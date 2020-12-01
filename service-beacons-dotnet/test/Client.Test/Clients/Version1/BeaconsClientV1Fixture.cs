using System.Threading.Tasks;
using Nov.MaxSamples.Beacons.Data.Version1;
using PipServices3.Commons.Data;
using Xunit;

namespace Nov.MaxSamples.Beacons.Clients.Version1
{
    public class BeaconsClientV1Fixture
    {
        private BeaconV1 BEACON1 = new BeaconV1
        {
            Id = "1",
            Udi = "00001",
            Type = BeaconTypeV1.AltBeacon,
            SiteId = "1",
            Label = "TestBeacon1",
            Center = new CenterObjectV1 { Type = "Point", Coordinates = new double[] { 0, 0 } },
            Radius = 50
        };
        private BeaconV1 BEACON2 = new BeaconV1
        {
            Id = "2",
            Udi = "00002",
            Type = BeaconTypeV1.iBeacon,
            SiteId = "1",
            Label = "TestBeacon2",
            Center = new CenterObjectV1 { Type = "Point", Coordinates = new double[] { 2, 2 } },
            Radius = 70
        };

        private IBeaconsClientV1 _client;

        public BeaconsClientV1Fixture(IBeaconsClientV1 client)
        {
            _client = client;
        }

        public async Task TestCrudOperationsAsync()
        {
            // Create the first beacon
            var beacon = await _client.CreateBeaconAsync(null, BEACON1);

            Assert.NotNull(beacon);
            Assert.Equal(BEACON1.Udi, beacon.Udi);
            Assert.Equal(BEACON1.SiteId, beacon.SiteId);
            Assert.Equal(BEACON1.Type, beacon.Type);
            Assert.Equal(BEACON1.Label, beacon.Label);
            Assert.NotNull(beacon.Center);

            // Create the second beacon
            beacon = await _client.CreateBeaconAsync(null, BEACON2);

            Assert.NotNull(beacon);
            Assert.Equal(BEACON2.Udi, beacon.Udi);
            Assert.Equal(BEACON2.SiteId, beacon.SiteId);
            Assert.Equal(BEACON2.Type, beacon.Type);
            Assert.Equal(BEACON2.Label, beacon.Label);
            Assert.NotNull(beacon.Center);

            // Get all beacons
            var page = await _client.GetBeaconsAsync(
                null,
                new FilterParams(),
                new PagingParams()
            );

            Assert.NotNull(page);
            Assert.Equal(2, page.Data.Count);

            var beacon1 = page.Data[0];

            // Update the beacon
            beacon1.Label = "ABC";

            beacon = await _client.UpdateBeaconAsync(null, beacon1);

            Assert.NotNull(beacon);
            Assert.Equal(beacon1.Id, beacon.Id);
            Assert.Equal("ABC", beacon.Label);

            // Get beacon by udi
            beacon = await _client.GetBeaconByUdiAsync(null, beacon1.Udi);

            Assert.NotNull(beacon);
            Assert.Equal(beacon1.Id, beacon.Id);

            // Delete the beacon
            beacon = await _client.DeleteBeaconByIdAsync(null, beacon1.Id);

            Assert.NotNull(beacon);
            Assert.Equal(beacon1.Id, beacon.Id);

            // Try to get deleted beacon
            beacon = await _client.GetBeaconByIdAsync(null, beacon1.Id);

            Assert.Null(beacon);

            // Clean up for the second test
            await _client.DeleteBeaconByIdAsync(null, BEACON2.Id);
        }

        public async Task TestCalculatePositionsAsync()
        {
            // Create the first beacon
            var beacon = await _client.CreateBeaconAsync(null, BEACON1);

            Assert.NotNull(beacon);
            Assert.Equal(BEACON1.Udi, beacon.Udi);
            Assert.Equal(BEACON1.SiteId, beacon.SiteId);
            Assert.Equal(BEACON1.Type, beacon.Type);
            Assert.Equal(BEACON1.Label, beacon.Label);
            Assert.NotNull(beacon.Center);

            // Create the second beacon
            beacon = await _client.CreateBeaconAsync(null, BEACON2);

            Assert.NotNull(beacon);
            Assert.Equal(BEACON2.Udi, beacon.Udi);
            Assert.Equal(BEACON2.SiteId, beacon.SiteId);
            Assert.Equal(BEACON2.Type, beacon.Type);
            Assert.Equal(BEACON2.Label, beacon.Label);
            Assert.NotNull(beacon.Center);

            // Calculate position for one beacon
            var position = await _client.CalculatePositionAsync(
                null, "1", new string[] { "00001" }
            );

            Assert.NotNull(position);
            Assert.Equal("Point", position.Type);
            Assert.Equal(2, position.Coordinates.Length);
            Assert.Equal(0, position.Coordinates[0]);
            Assert.Equal(0, position.Coordinates[1]);

            // Calculate position for two beacons
            position = await _client.CalculatePositionAsync(
                null, "1", new string[] { "00001", "00002" }
            );

            Assert.NotNull(position);
            Assert.Equal("Point", position.Type);
            Assert.Equal(2, position.Coordinates.Length);
            Assert.Equal(1, position.Coordinates[0]);
            Assert.Equal(1, position.Coordinates[1]);
        }
    }
}
