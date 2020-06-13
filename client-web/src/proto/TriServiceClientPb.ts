/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';

import {
  CreateGameReply,
  CreateGameRequest,
  GameSessionStream,
  JoinGameRequest,
  StartGameRequest,
  TurnGameRequest} from './tri_pb';

export class TRIGameClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: string; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoCreate = new grpcWeb.AbstractClientBase.MethodInfo(
    CreateGameReply,
    (request: CreateGameRequest) => {
      return request.serializeBinary();
    },
    CreateGameReply.deserializeBinary
  );

  create(
    request: CreateGameRequest,
    metadata: grpcWeb.Metadata | null): Promise<CreateGameReply>;

  create(
    request: CreateGameRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: CreateGameReply) => void): grpcWeb.ClientReadableStream<CreateGameReply>;

  create(
    request: CreateGameRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: CreateGameReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/TRIGame/Create',
        request,
        metadata || {},
        this.methodInfoCreate,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/TRIGame/Create',
    request,
    metadata || {},
    this.methodInfoCreate);
  }

  methodInfoJoin = new grpcWeb.AbstractClientBase.MethodInfo(
    GameSessionStream,
    (request: JoinGameRequest) => {
      return request.serializeBinary();
    },
    GameSessionStream.deserializeBinary
  );

  join(
    request: JoinGameRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/TRIGame/Join',
      request,
      metadata || {},
      this.methodInfoJoin);
  }

  methodInfoStart = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: StartGameRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  start(
    request: StartGameRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  start(
    request: StartGameRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  start(
    request: StartGameRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/TRIGame/Start',
        request,
        metadata || {},
        this.methodInfoStart,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/TRIGame/Start',
    request,
    metadata || {},
    this.methodInfoStart);
  }

  methodInfoTurn = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: TurnGameRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  turn(
    request: TurnGameRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  turn(
    request: TurnGameRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  turn(
    request: TurnGameRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/TRIGame/Turn',
        request,
        metadata || {},
        this.methodInfoTurn,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/TRIGame/Turn',
    request,
    metadata || {},
    this.methodInfoTurn);
  }

}

