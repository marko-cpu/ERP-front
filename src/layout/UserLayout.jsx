  import React, { useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import AuthService from '../services/auth.service.jsx';
  import Sidebar from '../common/components/Sidebar.jsx';
  import Navbar from '../common/components/Navbar.jsx';
  import '../assets/style/UserLayout.css';
  import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
  ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement);

  const UserLayout = ({ children, loading }) => {
    const navigate = useNavigate();
    
   

    useEffect(() => {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
    }, [navigate]);

    return (
      <div className="d-flex">
      <Sidebar loading={loading} />
      <div className="flex-grow-1">
        <Navbar />
        <div>
          {children}
        </div>
      </div>
    </div>
    );
  };

export default UserLayout;