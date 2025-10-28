import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import StorageIcon from '@mui/icons-material/Storage';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import GroupIcon from '@mui/icons-material/Group';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export const mainListItems: React.ReactElement = (
  <React.Fragment>
    <ListItem component={RouterLink} to="/">
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>

    <ListItem component={RouterLink} to="/profile">
      <ListItemIcon>
        <ProfileIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItem>
    <ListItem component={RouterLink} to="/upload-search">
      <ListItemIcon>
        <ManageSearchIcon></ManageSearchIcon>
      </ListItemIcon>
      <ListItemText primary="Upload Search" />
    </ListItem>
    <ListItem component={RouterLink} to="/coremaster-list">
      <ListItemIcon>
        <GroupIcon />
      </ListItemIcon>
      <ListItemText primary="User/Unit List" />
    </ListItem>
    <ListItem component={RouterLink} to="/user-search">
      <ListItemIcon>
        <PersonSearchIcon />
      </ListItemIcon>
      <ListItemText primary="User Search" />
    </ListItem>
  </React.Fragment>
);

export const secondaryListItems: React.ReactElement = (
  <React.Fragment>
    <ListItem component={RouterLink} to="/bookmarks">
      <ListItemIcon>
        <BookmarksIcon />
      </ListItemIcon>
      <ListItemText primary="Bookmarks" />
    </ListItem>

    <ListItem component={RouterLink} to="/services">
      <ListItemIcon>
        <StorageIcon />
      </ListItemIcon>
      <ListItemText primary="Services" />
    </ListItem>

    <ListItem component={RouterLink} to="/resource">
      <ListItemIcon>
        <StorageIcon />
      </ListItemIcon>
      <ListItemText primary="Resources" />
    </ListItem>
  </React.Fragment>
);
