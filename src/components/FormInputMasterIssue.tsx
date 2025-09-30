import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import { TextField, Box, Button, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface IssueForm {
  text: string;
  files: File[];
  constraints: { key: string; value: string }[];
}

const FormInputMasterIssue: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [constraints, setConstraints] = useState<
    { key: string; value: string }[]
  >([]);

  const handleTextChange = (value: string) => {
    setText(value);
  };

  const onDrop = (acceptedFiles: File[]) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const addConstraint = () => {
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
  ) => {
    const newKeyValuePairs = [...constraints];
    newKeyValuePairs[index] = { key, value };
    setConstraints(newKeyValuePairs);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    //accept: ['image/*', 'application/pdf'], // Accept only images and PDFs for this example
  });

  const handleSubmit = () => {
    const toUpload: IssueForm = {
      text,
      files,
      constraints,
    };

    console.log(toUpload);
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
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
          {...getRootProps({ className: 'dropzone' })}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon style={{ fontSize: 28, color: '#aaa' }} />
          <div style={{ marginTop: '1px' }}>
            Drag and drop files here, or click to select files
          </div>
          {files.length > 0 && (
            <div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {files.map((file, index) => (
                  <li
                    key={index}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <CloudUploadIcon />
                    <span style={{ marginLeft: '10px' }}>
                      {file.name} ({file.size} bytes)
                    </span>
                    <IconButton onClick={() => removeFile(index)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
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
      <Grid item xs={12} sm={12} md={12}>
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

export default FormInputMasterIssue;
