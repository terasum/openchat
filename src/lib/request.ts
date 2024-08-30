import { ReqError } from "./error";

const VERSION = "1.0.0"; // x-release-please-version

export type HTTPMethod = "get" | "post";

export type RequestOptions = {
  method: HTTPMethod;
  url: string;
  body: any;
  timeout?: number;
  controller?: AbortController;
  headers?: Record<string, string>;
};

export type APIResponseProps = {
  response: Response;
  controller: AbortController;
};

export async function makeRequest(
  optionsInput: RequestOptions
): Promise<APIResponseProps> {
  const options = optionsInput;
  const { req, url, timeout } = buildRequest(options);

  if (!options.controller) {
    options.controller = new AbortController();
  }

  if (options.controller.signal?.aborted) {
    throw new ReqError("APIUserAbortError", "APIUserAbortError");
  }

  const response = await fetchWithTimeout(
    url,
    req,
    timeout,
    options.controller
  ).catch(castToError);

  if (response instanceof Error) {
    if (options.controller.signal?.aborted) {
      throw new ReqError("APIUserAbortError", "APIUserAbortError");
    }

    if (response.name === "AbortError") {
      throw new ReqError(
        "APIConnectionTimeoutError",
        "APIConnectionTimeoutError"
      );
    }
    throw new ReqError("APIConnectionError", response.message);
  }

  const responseHeaders = createResponseHeaders(response.headers);

  if (!response.ok) {
    const errText = await response.text().catch((e) => castToError(e).message);
    const errJSON = safeJSON(errText);
    const errMessage = errJSON ? undefined : errText;

    throw new ReqError(
      "APIResponseNotOkError",
      JSON.stringify({
        status: response.status,
        errJSON,
        errMessage,
        responseHeaders,
      })
    );
  }

  return { response, controller: options.controller };
}

function buildHeaders(): Record<string, string> {
  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": `OpenChat/Client ${VERSION}`,
  };
  return reqHeaders;
}

function buildRequest(options: RequestOptions): {
  req: RequestInit;
  url: string;
  timeout: number;
} {
  const { method } = options;
  const body = options.body ? JSON.stringify(options.body, null, 2) : null;
  const timeout = options.timeout ?? 600000;
  const reqHeaders = applyHeadersMut(buildHeaders(), options.headers);

  console.log(`Headers ${JSON.stringify(reqHeaders)}`);

  const req: RequestInit = {
    method,
    ...(body && { body: body as any }),
    headers: reqHeaders,
    // @ts-ignore node-fetch uses a custom AbortSignal type that is
    // not compatible with standard web types
    signal: options.signal ?? null,
  };

  return { req, url: options.url, timeout };
}

async function fetchWithTimeout(
  url: RequestInfo,
  init: RequestInit | undefined,
  ms: number,
  controller: AbortController
): Promise<Response> {
  const { signal, ...options } = init || {};

  if (signal) signal.addEventListener("abort", () => controller.abort());
  const timeout = setTimeout(() => controller.abort(), ms);

  return fetch
    .call(undefined, url, { signal: controller.signal as any, ...options })
    .finally(() => {
      clearTimeout(timeout);
    });
}
type Fetch = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

const createResponseHeaders = (
  headers: Awaited<ReturnType<Fetch>>["headers"]
): Record<string, string> => {
  return new Proxy(
    Object.fromEntries(
      // @ts-ignore
      headers.entries()
    ),
    {
      get(target, name) {
        const key = name.toString();
        return target[key.toLowerCase()] || target[key];
      },
    }
  );
};

const safeJSON = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return undefined;
  }
};

const castToError = (err: any): Error => {
  if (err instanceof Error) return err;
  return new Error(err);
};

// https://eslint.org/docs/latest/rules/no-prototype-builtins
function hasOwn(obj: Object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Copies headers from "newHeaders" onto "targetHeaders",
 * using lower-case for all properties,
 * ignoring any keys with undefined values,
 * and deleting any keys with null values.
 */
function applyHeadersMut(
  targetHeaders: Record<string, string>,
  newHeaders?: Record<string, string>
): Record<string, string> {
  if (!newHeaders) {
    return targetHeaders;
  }
  for (const k in newHeaders) {
    if (!hasOwn(newHeaders, k)) continue;
    const lowerKey = k.toLowerCase();
    if (!lowerKey) continue;

    const val = newHeaders[k];

    if (val === null) {
      delete targetHeaders[lowerKey];
    } else if (val !== undefined) {
      targetHeaders[lowerKey] = val;
    }
  }
  return targetHeaders;
}
