using System;

namespace Nov.MaxSamples.Beacons
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = new BeaconsBenchmarkBuilder();
            var type = Environment.GetEnvironmentVariable("BENCHMARK_TYPE") ?? "performance";

            switch (type)
            {
                case "performance":
                    Console.Out.WriteLine("Testing beacons for performance");
                    builder.ForPerformanceTesting();
                    break;
                case "reliability":
                    Console.Out.WriteLine("Testing beacons for reliability");
                    builder.ForReliabilityTesting();
                    break;
                case "scalability":
                    Console.Out.WriteLine("Testing beacons for scalability");
                    builder.ForScalabilityTesting();
                    break;
                default:
                    builder.ForPerformanceTesting();
                    break;
            }

            var runner = builder.Create();

            runner.Run();

            Console.Out.WriteLine("Press ENTER to exit...");
            Console.In.ReadLine();
        }
    }
}
