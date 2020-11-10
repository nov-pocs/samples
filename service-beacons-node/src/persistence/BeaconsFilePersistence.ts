import { JsonFilePersister } from 'pip-services3-data-node';

import { BeaconV1 } from '../data/version1/BeaconV1';
import { BeaconsMemoryPersistence } from './BeaconsMemoryPersistence';
import { ConfigParams } from 'pip-services3-commons-node';

export class BeaconsFilePersistence extends BeaconsMemoryPersistence {
    protected _persister: JsonFilePersister<BeaconV1>;

    constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<BeaconV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams) {
        super.configure(config);
        this._persister.configure(config);
    }
    
}
