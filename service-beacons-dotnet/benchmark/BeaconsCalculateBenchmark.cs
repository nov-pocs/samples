using Nov.MaxSamples.Beacons.Data.Version1;
using PipBenchmark;
using PipBenchmark.Utilities.Random;
using PipServices3.Commons.Data;
using System.Collections.Generic;
using System.Linq;

namespace Nov.MaxSamples.Beacons
{
	public class BeaconsCalculateBenchmark: Benchmark
	{
		private string _siteId;
		private string[] _udis = new string[] {};
		private BeaconsBenchmarkContext _beaconsContext;

		public BeaconsCalculateBenchmark()
			: base("CalculatePosition", "Measures performance of calculatePosition operation")
		{ 
		}

		public override void SetUp()
		{
			var siteCount = Context.Parameters["SiteCount"].AsInteger;
			_siteId = RandomBeaconV1.NextSiteId(siteCount);

			_beaconsContext = new BeaconsBenchmarkContext(Context);

			// Connect to the database
			_beaconsContext.OpenAsync().Wait();

			var page = _beaconsContext.Persistence.GetPageByFilterAsync(
				null,
				FilterParams.FromTuples(
						"site_id", _siteId
				),
				new PagingParams(0, 100, false)).Result;

			if (page != null)
			{
				_udis = page.Data.Select(b => b.Udi).ToArray();
			}
		}

		public override void TearDown()
		{
			_beaconsContext.CloseAsync().Wait();
		}

		private string[] NextUdis()
		{
			var udiCount = RandomInteger.NextInteger(0, 10);
			var remainingUdis = new List<string>(_udis);
			var udis = new List<string>();
			while (udiCount > 0 && remainingUdis.Count> 0)
			{
				var index = RandomInteger.NextInteger(0, remainingUdis.Count - 1);
				udis.Add(remainingUdis[index]);
				remainingUdis.RemoveAt(index);
			}
			return udis.ToArray();
		}

		public override void Execute()
		{
			var udis = NextUdis();
			_beaconsContext.Controller.CalculatePositionAsync(null, _siteId, udis).Wait();
		}
	}
}
