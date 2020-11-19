package main

import (
	"fmt"
	"os"

	bb "github.com/nov-pocs/samples/service-beacons-go/benchmarks/suite"
)

func main() {

	builder := bb.NewBeaconsBenchmarkBuilder()

	choice := os.Getenv("BENCHMARK_TYPE")
	if choice == "" {
		choice = "performance"
	}

	switch choice {
	case "performance":
		fmt.Println("Testing beacons for performance")
		builder.ForPerformanceTesting()
		break
	case "reliability":
		fmt.Println("Testing beacons for reliability")
		builder.ForReliabilityTesting()
		break
	case "scalability":
		fmt.Println("Testing beacons for scalability")
		builder.ForScalabilityTesting()
		break
	default:
		builder.ForPerformanceTesting()
		break
	}

	runner := builder.Create()

	runner.Run(func(err error) {
		if err != nil {
			fmt.Println(err)
		}
	})
}
