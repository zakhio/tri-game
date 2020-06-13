package bus

import (
	"context"
	"fmt"
	"reflect"
	"sync"
)

// MessageBus implements publish/subscribe messaging paradigm
type MessageBus interface {
	// Publish publishes arguments to the given topic subscribers
	// Publish block only when the buffer of one of the subscribers is full.
	Publish(topic string, args ...interface{})
	// Close unsubscribe all handlers from given topic
	Close(topic string)
	// Subscribe subscribes to the given topic
	Subscribe(topic string, fn interface{}) error
	// SubscribeSync syncronically subscribes to the given topic
	SubscribeSync(context context.Context, topic string, fn interface{}) error
	// Unsubscribe unsubscribe handler from the given topic
	Unsubscribe(topic string, fn interface{}) error
}

type handlersMap map[string][]*handler

type handler struct {
	callback reflect.Value
	queue    chan []reflect.Value
}

type messageBus struct {
	handlerQueueSize int
	mtx              sync.RWMutex
	handlers         handlersMap
}

func (b *messageBus) Publish(topic string, args ...interface{}) {
	rArgs := buildHandlerArgs(args)

	b.mtx.RLock()
	defer b.mtx.RUnlock()

	if hs, ok := b.handlers[topic]; ok {
		for _, h := range hs {
			h.queue <- rArgs
		}
	}
}

func (b *messageBus) Subscribe(topic string, fn interface{}) error {
	if err := isValidHandler(fn); err != nil {
		return err
	}

	h := b.createHandler(topic, fn)

	go func() {
		for args := range h.queue {
			h.callback.Call(args)
		}
	}()

	return nil
}

func (b *messageBus) Unsubscribe(topic string, fn interface{}) error {
	if err := isValidHandler(fn); err != nil {
		return err
	}

	return b.deleteHandler(topic, fn)
}

func (b *messageBus) SubscribeSync(context context.Context, topic string, fn interface{}) error {
	if err := isValidHandler(fn); err != nil {
		return err
	}

	h := b.createHandler(topic, fn)
	defer b.deleteHandler(topic, fn)

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

func (b *messageBus) Close(topic string) {
	b.mtx.Lock()
	defer b.mtx.Unlock()

	if _, ok := b.handlers[topic]; ok {
		for _, h := range b.handlers[topic] {
			close(h.queue)
		}

		delete(b.handlers, topic)

		return
	}
}

func (b *messageBus) createHandler(topic string, fn interface{}) *handler {
	b.mtx.Lock()
	defer b.mtx.Unlock()
	h := &handler{
		callback: reflect.ValueOf(fn),
		queue:    make(chan []reflect.Value, b.handlerQueueSize),
	}
	b.handlers[topic] = append(b.handlers[topic], h)
	return h
}

func (b *messageBus) deleteHandler(topic string, fn interface{}) error {
	rv := reflect.ValueOf(fn)

	b.mtx.Lock()
	defer b.mtx.Unlock()

	if _, ok := b.handlers[topic]; ok {
		for i, h := range b.handlers[topic] {
			if h.callback == rv {
				close(h.queue)

				b.handlers[topic] = append(b.handlers[topic][:i], b.handlers[topic][i+1:]...)
			}
		}

		return nil
	}

	return fmt.Errorf("topic %s doesn't exist", topic)
}

func isValidHandler(fn interface{}) error {
	if reflect.TypeOf(fn).Kind() != reflect.Func {
		return fmt.Errorf("%s is not a reflect.Func", reflect.TypeOf(fn))
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

// New creates new MessageBus
// handlerQueueSize sets buffered channel length per subscriber
func New(handlerQueueSize int) MessageBus {
	if handlerQueueSize <= 0 {
		panic("handlerQueueSize has to be greater then 0")
	}

	return &messageBus{
		handlerQueueSize: handlerQueueSize,
		handlers:         make(handlersMap),
	}
}
