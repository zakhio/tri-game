package config

import (
	"encoding/json"
	"io/ioutil"
	"math/rand"
	"os"
	"path/filepath"
	"strings"
)

type Dictionary struct {
	Words           map[string][]string
	DefaultLanguage string
}

func (d *Dictionary) GetWords(language string, count int) []string {
	allWords := d.getWordsWithFallbackToDefault(language)

	used := make(map[int]bool, count)
	words := make([]string, 0, count)

	for len(used) < count {
		index := rand.Intn(len(allWords))
		if _, ok := used[index]; !ok {
			word := allWords[index]
			words = append(words, word)

			used[index] = true
		}
	}

	return words
}

func (d *Dictionary) getWordsWithFallbackToDefault(language string) []string {
	if words, ok := d.Words[language]; ok {
		return words
	}
	return d.Words[d.DefaultLanguage]
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

	err = json.Unmarshal(jsonFile, &config)
	if err != nil {
		panic(err)
	}

	return &config
}
