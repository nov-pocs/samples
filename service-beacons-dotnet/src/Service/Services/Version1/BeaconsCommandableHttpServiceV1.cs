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

        public override void Register()
        {
            if (!_swaggerAuto && _swaggerEnable)
            {
                RegisterOpenApiSpecFromResource("beacons_http_v1.yaml");
            }

            base.Register();
        }
    }
}
