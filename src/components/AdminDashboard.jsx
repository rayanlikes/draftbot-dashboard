import React from 'react';
import ScrimManager from './ScrimManager'; // Import ScrimManager
// TODO: Import other specific admin components like ConfigEditor, RoleChannelConfig etc.
import RoleChannelConfig from './RoleChannelConfig'; // Import RoleChannelConfig

const AdminDashboard = ({ children }) => { // Accept children to render VisualEditors passed from App.jsx
  return (
    <section className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin! Manage your bot settings here.</p>

      {/* Render Scrim Manager */}
      <ScrimManager />

      {/* Render Visual Editors passed as children */}
      {children}

      {/* Placeholder for other admin feature components */}
      {/* <RoleChannelConfig /> */}
      <RoleChannelConfig /> {/* Render RoleChannelConfig */}
    </section>
  );
};

export default AdminDashboard;