package observable

import (
	"context"
	"fmt"
	"reflect"
	"sync"
)

var (
	errorInterface = reflect.TypeOf((*error)(nil)).Elem()
)

// Observable implements publish/subscribe messaging paradigm
type Observable interface {
	// Publish publishes arguments to the given topic subscribers
	// Publish block only when the buffer of one of the subscribers is full.
	Publish(args ...interface{})
	// Value last published value, if none the nil
	Value() []interface{}
	// Close unsubscribe all handlers from given topic
	Close()
	// Subscribe subscribes to the given topic
	Subscribe(subscriber string, fn interface{}) error
	// SubscribeSync syncronically subscribes to the given topic
	SubscribeSync(context context.Context, subscriber string, fn interface{}) error
	// Unsubscribe unsubscribe handler from the given topic
	Unsubscribe(fn interface{}) error
	// IsSubscribed check if subscriber is in the list of handlers
	IsSubscribed(subscriber string) bool
}

type handler struct {
	subscriber string
	callback   reflect.Value
	queue      chan []reflect.Value
}

type observable struct {
	handlerQueueSize int
	mtx              sync.RWMutex
	handlers         []*handler
	value            []reflect.Value
}

func (o *observable) Publish(args ...interface{}) {
	rArgs := buildHandlerArgs(args)
	o.value = rArgs

	o.mtx.RLock()
	defer o.mtx.RUnlock()

	for _, h := range o.handlers {
		h.queue <- rArgs
	}
}

func (o *observable) Value() []interface{} {
	if o.value == nil {
		return nil
	}

	reflectedArgs := make([]interface{}, 0)

	for _, arg := range o.value {
		reflectedArgs = append(reflectedArgs, arg.Interface())
	}

	return reflectedArgs
}

func (o *observable) Subscribe(subscriber string, fn interface{}) error {
	if err := isValidHandler(fn); err != nil {
		return err
	}

	h := o.createHandler(subscriber, fn)

	go func() {
		for args := range h.queue {
			h.callback.Call(args)
		}
	}()

	return nil
}

func (o *observable) Unsubscribe(fn interface{}) error {
	if err := isValidHandler(fn); err != nil {
		return err
	}

	o.deleteHandler(fn)
	return nil
}

func (o *observable) SubscribeSync(context context.Context, subscriber string, fn interface{}) error {
	var err error
	if err = isValidHandler(fn); err != nil {
		return err
	}

	h := o.createHandler(subscriber, fn)
	defer o.deleteHandler(fn)

	// send current value
	res := h.callback.Call(o.value)
	if v := res[0].Interface(); v != nil {
		err = v.(error)
		return err
	}

	for {
		select {
		case <-context.Done():
			err = context.Err()
			break
		case args := <-h.queue:
			res := h.callback.Call(args)
			if v := res[0].Interface(); v != nil {
				err = v.(error)
				break
			}
		}

		if err != nil {
			break
		}
	}

	return err
}

func (o *observable) IsSubscribed(subscriber string) bool {
	o.mtx.Lock()
	defer o.mtx.Unlock()

	for _, h := range o.handlers {
		if h.subscriber == subscriber {
			return true
		}
	}

	return false
}

func (o *observable) Close() {
	o.mtx.Lock()
	defer o.mtx.Unlock()

	for _, h := range o.handlers {
		close(h.queue)
	}
}

func (o *observable) createHandler(subscriber string, fn interface{}) *handler {
	o.mtx.Lock()
	defer o.mtx.Unlock()
	h := &handler{
		callback:   reflect.ValueOf(fn),
		queue:      make(chan []reflect.Value, o.handlerQueueSize),
		subscriber: subscriber,
	}
	o.handlers = append(o.handlers, h)
	return h
}

func (o *observable) deleteHandler(fn interface{}) {
	rv := reflect.ValueOf(fn)

	o.mtx.Lock()
	defer o.mtx.Unlock()

	for i, h := range o.handlers {
		if h.callback == rv {
			close(h.queue)

			o.handlers = append(o.handlers[:i], o.handlers[i+1:]...)
			return
		}
	}
}

func isValidHandler(fn interface{}) error {
	if reflect.TypeOf(fn).Kind() != reflect.Func {
		return fmt.Errorf("%s is not a reflect.Func", reflect.TypeOf(fn))
	} else if !reflect.TypeOf(fn).Out(0).Implements(errorInterface) {
		return fmt.Errorf("first out value %s is not a error", reflect.TypeOf(fn).Out(0))
	}

	return nil
}

func buildHandlerArgs(args []interface{}) []reflect.Value {
	reflectedArgs := make([]reflect.Value, 0)

	for _, arg := range args {
		reflectedArgs = append(reflectedArgs, reflect.ValueOf(arg))
	}

	return reflectedArgs
}

// New creates new Observable
// handlerQueueSize sets buffered channel length per subscriber
func New(handlerQueueSize int) Observable {
	if handlerQueueSize <= 0 {
		panic("handlerQueueSize has to be greater then 0")
	}

	return &observable{
		handlerQueueSize: handlerQueueSize,
		handlers:         make([]*handler, 0),
	}
}
