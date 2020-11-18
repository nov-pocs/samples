package main

import (
	"os"

	bb "github.com/nov-pocs/samples/service-beacons-go/benchmarks/suite"
	benchconsole "github.com/pip-benchmark/pip-benchmark-go/console"
)

func main() {
	if len(os.Args) > 1 {
		benchconsole.Run(os.Args)
	} else {
		var benchmark = benchconsole.NewConsoleBenchmarkBuilder()
		benchmark.AddSuite(bb.NewBeaconsBenchmarkSuite().BenchmarkSuite).
			ForDuration(15).
			ForceContinue(true).
			WithAllBenchmarks()
		runner := benchmark.Create()
		runner.Parameters().Set(map[string]string{"General.Benchmarking.MeasurementType": "Peak"})
		//runner.Parameters().Set(map[string]string{"General.Benchmarking.MeasurementType": "Nominal"})
		runner.Parameters().Set(map[string]string{"General.Benchmarking.ExecutionType": "Sequential"})

		runner.Run(func(err error) {
			if err != nil {
				print(err.Error())
			}
		})
		runner.Report().SaveToFile("BenchmarkReport.txt")
		print(runner.Report().Generate())
	}
}
