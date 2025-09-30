import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Grid, Typography } from '@mui/material';
import FileUpload from './FileUpload';

import { Process, SolutionService } from '../services/SolutionsService';

import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';

export interface ProcessUpdateForm {
  text: string;
  filenames: string[];
}

export interface ProcessEditFormProps {
  onSubmit: (form: ProcessUpdateForm) => void;
  proc: Process | null;
}

export const ProcessEditForm: React.FC<ProcessEditFormProps> = ({
  onSubmit,
  proc,
}) => {
  const [files, setFiles] = useState<string[]>([]);
  const [data, setData] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [process, setProcess] = useState<Process | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const solutionBackendRef = useRef<SolutionService | null>(null);

  const handleFileUpload = (fileUrl: string): void => {
    setFiles((prevFiles) => [...prevFiles, fileUrl]);
  };

  useEffect((): void => {
    void authService.getUser().then((data) => {
      setUser(data);
    });
  }, []);

  useEffect((): void => {
    if (!user) return;
    if (!solutionBackendRef.current) {
      solutionBackendRef.current = new SolutionService(
        'https://mars.georgievski.net/',
        user.access_token
      );
    }
  }, [user]);

  const handleDataChange = (value: string): void => {
    setData(value);
  };

  const handleSubmit = (): void => {
    setError(null);
    setLoading(false);
    console.log(error, process, loading);

    const toUpload: ProcessUpdateForm = {
      text: data,
      filenames: files,
    };

    onSubmit(toUpload);
  };

  useEffect((): void => {
    setProcess(proc);
    if (proc) {
      setData(proc.data ?? '');
    }
  }, [proc]);

  useEffect((): void => {
    console.log('ProcessEditForm => Data: ', data);
  }, [data]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <Box
          sx={{
            border: '1px dashed #ccc',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          <FileUpload onFileUpload={handleFileUpload} />
          {files.length > 0 ? (
            <ul>
              {files.map((file: string, index: number) => (
                <li key={file}>
                  <Typography variant="body2">
                    {index}: {file}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2">No files uploaded yet.</Typography>
          )}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <ReactQuill
          value={data}
          onChange={handleDataChange}
          placeholder="Enter your text here"
          style={{ height: '200px', marginBottom: '20px' }}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              ['link', 'image'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['clean'],
            ],
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ marginTop: '20px' }}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};
