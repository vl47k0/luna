import React from 'react';
import { Grid, Typography } from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Description as DocumentIcon,
  Image as ImageIcon,
  MusicNote as AudioIcon,
  Videocam as VideoIcon,
} from '@mui/icons-material';

export interface FileListProps {
  files: File[];
}

const getIconByExtension = (extension: string): JSX.Element => {
  const iconMapping: Record<string, JSX.Element> = {
    doc: <DocumentIcon fontSize="large" />,
    docx: <DocumentIcon fontSize="large" />,
    jpg: <ImageIcon fontSize="large" />,
    jpeg: <ImageIcon fontSize="large" />,
    png: <ImageIcon fontSize="large" />,
    gif: <ImageIcon fontSize="large" />,
    mp3: <AudioIcon fontSize="large" />,
    mp4: <VideoIcon fontSize="large" />,
  };

  const defaultIcon = <FileIcon fontSize="large" />;
  return iconMapping[extension.toLowerCase()] || defaultIcon;
};

const FileList: React.FC<FileListProps> = ({ files }) => {
  return (
    <Grid container spacing={2}>
      {files.map((file, index) => (
        <Grid item key={index}>
          {getIconByExtension(
            file.name.substring(file.name.lastIndexOf('.') + 1)
          )}
          <Typography variant="body2" align="center">
            {file.name}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default FileList;
