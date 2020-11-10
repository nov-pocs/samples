import { IBeaconsClientV1 } from '../../../src/clients/version1/IBeaconsClientV1';
export declare class BeaconsClientV1Fixture {
    private _client;
    constructor(client: IBeaconsClientV1);
    testCrudOperations(done: any): void;
    testCalculatePosition(done: any): void;
}
