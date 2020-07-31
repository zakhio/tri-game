package config

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

type Dictionary struct {
	Words map[string][]string
}

func ParseDictionaryConfig(filename string) *Dictionary {
	var err error
	dir := "."

	if !strings.Contains(os.Args[0], "go-build") {
		dir, err = filepath.Abs(filepath.Dir(os.Args[0]))
		if err != nil {
			panic(err)
		}
	}

	path := filepath.Join(dir, filename)
	jsonFile, err := ioutil.ReadFile(filepath.Clean(path))

	if err != nil {
		panic(err)
	}

	var config Dictionary

	err = json.Unmarshal(jsonFile, &config.Words)
	if err != nil {
		panic(err)
	}

	fmt.Print(config)

	return &config
}
