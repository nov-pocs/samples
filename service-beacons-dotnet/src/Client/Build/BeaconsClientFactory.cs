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

        public BeaconsClientFactory()
        {
            RegisterAsType(BeaconsClientFactory.NullClientDescriptor, typeof(BeaconsNullClientV1));
            RegisterAsType(BeaconsClientFactory.DirectClientDescriptor, typeof(BeaconsDirectClientV1));
            RegisterAsType(BeaconsClientFactory.HttpClientDescriptor, typeof(BeaconsCommandableHttpClientV1));
        }
    }
}
