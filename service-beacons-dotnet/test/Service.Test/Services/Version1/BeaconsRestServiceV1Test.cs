using System;
using System.Net.Http;
using System.Text;
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
	public class BeaconsRestServiceV1Test : IDisposable
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

		private BeaconsMemoryPersistence _persistence;
		private BeaconsController _controller;
		private BeaconsRestServiceV1 _service;
		private HttpClient _httpClient;

		public BeaconsRestServiceV1Test()
		{
			_httpClient = new HttpClient();

			_persistence = new BeaconsMemoryPersistence();
			_controller = new BeaconsController();

			var config = ConfigParams.FromTuples(
				"connection.protocol", "http",
				"connection.host", "localhost",
				"connection.port", "3000"
			);
			_service = new BeaconsRestServiceV1();
			_service.Configure(config);

			var references = References.FromTuples(
				new Descriptor("beacons", "persistence", "memory", "default", "1.0"), _persistence,
				new Descriptor("beacons", "controller", "default", "default", "1.0"), _controller,
				new Descriptor("beacons", "service", "rest", "default", "1.0"), _service
			);

			_controller.SetReferences(references);

			_service.SetReferences(references);
			_service.OpenAsync(null).Wait();
		}

		public void Dispose()
		{
			_service.CloseAsync(null).Wait();
		}

		[Fact]
		public async Task TestCrudOperationsAsync()
		{
			// Create the first beacon
			var beacon = await Invoke<BeaconV1>(
				HttpMethod.Post, "/v1/beacons", new { beacon = BEACON1 });

			Assert.NotNull(beacon);
			Assert.Equal(BEACON1.Udi, beacon.Udi);
			Assert.Equal(BEACON1.SiteId, beacon.SiteId);
			Assert.Equal(BEACON1.Type, beacon.Type);
			Assert.Equal(BEACON1.Label, beacon.Label);
			Assert.NotNull(beacon.Center);

			// Create the second beacon
			beacon = await Invoke<BeaconV1>(
				HttpMethod.Post, "/v1/beacons", new { beacon = BEACON2 });

			Assert.NotNull(beacon);
			Assert.Equal(BEACON2.Udi, beacon.Udi);
			Assert.Equal(BEACON2.SiteId, beacon.SiteId);
			Assert.Equal(BEACON2.Type, beacon.Type);
			Assert.Equal(BEACON2.Label, beacon.Label);
			Assert.NotNull(beacon.Center);

			// Get beacon by id
			beacon = await Invoke<BeaconV1>(
				HttpMethod.Get, $"/v1/beacons/{BEACON2.Id}", new {});

			Assert.NotNull(beacon);
			Assert.Equal(BEACON2.Udi, beacon.Udi);
			Assert.Equal(BEACON2.SiteId, beacon.SiteId);
			Assert.Equal(BEACON2.Type, beacon.Type);
			Assert.Equal(BEACON2.Label, beacon.Label);
			Assert.NotNull(beacon.Center);

			// Get all beacons
			var page = await Invoke<DataPage<BeaconV1>>(
				HttpMethod.Get, "/v1/beacons",
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

			beacon = await Invoke<BeaconV1>(
				HttpMethod.Put, "/v1/beacons", new { beacon = beacon1 });

			Assert.NotNull(beacon);
			Assert.Equal(beacon1.Id, beacon.Id);
			Assert.Equal("ABC", beacon.Label);

			// Get beacon by udi
			beacon = await Invoke<BeaconV1>(
				HttpMethod.Get, $"/v1/beacons/udi/{beacon1.Udi}");

			Assert.NotNull(beacon);
			Assert.Equal(beacon1.Id, beacon.Id);

			// Delete the beacon
			beacon = await Invoke<BeaconV1>(
				HttpMethod.Delete, $"/v1/beacons/{beacon1.Id}");

			Assert.NotNull(beacon);
			Assert.Equal(beacon1.Id, beacon.Id);

			// Try to get deleted beacon
			beacon = await Invoke<BeaconV1>(
				HttpMethod.Get, $"/v1/beacons/beacons/{beacon1.Id}");

			Assert.Null(beacon);
		}

		private async Task<T> Invoke<T>(HttpMethod method, string route, dynamic body = null)
		{
			var requestUri = $"http://localhost:3000" + route;
			var request = new HttpRequestMessage(method, requestUri);

			if (body != null)
            {
				request.Content = new StringContent(JsonConverter.ToJson(body), Encoding.UTF8, "application/json");
			}

			var response = await _httpClient.SendAsync(request);

			var responseValue = await response.Content.ReadAsStringAsync();
			return JsonConverter.FromJson<T>(responseValue);
		}
	}
}
