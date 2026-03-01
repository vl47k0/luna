type ConsoleMethod = "debug" | "info" | "log" | "warn" | "error";

type SerializableRecord = Record<string, unknown>;

const originalConsole: Record<ConsoleMethod, (...args: unknown[]) => void> = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

let initialized = false;

const parseBool = (value: unknown): boolean => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value === 1;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["1", "true", "yes", "on", "debug"].includes(normalized);
  }
  return false;
};

const isRecord = (value: unknown): value is SerializableRecord => {
  return typeof value === "object" && value !== null;
};

const isDebugEnabled = (): boolean => {
  const envDebug = parseBool(import.meta.env.VITE_DEBUG);
  if (envDebug) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  const globalDebug = parseBool((window as Window & { DEBUG?: unknown }).DEBUG);
  const storageDebug = parseBool(window.localStorage.getItem("DEBUG"));
  const queryDebug = parseBool(new URLSearchParams(window.location.search).get("debug"));

  return globalDebug || storageDebug || queryDebug;
};

const normalizeError = (value: unknown): unknown => {
  if (value instanceof Error) {
    const base: SerializableRecord = {
      name: value.name,
      message: value.message,
    };
    if (isDebugEnabled()) {
      base.stack = value.stack;
      if ("cause" in value) {
        base.cause = (value as Error & { cause?: unknown }).cause;
      }
    }
    return base;
  }

  if (isRecord(value)) {
    const maybeAxios = value as SerializableRecord;
    if ("isAxiosError" in maybeAxios) {
      const response = isRecord(maybeAxios.response)
        ? {
            status: maybeAxios.response.status,
            statusText: maybeAxios.response.statusText,
            data: maybeAxios.response.data,
          }
        : undefined;

      const request = isRecord(maybeAxios.config)
        ? {
            method: maybeAxios.config.method,
            url: maybeAxios.config.url,
            baseURL: maybeAxios.config.baseURL,
          }
        : undefined;

      return {
        message: maybeAxios.message,
        code: maybeAxios.code,
        request,
        response,
      };
    }
  }

  return value;
};

const prefixFor = (method: ConsoleMethod): string => {
  const level = method.toUpperCase();
  const timestamp = new Date().toISOString();
  return `[Luna][${level}][${timestamp}]`;
};

const emit = (method: ConsoleMethod, args: unknown[]): void => {
  const debug = isDebugEnabled();

  if (!debug && (method === "log" || method === "debug")) {
    return;
  }

  if (!debug && method === "info") {
    return;
  }

  const processed = method === "error" ? args.map(normalizeError) : args;
  originalConsole[method](prefixFor(method), ...processed);
};

const patchConsole = (): void => {
  if (initialized) {
    return;
  }

  initialized = true;

  console.debug = (...args: unknown[]): void => emit("debug", args);
  console.info = (...args: unknown[]): void => emit("info", args);
  console.log = (...args: unknown[]): void => emit("log", args);
  console.warn = (...args: unknown[]): void => emit("warn", args);
  console.error = (...args: unknown[]): void => emit("error", args);

  if (typeof window !== "undefined") {
    window.addEventListener("error", (event: ErrorEvent) => {
      emit("error", ["Unhandled error", event.message, event.filename, event.lineno, event.colno, event.error]);
    });

    window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
      emit("error", ["Unhandled promise rejection", event.reason]);
    });
  }
};

export const logger = {
  debug(message: string, context?: unknown): void {
    if (context === undefined) {
      console.debug(message);
      return;
    }
    console.debug(message, context);
  },
  info(message: string, context?: unknown): void {
    if (context === undefined) {
      console.info(message);
      return;
    }
    console.info(message, context);
  },
  warn(message: string, context?: unknown): void {
    if (context === undefined) {
      console.warn(message);
      return;
    }
    console.warn(message, context);
  },
  error(message: string, error?: unknown, context?: unknown): void {
    if (context !== undefined && error !== undefined) {
      console.error(message, context, error);
      return;
    }
    if (context !== undefined) {
      console.error(message, context);
      return;
    }
    if (error !== undefined) {
      console.error(message, error);
      return;
    }
    console.error(message);
  },
  isDebugEnabled,
};

export const initializeLogging = (): void => {
  patchConsole();
  logger.info("Logging initialized", { debugEnabled: isDebugEnabled() });
};
