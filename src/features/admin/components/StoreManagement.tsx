import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { adminService } from '../../../services/adminService';
import { Store } from '../../../types/store.types';

const StoreManagement: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState<string>('');

  const loadStores = async () => {
    setLoading(true);
    try {
      const res = await adminService.getStores({ ...filters });
      setStores(res.data.stores || res.data); 
    } catch (err: any) {
      setError('Failed to load stores');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line
  }, [filters]);

  const handleAddStore = async () => {
    setError('');
    try {
      await adminService.createStore(newStore);
      setShowAdd(false);
      setNewStore({ name: '', email: '', address: '' });
      loadStores();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add store');
    }
  };

  return (
    <div>
      <h2>Store Management</h2>
      <Form className="mb-3" onSubmit={e => { e.preventDefault(); loadStores(); }}>
        <Form.Control className="mb-1" placeholder="Name" value={filters.name}
          onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <Form.Control className="mb-1" placeholder="Email" value={filters.email}
          onChange={e => setFilters({ ...filters, email: e.target.value })} />
        <Form.Control className="mb-1" placeholder="Address" value={filters.address}
          onChange={e => setFilters({ ...filters, address: e.target.value })} />
        <Button type="submit" className="mt-1">Search</Button>
        <Button variant="primary" className="mt-1 ms-2" onClick={() => setShowAdd(true)}>Add Store</Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Address</th><th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan={4}>Loading...</td></tr> :
            stores.map((s: any) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.rating ?? 'N/A'}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton><Modal.Title>Add Store</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control value={newStore.email} onChange={e => setNewStore({ ...newStore, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddStore}>Add Store</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StoreManagement;
