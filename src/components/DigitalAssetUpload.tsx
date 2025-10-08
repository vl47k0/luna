import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { AxiosError } from "axios";
import { useDigitalAssetService } from "../hooks/useDigitalAssetService";

interface UploadResponse {
  blobId: string;
}

const DigitalAssetUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [container, setContainer] = useState<string>("default");
  const [path, setPath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const digitalAssetService = useDigitalAssetService();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file || !container || !path) {
      setFeedback({ message: "All fields are required.", severity: "error" });
      return;
    }

    if (!digitalAssetService) {
      setFeedback({
        message:
          "Asset service is not available. Please ensure you are logged in.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await digitalAssetService.putBlob<UploadResponse>(
        container,
        { path },
        file,
        { "Content-Type": file.type }
      );

      if (response.status >= 200 && response.status < 300) {
        setFeedback({
          message: `File uploaded successfully. Blob ID: ${response.data.blobId}`,
          severity: "success",
        });
        setFile(null);
        setPath("");
      } else {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("File upload error:", error);
      const axiosError = error as AxiosError<{ detail?: string }>;
      const errorMessage =
        axiosError.response?.data?.detail ??
        (axiosError.response?.data as string) ??
        axiosError.message ??
        "An unknown error occurred during file upload.";
      setFeedback({
        message: `Upload failed: ${errorMessage}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (): void => {
    setFeedback(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upload Digital Asset
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Container"
          value={container}
          onChange={(e) => setContainer(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Path (e.g., /documents/myfile.txt)"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          margin="normal"
          required
        />
        <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }}>
          Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {file && <Typography sx={{ mb: 2 }}>Selected: {file.name}</Typography>}
        <Button
          variant="contained"
          color="primary"
          onClick={() => void handleUpload()}
          disabled={
            loading || !file || !container || !path || !digitalAssetService
          }
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </Box>
      {feedback && (
        <Snackbar
          open={!!feedback}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={feedback.severity}
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default DigitalAssetUpload;
