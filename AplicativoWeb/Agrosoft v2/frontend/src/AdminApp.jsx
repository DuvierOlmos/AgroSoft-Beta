// src/AdminApp.jsx

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute';
import AppRoutes from './app/routes';

function AdminApp() {
  return (
    <Routes>
      
      <Route
        path="/*"
        element={
          <ProtectedRoute requiredRole={2}> 
          <AppRoutes />
            
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AdminApp;
