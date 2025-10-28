import React from 'react';
import { Routes, Route, Navigate } from 'react-router';

import Content from './components/Content';
import Login from './components/Login';
import Profile from './components/Profile';
import ProtectedRoutes from './components/ProtectedRoutes';
import PublicRoutes from './components/PublicRoutes';
import PermissionDenied from './components/PermissionDenied';
import ServiceList from './components/ServiceList';
import BookmarkList from './components/BookmarkList';
import BookmarkDetail from './components/BookmarkDetail';
import IssueList from './components/IssueList';
import IssueDetail from './components/IssueDetail';
import ProcessList from './components/ProcessList';
import ProcessDetail from './components/ProcessDetail';
import ServiceDetail from './components/ServiceDetail';
import Authenticate from './components/Authenticate';
import ResourceAccessListForm from './components/ResourceAccessListForm';
import UploadSearch from './components/UploadSearch';
import CoreMasterUserUnitList from './components/CoreMasterUserUnitList';
import UserSearch from './components/UserSearch';
const Routing: React.FC = () => (
  <Routes>
    {/* Protected routes requiring authentication */}
    <Route path="/" element={<ProtectedRoutes />}>
      <Route path="/" element={<Content />}>
        {/* REMOVED: Immediate redirect to /issues. App.tsx will handle this. */}
        <Route path="/" element={<IssueList />} />
        <Route path="profile" element={<Profile />} />
        <Route path="resource" element={<ResourceAccessListForm />} />
        <Route path="issues" element={<IssueList />} />
        <Route path="issues/:issueId" element={<IssueDetail />} />
        <Route path="processes" element={<ProcessList />} />
        <Route path="processes/:processId" element={<ProcessDetail />} />
        <Route path="services" element={<ServiceList />} />
        <Route path="bookmarks" element={<BookmarkList />} />
        <Route path="bookmarks/:unitId" element={<BookmarkDetail />} />
        <Route path="services/:serviceId" element={<ServiceDetail />} />
        <Route path="upload-search" element={<UploadSearch />} />
        <Route path="coremaster-list" element={<CoreMasterUserUnitList />} />
        <Route path="user-search" element={<UserSearch />} />
      </Route>
    </Route>

    {/* Public routes */}
    <Route path="login" element={<PublicRoutes />}>
      <Route path="/login" element={<Login />} />
    </Route>

    {/* Authentication callback route */}
    <Route path="/token" element={<Authenticate />} />

    {/* Permission denied route */}
    <Route path="/denied" element={<PermissionDenied />} />

    {/* Catch all route */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default Routing;
