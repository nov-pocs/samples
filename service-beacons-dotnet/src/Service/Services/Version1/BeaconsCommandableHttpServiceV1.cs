using PipServices3.Commons.Refer;
using PipServices3.Rpc.Services;

namespace Nov.MaxSamples.Beacons.Services.Version1
{
    public class BeaconsCommandableHttpServiceV1 : CommandableHttpService
    {
        public BeaconsCommandableHttpServiceV1()
            : base("v1/beacons")
        {
            _dependencyResolver.Put("controller", new Descriptor("beacons", "controller", "default", "*", "1.0"));
        }
    }
}
