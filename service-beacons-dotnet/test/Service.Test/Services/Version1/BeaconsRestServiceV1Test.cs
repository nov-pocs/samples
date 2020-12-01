//using System;
//using System.Net.Http;
//using System.Text;
//using System.Threading;
//using System.Threading.Tasks;
//using Nov.MaxSamples.Beacons.Data.Version1;
//using Nov.MaxSamples.Beacons.Logic;
//using Nov.MaxSamples.Beacons.Persistence;
//using PipServices3.Commons.Config;
//using PipServices3.Commons.Convert;
//using PipServices3.Commons.Refer;
//using Xunit;

//namespace Nov.MaxSamples.Beacons.Services.Version1
//{
//    public class BeaconsRestServiceV1Test : IDisposable
//    {
//        private BeaconV1 BEACON1 = new BeaconV1
//        {
//            Id = "1",
//            Udi = "00001",
//            Type = BeaconTypeV1.AltBeacon,
//            SiteId = "1",
//            Label = "TestBeacon1",
//            Center = new CenterObjectV1 { Type = "Point", Coordinates = new double[] { 0, 0 } },
//            Radius = 50
//        };
//        private BeaconV1 BEACON2 = new BeaconV1
//        {
//            Id = "2",
//            Udi = "00002",
//            Type = BeaconTypeV1.iBeacon,
//            SiteId = "1",
//            Label = "TestBeacon2",
//            Center = new CenterObjectV1 { Type = "Point", Coordinates = new double[] { 2, 2 } },
//            Radius = 70
//        };

//        private BeaconsMemoryPersistence _persistence;
//        private BeaconsController _controller;
//        private BeaconsRestServiceV1 _service;
//        private HttpClient _httpClient;

//        public BeaconsRestServiceV1Test()
//        {
//            _httpClient = new HttpClient();

//            _persistence = new BeaconsMemoryPersistence();
//            _controller = new BeaconsController();

//            var config = ConfigParams.FromTuples(
//                "connection.protocol", "http",
//                "connection.host", "localhost",
//                "connection.port", "3001"
//            );
//            _service = new BeaconsRestServiceV1();
//            _service.Configure(config);

//            var references = References.FromTuples(
//                new Descriptor("beacons", "persistence", "memory", "default", "1.0"), _persistence,
//                new Descriptor("beacons", "controller", "default", "default", "1.0"), _controller,
//                new Descriptor("beacons", "service", "rest", "default", "1.0"), _service
//            );

//            _controller.SetReferences(references);

//            _service.SetReferences(references);
//            //_service.OpenAsync(null).Wait();

//            // Todo: This is defect! Open shall not block the tread
//            Task.Run(() => _service.OpenAsync(null));
//            Thread.Sleep(1000); // Just let service a sec to be initialized
//        }

//        public void Dispose()
//        {
//            _service.CloseAsync(null).Wait();
//        }

//        [Fact]
//        public async Task TestCrudOperationsAsync()
//        {
//            // Create the first beacon
//            var beacon = await SendRequestAsync<BeaconV1>("create_beacon", new { beacon = BEACON1 });

//            Assert.NotNull(beacon);
//            Assert.Equal(BEACON1.Udi, beacon.Udi);
//            Assert.Equal(BEACON1.SiteId, beacon.SiteId);
//            Assert.Equal(BEACON1.Type, beacon.Type);
//            Assert.Equal(BEACON1.Label, beacon.Label);
//            Assert.NotNull(beacon.Center);

//            // Get first block of IDs
//            var values = await Invoke<string[]>(
//                "/v1/id_generator/next_id_block?scope=key1&count=10"
//            );
//            Assert.Equal(10, values.Length);
//            Assert.Contains(values, (x) => x == "1");
//            Assert.Contains(values, (x) => x == "10");

//            // Get second block of IDs
//            values = await Invoke<string[]>(
//                "/v1/id_generator/next_id_block?scope=key1&count=10"
//            );
//            Assert.Equal(10, values.Length);
//            Assert.Contains(values, (x) => x == "11");
//            Assert.Contains(values, (x) => x == "20");

//            // Reset id
//            values = await Invoke<string[]>(
//                "/v1/id_generator/reset_id?scope=key1"
//            );

//            values = await Invoke<string[]>(
//                "/v1/id_generator/next_id_block?scope=key1&count=10"
//            );
//            Assert.Equal(10, values.Length);
//            Assert.Contains(values, (x) => x == "1");
//            Assert.Contains(values, (x) => x == "10");
//        }

//        private async Task<T> SendRequestAsync<T>(string method, string route, dynamic request, bool formData = false)
//        {
//            HttpContent content;
//            if (formData)
//            {
//                content = new MultipartFormDataContent()
//                {
//                    {new StringContent(JsonConverter.ToJson(request)), "file", "test_file.json"}
//                };
//            }
//            else
//            {
//                content = new StringContent(JsonConverter.ToJson(request), Encoding.UTF8, "application/json");
//            }

//            var response = new HttpResponseMessage();

//            switch (method)
//            {
//                case "get":
//                    response = await _httpClient.GetAsync($"http://localhost:3003{route}");
//                    break;
//                case "post":
//                    response = await _httpClient.PostAsync($"http://localhost:3003{route}", content);
//                    break;
//                case "put":
//                    response = await _httpClient.PutAsync($"http://localhost:3003{route}", content);
//                    break;
//                case "delete":
//                    response = await _httpClient.DeleteAsync($"http://localhost:3003{route}");
//                    break;
//            }

//            var responseValue = await response.Content.ReadAsStringAsync();
//            return JsonConverter.FromJson<T>(responseValue);
//        }
//    }
//}
