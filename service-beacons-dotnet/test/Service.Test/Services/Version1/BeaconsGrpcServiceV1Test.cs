using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Grpc.Core;
using Nov.MaxSamples.Beacons.Data.Version1;
using Nov.MaxSamples.Beacons.Logic;
using Nov.MaxSamples.Beacons.Persistence;
using PipServices3.Commons.Config;
using PipServices3.Commons.Refer;
using Xunit;
using static BeaconsV1.BeaconsV1;

namespace Nov.MaxSamples.Beacons.Services.Version1
{
    [Collection("Sequential")]
    public class BeaconsGrpcServiceV1Test : IDisposable
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
        private BeaconsGrpcServiceV1 _service;
        private BeaconsV1Client _client;

        public BeaconsGrpcServiceV1Test()
        {
            _persistence = new BeaconsMemoryPersistence();
            _controller = new BeaconsController();

            var config = ConfigParams.FromTuples(
                "connection.protocol", "http",
                "connection.host", "localhost",
                "connection.port", "3001"
            );

            // this service name is for test only, used by client
            _service = new BeaconsGrpcServiceV1("beacons_v1.BeaconsV1");
            _service.Configure(config);

            var references = References.FromTuples(
                new Descriptor("beacons", "persistence", "memory", "default", "1.0"), _persistence,
                new Descriptor("beacons", "controller", "default", "default", "1.0"), _controller,
                new Descriptor("beacons", "service", "grpc", "default", "1.0"), _service
            );

            _controller.SetReferences(references);

            _service.SetReferences(references);
            _service.OpenAsync(null).Wait();

            Channel channel = new Channel("localhost:3001", ChannelCredentials.Insecure);
            _client = new BeaconsV1Client(channel);
        }

        public void Dispose()
        {
            _service.CloseAsync(null).Wait();
        }

        [Fact]
        public async Task TestCrudOperationsAsync()
        {
            var callOptions = new CallOptions();

            // Create the first beacon
            var reply = await _client.create_beaconAsync(new BeaconsV1.BeaconV1ObjectRequest 
            { 
                CorrelationId = "default",
                Beacon = BeaconsGrpcConverterV1.FromBeacon(BEACON1)
            }, callOptions);

            var beacon = BeaconsGrpcConverterV1.ToBeacon(reply.Beacon);

            Assert.NotNull(beacon);
            Assert.Equal(BEACON1.Udi, beacon.Udi);
            Assert.Equal(BEACON1.SiteId, beacon.SiteId);
            Assert.Equal(BEACON1.Type, beacon.Type);
            Assert.Equal(BEACON1.Label, beacon.Label);
            Assert.NotNull(beacon.Center);

            // Create the second beacon
            reply = await _client.create_beaconAsync(new BeaconsV1.BeaconV1ObjectRequest
            {
                CorrelationId = "default",
                Beacon = BeaconsGrpcConverterV1.FromBeacon(BEACON2)
            }, callOptions);
            
            Assert.Null(reply.Error);
            beacon = BeaconsGrpcConverterV1.ToBeacon(reply.Beacon);

            Assert.NotNull(beacon);
            Assert.Equal(BEACON2.Udi, beacon.Udi);
            Assert.Equal(BEACON2.SiteId, beacon.SiteId);
            Assert.Equal(BEACON2.Type, beacon.Type);
            Assert.Equal(BEACON2.Label, beacon.Label);
            Assert.NotNull(beacon.Center);

            // Get all beacons
            var pageReply = await _client.get_beaconsAsync(new BeaconsV1.BeaconV1PageRequest
            {
                CorrelationId = "default",
                //Filter = empty by default
                Paging = new BeaconsV1.PagingParams
                { 
                    Skip = 0,
                    Take = 100,
                    Total = true
                }
            }, callOptions);

            Assert.Null(reply.Error);
            var page = BeaconsGrpcConverterV1.ToBeaconsPage(pageReply.Page);

            Assert.NotNull(page);
            Assert.Equal(2, page.Data.Count);

            var beacon1 = page.Data[0];

            // Update the beacon
            beacon1.Label = "ABC";

            reply = await _client.update_beaconAsync(new BeaconsV1.BeaconV1ObjectRequest
            {
                CorrelationId = "default",
                Beacon = BeaconsGrpcConverterV1.FromBeacon(beacon1)
            }, callOptions);

            Assert.Null(reply.Error);
            beacon = BeaconsGrpcConverterV1.ToBeacon(reply.Beacon);

            Assert.NotNull(beacon);
            Assert.Equal(beacon1.Id, beacon.Id);
            Assert.Equal("ABC", beacon.Label);

            // Get beacon by udi
            reply = await _client.get_beacon_by_udiAsync(new BeaconsV1.BeaconV1UdiRequest
            {
                CorrelationId = "default",
                BeaconUdi = beacon1.Udi
            }, callOptions);

            Assert.Null(reply.Error);
            beacon = BeaconsGrpcConverterV1.ToBeacon(reply.Beacon);

            Assert.NotNull(beacon);
            Assert.Equal(beacon1.Id, beacon.Id);

            // Delete the beacon
            reply = await _client.delete_beacon_by_idAsync(new BeaconsV1.BeaconV1IdRequest
            {
                CorrelationId = "default",
                BeaconId = beacon1.Id
            }, callOptions);

            Assert.Null(reply.Error);
            beacon = BeaconsGrpcConverterV1.ToBeacon(reply.Beacon);

            Assert.NotNull(beacon);
            Assert.Equal(beacon1.Id, beacon.Id);

            // Try to get deleted beacon
            reply = await _client.get_beacon_by_idAsync(new BeaconsV1.BeaconV1IdRequest
            {
                CorrelationId = "default",
                BeaconId = beacon1.Id
            }, callOptions);

            beacon = BeaconsGrpcConverterV1.ToBeacon(reply.Beacon);
            Assert.Null(beacon);
        }
    }
}
