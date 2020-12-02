using Nov.MaxSamples.Beacons.Data.Version1;
using PipServices3.Commons.Config;
using PipServices3.Data.Persistence;

namespace Nov.MaxSamples.Beacons.Persistence
{
    public class BeaconsFilePersistence : BeaconsMemoryPersistence
    {
        protected JsonFilePersister<BeaconV1> _persister;

        public BeaconsFilePersistence()
        {
            _persister = new JsonFilePersister<BeaconV1>();
            _loader = _persister;
            _saver = _persister;
        }

        public override void Configure(ConfigParams config)
        {
            base.Configure(config);
            _persister.Configure(config);
        }
    }
}
