import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { BeaconsMemoryPersistence } from '../../src/persistence/BeaconsMemoryPersistence';
import { BeaconsFilePersistence } from '../../src/persistence/BeaconsFilePersistence';
import { BeaconsMongoDbPersistence } from '../../src/persistence/BeaconsMongoDbPersistence';
import { BeaconsController } from '../../src/logic/BeaconsController';
import { BeaconsHttpServiceV1 } from '../../src/services/version1/BeaconsHttpServiceV1';
import { BeaconsPostgresPersistence } from '../../src/persistence/BeaconsPostgresPersistence';
import { BeaconsJsonPostgresPersistence } from '../../src/persistence/BeaconsJsonPostgresPersistence';

export class BeaconsServiceFactory extends Factory{
    public static MemoryPersistenceDescriptor = new Descriptor('beacons', 'persistence', 'memory', '*', '1.0');
    public static FilePersistenceDescriptor = new Descriptor('beacons', 'persistence', 'file', '*', '1.0');
    public static MongoDbPersistenceDescriptor = new Descriptor('beacons', 'persistence', 'mongodb', '*', '1.0');
    public static ControllerDescriptor = new Descriptor('beacons', 'controller', 'default', '*', '1.0');
    public static HttpServiceV1Descriptor = new Descriptor('beacons', 'service', 'http', '*', '1.0');
    public static PostgresPersistenceDescriptor = new Descriptor('beacons', 'persistence', 'postgres', '*', '1.0');
    public static JsonPostgresPersistenceDescriptor = new Descriptor('beacons', 'persistence', 'json-postgres', '*', '1.0');
    public static CommandableGrpcServiceDescriptor = new Descriptor("beacons", "service", "commandable-grpc", "default", "1.0");
    
    constructor(){
        super();

        this.registerAsType(BeaconsServiceFactory.MemoryPersistenceDescriptor, BeaconsMemoryPersistence);
        this.registerAsType(BeaconsServiceFactory.FilePersistenceDescriptor, BeaconsFilePersistence);
        this.registerAsType(BeaconsServiceFactory.MongoDbPersistenceDescriptor, BeaconsMongoDbPersistence);
        this.registerAsType(BeaconsServiceFactory.ControllerDescriptor, BeaconsController);
        this.registerAsType(BeaconsServiceFactory.HttpServiceV1Descriptor, BeaconsHttpServiceV1);
        this.registerAsType(BeaconsServiceFactory.PostgresPersistenceDescriptor, BeaconsPostgresPersistence);
        this.registerAsType(BeaconsServiceFactory.JsonPostgresPersistenceDescriptor, BeaconsJsonPostgresPersistence);
    }
}