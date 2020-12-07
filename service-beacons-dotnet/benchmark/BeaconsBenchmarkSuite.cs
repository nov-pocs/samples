using Nov.MaxSamples.Beacons.Data.Version1;
using PipBenchmark;
using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Nov.MaxSamples.Beacons
{
    public class BeaconsBenchmarkSuite : BenchmarkSuite
    {
        public BeaconsBenchmarkSuite() : base("Beacons", "Beacons benchmark")
        {
            AddParameter(new Parameter("RecordCount", "Number of records at start", "0"));
            AddParameter(new Parameter("SiteCount", "Number of field sites", "100"));
            AddParameter(new Parameter("DatabaseType", "Database type", "postgres"));
            AddParameter(new Parameter("DatabaseUri", "Database URI", null));
            AddParameter(new Parameter("DatabaseHost", "Database hostname", "localhost"));
            AddParameter(new Parameter("DatabasePort", "Database port", "5432"));
            AddParameter(new Parameter("DatabaseName", "Database name", "test"));
            AddParameter(new Parameter("DatabaseUser", "Database username", "postgres"));
            AddParameter(new Parameter("DatabasePassword", "Database password", "postgres"));

            AddBenchmark(new BeaconsCalculateBenchmark());
            AddBenchmark(new BeaconsReadBenchmark());
        }

        public override void SetUp()
        {
            var totalCount = Context.Parameters["RecordCount"].AsInteger;
            var siteCount = Context.Parameters["SiteCount"].AsInteger;
			var context = new BeaconsBenchmarkContext(Context);

            // Connect to the database
            context.OpenAsync().Wait();

            // Get number of records in the database
            var page = context.Persistence.GetPageByFilterAsync(
                null,
                null,
                new PagingParams(0, 1, true)
            ).Result;

			long currentCount = page != null ? page.Total ?? 0L : 0;

			// Generate initial records
			if (currentCount < totalCount)
            {
                Context.SendMessage("Creating " + (totalCount - currentCount) + " beacons...");

                while (currentCount < totalCount)
                {
                    var beacon = RandomBeaconV1.NextBeacon(siteCount);
                    context.Persistence.CreateAsync(null, beacon).Wait();

                    currentCount++;
                    if (currentCount % 100 == 0)
                    {
                        Context.SendMessage("Created " + currentCount + " beacons");
                    }
                }

                Context.SendMessage("Initial beacons successfully created.");
            }

            // Disconnect from the database
            context.CloseAsync().Wait();
        }
    }
}