import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { StoreWithUserRating } from '../../../types/store.types';

interface StoreCardProps {
  store: StoreWithUserRating;
  onRate?: (storeId: string, rating: number) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onRate }) => {
  const { id, name, address, averageRating, userRating } = store;

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{address}</Card.Text>
        <Card.Text>
          <strong>Overall Rating:</strong> {averageRating.toFixed(2)} / 5
        </Card.Text>
        <Card.Text>
          <strong>Your Rating:</strong> {userRating ? userRating : 'Not rated yet'}
        </Card.Text>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant={userRating && userRating >= star ? 'warning' : 'outline-warning'}
              size="sm"
              className="me-1"
              onClick={() => onRate && onRate(id, star)}
            >
              ★
            </Button>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StoreCard;
