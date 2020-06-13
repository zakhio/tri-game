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
	Subscribe(fn interface{}) error
	// SubscribeSync syncronically subscribes to the given topic
	SubscribeSync(context context.Context, fn interface{}) error
	// Unsubscribe unsubscribe handler from the given topic
	Unsubscribe(fn interface{}) error
}

type handler struct {
	callback reflect.Value
	queue    chan []reflect.Value
}

type observable struct {
	handlerQueueSize int
	mtx              sync.RWMutex
	handlers         []*handler
	value            []reflect.Value
}

func (b *observable) Publish(args ...interface{}) {
	rArgs := buildHandlerArgs(args)
	b.value = rArgs

	b.mtx.RLock()
	defer b.mtx.RUnlock()

	for _, h := range b.handlers {
		h.queue <- rArgs
	}
}

func (b *observable) Value() []interface{} {
	if b.value == nil {
		return nil
	}

	reflectedArgs := make([]interface{}, 0)

	for _, arg := range b.value {
		reflectedArgs = append(reflectedArgs, arg.Interface())
	}

	return reflectedArgs
}

func (b *observable) Subscribe(fn interface{}) error {
	if err := isValidHandler(fn); err != nil {
		return err
	}

	h := b.createHandler(fn)

	go func() {
		for args := range h.queue {
			h.callback.Call(args)
		}
	}()

	return nil
}

func (b *observable) Unsubscribe(fn interface{}) error {
	if err := isValidHandler(fn); err != nil {
		return err
	}

	return b.deleteHandler(fn)
}

func (b *observable) SubscribeSync(context context.Context, fn interface{}) error {
	if err := isValidHandler(fn); err != nil {
		return err
	}

	h := b.createHandler(fn)
	defer b.deleteHandler(fn)

	var err error
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

func (b *observable) Close() {
	b.mtx.Lock()
	defer b.mtx.Unlock()

	for _, h := range b.handlers {
		close(h.queue)
	}
}

func (b *observable) createHandler(fn interface{}) *handler {
	b.mtx.Lock()
	defer b.mtx.Unlock()
	h := &handler{
		callback: reflect.ValueOf(fn),
		queue:    make(chan []reflect.Value, b.handlerQueueSize),
	}
	b.handlers = append(b.handlers, h)
	return h
}

func (b *observable) deleteHandler(fn interface{}) error {
	rv := reflect.ValueOf(fn)

	b.mtx.Lock()
	defer b.mtx.Unlock()

	for i, h := range b.handlers {
		if h.callback == rv {
			close(h.queue)

			b.handlers = append(b.handlers[:i], b.handlers[i+1:]...)
			return nil
		}
	}

	return fmt.Errorf("handler is not present")
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
