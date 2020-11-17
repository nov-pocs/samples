// package: beacons_v1
// file: beacons_v1.proto

import * as jspb from "google-protobuf";

export class ErrorDescription extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getCategory(): string;
  setCategory(value: string): void;

  getCode(): string;
  setCode(value: string): void;

  getCorrelationId(): string;
  setCorrelationId(value: string): void;

  getStatus(): string;
  setStatus(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  getCause(): string;
  setCause(value: string): void;

  getStackTrace(): string;
  setStackTrace(value: string): void;

  getDetailsMap(): jspb.Map<string, string>;
  clearDetailsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrorDescription.AsObject;
  static toObject(includeInstance: boolean, msg: ErrorDescription): ErrorDescription.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ErrorDescription, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrorDescription;
  static deserializeBinaryFromReader(message: ErrorDescription, reader: jspb.BinaryReader): ErrorDescription;
}

export namespace ErrorDescription {
  export type AsObject = {
    type: string,
    category: string,
    code: string,
    correlationId: string,
    status: string,
    message: string,
    cause: string,
    stackTrace: string,
    detailsMap: Array<[string, string]>,
  }
}

export class PagingParams extends jspb.Message {
  getSkip(): number;
  setSkip(value: number): void;

  getTake(): number;
  setTake(value: number): void;

  getTotal(): boolean;
  setTotal(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PagingParams.AsObject;
  static toObject(includeInstance: boolean, msg: PagingParams): PagingParams.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PagingParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PagingParams;
  static deserializeBinaryFromReader(message: PagingParams, reader: jspb.BinaryReader): PagingParams;
}

export namespace PagingParams {
  export type AsObject = {
    skip: number,
    take: number,
    total: boolean,
  }
}

export class InternalArray extends jspb.Message {
  clearInternalArrayList(): void;
  getInternalArrayList(): Array<number>;
  setInternalArrayList(value: Array<number>): void;
  addInternalArray(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InternalArray.AsObject;
  static toObject(includeInstance: boolean, msg: InternalArray): InternalArray.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InternalArray, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InternalArray;
  static deserializeBinaryFromReader(message: InternalArray, reader: jspb.BinaryReader): InternalArray;
}

export namespace InternalArray {
  export type AsObject = {
    internalArrayList: Array<number>,
  }
}

export class GeoPointV1 extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  clearCoordinatesList(): void;
  getCoordinatesList(): Array<InternalArray>;
  setCoordinatesList(value: Array<InternalArray>): void;
  addCoordinates(value?: InternalArray, index?: number): InternalArray;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeoPointV1.AsObject;
  static toObject(includeInstance: boolean, msg: GeoPointV1): GeoPointV1.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GeoPointV1, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeoPointV1;
  static deserializeBinaryFromReader(message: GeoPointV1, reader: jspb.BinaryReader): GeoPointV1;
}

export namespace GeoPointV1 {
  export type AsObject = {
    type: string,
    coordinatesList: Array<InternalArray.AsObject>,
  }
}

export class BeaconV1 extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getSiteId(): string;
  setSiteId(value: string): void;

  getType(): string;
  setType(value: string): void;

  getUdi(): string;
  setUdi(value: string): void;

  getLabel(): string;
  setLabel(value: string): void;

  hasCenter(): boolean;
  clearCenter(): void;
  getCenter(): GeoPointV1 | undefined;
  setCenter(value?: GeoPointV1): void;

  getRadius(): number;
  setRadius(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconV1.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconV1): BeaconV1.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BeaconV1, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconV1;
  static deserializeBinaryFromReader(message: BeaconV1, reader: jspb.BinaryReader): BeaconV1;
}

export namespace BeaconV1 {
  export type AsObject = {
    id: string,
    siteId: string,
    type: string,
    udi: string,
    label: string,
    center?: GeoPointV1.AsObject,
    radius: number,
  }
}

export class BeaconV1Page extends jspb.Message {
  getTotal(): number;
  setTotal(value: number): void;

  clearDataList(): void;
  getDataList(): Array<BeaconV1>;
  setDataList(value: Array<BeaconV1>): void;
  addData(value?: BeaconV1, index?: number): BeaconV1;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconV1Page.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconV1Page): BeaconV1Page.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BeaconV1Page, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconV1Page;
  static deserializeBinaryFromReader(message: BeaconV1Page, reader: jspb.BinaryReader): BeaconV1Page;
}

export namespace BeaconV1Page {
  export type AsObject = {
    total: number,
    dataList: Array<BeaconV1.AsObject>,
  }
}

export class BeaconV1PageRequest extends jspb.Message {
  getCorrelationId(): string;
  setCorrelationId(value: string): void;

  getFilterMap(): jspb.Map<string, string>;
  clearFilterMap(): void;
  hasPaging(): boolean;
  clearPaging(): void;
  getPaging(): PagingParams | undefined;
  setPaging(value?: PagingParams): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconV1PageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconV1PageRequest): BeaconV1PageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BeaconV1PageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconV1PageRequest;
  static deserializeBinaryFromReader(message: BeaconV1PageRequest, reader: jspb.BinaryReader): BeaconV1PageRequest;
}

export namespace BeaconV1PageRequest {
  export type AsObject = {
    correlationId: string,
    filterMap: Array<[string, string]>,
    paging?: PagingParams.AsObject,
  }
}

export class BeaconV1PageReply extends jspb.Message {
  hasError(): boolean;
  clearError(): void;
  getError(): ErrorDescription | undefined;
  setError(value?: ErrorDescription): void;

  hasPage(): boolean;
  clearPage(): void;
  getPage(): BeaconV1Page | undefined;
  setPage(value?: BeaconV1Page): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconV1PageReply.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconV1PageReply): BeaconV1PageReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BeaconV1PageReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconV1PageReply;
  static deserializeBinaryFromReader(message: BeaconV1PageReply, reader: jspb.BinaryReader): BeaconV1PageReply;
}

export namespace BeaconV1PageReply {
  export type AsObject = {
    error?: ErrorDescription.AsObject,
    page?: BeaconV1Page.AsObject,
  }
}

export class BeaconV1IdRequest extends jspb.Message {
  getCorrelationId(): string;
  setCorrelationId(value: string): void;

  getBeaconId(): string;
  setBeaconId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconV1IdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconV1IdRequest): BeaconV1IdRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BeaconV1IdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconV1IdRequest;
  static deserializeBinaryFromReader(message: BeaconV1IdRequest, reader: jspb.BinaryReader): BeaconV1IdRequest;
}

export namespace BeaconV1IdRequest {
  export type AsObject = {
    correlationId: string,
    beaconId: string,
  }
}

export class BeaconV1UdiRequest extends jspb.Message {
  getCorrelationId(): string;
  setCorrelationId(value: string): void;

  getBeaconUdi(): string;
  setBeaconUdi(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconV1UdiRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconV1UdiRequest): BeaconV1UdiRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BeaconV1UdiRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconV1UdiRequest;
  static deserializeBinaryFromReader(message: BeaconV1UdiRequest, reader: jspb.BinaryReader): BeaconV1UdiRequest;
}

export namespace BeaconV1UdiRequest {
  export type AsObject = {
    correlationId: string,
    beaconUdi: string,
  }
}

export class BeaconV1PositionRequest extends jspb.Message {
  getCorrelationId(): string;
  setCorrelationId(value: string): void;

  clearUdisList(): void;
  getUdisList(): Array<string>;
  setUdisList(value: Array<string>): void;
  addUdis(value: string, index?: number): string;

  getSiteId(): string;
  setSiteId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconV1PositionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconV1PositionRequest): BeaconV1PositionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BeaconV1PositionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconV1PositionRequest;
  static deserializeBinaryFromReader(message: BeaconV1PositionRequest, reader: jspb.BinaryReader): BeaconV1PositionRequest;
}

export namespace BeaconV1PositionRequest {
  export type AsObject = {
    correlationId: string,
    udisList: Array<string>,
    siteId: string,
  }
}

export class BeaconV1ObjectRequest extends jspb.Message {
  getCorrelationId(): string;
  setCorrelationId(value: string): void;

  hasBeacon(): boolean;
  clearBeacon(): void;
  getBeacon(): BeaconV1 | undefined;
  setBeacon(value?: BeaconV1): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconV1ObjectRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconV1ObjectRequest): BeaconV1ObjectRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BeaconV1ObjectRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconV1ObjectRequest;
  static deserializeBinaryFromReader(message: BeaconV1ObjectRequest, reader: jspb.BinaryReader): BeaconV1ObjectRequest;
}

export namespace BeaconV1ObjectRequest {
  export type AsObject = {
    correlationId: string,
    beacon?: BeaconV1.AsObject,
  }
}

export class BeaconV1ObjectReply extends jspb.Message {
  hasError(): boolean;
  clearError(): void;
  getError(): ErrorDescription | undefined;
  setError(value?: ErrorDescription): void;

  hasBeacon(): boolean;
  clearBeacon(): void;
  getBeacon(): BeaconV1 | undefined;
  setBeacon(value?: BeaconV1): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconV1ObjectReply.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconV1ObjectReply): BeaconV1ObjectReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BeaconV1ObjectReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconV1ObjectReply;
  static deserializeBinaryFromReader(message: BeaconV1ObjectReply, reader: jspb.BinaryReader): BeaconV1ObjectReply;
}

export namespace BeaconV1ObjectReply {
  export type AsObject = {
    error?: ErrorDescription.AsObject,
    beacon?: BeaconV1.AsObject,
  }
}

export class BeaconV1PositionReply extends jspb.Message {
  hasError(): boolean;
  clearError(): void;
  getError(): ErrorDescription | undefined;
  setError(value?: ErrorDescription): void;

  hasPoint(): boolean;
  clearPoint(): void;
  getPoint(): GeoPointV1 | undefined;
  setPoint(value?: GeoPointV1): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconV1PositionReply.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconV1PositionReply): BeaconV1PositionReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BeaconV1PositionReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconV1PositionReply;
  static deserializeBinaryFromReader(message: BeaconV1PositionReply, reader: jspb.BinaryReader): BeaconV1PositionReply;
}

export namespace BeaconV1PositionReply {
  export type AsObject = {
    error?: ErrorDescription.AsObject,
    point?: GeoPointV1.AsObject,
  }
}

