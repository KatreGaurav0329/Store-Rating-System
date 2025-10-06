import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext'; 
import { UserRole } from '../../../types/user.types';     

const Layout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout d-flex flex-column min-vh-100">
      {/* Role-aware Header */}
      <header>
        <Navbar bg="primary" variant="dark" expand="lg" className="py-2">
          <Container>
            <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              Store Rating System
            </Navbar.Brand>

            <Nav className="me-auto">
              {/* Admin tabs */}
              {user?.role === UserRole.SYSTEM_ADMIN && (
                <>
                  <Nav.Link onClick={() => navigate('/admin-dashboard')}>Dashboard</Nav.Link>
                  <Nav.Link onClick={() => navigate('/admin/users')}>User Management</Nav.Link>
                  <Nav.Link onClick={() => navigate('/admin/stores')}>Store Management</Nav.Link>
                </>
              )}

              {/* Store owner tabs */}
              {user?.role === UserRole.STORE_OWNER && (
                <>
                  <Nav.Link onClick={() => navigate('/store-dashboard')}>Store Dashboard</Nav.Link>
                </>
              )}

              {/* Normal user tabs */}
              {user?.role === UserRole.NORMAL_USER && (
                <>
                  <Nav.Link onClick={() => navigate('/user-dashboard')}>My Dashboard</Nav.Link>
                </>
              )}
              <Nav.Link onClick={() => navigate('/change-password')} title="Change Password">
                <span role="img" aria-label="change-password">🔑Change Password</span>
              </Nav.Link>

            </Nav>

            <div className="d-flex align-items-center gap-2">
              {isAuthenticated && <span className="text-white">{user?.name}</span>}
              {isAuthenticated ? (
                <Button size="sm" variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button size="sm" variant="light" onClick={() => navigate('/login')}>
                  Login
                </Button>
              )}
            </div>
          </Container>
        </Navbar>
      </header>

      {/* Main */}
      <main className="py-4 flex-grow-1">
        <Container>
          <Outlet />
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-light text-center p-3 mt-auto">
        <Container>
          <p>Store Rating System.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;
