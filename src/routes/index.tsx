import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthRoutes from './authRoute';

const Login = lazy(() => import('../pages/Login'));
const SignUp = lazy(() => import('../pages/SignUp'));
const Home = lazy(() => import('../pages/Home'));

const RouteComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/sign-up' element={<SignUp />}></Route>
        <Route
          path='/'
          element={
            <AuthRoutes>
              <Home />
            </AuthRoutes>
          }></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteComponent;
