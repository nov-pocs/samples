using Nov.MaxSamples.Beacons.Logic;
using Nov.MaxSamples.Beacons.Persistence;
using Nov.MaxSamples.Beacons.Services.Version1;
using PipServices3.Commons.Refer;
using PipServices3.Components.Build;

namespace Nov.MaxSamples.Beacons.Build
{
    public class BeaconsServiceFactory : Factory
    {
        public static Descriptor Descriptor = new Descriptor("beacons", "factory", "service", "default", "1.0");
        public static Descriptor MemoryPersistenceDescriptor = new Descriptor("beacons", "persistence", "memory", "*", "1.0");
        public static Descriptor MongoDbPersistenceDescriptor = new Descriptor("beacons", "persistence", "mongodb", "*", "1.0");
        public static Descriptor PostgresPersistenceDescriptor = new Descriptor("beacons", "persistence", "postgres", "*", "1.0");
        public static Descriptor JsonPostgresPersistenceDescriptor = new Descriptor("beacons", "persistence", "json-postgres", "*", "1.0");
        public static Descriptor ControllerDescriptor = new Descriptor("beacons", "controller", "default", "*", "1.0");
        public static Descriptor HttpServiceDescriptor = new Descriptor("beacons", "service", "commandable-http", "*", "1.0");
        public static Descriptor RestServiceDescriptor = new Descriptor("beacons", "service", "rest", "*", "1.0");
        public static Descriptor GrpcServiceDescriptor = new Descriptor("beacons", "service", "grpc", "default", "1.0");
        public static Descriptor CommandableGrpcServiceDescriptor = new Descriptor("beacons", "service", "commandable-grpc", "default", "1.0");

        public BeaconsServiceFactory()
        {
            RegisterAsType(MemoryPersistenceDescriptor, typeof(BeaconsMemoryPersistence));
            RegisterAsType(MongoDbPersistenceDescriptor, typeof(BeaconsMongoDbPersistence));
            RegisterAsType(ControllerDescriptor, typeof(BeaconsController));
            RegisterAsType(HttpServiceDescriptor, typeof(BeaconsCommandableHttpServiceV1));
            RegisterAsType(PostgresPersistenceDescriptor, typeof(BeaconsPostgresPersistence));
            RegisterAsType(JsonPostgresPersistenceDescriptor, typeof(BeaconsJsonPostgresPersistence));
            RegisterAsType(RestServiceDescriptor, typeof(BeaconsRestServiceV1));
            RegisterAsType(GrpcServiceDescriptor, typeof(BeaconsGrpcServiceV1)); 
            RegisterAsType(CommandableGrpcServiceDescriptor, typeof(BeaconsCommandableGrpcServiceV1));
        }
    }
}
