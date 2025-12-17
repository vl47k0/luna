import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import FileUpload from "./FileUpload";

export interface ProcessForm {
  text: string;
  filenames: string[];
}

export interface ProcessInputFormProps {
  onSubmit: (form: ProcessForm, issue: string) => void;
  issue: string | null;
}

export const ProcessInputForm: React.FC<ProcessInputFormProps> = ({
  onSubmit,
  issue,
}) => {
  const [files, setFiles] = useState<string[]>([]);
  const [data, setData] = useState("");

  const handleDataChange = (value: string): void => {
    setData(value);
  };

  const handleFileUpload = (fileUrl: string): void => {
    setFiles((prevFiles) => [...prevFiles, fileUrl]);
  };

  const handleSubmit = (): void => {
    const toUpload: ProcessForm = {
      text: data,
      filenames: files,
    };

    if (issue) {
      onSubmit(toUpload, issue);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <Box
          sx={{
            border: "1px dashed #ccc",
            padding: "10px",
            textAlign: "center",
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
          placeholder=""
          style={{ height: "200px", marginBottom: "10px" }}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, false] }],
              ["bold", "italic", "underline", "strike"],
              ["link", "image"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["clean"],
            ],
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ marginTop: "40px", marginBottom: "10px" }}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};
