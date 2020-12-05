using System.Threading.Tasks;
using PipServices3.Commons.Config;
using Xunit;

namespace Nov.MaxSamples.Beacons.Persistence
{
	[Collection("Sequential")]
	public class BeaconsFilePersistenceTest
	{
		private BeaconsFilePersistence _persistence;
		private BeaconsPersistenceFixture _fixture;

		public BeaconsFilePersistenceTest()
		{
			ConfigParams config = ConfigParams.FromTuples(
				"path", "beacons.json"
			);
			_persistence = new BeaconsFilePersistence();
			_persistence.Configure(config);
			_persistence.OpenAsync(null).Wait();
			_persistence.ClearAsync(null).Wait();

			_fixture = new BeaconsPersistenceFixture(_persistence);
		}

		[Fact]
		public async Task TestCrudOperationsAsync()
		{
			await _fixture.TestCrudOperationsAsync();
		}

		[Fact]
		public async Task TestGetWithFiltersAsync()
		{
			await _fixture.TestGetWithFiltersAsync();
		}
	}
}
