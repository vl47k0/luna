import React from 'react';
import { TextField, Button, Box } from '@mui/material';

interface Permission {
  get: boolean;
  post: boolean;
  put: boolean;
  patch: boolean;
  delete: boolean;
}

interface ACL {
  type: string;
  name: string;
  permissions: Permission;
}

type PermissionsMap = Record<string, Permission>;

interface Resource {
  resource: string;
  owner: string;
  organisation: string;
  unit: string;
  role: string;
  duty: string;
  group: string;
  permissions: PermissionsMap;
  acl: ACL[];
  default_acl: ACL[];
}

// Only the scalar fields we edit via TextFields
type EditableField =
  | 'resource'
  | 'owner'
  | 'organisation'
  | 'unit'
  | 'role'
  | 'duty'
  | 'group';

const initialResource: Resource = {
  resource: 'http://localhost/files/xd232xds',
  owner: 'alice',
  organisation: 'developers',
  unit: 'developers',
  role: 'developers',
  duty: 'developers',
  group: 'developers',
  permissions: {
    owner: { get: true, post: true, put: true, patch: true, delete: false },
    // other principals...
  },
  acl: [],
  default_acl: [],
};

const ResourceAccessListForm: React.FC = () => {
  const [resource, setResource] = React.useState<Resource>(initialResource);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ): void => {
    const { name, value } = e.target;
    const key = name as EditableField;
    setResource((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();
    // TODO: replace with real submit
    // eslint-disable-next-line no-console
    console.log(resource);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="resource"
        label="Resource URL"
        name="resource"
        autoComplete="resource"
        autoFocus
        value={resource.resource}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        fullWidth
        id="owner"
        label="Owner"
        name="owner"
        autoComplete="owner"
        value={resource.owner}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        fullWidth
        id="organisation"
        label="Organisation"
        name="organisation"
        autoComplete="organization"
        value={resource.organisation}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        fullWidth
        id="unit"
        label="Unit"
        name="unit"
        value={resource.unit}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        fullWidth
        id="role"
        label="Role"
        name="role"
        value={resource.role}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        fullWidth
        id="duty"
        label="Duty"
        name="duty"
        value={resource.duty}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        fullWidth
        id="group"
        label="Group"
        name="group"
        value={resource.group}
        onChange={handleChange}
      />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Box>
  );
};

export default ResourceAccessListForm;
