using System;
using System.Threading;
using System.Threading.Tasks;
using Nov.MaxSamples.Beacons.Logic;
using Nov.MaxSamples.Beacons.Persistence;
using Nov.MaxSamples.Beacons.Services.Version1;
using PipServices3.Commons.Config;
using PipServices3.Commons.Refer;
using Xunit;

namespace Nov.MaxSamples.Beacons.Clients.Version1
{
    [Collection("Sequential")]
    public class BeaconsCommandableGrpcClientV1Test : IDisposable
    {
        private static readonly ConfigParams HttpConfig = ConfigParams.FromTuples(
            "connection.protocol", "http",
            "connection.host", "localhost",
            "connection.port", 3000
        );

        private BeaconsMemoryPersistence _persistence;
        private BeaconsController _controller;
        private BeaconsCommandableGrpcServiceV1 _service;
        private BeaconsCommandableGrpcClientV1 _client;
        private BeaconsClientV1Fixture _fixture;

        public BeaconsCommandableGrpcClientV1Test()
        {
            _persistence = new BeaconsMemoryPersistence();
            _controller = new BeaconsController();
            _service = new BeaconsCommandableGrpcServiceV1();
            _client = new BeaconsCommandableGrpcClientV1();

            IReferences references = References.FromTuples(
                new Descriptor("beacons", "persistence", "memory", "default", "1.0"), _persistence,
                new Descriptor("beacons", "controller", "default", "default", "1.0"), _controller,
                new Descriptor("beacons", "service", "grpc", "default", "1.0"), _service,
                new Descriptor("beacons", "client", "grpc", "default", "1.0"), _client
            );

            _controller.SetReferences(references);

            _service.Configure(HttpConfig);
            _service.SetReferences(references);

            _client.Configure(HttpConfig);
            _client.SetReferences(references);

            _fixture = new BeaconsClientV1Fixture(_client);

            _service.OpenAsync(null).Wait();

            Thread.Sleep(1000); // Just let service a sec to be initialized

            _client.OpenAsync(null).Wait();
        }

        public void Dispose()
        {
            _client.CloseAsync(null).Wait();
            _service.CloseAsync(null).Wait();
        }

        [Fact]
        public async Task TestCrudOperationsAsync()
        {
            await _fixture.TestCrudOperationsAsync();
        }

        [Fact]
        public async Task TestCalculatePositionsAsync()
        {
            await _fixture.TestCalculatePositionsAsync();
        }
    }
}
