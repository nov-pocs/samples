using PipBenchmark;
using PipBenchmark.Utilities.Random;
using PipServices3.Commons.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Nov.MaxSamples.Beacons
{
	public class BeaconsReadBenchmark: Benchmark
	{
		private int _siteCount;
		private BeaconsBenchmarkContext _beaconsContext;

		public BeaconsReadBenchmark()
			: base("ReadBeacons", "Measures performance of getBeacons operation")
		{
		}

		public override void SetUp()
		{
			_siteCount = Context.Parameters["SiteCount"].AsInteger;
			_beaconsContext = new BeaconsBenchmarkContext(Context);

			// Connect to the database
			_beaconsContext.OpenAsync().Wait();
		}

		public override void TearDown()
		{
			_beaconsContext.CloseAsync().Wait();
		}

		public override void Execute()
		{
			var siteId = RandomInteger.NextInteger(1, _siteCount).ToString();
			_beaconsContext.Controller.GetBeaconsAsync(
				null,
				FilterParams.FromTuples(
					"site_id", siteId
				),
				new PagingParams(0, 100, false)
			).Wait();
		}
	}
}
