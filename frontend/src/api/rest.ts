/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ProblemDetail {
  /** @format uri */
  type?: string;
  title?: string;
  /** @format int32 */
  status?: number;
  detail?: string;
  /** @format uri */
  instance?: string;
  properties?: Record<string, object>;
}

export interface ChangeStateDTO {
  state: "IDLE" | "IN_PROGRESS" | "FINISHED";
}

export interface ChangeConfigDTO {
  /** @format int32 */
  columnCount: number;
  /** @format int32 */
  rowsCount: number;
  /** @format int32 */
  teamsCount: number;
  language?: string;
}

export interface ChangeFieldCellDTO {
  open?: boolean;
}

export interface FieldCellDTO {
  word: string;
  type: "REGULAR" | "TEAM_OWNED" | "END_GAME";
  /** @format int32 */
  ownerTeamId?: number;
  open: boolean;
  /** @format int32 */
  openTeamId?: number;
}

export interface PlayerDTO {
  id: string;
  name: string;
}

export interface SessionDTO {
  id: string;
  players: PlayerDTO[];
  state: "IDLE" | "IN_PROGRESS" | "FINISHED";
  /** @uniqueItems true */
  captains: string[];
  playerIDtoTeamID: Record<string, number>;
  config?: ChangeConfigDTO;
  cells: FieldCellDTO[];
}

export interface ChangePlayerDTO {
  name: string;
  captain: boolean;
  /** @format int32 */
  teamID: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8080";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title OpenAPI definition
 * @version v0
 * @baseUrl http://localhost:8080
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  sessions = {
    /**
     * @description Starts a new game for a session with http session holder as a player.
     *
     * @tags game session
     * @name ChangeState
     * @summary Start a new game for the specified session.
     * @request PUT:/sessions/{id}/state
     */
    changeState: (id: string, data: ChangeStateDTO, params: RequestParams = {}) =>
      this.request<void, ProblemDetail | string>({
        path: `/sessions/${id}/state`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Starts a new game for a session with http session holder as a player.
     *
     * @tags game session
     * @name ChangeConfig
     * @summary Start a new game for the specified session.
     * @request PUT:/sessions/{id}/config
     */
    changeConfig: (id: string, data: ChangeConfigDTO, params: RequestParams = {}) =>
      this.request<void, ProblemDetail | string>({
        path: `/sessions/${id}/config`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Updates the state of the game for a session with http session holder as a player.
     *
     * @tags game session
     * @name ChangeCell
     * @summary Update the state of the cell.
     * @request PUT:/sessions/{id}/cells/{cellIndex}
     */
    changeCell: (id: string, cellIndex: number, data: ChangeFieldCellDTO, params: RequestParams = {}) =>
      this.request<void, ProblemDetail | string>({
        path: `/sessions/${id}/cells/${cellIndex}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags game session
     * @name Status
     * @request GET:/sessions
     */
    status: (params: RequestParams = {}) =>
      this.request<SessionDTO[], ProblemDetail>({
        path: `/sessions`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Starts a new game session with http session holder as a player.
     *
     * @tags game session
     * @name NewSession
     * @summary Start a new session.
     * @request POST:/sessions
     */
    newSession: (params: RequestParams = {}) =>
      this.request<SessionDTO, ProblemDetail | string>({
        path: `/sessions`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags game session
     * @name NewPlayer
     * @request POST:/sessions/{id}/players
     */
    newPlayer: (id: string, data: PlayerDTO, params: RequestParams = {}) =>
      this.request<void, ProblemDetail>({
        path: `/sessions/${id}/players`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags game session
     * @name ChangePlayer
     * @request PATCH:/sessions/{id}/players/{playerID}
     */
    changePlayer: (id: string, playerId: string, data: ChangePlayerDTO, params: RequestParams = {}) =>
      this.request<void, ProblemDetail>({
        path: `/sessions/${id}/players/${playerId}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags game session
     * @name GetSession
     * @request GET:/sessions/{id}
     */
    getSession: (id: string, params: RequestParams = {}) =>
      this.request<SessionDTO, ProblemDetail>({
        path: `/sessions/${id}`,
        method: "GET",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags user
     * @name GetMe
     * @request GET:/users/me
     */
    getMe: (params: RequestParams = {}) =>
      this.request<PlayerDTO, ProblemDetail>({
        path: `/users/me`,
        method: "GET",
        ...params,
      }),
  };
}
