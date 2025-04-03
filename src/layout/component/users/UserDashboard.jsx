import React from 'react';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

import UserLayout from '../../UserLayout.jsx';
import Dashboard from '../../../common/components/Dashboard.jsx';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const UserDashboard = () => {
  return (
    <UserLayout>
      <Dashboard />
    </UserLayout>
  );
};

export default UserDashboard;