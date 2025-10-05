import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <header className="bg-primary text-white p-3">
        <Container>
          <h2>Store Rating System</h2>
        </Container>
      </header>
      
      <main className="py-4">
        <Container>
          <Outlet />
        </Container>
      </main>
      
      <footer className="bg-light text-center p-3 mt-auto">
        <Container>
          <p>&copy; 2025 Store Rating System. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;
