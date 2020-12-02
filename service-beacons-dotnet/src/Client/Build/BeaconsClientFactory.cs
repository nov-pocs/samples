using Nov.MaxSamples.Beacons.Clients.Version1;
using PipServices3.Commons.Refer;
using PipServices3.Components.Build;

namespace Nov.MaxSamples.Beacons.Build
{
    public class BeaconsClientFactory : Factory
    {
        public static Descriptor NullClientDescriptor = new Descriptor("beacons", "client", "null", "*", "1.0");
        public static Descriptor DirectClientDescriptor = new Descriptor("beacons", "client", "direct", "*", "1.0");
        public static Descriptor HttpClientDescriptor = new Descriptor("beacons", "client", "commandable-http", "*", "1.0");
        public static Descriptor RestClientDescriptor = new Descriptor("beacons", "client", "rest", "*", "1.0");
        public static Descriptor GrpcClientDescriptor = new Descriptor("beacons", "client", "grpc", "default", "1.0");
        public static Descriptor CommandableGrpcClientDescriptor = new Descriptor("beacons", "client", "commandable-grpc", "default", "1.0");

        public BeaconsClientFactory()
        {
            RegisterAsType(NullClientDescriptor, typeof(BeaconsNullClientV1));
            RegisterAsType(DirectClientDescriptor, typeof(BeaconsDirectClientV1));
            RegisterAsType(HttpClientDescriptor, typeof(BeaconsCommandableHttpClientV1));
            RegisterAsType(RestClientDescriptor, typeof(BeaconsRestClientV1));
            RegisterAsType(GrpcClientDescriptor, typeof(BeaconsGrpcClientV1));
            RegisterAsType(CommandableGrpcClientDescriptor, typeof(BeaconsCommandableGrpcClientV1));
        }
    }
}
