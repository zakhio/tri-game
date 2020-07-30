package dictionary

import (
	"bufio"
	"log"
	"os"
	"path/filepath"
	"strings"
)

// readLines reads a whole file into memory
// and returns a slice of its lines.
func ReadLines(filename string) ([]string, error) {
	var err error
	var dir = "."

	if !strings.Contains(os.Args[0], "go-build") {
		dir, err = filepath.Abs(filepath.Dir(os.Args[0]))
		if err != nil {
			log.Fatal(err)
		}
	}

	path := filepath.Join(dir, filename)
	file, err := os.Open(filepath.Clean(path))
	if err != nil {
		return nil, err
	}

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, strings.Split(scanner.Text(), ",")...)
	}

	_ = file.Close()
	return lines, scanner.Err()
}
