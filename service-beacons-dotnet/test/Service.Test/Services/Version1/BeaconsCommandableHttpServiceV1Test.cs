using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Nov.MaxSamples.Beacons.Data.Version1;
using Nov.MaxSamples.Beacons.Logic;
using Nov.MaxSamples.Beacons.Persistence;
using PipServices3.Commons.Config;
using PipServices3.Commons.Convert;
using PipServices3.Commons.Data;
using PipServices3.Commons.Refer;
using Xunit;

namespace Nov.MaxSamples.Beacons.Services.Version1
{
    [Collection("Sequential")]
    public class BeaconsCommandableHttpServiceV1Test
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

        private static readonly ConfigParams HttpConfig = ConfigParams.FromTuples(
            "connection.protocol", "http",
            "connection.host", "localhost",
            "connection.port", "3000"
        );

        private BeaconsMemoryPersistence _persistence;
        private BeaconsController _controller;
        private BeaconsCommandableHttpServiceV1 _service;

        public BeaconsCommandableHttpServiceV1Test()
        {
            _persistence = new BeaconsMemoryPersistence();
            _controller = new BeaconsController();
            _service = new BeaconsCommandableHttpServiceV1();

            IReferences references = References.FromTuples(
                new Descriptor("beacons", "persistence", "memory", "default", "1.0"), _persistence,
                new Descriptor("beacons", "controller", "default", "default", "1.0"), _controller,
                new Descriptor("beacons", "service", "commandable-http", "default", "1.0"), _service
            );

            _controller.SetReferences(references);

            _service.Configure(HttpConfig);
            _service.SetReferences(references);

            //_service.OpenAsync(null).Wait();
            // Todo: This is defect! Open shall not block the tread
            Task.Run(() => _service.OpenAsync(null));
            Thread.Sleep(1000); // Just let service a sec to be initialized
        }

        [Fact]
        public async Task TestCrudOperationsAsync()
        {
            // Create the first beacon
            var beacon = await Invoke<BeaconV1>("create_beacon", new { beacon = BEACON1 });

            Assert.NotNull(beacon);
            Assert.Equal(BEACON1.Udi, beacon.Udi);
            Assert.Equal(BEACON1.SiteId, beacon.SiteId);
            Assert.Equal(BEACON1.Type, beacon.Type);
            Assert.Equal(BEACON1.Label, beacon.Label);
            Assert.NotNull(beacon.Center);

            // Create the second beacon
            beacon = await Invoke<BeaconV1>("create_beacon", new { beacon = BEACON2 });

            Assert.NotNull(beacon);
            Assert.Equal(BEACON2.Udi, beacon.Udi);
            Assert.Equal(BEACON2.SiteId, beacon.SiteId);
            Assert.Equal(BEACON2.Type, beacon.Type);
            Assert.Equal(BEACON2.Label, beacon.Label);
            Assert.NotNull(beacon.Center);

            // Get all beacons
            var page = await Invoke<DataPage<BeaconV1>>(
                "get_beacons",
                new
                {
                    filter = new FilterParams(),
                    paging = new PagingParams()
                }
            );

            Assert.NotNull(page);
            Assert.Equal(2, page.Data.Count);

            var beacon1 = page.Data[0];

            // Update the beacon
            beacon1.Label = "ABC";

            beacon = await Invoke<BeaconV1>("update_beacon", new { beacon = beacon1 });

            Assert.NotNull(beacon);
            Assert.Equal(beacon1.Id, beacon.Id);
            Assert.Equal("ABC", beacon.Label);

            // Get beacon by udi
            beacon = await Invoke<BeaconV1>("get_beacon_by_udi", new { udi = beacon1.Udi });

            Assert.NotNull(beacon);
            Assert.Equal(beacon1.Id, beacon.Id);

            // Delete the beacon
            beacon = await Invoke<BeaconV1>("delete_beacon_by_id", new { beacon_id = beacon1.Id });

            Assert.NotNull(beacon);
            Assert.Equal(beacon1.Id, beacon.Id);

            // Try to get deleted beacon
            beacon = await Invoke<BeaconV1>("get_beacon_by_id", new { beacon_id = beacon1.Id });

            Assert.Null(beacon);
        }

        private static async Task<T> Invoke<T>(string route, dynamic request)
        {
            using (var httpClient = new HttpClient())
            {
                var requestValue = JsonConverter.ToJson(request);
                using (var content = new StringContent(requestValue, Encoding.UTF8, "application/json"))
                {
                    var response = await httpClient.PostAsync("http://localhost:3000/v1/beacons/" + route, content);
                    var responseValue = response.Content.ReadAsStringAsync().Result;
                    return JsonConverter.FromJson<T>(responseValue);
                }
            }
        }
    }
}
