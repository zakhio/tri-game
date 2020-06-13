package dictionary

import (
	"bufio"
	"os"
	"strings"
)

// readLines reads a whole file into memory
// and returns a slice of its lines.
func ReadLines(path string) ([]string, error) {
	//root, err := os.Getwd()
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, strings.Split(scanner.Text(), ",")...)
	}
	return lines, scanner.Err()
}
