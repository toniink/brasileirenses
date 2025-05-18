import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../api/auth';
import { Button } from 'react-bootstrap';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Button 
      variant="outline-danger" 
      onClick={handleLogout}
      className="ms-2"
    >
      Sair
    </Button>
  );
};

export default LogoutButton;