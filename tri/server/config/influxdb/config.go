package influxdb

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"os"
	"path/filepath"
	"time"
)

type Config struct {
	URL             string        `yaml:"url"`
	OrganizationId  string        `yaml:"organizationId"`
	BucketId        string        `yaml:"bucketId"`
	Token           string        `yaml:"token"`
	Measurement     string        `yaml:"measurement"`
	Interval        time.Duration `yaml:"interval"`
	AlignTimestamps bool          `yaml:"alignTimestamps"`
}

func ParseConfig(filename string) *Config {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		panic(err)
	}

	path := dir + "/" + filename
	yamlFile, err := ioutil.ReadFile(path)

	if err != nil {
		panic(err)
	}

	var config Config

	err = yaml.Unmarshal(yamlFile, &config)
	if err != nil {
		panic(err)
	}

	return &config
}
