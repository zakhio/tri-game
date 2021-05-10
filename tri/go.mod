module github.com/zakhio/online-games/tri

go 1.16

require (
	github.com/golang/protobuf v1.4.2
	github.com/google/uuid v1.1.2
	github.com/rcrowley/go-metrics v0.0.0-20200313005456-10cdbea86bc0
	github.com/sirupsen/logrus v1.6.0
	github.com/zakhio/go-metrics-influxdb v0.3.0
	github.com/zakhio/online-games/go-game-base v0.0.0-00010101000000-000000000000
	google.golang.org/genproto v0.0.0-20200624020401-64a14ca9d1ad // indirect
	google.golang.org/grpc v1.37.0
	google.golang.org/protobuf v1.25.0
	gopkg.in/yaml.v2 v2.2.5
)

replace github.com/zakhio/online-games/go-game-base => ../go-game-base
