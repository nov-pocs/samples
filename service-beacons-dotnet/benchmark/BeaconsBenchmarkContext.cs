using Nov.MaxSamples.Beacons.Build;
using Nov.MaxSamples.Beacons.Logic;
using Nov.MaxSamples.Beacons.Persistence;
using PipBenchmark;
using PipServices3.Commons.Config;
using PipServices3.Commons.Refer;
using PipServices3.Commons.Run;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Nov.MaxSamples.Beacons
{
	public class BeaconsBenchmarkContext
	{
		private IExecutionContext _baseContext;
		public IBeaconsPersistence Persistence;
		public BeaconsController Controller;

		public BeaconsBenchmarkContext(IExecutionContext baseContext)
		{
			_baseContext = baseContext;
		}

		public async Task OpenAsync()
		{
            var databaseType = _baseContext.Parameters["DatabaseType"].AsString;
            var databaseUri = _baseContext.Parameters["DatabaseUri"].AsString;
            var databaseHost = _baseContext.Parameters["DatabaseHost"].AsString;
            var databasePort = _baseContext.Parameters["DatabasePort"].AsInteger;
            var databaseName = _baseContext.Parameters["DatabaseName"].AsString;
            var databaseUser = _baseContext.Parameters["DatabaseUser"].AsString;
            var databasePassword = _baseContext.Parameters["DatabasePassword"].AsString;

            var persistenceDescriptor = new Descriptor("beacons", "persistence", databaseType, "*", "1.0");
            Persistence = new BeaconsServiceFactory().Create(persistenceDescriptor) as IBeaconsPersistence;
            ((IConfigurable)Persistence).Configure(ConfigParams.FromTuples(
                "connection.uri", databaseUri,
                "connection.host", databaseHost,
                "connection.port", databasePort,
                "connection.database", databaseName,
                "credential.username", databaseUser,
                "credential.password", databasePassword
            ));

            Controller = new BeaconsController();
            Controller.Configure(new ConfigParams());

            var references = References.FromTuples(
                new Descriptor("beacons", "persistence", databaseType, "default", "1.0"), Persistence,
                new Descriptor("pip-services-positions", "controller", "default", "default", "1.0"), Controller
            );
            Controller.SetReferences(references);

            await ((IOpenable)Persistence).OpenAsync(null);
        }

        public async Task CloseAsync()
        {
            await ((IOpenable)Persistence).CloseAsync(null);
        }
    }
}
