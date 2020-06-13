import * as jspb from "google-protobuf"

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';

export class Word extends jspb.Message {
  getWord(): string;
  setWord(value: string): Word;

  getOpen(): boolean;
  setOpen(value: boolean): Word;

  getSkinid(): string;
  setSkinid(value: string): Word;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Word.AsObject;
  static toObject(includeInstance: boolean, msg: Word): Word.AsObject;
  static serializeBinaryToWriter(message: Word, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Word;
  static deserializeBinaryFromReader(message: Word, reader: jspb.BinaryReader): Word;
}

export namespace Word {
  export type AsObject = {
    word: string,
    open: boolean,
    skinid: string,
  }
}

export class CurrentPlayer extends jspb.Message {
  getToken(): string;
  setToken(value: string): CurrentPlayer;

  getPlayerindex(): number;
  setPlayerindex(value: number): CurrentPlayer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CurrentPlayer.AsObject;
  static toObject(includeInstance: boolean, msg: CurrentPlayer): CurrentPlayer.AsObject;
  static serializeBinaryToWriter(message: CurrentPlayer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CurrentPlayer;
  static deserializeBinaryFromReader(message: CurrentPlayer, reader: jspb.BinaryReader): CurrentPlayer;
}

export namespace CurrentPlayer {
  export type AsObject = {
    token: string,
    playerindex: number,
  }
}

export class Player extends jspb.Message {
  getName(): string;
  setName(value: string): Player;

  getScore(): string;
  setScore(value: string): Player;

  getWordsList(): Array<Word>;
  setWordsList(value: Array<Word>): Player;
  clearWordsList(): Player;
  addWords(value?: Word, index?: number): Word;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Player.AsObject;
  static toObject(includeInstance: boolean, msg: Player): Player.AsObject;
  static serializeBinaryToWriter(message: Player, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Player;
  static deserializeBinaryFromReader(message: Player, reader: jspb.BinaryReader): Player;
}

export namespace Player {
  export type AsObject = {
    name: string,
    score: string,
    wordsList: Array<Word.AsObject>,
  }
}

export class CreateGameRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateGameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateGameRequest): CreateGameRequest.AsObject;
  static serializeBinaryToWriter(message: CreateGameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateGameRequest;
  static deserializeBinaryFromReader(message: CreateGameRequest, reader: jspb.BinaryReader): CreateGameRequest;
}

export namespace CreateGameRequest {
  export type AsObject = {
  }
}

export class CreateGameReply extends jspb.Message {
  getSessionid(): string;
  setSessionid(value: string): CreateGameReply;

  getCreatortoken(): string;
  setCreatortoken(value: string): CreateGameReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateGameReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateGameReply): CreateGameReply.AsObject;
  static serializeBinaryToWriter(message: CreateGameReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateGameReply;
  static deserializeBinaryFromReader(message: CreateGameReply, reader: jspb.BinaryReader): CreateGameReply;
}

export namespace CreateGameReply {
  export type AsObject = {
    sessionid: string,
    creatortoken: string,
  }
}

export class JoinGameRequest extends jspb.Message {
  getSessionid(): string;
  setSessionid(value: string): JoinGameRequest;

  getPlayername(): string;
  setPlayername(value: string): JoinGameRequest;

  getPlayertoken(): string;
  setPlayertoken(value: string): JoinGameRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinGameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: JoinGameRequest): JoinGameRequest.AsObject;
  static serializeBinaryToWriter(message: JoinGameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JoinGameRequest;
  static deserializeBinaryFromReader(message: JoinGameRequest, reader: jspb.BinaryReader): JoinGameRequest;
}

export namespace JoinGameRequest {
  export type AsObject = {
    sessionid: string,
    playername: string,
    playertoken: string,
  }
}

export class GameSessionStream extends jspb.Message {
  getMe(): CurrentPlayer | undefined;
  setMe(value?: CurrentPlayer): GameSessionStream;
  hasMe(): boolean;
  clearMe(): GameSessionStream;

  getPlayersList(): Array<Player>;
  setPlayersList(value: Array<Player>): GameSessionStream;
  clearPlayersList(): GameSessionStream;
  addPlayers(value?: Player, index?: number): Player;

  getWordsList(): Array<Word>;
  setWordsList(value: Array<Word>): GameSessionStream;
  clearWordsList(): GameSessionStream;
  addWords(value?: Word, index?: number): Word;

  getNumberofcolumns(): number;
  setNumberofcolumns(value: number): GameSessionStream;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameSessionStream.AsObject;
  static toObject(includeInstance: boolean, msg: GameSessionStream): GameSessionStream.AsObject;
  static serializeBinaryToWriter(message: GameSessionStream, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameSessionStream;
  static deserializeBinaryFromReader(message: GameSessionStream, reader: jspb.BinaryReader): GameSessionStream;
}

export namespace GameSessionStream {
  export type AsObject = {
    me?: CurrentPlayer.AsObject,
    playersList: Array<Player.AsObject>,
    wordsList: Array<Word.AsObject>,
    numberofcolumns: number,
  }
}

export class TurnGameRequest extends jspb.Message {
  getSessionid(): string;
  setSessionid(value: string): TurnGameRequest;

  getPlayertoken(): string;
  setPlayertoken(value: string): TurnGameRequest;

  getPosition(): number;
  setPosition(value: number): TurnGameRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TurnGameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TurnGameRequest): TurnGameRequest.AsObject;
  static serializeBinaryToWriter(message: TurnGameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TurnGameRequest;
  static deserializeBinaryFromReader(message: TurnGameRequest, reader: jspb.BinaryReader): TurnGameRequest;
}

export namespace TurnGameRequest {
  export type AsObject = {
    sessionid: string,
    playertoken: string,
    position: number,
  }
}

export class StartGameRequest extends jspb.Message {
  getSessionid(): string;
  setSessionid(value: string): StartGameRequest;

  getPlayertoken(): string;
  setPlayertoken(value: string): StartGameRequest;

  getNumberofrows(): number;
  setNumberofrows(value: number): StartGameRequest;

  getNumberofcolumns(): number;
  setNumberofcolumns(value: number): StartGameRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartGameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StartGameRequest): StartGameRequest.AsObject;
  static serializeBinaryToWriter(message: StartGameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartGameRequest;
  static deserializeBinaryFromReader(message: StartGameRequest, reader: jspb.BinaryReader): StartGameRequest;
}

export namespace StartGameRequest {
  export type AsObject = {
    sessionid: string,
    playertoken: string,
    numberofrows: number,
    numberofcolumns: number,
  }
}

