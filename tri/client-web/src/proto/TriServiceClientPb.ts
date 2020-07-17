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
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';

import {
  CreateSessionReply,
  CreateSessionRequest,
  GameSessionStream,
  ObserveSessionRequest,
  SetAliasRequest,
  SetSettingsRequest,
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

  methodInfoCreateSession = new grpcWeb.AbstractClientBase.MethodInfo(
    CreateSessionReply,
    (request: CreateSessionRequest) => {
      return request.serializeBinary();
    },
    CreateSessionReply.deserializeBinary
  );

  createSession(
    request: CreateSessionRequest,
    metadata: grpcWeb.Metadata | null): Promise<CreateSessionReply>;

  createSession(
    request: CreateSessionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: CreateSessionReply) => void): grpcWeb.ClientReadableStream<CreateSessionReply>;

  createSession(
    request: CreateSessionRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: CreateSessionReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/TRIGame/CreateSession',
        request,
        metadata || {},
        this.methodInfoCreateSession,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/TRIGame/CreateSession',
    request,
    metadata || {},
    this.methodInfoCreateSession);
  }

  methodInfoObserveSession = new grpcWeb.AbstractClientBase.MethodInfo(
    GameSessionStream,
    (request: ObserveSessionRequest) => {
      return request.serializeBinary();
    },
    GameSessionStream.deserializeBinary
  );

  observeSession(
    request: ObserveSessionRequest,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/TRIGame/ObserveSession',
      request,
      metadata || {},
      this.methodInfoObserveSession);
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

  methodInfoSetAlias = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: SetAliasRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  setAlias(
    request: SetAliasRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  setAlias(
    request: SetAliasRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  setAlias(
    request: SetAliasRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/TRIGame/SetAlias',
        request,
        metadata || {},
        this.methodInfoSetAlias,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/TRIGame/SetAlias',
    request,
    metadata || {},
    this.methodInfoSetAlias);
  }

  methodInfoSetSettings = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: SetSettingsRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  setSettings(
    request: SetSettingsRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  setSettings(
    request: SetSettingsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  setSettings(
    request: SetSettingsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/TRIGame/SetSettings',
        request,
        metadata || {},
        this.methodInfoSetSettings,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/TRIGame/SetSettings',
    request,
    metadata || {},
    this.methodInfoSetSettings);
  }

}

