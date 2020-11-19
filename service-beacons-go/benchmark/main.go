package main

import (
	"fmt"
	"os"
	"os/signal"

	suite "github.com/nov-pocs/samples/service-beacons-go/benchmark/suite"
)

func main() {

	builder := suite.NewBeaconsBenchmarkBuilder()

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

	defer captureErrors()
	captureExit()

	runner.Run(func(err error) {
		if err != nil {
			fmt.Println(err)
		}
	})
}

func captureErrors() {
	if r := recover(); r != nil {
		err, _ := r.(error)
		fmt.Println("Process is terminated ")
		if err != nil {
			fmt.Println(err)
		}
		os.Exit(1)
	}
}

func captureExit() {
	fmt.Println("Press Control-C to stop the benchmark...")

	ch := make(chan os.Signal)
	signal.Notify(ch, os.Interrupt)

	go func() {
		select {
		case <-ch:
			fmt.Println("Googbye!")
			os.Exit(0)
		}
	}()
}
