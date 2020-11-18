import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IExecutionContext } from 'pip-benchmark-node';

import { IBeaconsPersistence } from '../src/persistence/IBeaconsPersistence';
import { BeaconsController } from '../src/logic/BeaconsController';
import { BeaconsServiceFactory } from '../src/build/BeaconsServiceFactory';

export class BeaconsBenchmarkContext {
    private _baseContext: IExecutionContext;
    public persistence: IBeaconsPersistence;
    public controller: BeaconsController;

    public constructor(baseContext: IExecutionContext) {
        this._baseContext = baseContext;
    }

    public open(callback: (err: any) => void): void {
        let databaseType = this._baseContext.parameters['DatabaseType'].getAsString();
        let databaseUri = this._baseContext.parameters['DatabaseUri'].getAsString();
        let databaseHost = this._baseContext.parameters['DatabaseHost'].getAsString();
        let databasePort = this._baseContext.parameters['DatabasePort'].getAsInteger();
        let databaseName = this._baseContext.parameters['DatabaseName'].getAsString();
        let databaseUser = this._baseContext.parameters['DatabaseUser'].getAsString();
        let databasePassword = this._baseContext.parameters['DatabasePassword'].getAsString();
    
        let persistenceDescriptor = new Descriptor("beacons", "persistence", databaseType, "*", "1.0");
        this.persistence = new BeaconsServiceFactory().create(persistenceDescriptor);
        (this.persistence as any).configure(ConfigParams.fromTuples(
            'connection.uri', databaseUri,
            'connection.host', databaseHost,
            'connection.port', databasePort,
            'connection.database', databaseName,
            'credential.username', databaseUser,
            'credential.password', databasePassword
        ));

        this.controller = new BeaconsController();
        this.controller.configure(new ConfigParams());

        let references: References = References.fromTuples(
            new Descriptor('beacons', 'persistence', databaseType, 'default', '1.0'), this.persistence,
            new Descriptor('pip-services-positions', 'controller', 'default', 'default', '1.0'), this.controller
        );
        this.controller.setReferences(references);

        (this.persistence as any).open(null, callback);
    }

    public close(callback: (err: any) => void): void {
        (this.persistence as any).close(null, callback);
    }
}