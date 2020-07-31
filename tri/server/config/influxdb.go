package config

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gopkg.in/yaml.v2"
)

type InfluxDB struct {
	URL             string        `yaml:"url"`
	OrganizationId  string        `yaml:"organizationId"`
	BucketId        string        `yaml:"bucketId"`
	Token           string        `yaml:"token"`
	Measurement     string        `yaml:"measurement"`
	Interval        time.Duration `yaml:"interval"`
	AlignTimestamps bool          `yaml:"alignTimestamps"`
}

func ParseInfluxDBConfig(filename string) *InfluxDB {
	var err error
	dir := "."

	if !strings.Contains(os.Args[0], "go-build") {
		dir, err = filepath.Abs(filepath.Dir(os.Args[0]))
		if err != nil {
			panic(err)
		}
	}

	path := filepath.Join(dir, filename)
	yamlFile, err := ioutil.ReadFile(filepath.Clean(path))

	if err != nil {
		panic(err)
	}

	var config InfluxDB

	err = yaml.Unmarshal(yamlFile, &config)
	if err != nil {
		panic(err)
	}

	return &config
}
