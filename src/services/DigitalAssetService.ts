import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface ApiConfig {
  protocol?: "http" | "https";
  domain?: string;
  port?: string | number;
  basePath?: "v1" | "assets" | "assets/v1" | "";
  token?: string;
}

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errorCode?: string;
  invalidParams?: {
    name?: string;
    reason?: string;
  }[];
}

export type PutContainerRequest = any;
export type PutFolderRequest = any;
export type PutBlobMetadataRequest = any;
export type GetBlobMetadataResponse = any;
export type GetFolderMetadataResponse = any;

export class DigitalAssetService {
  private readonly apiClient: AxiosInstance;

  constructor(config: ApiConfig) {
    const {
      protocol = "http",
      domain = "localhost",
      port = "8081",
      basePath = "v1",
      token,
    } = config;

    const baseURL = `${protocol}://${domain}:${port}/${basePath}`;

    this.apiClient = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.apiClient.interceptors.request.use(
      (axiosConfig) => {
        if (token && axiosConfig.headers) {
          axiosConfig.headers["X-A2B-Token"] = token;
        }
        return axiosConfig;
      },
      (error) => Promise.reject(error)
    );
  }

  createContainer(
    container: string,
    params: {
      unitId: string;
      userId?: string;
      "x-a2b-correlation-id"?: string;
    },
    data?: PutContainerRequest
  ): Promise<AxiosResponse> {
    return this.apiClient.put(`/containers/${container}`, data, { params });
  }

  putBlob(
    container: string,
    params: {
      path: string;
      blobId?: string;
      revisionNo?: string;
    },
    data: FormData | Blob,
    headers?: {
      "Content-Type"?: string;
      "Content-Encoding"?: string;
      "x-a2b-blob-content-disposition"?: string;
      "x-a2b-blob-logical-name"?: string;
      "x-a2b-correlation-id"?: string;
    }
  ): Promise<AxiosResponse> {
    const requestHeaders = { ...headers };
    if (!(data instanceof FormData)) {
      requestHeaders["Content-Type"] =
        headers?.["Content-Type"] || "application/octet-stream";
    }
    return this.apiClient.put(`/blobs/${container}`, data, {
      params,
      headers: requestHeaders,
    });
  }

  getBlob(
    container: string,
    params: {
      path?: string;
      blobId?: string;
      "x-a2b-correlation-id"?: string;
    }
  ): Promise<AxiosResponse<Blob>> {
    return this.apiClient.get(`/blobs/${container}`, {
      params,
      responseType: "blob",
    });
  }

  deleteBlob(
    container: string,
    params: {
      path: string;
      blobId?: string;
      "x-a2b-correlation-id"?: string;
    }
  ): Promise<AxiosResponse> {
    return this.apiClient.delete(`/blobs/${container}`, { params });
  }

  moveBlob(params: {
    fromPath?: string;
    fromBlobId?: string;
    toPath: string;
    force?: boolean;
    revisionNo?: string;
    "x-a2b-correlation-id"?: string;
  }): Promise<AxiosResponse> {
    return this.apiClient.post("/blobs/move", null, { params });
  }

  createFolder(
    container: string,
    params: {
      path: string;
      unitId?: string;
      userId?: string;
      "x-a2b-correlation-id"?: string;
    },
    data?: PutFolderRequest
  ): Promise<AxiosResponse> {
    return this.apiClient.put(`/folders/${container}`, data, { params });
  }

  deleteFolder(
    container: string,
    params: {
      path: string;
      recursive?: boolean;
      "x-a2b-correlation-id"?: string;
    }
  ): Promise<AxiosResponse> {
    return this.apiClient.delete(`/folders/${container}`, { params });
  }

  getBlobMetadata(
    container: string,
    params: {
      path?: string;
      blobId?: string;
      "x-a2b-correlation-id"?: string;
    }
  ): Promise<AxiosResponse<GetBlobMetadataResponse>> {
    return this.apiClient.get(`/meta/blobs/${container}`, { params });
  }

  putBlobMetadata(
    container: string,
    params: {
      path?: string;
      blobId?: string;
      revisionNo?: string;
      "x-a2b-correlation-id"?: string;
    },
    data: PutBlobMetadataRequest
  ): Promise<AxiosResponse> {
    return this.apiClient.put(`/meta/blobs/${container}`, data, { params });
  }

  getFolderMetadata(
    container: string,
    params: {
      path: string;
      "x-a2b-correlation-id"?: string;
    }
  ): Promise<AxiosResponse<GetFolderMetadataResponse>> {
    return this.apiClient.get(`/meta/folders/${container}`, { params });
  }
}
