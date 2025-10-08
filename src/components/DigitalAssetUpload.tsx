import React, { useState } from "react";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Container,
  Alert,
  styled,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// DigitalAssetService Client and Interfaces
class BaseApiClient {
  protected client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  protected async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config
    );
    return response.data;
  }

  protected async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export interface Owner {
  unitId?: string;
  userId?: string;
}

export interface Tag {
  key: string;
  value: string;
}

export interface AssetAcl {
  unitId: string;
  userId: string;
  scopeId: string;
  scopeType: "user" | "unitTreeRole" | "";
  accessType: "RO" | "RW";
  isRevoked: boolean;
  startDateTime?: string;
  endDateTime?: string;
}

export interface PutContainer {
  owner?: Owner;
  acls?: AssetAcl[];
}

export interface PutFolder {
  owner?: Owner;
  acls?: AssetAcl[];
}

export interface GetBlobMetadata {
  id: string;
  name: string;
  url: string;
  revisionNo: number;
  ownerUnitId: string;
  ownerUserId: string;
  tags: Tag[];
  memo: string;
  createdById: string;
  createdByName: string;
  createDateTime: string;
  lastUpdatedById: string;
  lastUpdatedByName: string;
  lastUpdateDateTime: string;
  contentLength: number;
  contentType: string;
  contentMd5: string;
  contentEncoding: string;
  contentDisposition: string;
  nativeObjectId: string;
  nativeMetadataContentType?: string;
  nativeMetadata?: unknown;
}

export interface SetBlobMetadata {
  name?: string;
  ownerUnitId?: string;
  ownerUserId?: string;
  tags?: Tag[];
  memo?: string;
  contentDisposition?: string;
  nativeMetadataContentType?: string;
  nativeMetadata?: unknown;
}

export interface GetFolderMetadata {
  id: string;
  name: string;
  url: string;
  revisionNo: number;
  ownerUnitId: string;
  ownerUserId: string;
  tags: Tag[];
  memo: string;
  createdById: string;
  createdByName: string;
  createDateTime: string;
  lastUpdatedById: string;
  lastUpdatedByName: string;
  lastUpdateDateTime: string;
}

export interface PostCreateZipArchivedBlobsRequest {
  blobs: { id: string }[];
  zipFileName?: string;
  signature?: {
    expireDateTime: string;
    userId: string;
    unitId: string;
  };
}

type StringOrNumber = string | number | boolean | undefined;

export class DigitalAssetService extends BaseApiClient {
  constructor(
    protocol: "http" | "https" = "https",
    domain: string = "dev.api-sod.com",
    port: number = 443,
    basePath: string = "assets/v1"
  ) {
    super(`${protocol}://${domain}:${port}/${basePath}`);
  }

  public async createContainer(
    container: string,
    unitId: string,
    userId?: string,
    correlationId?: string,
    body?: PutContainer
  ): Promise<void> {
    const config: AxiosRequestConfig = {
      headers: {},
      params: { unitId, userId },
    };
    if (correlationId && config.headers) {
      config.headers["x-a2b-correlation-id"] = correlationId;
    }
    await this.put<void>(`/containers/${container}`, body, config);
  }

  public async putBlob(
    container: string,
    path: string,
    blobData: Blob | File | FormData,
    options?: {
      contentType?: string;
      contentEncoding?: string;
      blobContentDisposition?: string;
      blobLogicalName?: string;
      correlationId?: string;
      origin?: string;
      blobId?: string;
      revisionNo?: string;
      accessType?: "RO" | "RW";
      expireDateTime?: string;
      userId?: string;
      unitId?: string;
      sigVersion?: "1";
      resourcePath?: string;
    }
  ): Promise<AxiosResponse<void>> {
    const headers: Record<string, string> = {};
    if (options?.contentType) headers["Content-Type"] = options.contentType;
    if (options?.contentEncoding)
      headers["Content-Encoding"] = options.contentEncoding;
    if (options?.blobContentDisposition)
      headers["x-a2b-blob-content-disposition"] =
        options.blobContentDisposition;
    if (options?.blobLogicalName)
      headers["x-a2b-blob-logical-name"] = options.blobLogicalName;
    if (options?.correlationId)
      headers["x-a2b-correlation-id"] = options.correlationId;
    if (options?.origin) headers.Origin = options.origin;

    const params: Record<string, StringOrNumber> = { path };
    if (options?.blobId) params.blobId = options.blobId;
    if (options?.revisionNo) params.revisionNo = options.revisionNo;
    if (options?.accessType) params.accessType = options.accessType;
    if (options?.expireDateTime) params.expireDateTime = options.expireDateTime;
    if (options?.userId) params.userId = options.userId;
    if (options?.unitId) params.unitId = options.unitId;
    if (options?.sigVersion) params.sigVersion = options.sigVersion;
    if (options?.resourcePath) params.resourcePath = options.resourcePath;

    return this.put(`/blobs/${container}`, blobData, { headers, params });
  }

  public async getBlob(
    container: string,
    path?: string,
    blobId?: string,
    options?: {
      accessType?: "RO" | "RW";
      expireDateTime?: string;
      userId?: string;
      unitId?: string;
      sigVersion?: "1";
      resourcePath?: string;
      sig?: string;
      origin?: string;
      correlationId?: string;
    }
  ): Promise<Blob> {
    const params: Record<string, StringOrNumber> = {};
    if (path) params.path = path;
    if (blobId) params.blobId = blobId;
    if (options) {
      Object.assign(params, { ...options });
    }

    const headers: Record<string, string> = {};
    if (options?.origin) headers.Origin = options.origin;
    if (options?.correlationId)
      headers["x-a2b-correlation-id"] = options.correlationId;

    return this.get<Blob>(`/blobs/${container}`, {
      params,
      headers,
      responseType: "blob",
    });
  }

  public async deleteBlob(
    container: string,
    path: string,
    blobId?: string,
    options?: {
      origin?: string;
      correlationId?: string;
    }
  ): Promise<void> {
    const params: Record<string, StringOrNumber> = { path };
    if (blobId) params.blobId = blobId;

    const headers: Record<string, string> = {};
    if (options?.origin) headers.Origin = options.origin;
    if (options?.correlationId)
      headers["x-a2b-correlation-id"] = options.correlationId;

    await this.delete<void>(`/blobs/${container}`, { params, headers });
  }

  public async moveBlob(
    toPath: string,
    options?: {
      fromPath?: string;
      fromBlobId?: string;
      force?: boolean;
      revisionNo?: string;
      origin?: string;
      correlationId?: string;
    }
  ): Promise<AxiosResponse<void>> {
    const params: Record<string, StringOrNumber> = { toPath };
    if (options) {
      Object.assign(params, { ...options });
    }

    const headers: Record<string, string> = {};
    if (options?.origin) headers.Origin = options.origin;
    if (options?.correlationId)
      headers["x-a2b-correlation-id"] = options.correlationId;

    return this.post(`/blobs/move`, null, { params, headers });
  }

  public async createFolder(
    container: string,
    path: string,
    options?: {
      unitId?: string;
      userId?: string;
      origin?: string;
      correlationId?: string;
    },
    body?: PutFolder
  ): Promise<void> {
    const params: Record<string, StringOrNumber> = { path };
    const headers: Record<string, string> = {};
    if (options) {
      if (options.unitId) params.unitId = options.unitId;
      if (options.userId) params.userId = options.userId;
      if (options.origin) headers.Origin = options.origin;
      if (options.correlationId)
        headers["x-a2b-correlation-id"] = options.correlationId;
    }

    await this.put<void>(`/folders/${container}`, body, { params, headers });
  }

  public async deleteFolder(
    container: string,
    path: string,
    recursive: boolean = false,
    correlationId?: string
  ): Promise<void> {
    const params = { path, recursive };
    const headers: Record<string, string> = {};
    if (correlationId) headers["x-a2b-correlation-id"] = correlationId;

    await this.delete<void>(`/folders/${container}`, { params, headers });
  }

  public async getBlobMetadata(
    container: string,
    path?: string,
    blobId?: string,
    options?: {
      origin?: string;
      correlationId?: string;
    }
  ): Promise<GetBlobMetadata> {
    const params: Record<string, StringOrNumber> = {};
    if (path) params.path = path;
    if (blobId) params.blobId = blobId;

    const headers: Record<string, string> = {};
    if (options) {
      if (options.origin) headers.Origin = options.origin;
      if (options.correlationId)
        headers["x-a2b-correlation-id"] = options.correlationId;
    }

    return this.get<GetBlobMetadata>(`/meta/blobs/${container}`, {
      params,
      headers,
    });
  }

  public async putBlobMetadata(
    container: string,
    metadata: SetBlobMetadata,
    options?: {
      path?: string;
      blobId?: string;
      revisionNo?: string;
      correlationId?: string;
    }
  ): Promise<void> {
    const params: Record<string, StringOrNumber> = {};
    if (options) {
      if (options.path) params.path = options.path;
      if (options.blobId) params.blobId = options.blobId;
      if (options.revisionNo) params.revisionNo = options.revisionNo;
    }

    const headers: Record<string, string> = {};
    if (options?.correlationId)
      headers["x-a2b-correlation-id"] = options.correlationId;

    await this.put<void>(`/meta/blobs/${container}`, metadata, {
      params,
      headers,
    });
  }

  public async getFolderMetadata(
    container: string,
    path: string,
    options?: {
      origin?: string;
      correlationId?: string;
    }
  ): Promise<GetFolderMetadata> {
    const params = { path };

    const headers: Record<string, string> = {};
    if (options) {
      if (options.origin) headers.Origin = options.origin;
      if (options.correlationId)
        headers["x-a2b-correlation-id"] = options.correlationId;
    }

    return this.get<GetFolderMetadata>(`/meta/folders/${container}`, {
      params,
      headers,
    });
  }

  public async getPresignedUrl(
    accessType: "RO" | "RW",
    expireDateTime: string,
    userId: string,
    unitId: string,
    sigVersion: "1",
    resourcePath: string,
    correlationId?: string
  ): Promise<string> {
    const params = {
      accessType,
      expireDateTime,
      userId,
      unitId,
      sigVersion,
      resourcePath,
    };

    const headers: Record<string, string> = {};
    if (correlationId) headers["x-a2b-correlation-id"] = correlationId;

    const response = await this.get<string>("/presigned-url", {
      params,
      headers,
      transformResponse: (res: string) => res,
    });
    return response;
  }

  public async createTmpFolder(
    container: string,
    path: string,
    options?: {
      unitId?: string;
      userId?: string;
      origin?: string;
      correlationId?: string;
    },
    body?: unknown
  ): Promise<void> {
    const params: Record<string, StringOrNumber> = { path };
    const headers: Record<string, string> = {};
    if (options) {
      if (options.unitId) params.unitId = options.unitId;
      if (options.userId) params.userId = options.userId;
      if (options.origin) headers.Origin = options.origin;
      if (options.correlationId)
        headers["x-a2b-correlation-id"] = options.correlationId;
    }

    await this.put<void>(`/tmp-folders/${container}`, body, {
      params,
      headers,
    });
  }

  public async deleteTmpFolderBlobs(
    container: string,
    path: string,
    correlationId?: string
  ): Promise<void> {
    const params = { path };
    const headers: Record<string, string> = {};
    if (correlationId) headers["x-a2b-correlation-id"] = correlationId;

    await this.post<void>(`/tmp-folders/sweep-blobs/${container}`, null, {
      params,
      headers,
    });
  }

  public async createZipArchivedBlobs(
    container: string,
    body: PostCreateZipArchivedBlobsRequest,
    correlationId?: string
  ): Promise<string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (correlationId) headers["x-a2b-correlation-id"] = correlationId;

    const response = await this.post<string>(
      `/containers/${container}/create-zip-blobs`,
      body,
      { headers }
    );
    return response;
  }

  public async downloadZipArchivedBlobs(
    downloadId: string,
    options?: {
      sig?: string;
      expireDateTime?: string;
      userId?: string;
      unitId?: string;
      retry?: number;
      correlationId?: string;
    }
  ): Promise<Blob> {
    const params: Record<string, StringOrNumber> = { downloadId };
    if (options) {
      Object.assign(params, { ...options });
    }

    const headers: Record<string, string> = {};
    if (options?.correlationId)
      headers["x-a2b-correlation-id"] = options.correlationId;

    return this.get<Blob>("/download-zip-blobs", {
      params,
      headers,
      responseType: "blob",
    });
  }
}

// Styled component for the visually hidden input
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// DigitalAssetUpload Component
type UploadStatus = "" | "uploading" | "success" | "error";

const DigitalAssetUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [container, setContainer] = useState<string>("default");
  const [path, setPath] = useState<string>("tmp");
  const [status, setStatus] = useState<UploadStatus>("");
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setPath(`${path}/${selectedFile.name}`);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setError("Please select a file first.");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setError("");

    try {
      const digitalAssetService = new DigitalAssetService();
      await digitalAssetService.putBlob(container, path, file, {
        contentType: file.type || "application/octet-stream",
      });

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during upload.");
      }
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ p: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            align="center"
            fontWeight="bold"
          >
            Digital Asset Upload
          </Typography>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Container"
              variant="outlined"
              value={container}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setContainer(e.target.value)
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Path"
              variant="outlined"
              value={path}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPath(e.target.value)
              }
              margin="normal"
            />
            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Select file
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
              {fileName && (
                <Typography sx={{ ml: 2, color: "text.secondary" }}>
                  {fileName}
                </Typography>
              )}
            </Box>

            <Button
              onClick={(): void => {
                void handleUpload();
              }}
              disabled={status === "uploading"}
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2, py: 1.5 }}
            >
              {status === "uploading" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Upload File"
              )}
            </Button>

            {status === "success" && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Upload successful!
              </Alert>
            )}
            {status === "error" && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Error: {error}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DigitalAssetUpload;
