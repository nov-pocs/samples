import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
export declare class BeaconsServiceFactory extends Factory {
    static MemoryPersistenceDescriptor: Descriptor;
    static FilePersistenceDescriptor: Descriptor;
    static MongoDbPersistenceDescriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static HttpServiceV1Descriptor: Descriptor;
    static PostgresPersistenceDescriptor: Descriptor;
    static JsonPostgresPersistenceDescriptor: Descriptor;
    static CommandableGrpcServiceDescriptor: Descriptor;
    constructor();
}
