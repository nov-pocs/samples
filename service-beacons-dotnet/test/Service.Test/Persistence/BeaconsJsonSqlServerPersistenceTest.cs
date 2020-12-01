using System;
using System.Threading.Tasks;
using PipServices3.Commons.Config;
using Xunit;

namespace Nov.MaxSamples.Beacons.Persistence
{
	public class BeaconsJsonSqlServerPersistenceTest : IDisposable
	{
		private bool _enabled = false;
		private BeaconsJsonSqlServerPersistence _persistence;
		private BeaconsPersistenceFixture _fixture;

		public BeaconsJsonSqlServerPersistenceTest()
		{
			var SQLSERVER_DB = Environment.GetEnvironmentVariable("SQLSERVER_DB") ?? "master";
			var SQLSERVER_HOST = Environment.GetEnvironmentVariable("SQLSERVER_HOST") ?? "localhost";
			var SQLSERVER_PORT = Environment.GetEnvironmentVariable("SQLSERVER_PORT") ?? "1433";
			var SQLSERVER_URI = Environment.GetEnvironmentVariable("SQLSERVER_URI");
			var SQLSERVER_USER = Environment.GetEnvironmentVariable("SQLSERVER_USER") ?? "sa";
			var SQLSERVER_PASS = Environment.GetEnvironmentVariable("SQLSERVER_PASS") ?? "sqlserver_123";

			_enabled = !string.IsNullOrEmpty(SQLSERVER_URI) || !string.IsNullOrEmpty(SQLSERVER_HOST);

			if (_enabled)
			{
				var config = ConfigParams.FromTuples(
					"connection.database", SQLSERVER_DB,
					"connection.host", SQLSERVER_HOST,
					"connection.port", SQLSERVER_PORT,
					"connection.uri", SQLSERVER_URI,
					"credential.username", SQLSERVER_USER,
					"credential.password", SQLSERVER_PASS
				);

				_persistence = new BeaconsJsonSqlServerPersistence();
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
