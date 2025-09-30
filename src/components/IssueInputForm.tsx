import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { TextField, Box, Button, Grid, Typography } from '@mui/material';
import FileUpload from './FileUpload';

export interface IssueForm {
  title: string;
  text: string;
  filenames: string[];
  constraints: { key: string; value: string }[];
}

export interface IssueInputFormProps {
  onSubmit: (form: IssueForm) => void;
}

export const IssueInputForm: React.FC<IssueInputFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const [text, setText] = useState<string>('');
  const [constraints, setConstraints] = useState<
    { key: string; value: string }[]
  >([]);

  const handleFileUpload = (fileUrl: string): void => {
    setFiles((prevFiles) => [...prevFiles, fileUrl]);
  };

  const handleTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTitle(event.target.value);
  };

  const handleTextChange = (value: string): void => {
    setText(value);
  };

  const addConstraint = (): void => {
    if (constraints.length < 10) {
      setConstraints([...constraints, { key: '', value: '' }]);
    } else {
      alert('You can only add up to 10 key-value pairs.');
    }
  };

  const handleConstraintChange = (
    index: number,
    key: string,
    value: string
  ): void => {
    const newKeyValuePairs = [...constraints];
    newKeyValuePairs[index] = { key, value };
    setConstraints(newKeyValuePairs);
  };

  const handleSubmit = (): void => {
    const toUpload: IssueForm = {
      title,
      text,
      filenames: files,
      constraints,
    };

    onSubmit(toUpload);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          label="Title"
          value={title}
          onChange={handleTitleChange}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            border: '1px dashed #ccc',
            padding: '10px',
            marginBottom: '20px',
          }}
        >
          {constraints.map((pair, index) => (
            <div key={index} style={{ marginBottom: '10px', display: 'flex' }}>
              <TextField
                label="Constraint Description"
                value={pair.key}
                onChange={(e) =>
                  handleConstraintChange(index, e.target.value, pair.value)
                }
                variant="outlined"
                size="small"
                style={{ width: '50%', marginLeft: '5px' }}
              />
              <TextField
                label="Constraint Limit"
                value={pair.value}
                onChange={(e) =>
                  handleConstraintChange(index, pair.key, e.target.value)
                }
                variant="outlined"
                size="small"
                style={{ width: '50%', marginLeft: '5px' }}
              />
            </div>
          ))}
          <Button variant="contained" onClick={addConstraint} size="small">
            Add Constraint
          </Button>
        </Box>
      </Grid>
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
          value={text}
          onChange={handleTextChange}
          placeholder=""
          style={{ height: '200px', marginBottom: '10px' }}
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
          sx={{ marginTop: '40px', marginBottom: '10px' }}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};
