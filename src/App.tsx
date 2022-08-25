import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'i18n';

const Login = lazy(() => import('./pages/Login'));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
