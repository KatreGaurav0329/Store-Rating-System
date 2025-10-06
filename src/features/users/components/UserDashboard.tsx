import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import { adminService } from '../../../services/adminService'; // adjust if you have storeService/ratingService

interface StoreInfo {
  id: string;
  name: string;
  address: string;
  averageRating: number;
}

interface UserRatingMap {
  [storeId: string]: number; // storeId => rating
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [userRatings, setUserRatings] = useState<UserRatingMap>({});
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load all stores
  const loadStores = async () => {
    setLoading(true);
    setSuccessMessage('');
    try {
      const res = await adminService.getStores({ ...filters });
      setStores(res.data.stores || res.data);
    } catch {
      setStores([]);
    }
    setLoading(false);
  };

  // Load user's previous ratings
  const loadUserRatings = async () => {
    try {
      /**const res = await adminService.getUserRatings?.(); // add in your service if missing
      const ratingMap: UserRatingMap = {};
      res.data.forEach((r: { storeId: string; rating: number }) => {
        ratingMap[r.storeId] = r.rating;
      });
      setUserRatings(ratingMap);**/
    } catch {
      setUserRatings({});
    }
  };

  useEffect(() => {
    loadStores();
    if (user) loadUserRatings();
    // eslint-disable-next-line
  }, [filters, user]);

  // Open modal for submit/modify rating
  const handleRate = (store: StoreInfo) => {
    setSelectedStore(store);
    setRatingValue(userRatings[store.id] ?? 0);
    setShowModal(true);
    setSubmitError('');
  };

  // Submit or update a rating
  const handleSubmitRating = async () => {
    setSubmitError('');
    if (ratingValue < 1 || ratingValue > 5) return setSubmitError('Choose a value from 1 to 5');
    try {
      /**await adminService.submitOrUpdateRating({
        storeId: selectedStore?.id,
        rating: ratingValue,
      });**/
      setSuccessMessage(
        userRatings[selectedStore!.id]
          ? 'Rating updated successfully!'
          : 'Rating submitted successfully!'
      );
      setShowModal(false);
      loadUserRatings();
      loadStores();
    } catch (err: any) {
      setSubmitError('Failed to submit rating');
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <Form className="mb-3" onSubmit={e => { e.preventDefault(); loadStores(); }}>
        <Form.Control className="mb-2" placeholder="Store name" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <Form.Control className="mb-2" placeholder="Store address" value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} />
        <Button type="submit" className="mb-2">Search</Button>
      </Form>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.averageRating ? store.averageRating.toFixed(2) : 'N/A'}</td>
              <td>{userRatings[store.id] ?? 'N/A'}</td>
              <td>
                <Button size="sm" onClick={() => handleRate(store)}>
                  {userRatings[store.id] ? 'Modify Rating' : 'Submit Rating'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for rating */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{userRatings[selectedStore?.id ?? ''] ? "Modify" : "Submit"} Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitError && <Alert variant="danger">{submitError}</Alert>}
          <Form.Group>
            <Form.Label>Rating (1-5)</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={5}
              value={ratingValue}
              onChange={e => setRatingValue(Number(e.target.value))}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmitRating}>
            {userRatings[selectedStore?.id ?? ''] ? 'Update Rating' : 'Submit Rating'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserDashboard;
