using PipServices3.Commons.Refer;
using PipServices3.Grpc.Services;

namespace Nov.MaxSamples.Beacons.Services.Version1
{
	public class BeaconsCommandableGrpcServiceV1: CommandableGrpcService
	{
		public BeaconsCommandableGrpcServiceV1()
			: base("beacons_v1")
		{
			_dependencyResolver.Put("controller", new Descriptor("beacons", "controller", "default", "*", "1.0"));
		}
	}
}
