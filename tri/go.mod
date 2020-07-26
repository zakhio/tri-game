module github.com/zakhio/online-games/tri

go 1.14

require (
	github.com/golang/protobuf v1.4.2
	github.com/google/uuid v1.1.1
	github.com/labstack/gommon v0.3.0
	github.com/rcrowley/go-metrics v0.0.0-20200313005456-10cdbea86bc0
	github.com/zakhio/go-metrics-influxdb v0.3.0
	github.com/zakhio/online-games/go-game-base v0.0.0
	google.golang.org/grpc v1.30.0
	google.golang.org/protobuf v1.25.0
	gopkg.in/yaml.v2 v2.2.5
)

replace github.com/zakhio/online-games/go-game-base => ../go-game-base
