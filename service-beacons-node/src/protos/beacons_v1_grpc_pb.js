// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright 2015 gRPC authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
'use strict';
var grpc = require('grpc');
var beacons_v1_pb = require('./beacons_v1_pb.js');

function serialize_beacons_v1_BeaconV1IdRequest(arg) {
  if (!(arg instanceof beacons_v1_pb.BeaconV1IdRequest)) {
    throw new Error('Expected argument of type beacons_v1.BeaconV1IdRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_beacons_v1_BeaconV1IdRequest(buffer_arg) {
  return beacons_v1_pb.BeaconV1IdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_beacons_v1_BeaconV1ObjectReply(arg) {
  if (!(arg instanceof beacons_v1_pb.BeaconV1ObjectReply)) {
    throw new Error('Expected argument of type beacons_v1.BeaconV1ObjectReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_beacons_v1_BeaconV1ObjectReply(buffer_arg) {
  return beacons_v1_pb.BeaconV1ObjectReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_beacons_v1_BeaconV1ObjectRequest(arg) {
  if (!(arg instanceof beacons_v1_pb.BeaconV1ObjectRequest)) {
    throw new Error('Expected argument of type beacons_v1.BeaconV1ObjectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_beacons_v1_BeaconV1ObjectRequest(buffer_arg) {
  return beacons_v1_pb.BeaconV1ObjectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_beacons_v1_BeaconV1PageReply(arg) {
  if (!(arg instanceof beacons_v1_pb.BeaconV1PageReply)) {
    throw new Error('Expected argument of type beacons_v1.BeaconV1PageReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_beacons_v1_BeaconV1PageReply(buffer_arg) {
  return beacons_v1_pb.BeaconV1PageReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_beacons_v1_BeaconV1PageRequest(arg) {
  if (!(arg instanceof beacons_v1_pb.BeaconV1PageRequest)) {
    throw new Error('Expected argument of type beacons_v1.BeaconV1PageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_beacons_v1_BeaconV1PageRequest(buffer_arg) {
  return beacons_v1_pb.BeaconV1PageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_beacons_v1_BeaconV1PositionReply(arg) {
  if (!(arg instanceof beacons_v1_pb.BeaconV1PositionReply)) {
    throw new Error('Expected argument of type beacons_v1.BeaconV1PositionReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_beacons_v1_BeaconV1PositionReply(buffer_arg) {
  return beacons_v1_pb.BeaconV1PositionReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_beacons_v1_BeaconV1PositionRequest(arg) {
  if (!(arg instanceof beacons_v1_pb.BeaconV1PositionRequest)) {
    throw new Error('Expected argument of type beacons_v1.BeaconV1PositionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_beacons_v1_BeaconV1PositionRequest(buffer_arg) {
  return beacons_v1_pb.BeaconV1PositionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_beacons_v1_BeaconV1UdiRequest(arg) {
  if (!(arg instanceof beacons_v1_pb.BeaconV1UdiRequest)) {
    throw new Error('Expected argument of type beacons_v1.BeaconV1UdiRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_beacons_v1_BeaconV1UdiRequest(buffer_arg) {
  return beacons_v1_pb.BeaconV1UdiRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The beacons service definition.
var BeaconsV1Service = exports.BeaconsV1Service = {
  get_beacons: {
    path: '/beacons_v1.BeaconsV1/get_beacons',
    requestStream: false,
    responseStream: false,
    requestType: beacons_v1_pb.BeaconV1PageRequest,
    responseType: beacons_v1_pb.BeaconV1PageReply,
    requestSerialize: serialize_beacons_v1_BeaconV1PageRequest,
    requestDeserialize: deserialize_beacons_v1_BeaconV1PageRequest,
    responseSerialize: serialize_beacons_v1_BeaconV1PageReply,
    responseDeserialize: deserialize_beacons_v1_BeaconV1PageReply,
  },
  get_beacon_by_id: {
    path: '/beacons_v1.BeaconsV1/get_beacon_by_id',
    requestStream: false,
    responseStream: false,
    requestType: beacons_v1_pb.BeaconV1IdRequest,
    responseType: beacons_v1_pb.BeaconV1ObjectReply,
    requestSerialize: serialize_beacons_v1_BeaconV1IdRequest,
    requestDeserialize: deserialize_beacons_v1_BeaconV1IdRequest,
    responseSerialize: serialize_beacons_v1_BeaconV1ObjectReply,
    responseDeserialize: deserialize_beacons_v1_BeaconV1ObjectReply,
  },
  create_beacon: {
    path: '/beacons_v1.BeaconsV1/create_beacon',
    requestStream: false,
    responseStream: false,
    requestType: beacons_v1_pb.BeaconV1ObjectRequest,
    responseType: beacons_v1_pb.BeaconV1ObjectReply,
    requestSerialize: serialize_beacons_v1_BeaconV1ObjectRequest,
    requestDeserialize: deserialize_beacons_v1_BeaconV1ObjectRequest,
    responseSerialize: serialize_beacons_v1_BeaconV1ObjectReply,
    responseDeserialize: deserialize_beacons_v1_BeaconV1ObjectReply,
  },
  update_beacon: {
    path: '/beacons_v1.BeaconsV1/update_beacon',
    requestStream: false,
    responseStream: false,
    requestType: beacons_v1_pb.BeaconV1ObjectRequest,
    responseType: beacons_v1_pb.BeaconV1ObjectReply,
    requestSerialize: serialize_beacons_v1_BeaconV1ObjectRequest,
    requestDeserialize: deserialize_beacons_v1_BeaconV1ObjectRequest,
    responseSerialize: serialize_beacons_v1_BeaconV1ObjectReply,
    responseDeserialize: deserialize_beacons_v1_BeaconV1ObjectReply,
  },
  delete_beacon_by_id: {
    path: '/beacons_v1.BeaconsV1/delete_beacon_by_id',
    requestStream: false,
    responseStream: false,
    requestType: beacons_v1_pb.BeaconV1IdRequest,
    responseType: beacons_v1_pb.BeaconV1ObjectReply,
    requestSerialize: serialize_beacons_v1_BeaconV1IdRequest,
    requestDeserialize: deserialize_beacons_v1_BeaconV1IdRequest,
    responseSerialize: serialize_beacons_v1_BeaconV1ObjectReply,
    responseDeserialize: deserialize_beacons_v1_BeaconV1ObjectReply,
  },
  get_beacon_by_udi: {
    path: '/beacons_v1.BeaconsV1/get_beacon_by_udi',
    requestStream: false,
    responseStream: false,
    requestType: beacons_v1_pb.BeaconV1UdiRequest,
    responseType: beacons_v1_pb.BeaconV1ObjectReply,
    requestSerialize: serialize_beacons_v1_BeaconV1UdiRequest,
    requestDeserialize: deserialize_beacons_v1_BeaconV1UdiRequest,
    responseSerialize: serialize_beacons_v1_BeaconV1ObjectReply,
    responseDeserialize: deserialize_beacons_v1_BeaconV1ObjectReply,
  },
  calculate_position: {
    path: '/beacons_v1.BeaconsV1/calculate_position',
    requestStream: false,
    responseStream: false,
    requestType: beacons_v1_pb.BeaconV1PositionRequest,
    responseType: beacons_v1_pb.BeaconV1PositionReply,
    requestSerialize: serialize_beacons_v1_BeaconV1PositionRequest,
    requestDeserialize: deserialize_beacons_v1_BeaconV1PositionRequest,
    responseSerialize: serialize_beacons_v1_BeaconV1PositionReply,
    responseDeserialize: deserialize_beacons_v1_BeaconV1PositionReply,
  },
};

exports.BeaconsV1Client = grpc.makeGenericClientConstructor(BeaconsV1Service);
