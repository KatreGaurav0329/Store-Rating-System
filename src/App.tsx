import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import Layout from './components/common/Layout/Layout';
import { UserRole } from './types/user.types';

// Page imports
import LoginPage from './features/auth/components/LoginPage';
import RegisterPage from './features/auth/components/RegisterPage';
import AdminDashboard from './features/admin/components/AdminDashboard';
import UserManagement from './features/admin/components/UserManagement';
import StoreManagement from './features/admin/components/StoreManagement';
import StoreList from './features/stores/components/StoreList';
import StoreDetail from './features/stores/components/StoreDetail';
import StoreOwnerDashboard from './features/stores/components/StoreOwnerDashboard';
import UserProfile from './features/users/components/UserProfile';
import UnauthorizedPage from './components/common/UnauthorizedPage';

// CSS imports
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  {/* Admin routes */}
                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.SYSTEM_ADMIN]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/users"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.SYSTEM_ADMIN]}>
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/stores"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.SYSTEM_ADMIN]}>
                        <StoreManagement />
                      </ProtectedRoute>
                    }
                  />

                  {/* Store Owner routes */}
                  <Route
                    path="store-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.STORE_OWNER]}>
                        <StoreOwnerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Normal User and shared routes */}
                  <Route path="stores" element={<StoreList />} />
                  <Route path="stores/:storeId" element={<StoreDetail />} />
                  <Route path="profile" element={<UserProfile />} />

                  {/* Default redirect */}
                  <Route
                    path=""
                    element={<Navigate to="/stores" replace />}
                  />
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
