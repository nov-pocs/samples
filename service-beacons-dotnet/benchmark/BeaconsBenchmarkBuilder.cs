using PipBenchmark.Console;
using PipBenchmark.Runner;
using PipBenchmark.Runner.Config;
using PipBenchmark.Runner.Console;
using System;

namespace Nov.MaxSamples.Beacons
{
	public class BeaconsBenchmarkBuilder : ConsoleBenchmarkBuilder
	{
		public BeaconsBenchmarkBuilder() : base()
		{
			AddSuite(new BeaconsBenchmarkSuite());
			SetEnvParameters();

			_runner.Results.Updated += ConsoleEventPrinter.OnResultUpdated;
		}

		private void SetEnvParameters()
		{
			var databaseType = Environment.GetEnvironmentVariable("DATABASE_TYPE") ?? "postgres";
			var DB = databaseType.ToUpper();

			WithParameter("Beacons.RecordCount", Environment.GetEnvironmentVariable("BENCHMARK_RECORDS") ?? "1000");
			WithParameter("Beacons.SiteCount", Environment.GetEnvironmentVariable("BENCHMARK_SITES") ?? "100");
			WithParameter("Beacons.DatabaseUri", Environment.GetEnvironmentVariable(DB + "_SERVICE_URI"));
			WithParameter("Beacons.DatabaseHost", Environment.GetEnvironmentVariable(DB + "_SERVICE_HOST") ?? "localhost");
			WithParameter("Beacons.DatabasePort", Environment.GetEnvironmentVariable(DB + "_SERVICE_PORT") ?? "5432");
			WithParameter("Beacons.DatabaseName", Environment.GetEnvironmentVariable(DB + "_DB") ?? "test");
			WithParameter("Beacons.DatabaseUser", Environment.GetEnvironmentVariable(DB + "_USER") ?? "postgres");
			WithParameter("Beacons.DatabasePassword", Environment.GetEnvironmentVariable(DB + "_PASS") ?? "postgres");
		}

		public BeaconsBenchmarkBuilder ForPerformanceTesting()
		{
			ForceContinue(false);
			MeasureAs(MeasurementType.Peak);
			ExecuteAs(ExecutionType.Sequential);

			WithBenchmark("Beacons.CalculatePosition");
			WithBenchmark("Beacons.ReadBeacons");

			ForDuration(10); //1 * 3600); // Run for 1 minute

			return this;
		}

		public BeaconsBenchmarkBuilder ForReliabilityTesting()
		{
			ForceContinue(true);
			MeasureAs(MeasurementType.Nominal);
			WithNominalRate(100);
			ExecuteAs(ExecutionType.Proportional);

			WithProportionalBenchmark("Beacons.CalculatePosition", 70);
			WithProportionalBenchmark("Beacons.ReadBeacons", 10);

			ForDuration(24 * 60 * 3600); // Run for 24 hours

			return this;
		}

		public BeaconsBenchmarkBuilder ForScalabilityTesting()
		{
			ForceContinue(true);
			MeasureAs(MeasurementType.Peak);
			ExecuteAs(ExecutionType.Proportional);

			WithProportionalBenchmark("Beacons.CalculatePosition", 70);
			WithProportionalBenchmark("Beacons.ReadBeacons", 10);

			ForDuration(15 * 3600); // Run for 15 minutes

			return this;
		}

		public BenchmarkBuilder WithProportionalBenchmark(string name, int propotion)
		{
			_runner.Benchmarks.SelectByName(new[] { name });
			WithParameter(name + ".Proportion", propotion.ToString());
			return this;
		}
	}
}
