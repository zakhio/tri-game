package latency

import (
	"time"

	"github.com/rcrowley/go-metrics"
)

func Measure(name string) func() {
	t := metrics.GetOrRegisterTimer(name, nil)
	ts := time.Now()

	return func() {
		t.Update(time.Since(ts))
	}
}
