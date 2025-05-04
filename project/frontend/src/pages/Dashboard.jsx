import React from 'react';
import LeftBar from '@/components/LeftBar.jsx';
import DashboardContent from '@/components/dashboard/DashboardContent.jsx';
import '@/styles/global.css';

function Dashboard() {
  return (
    <div className="app-layout">
      <DashboardContent />
    </div>
  );
}

export default Dashboard;
