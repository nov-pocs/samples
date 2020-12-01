using System;
using System.Threading.Tasks;
using PipServices3.Commons.Config;
using Xunit;

namespace Nov.MaxSamples.Beacons.Persistence
{
    [Collection("Sequential")]
    public class BeaconsJsonPostgresPersistenceTest : IDisposable
    {
        private bool _enabled = false;
        private BeaconsJsonPostgresPersistence _persistence;
        private BeaconsPersistenceFixture _fixture;

        public BeaconsJsonPostgresPersistenceTest()
        {
            var POSTGRES_DB = Environment.GetEnvironmentVariable("POSTGRES_DB") ?? "test";
            var POSTGRES_HOST = Environment.GetEnvironmentVariable("POSTGRES_HOST") ?? "localhost";
            var POSTGRES_PORT = Environment.GetEnvironmentVariable("POSTGRES_PORT") ?? "5432";
            var POSTGRES_URI = Environment.GetEnvironmentVariable("POSTGRES_URI");
            var POSTGRES_USER = Environment.GetEnvironmentVariable("POSTGRES_USER") ?? "postgres";
            var POSTGRES_PASS = Environment.GetEnvironmentVariable("POSTGRES_PASS") ?? "postgres";

            _enabled = !string.IsNullOrEmpty(POSTGRES_URI) || !string.IsNullOrEmpty(POSTGRES_HOST);

            if (_enabled)
            {
                var config = ConfigParams.FromTuples(
                    "connection.database", POSTGRES_DB,
                    "connection.host", POSTGRES_HOST,
                    "connection.port", POSTGRES_PORT,
                    "connection.uri", POSTGRES_URI,
                    "credential.username", POSTGRES_USER,
                    "credential.password", POSTGRES_PASS
                );

                _persistence = new BeaconsJsonPostgresPersistence();
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
