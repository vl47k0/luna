import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { LinearProgress, Typography, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { styled } from '@mui/material/styles';

interface FileUploadResponse {
  status: string;
  location: string;
}

interface FileUploadProps {
  onFileUpload: (fileUrl: string) => void;
}

const Input = styled('input')({
  display: 'none',
});

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  //const [uploadStatus, setUploadStatus] = useState<string>('');

  const onDrop = useCallback(
    (acceptedFiles: File[]): void => {
      const handleFileUpload = async (file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axios.post<FileUploadResponse>(
            `${import.meta.env.VITE_BACKEND_API_URL}resource/api/v1/asset`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  setUploadProgress(percentCompleted);
                }
              },
            }
          );

          if (response.status === 200 && response.data.status === 'success') {
            //setUploadStatus('File uploaded successfully');
            onFileUpload(response.data.location);
          } //else {
          //setUploadStatus('File upload failed');
          //}
        } catch (error) {
          //setUploadStatus('File upload failed');
          console.error('There was an error uploading the file!', error);
        }
      };

      if (acceptedFiles && acceptedFiles.length > 0) {
        void handleFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box
      sx={{
        width: '50%',
        margin: 'auto',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed grey',
          padding: '2rem',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        <Input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the files here ...</Typography>
        ) : (
          <Typography>
            Drag some files here, or click to select files
          </Typography>
        )}
      </Box>
      {uploadProgress > 0 && (
        <Box sx={{ width: '100%', margin: '1rem 0' }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="textSecondary">
            {uploadProgress}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
