import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'App';

const AuthRoutes = ({ children }: { children: React.ReactElement }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth) navigate('/login');
  }, [auth, navigate]);

  return children;
};

export default AuthRoutes;
