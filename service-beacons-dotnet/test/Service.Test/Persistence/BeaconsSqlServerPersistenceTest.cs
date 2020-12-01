using System;
using System.Threading.Tasks;
using PipServices3.Commons.Config;
using Xunit;

namespace Nov.MaxSamples.Beacons.Persistence
{
    public class BeaconsSqlServerPersistenceTest : IDisposable
    {
        private bool _enabled = false;
        private BeaconsSqlServerPersistence _persistence;
        private BeaconsPersistenceFixture _fixture;

        public BeaconsSqlServerPersistenceTest()
        {
            var SQLSERVER_DB = Environment.GetEnvironmentVariable("SQLSERVER_DB") ?? "master";
            var SQLSERVER_SERVICE_HOST = Environment.GetEnvironmentVariable("SQLSERVER_SERVICE_HOST") ?? "localhost";
            var SQLSERVER_SERVICE_PORT = Environment.GetEnvironmentVariable("SQLSERVER_SERVICE_PORT") ?? "1433";
            var SQLSERVER_SERVICE_URI = Environment.GetEnvironmentVariable("SQLSERVER_SERVICE_URI");
            var SQLSERVER_USER = Environment.GetEnvironmentVariable("SQLSERVER_USER") ?? "sa";
            var SQLSERVER_PASS = Environment.GetEnvironmentVariable("SQLSERVER_PASS") ?? "sqlserver_123";

            _enabled = !string.IsNullOrEmpty(SQLSERVER_SERVICE_URI) || !string.IsNullOrEmpty(SQLSERVER_SERVICE_HOST);

            if (_enabled)
            {
                var config = ConfigParams.FromTuples(
                    "connection.database", SQLSERVER_DB,
                    "connection.host", SQLSERVER_SERVICE_HOST,
                    "connection.port", SQLSERVER_SERVICE_PORT,
                    "connection.uri", SQLSERVER_SERVICE_URI,
                    "credential.username", SQLSERVER_USER,
                    "credential.password", SQLSERVER_PASS
                );

                _persistence = new BeaconsSqlServerPersistence();
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
