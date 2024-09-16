import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CreateUser from './pages/createUser/CreateUser';
import Login from './pages/login/Login';
import HomePage from './pages/homePage/HomePage';
import ApplicationForm from './pages/applicationForm/ApplicationForm';
import { AuthProvider } from './context/AuthenticationContext';
import PrivateRoute from './components/Routing/PrivateRoutes';
import AdminPage from './pages/adminPage/AdminPage';
import FAQ from './pages/faq/FAQ';
import ProtectedAdminRoute from './components/Routing/AdminRoutes';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/createUser" element={<CreateUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/homePage" element={<HomePage />} />
          <Route
            path="/applicationForm"
            element={
              <PrivateRoute>
                <ApplicationForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
