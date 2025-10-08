import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";

export interface ApiConfig {
  protocol?: "http" | "https";
  domain?: string;
  port?: string | number;
  basePath?: "v1" | "assets" | "assets/v1" | "";
  token: string;
}

export class DigitalAssetService {
  private readonly apiClient: AxiosInstance;

  constructor(config: ApiConfig) {
    const {
      protocol = "https",
      domain = "dev.api-sod.com",
      port = 443,
      basePath = "assets/v1",
      token,
    } = config;

    const portString =
      (port === 443 && protocol === "https") ||
      (port === 80 && protocol === "http")
        ? ""
        : `:${port}`;
    const baseURL = `${protocol}://${domain}${portString}/${basePath}`;

    this.apiClient = axios.create({
      baseURL,
    });

    this.apiClient.interceptors.request.use(
      (axiosConfig: InternalAxiosRequestConfig) => {
        if (token && axiosConfig.headers) {
          axiosConfig.headers["X-A2b-Token"] = token;
        }
        return axiosConfig;
      },
      (error) => Promise.reject(error)
    );
  }

  putBlob<T>(
    container: string,
    params: {
      path: string;
      blobId?: string;
      revisionNo?: string;
    },
    data: Blob,
    headers?: {
      "Content-Type"?: string;
      "Content-Encoding"?: string;
      "x-a2b-blob-content-disposition"?: string;
      "x-a2b-blob-logical-name"?: string;
      "x-a2b-correlation-id"?: string;
    }
  ): Promise<AxiosResponse<T>> {
    const requestHeaders: RawAxiosRequestHeaders = { ...headers };

    // Ensure the content type for the blob is correctly set,
    // defaulting to application/octet-stream if not provided.
    requestHeaders["Content-Type"] =
      headers?.["Content-Type"] ?? "application/octet-stream";

    return this.apiClient.put<T>(`/blobs/${container}`, data, {
      params,
      headers: requestHeaders,
    });
  }
}
