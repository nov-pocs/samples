using PipServices3.Commons.Refer;
using PipServices3.Rpc.Services;

namespace Nov.MaxSamples.Beacons.Services.Version1
{
    public class BeaconsHttpServiceV1: CommandableHttpService
    {
        public BeaconsHttpServiceV1()
            : base("v1/beacons")
        {
            _dependencyResolver.Put("controller", new Descriptor("beacons", "controller", "default", "*", "1.0"));
        }

        public override void Register()
        {
            if (!_swaggerAuto && _swaggerEnable)
            {
                RegisterOpenApiSpecFromResource("beacons_v1.yaml");
            }

            base.Register();
        }
    }
}
