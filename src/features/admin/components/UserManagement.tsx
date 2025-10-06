import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { adminService } from '../../../services/adminService';
import { User, UserRole } from '../../../types/user.types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: UserRole.NORMAL_USER });
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ ...filters, page, limit });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [filters, page]);

  const handleAddUser = async () => {
    setLoading(true);
    setError('');
    try {
      await adminService.createUser(newUser);
      setShowAdd(false);
      setNewUser({ name: '', email: '', password: '', address: '', role: UserRole.NORMAL_USER });
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating user');
    }
    setLoading(false);
  };

  return (
    <>
      <h2>User Management</h2>
      <Form onSubmit={e => { e.preventDefault(); loadUsers(); }}>
        <Form.Control placeholder="Name" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <Form.Control placeholder="Email" value={filters.email} onChange={e => setFilters({ ...filters, email: e.target.value })} />
        <Form.Control placeholder="Address" value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} />
        <Form.Select value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All Roles</option>
          {Object.values(UserRole).map(role => (
            <option key={role} value={role}>{role.replace('_', ' ')}</option>
          ))}
        </Form.Select>
        <Button type="submit" className="mt-2">Search</Button>
        <Button variant="primary" className="mt-2 ms-2" onClick={() => setShowAdd(true)}>Add User</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan={4}>Loading...</td></tr> : users.map((user: any) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton><Modal.Title>Add New User</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control value={newUser.address} onChange={e => setNewUser({ ...newUser, address: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role.replace('_', ' ')}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddUser}>Add User</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagement;
