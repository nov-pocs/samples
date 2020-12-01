using System;
using System.Threading.Tasks;
using PipServices3.Commons.Config;
using Xunit;

namespace Nov.MaxSamples.Beacons.Persistence
{
    public class BeaconsPostgresPersistenceTest : IDisposable
    {
        private bool _enabled = false;
        private BeaconsPostgresPersistence _persistence;
        private BeaconsPersistenceFixture _fixture;

        public BeaconsPostgresPersistenceTest()
        {
            var POSTGRES_DB = Environment.GetEnvironmentVariable("POSTGRES_DB") ?? "test";
            var POSTGRES_SERVICE_HOST = Environment.GetEnvironmentVariable("POSTGRES_SERVICE_HOST") ?? "localhost";
            var POSTGRES_SERVICE_PORT = Environment.GetEnvironmentVariable("POSTGRES_SERVICE_PORT") ?? "5432";
            var POSTGRES_SERVICE_URI = Environment.GetEnvironmentVariable("POSTGRES_SERVICE_URI");
            var POSTGRES_USER = Environment.GetEnvironmentVariable("POSTGRES_USER") ?? "postgres";
            var POSTGRES_PASS = Environment.GetEnvironmentVariable("POSTGRES_PASS") ?? "postgres";

            _enabled = !string.IsNullOrEmpty(POSTGRES_SERVICE_URI) || !string.IsNullOrEmpty(POSTGRES_SERVICE_HOST);

            if (_enabled)
            {
                var config = ConfigParams.FromTuples(
                    "connection.database", POSTGRES_DB,
                    "connection.host", POSTGRES_SERVICE_HOST,
                    "connection.port", POSTGRES_SERVICE_PORT,
                    "connection.uri", POSTGRES_SERVICE_URI,
                    "credential.username", POSTGRES_USER,
                    "credential.password", POSTGRES_PASS
                );

                _persistence = new BeaconsPostgresPersistence();
                _persistence.Configure(config);
                _persistence.OpenAsync(null).Wait();
                _persistence.ClearAsync(null).Wait();

                _fixture = new BeaconsPersistenceFixture(_persistence);
            }
        }

        public void Dispose()
        {
            if (_enabled)
                _persistence.CloseAsync(null).Wait();
        }

        [Fact]
        public async Task TestCrudOperationsAsync()
        {
            if (_enabled)
                await _fixture.TestCrudOperationsAsync();
        }

        [Fact]
        public async Task TestGetWithFiltersAsync()
        {
            if (_enabled)
                await _fixture.TestGetWithFiltersAsync();
        }

    }
}
