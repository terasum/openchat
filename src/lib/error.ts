// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
export class OpenAIError extends Error {}

export class ReqError extends Error {
  readonly type: string | number | undefined;

  constructor(type: string | number, message: string) {
    super(message);
    this.type = type;
  }
  
}

export class APIError extends OpenAIError {
  readonly status: number | undefined;
  readonly headers: Headers | undefined;
  readonly error: Object | undefined;

  readonly code: string | null | undefined;
  readonly param: string | null | undefined;
  readonly type: string | undefined;

  readonly request_id: string | null | undefined;

  constructor(
    status: number | undefined,
    error: Object | undefined,
    message: string | undefined,
    headers: Headers | undefined
  ) {
    super(`${APIError.makeMessage(status, error, message)}`);
    this.status = status;
    this.headers = headers;

    const data = error as Record<string, any>;
    this.error = data;
    this.code = data?.["code"];
    this.param = data?.["param"];
    this.type = data?.["type"];
  }

  private static makeMessage(
    status: number | undefined,
    error: any,
    message: string | undefined
  ) {
    const msg = error?.message
      ? typeof error.message === "string"
        ? error.message
        : JSON.stringify(error.message)
      : error
      ? JSON.stringify(error)
      : message;

    if (status && msg) {
      return `${status} ${msg}`;
    }
    if (status) {
      return `${status} status code (no body)`;
    }
    if (msg) {
      return msg;
    }
    return "(no status code or body)";
  }

  static generate(
    status: number | undefined,
    errorResponse: Object | undefined,
    message: string | undefined,
    headers: Headers | undefined
  ) {
    if (!status) {
      return new APIConnectionError({ cause: undefined });
    }

    const error = (errorResponse as Record<string, any>)?.["error"];

    if (status === 400) {
      return new BadRequestError(status, error, message, headers);
    }

    if (status === 401) {
      return new AuthenticationError(status, error, message, headers);
    }

    if (status === 403) {
      return new PermissionDeniedError(status, error, message, headers);
    }

    if (status === 404) {
      return new NotFoundError(status, error, message, headers);
    }

    if (status === 409) {
      return new ConflictError(status, error, message, headers);
    }

    if (status === 422) {
      return new UnprocessableEntityError(status, error, message, headers);
    }

    if (status === 429) {
      return new RateLimitError(status, error, message, headers);
    }

    if (status >= 500) {
      return new InternalServerError(status, error, message, headers);
    }

    return new APIError(status, error, message, headers);
  }
}

export class APIUserAbortError extends APIError {
  override readonly status: undefined = undefined;

  constructor({ message }: { message?: string } = {}) {
    super(undefined, undefined, message || "Request was aborted.", undefined);
  }
}

export class APIConnectionError extends APIError {
  override readonly status: undefined = undefined;

  constructor({
    message,
    cause,
  }: {
    message?: string;
    cause?: Error | undefined;
  }) {
    super(undefined, undefined, message || "Connection error.", undefined);
    // in some environments the 'cause' property is already declared
    // @ts-ignore
    if (cause) this.cause = cause;
  }
}

export class APIConnectionTimeoutError extends APIConnectionError {
  constructor({ message }: { message?: string } = {}) {
    super({ message: message ?? "Request timed out." });
  }
}

export class BadRequestError extends APIError {
  override readonly status: 400 = 400;
}

export class AuthenticationError extends APIError {
  override readonly status: 401 = 401;
}

export class PermissionDeniedError extends APIError {
  override readonly status: 403 = 403;
}

export class NotFoundError extends APIError {
  override readonly status: 404 = 404;
}

export class ConflictError extends APIError {
  override readonly status: 409 = 409;
}

export class UnprocessableEntityError extends APIError {
  override readonly status: 422 = 422;
}

export class RateLimitError extends APIError {
  override readonly status: 429 = 429;
}

export class InternalServerError extends APIError {}

export class LengthFinishReasonError extends OpenAIError {
  constructor() {
    super(`Could not parse response content as the length limit was reached`);
  }
}

export class ContentFilterFinishReasonError extends OpenAIError {
  constructor() {
    super(
      `Could not parse response content as the request was rejected by the content filter`
    );
  }
}
