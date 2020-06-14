import * as jspb from "google-protobuf"

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';

export class Player extends jspb.Message {
  getId(): string;
  setId(value: string): Player;

  getAlias(): string;
  setAlias(value: string): Player;

  getTeamid(): string;
  setTeamid(value: string): Player;

  getScore(): string;
  setScore(value: string): Player;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Player.AsObject;
  static toObject(includeInstance: boolean, msg: Player): Player.AsObject;
  static serializeBinaryToWriter(message: Player, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Player;
  static deserializeBinaryFromReader(message: Player, reader: jspb.BinaryReader): Player;
}

export namespace Player {
  export type AsObject = {
    id: string,
    alias: string,
    teamid: string,
    score: string,
  }
}

export class Team extends jspb.Message {
  getId(): string;
  setId(value: string): Team;

  getRemainingcount(): number;
  setRemainingcount(value: number): Team;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Team.AsObject;
  static toObject(includeInstance: boolean, msg: Team): Team.AsObject;
  static serializeBinaryToWriter(message: Team, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Team;
  static deserializeBinaryFromReader(message: Team, reader: jspb.BinaryReader): Team;
}

export namespace Team {
  export type AsObject = {
    id: string,
    remainingcount: number,
  }
}

export class Cell extends jspb.Message {
  getWord(): string;
  setWord(value: string): Cell;

  getOpen(): boolean;
  setOpen(value: boolean): Cell;

  getType(): Cell.Type;
  setType(value: Cell.Type): Cell;

  getOwnerteamid(): string;
  setOwnerteamid(value: string): Cell;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Cell.AsObject;
  static toObject(includeInstance: boolean, msg: Cell): Cell.AsObject;
  static serializeBinaryToWriter(message: Cell, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Cell;
  static deserializeBinaryFromReader(message: Cell, reader: jspb.BinaryReader): Cell;
}

export namespace Cell {
  export type AsObject = {
    word: string,
    open: boolean,
    type: Cell.Type,
    ownerteamid: string,
  }

  export enum Type { 
    REGULAR = 0,
    TEAM_OWNED = 1,
    END_GAME = 2,
  }
}

export class CreateGameRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): CreateGameRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateGameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateGameRequest): CreateGameRequest.AsObject;
  static serializeBinaryToWriter(message: CreateGameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateGameRequest;
  static deserializeBinaryFromReader(message: CreateGameRequest, reader: jspb.BinaryReader): CreateGameRequest;
}

export namespace CreateGameRequest {
  export type AsObject = {
    token: string,
  }
}

export class CreateGameReply extends jspb.Message {
  getSessionid(): string;
  setSessionid(value: string): CreateGameReply;

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
  }
}

export class GameSessionStream extends jspb.Message {
  getPlayerid(): string;
  setPlayerid(value: string): GameSessionStream;

  getPlayersList(): Array<Player>;
  setPlayersList(value: Array<Player>): GameSessionStream;
  clearPlayersList(): GameSessionStream;
  addPlayers(value?: Player, index?: number): Player;

  getTeamsList(): Array<Team>;
  setTeamsList(value: Array<Team>): GameSessionStream;
  clearTeamsList(): GameSessionStream;
  addTeams(value?: Team, index?: number): Team;

  getCellsList(): Array<Cell>;
  setCellsList(value: Array<Cell>): GameSessionStream;
  clearCellsList(): GameSessionStream;
  addCells(value?: Cell, index?: number): Cell;

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
    playerid: string,
    playersList: Array<Player.AsObject>,
    teamsList: Array<Team.AsObject>,
    cellsList: Array<Cell.AsObject>,
    numberofcolumns: number,
  }
}

export class ObserveGameRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): ObserveGameRequest;

  getSessionid(): string;
  setSessionid(value: string): ObserveGameRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObserveGameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ObserveGameRequest): ObserveGameRequest.AsObject;
  static serializeBinaryToWriter(message: ObserveGameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObserveGameRequest;
  static deserializeBinaryFromReader(message: ObserveGameRequest, reader: jspb.BinaryReader): ObserveGameRequest;
}

export namespace ObserveGameRequest {
  export type AsObject = {
    token: string,
    sessionid: string,
  }
}

export class SetAliasRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): SetAliasRequest;

  getSessionid(): string;
  setSessionid(value: string): SetAliasRequest;

  getAnyid(): string;
  setAnyid(value: string): SetAliasRequest;

  getAlias(): string;
  setAlias(value: string): SetAliasRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetAliasRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetAliasRequest): SetAliasRequest.AsObject;
  static serializeBinaryToWriter(message: SetAliasRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetAliasRequest;
  static deserializeBinaryFromReader(message: SetAliasRequest, reader: jspb.BinaryReader): SetAliasRequest;
}

export namespace SetAliasRequest {
  export type AsObject = {
    token: string,
    sessionid: string,
    anyid: string,
    alias: string,
  }
}

export class SetSettingsRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): SetSettingsRequest;

  getSessionid(): string;
  setSessionid(value: string): SetSettingsRequest;

  getTeamid(): string;
  setTeamid(value: string): SetSettingsRequest;

  getAlias(): string;
  setAlias(value: string): SetSettingsRequest;

  getCaptain(): boolean;
  setCaptain(value: boolean): SetSettingsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSettingsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetSettingsRequest): SetSettingsRequest.AsObject;
  static serializeBinaryToWriter(message: SetSettingsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSettingsRequest;
  static deserializeBinaryFromReader(message: SetSettingsRequest, reader: jspb.BinaryReader): SetSettingsRequest;
}

export namespace SetSettingsRequest {
  export type AsObject = {
    token: string,
    sessionid: string,
    teamid: string,
    alias: string,
    captain: boolean,
  }
}

export class TurnGameRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): TurnGameRequest;

  getSessionid(): string;
  setSessionid(value: string): TurnGameRequest;

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
    token: string,
    sessionid: string,
    position: number,
  }
}

export class StartGameRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): StartGameRequest;

  getSessionid(): string;
  setSessionid(value: string): StartGameRequest;

  getNumberofteams(): number;
  setNumberofteams(value: number): StartGameRequest;

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
    token: string,
    sessionid: string,
    numberofteams: number,
    numberofrows: number,
    numberofcolumns: number,
  }
}

