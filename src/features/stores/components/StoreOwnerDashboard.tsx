import React, { useEffect, useState } from 'react';
import { Table, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import { adminService } from '../../../services/adminService'; // Replace with your service for owner

interface RatingWithUser {
  user: { name: string; email: string };
  rating: number;
  comment?: string;
}

const StoreOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        // Adjust this to your actual service/method/backend endpoint
        //const res = await adminService.getStoreRatings();
        //setRatings(res.data.ratings);
        //setAvgRating(res.data.averageRating);
      } catch (e) {
        setRatings([]);
        setAvgRating(null);
      }
      setLoading(false);
    };
    fetchRatings();
  }, []);

  return (
    <div>
      <h2>Store Owner Dashboard</h2>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Average Rating</Card.Title>
          <Card.Text style={{ fontSize: '2rem' }}>
            {avgRating !== null ? avgRating.toFixed(2) : "N/A"}
          </Card.Text>
        </Card.Body>
      </Card>

      <h4>Users Who Rated Your Store</h4>
      {loading ? (
        <Spinner animation="border" />
      ) : (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {ratings.length === 0 ? (
            <tr>
              <td colSpan={4}>No ratings yet.</td>
            </tr>
          ) : (
            ratings.map((r, idx) => (
              <tr key={idx}>
                <td>{r.user.name}</td>
                <td>{r.user.email}</td>
                <td>{r.rating}</td>
                <td>{r.comment || ""}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
