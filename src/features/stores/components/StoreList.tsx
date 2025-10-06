import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, Pagination } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import { StoreWithUserRating } from '../../../types/store.types';
import { storeService } from '../../../services/storeService';
import StoreCard from '../../../features/stores/components/StoreCard';
import { useDebounce } from '../../../hooks/useDebounce';

interface StoreFilters {
  search: string;
  sortBy: 'name' | 'rating' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

const StoreList: React.FC = () => {
  const { user, isNormalUser } = useAuth();
  const [stores, setStores] = useState<StoreWithUserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<StoreFilters>({
    search: '',
    sortBy: 'rating',
    sortOrder: 'desc',
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchStores = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        search: debouncedSearch,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      const response = isNormalUser
        ? await storeService.getStoresWithUserRatings(params)
        : await storeService.getStores(params);

      setStores(response.stores ?? []);
        setTotalPages(response.totalPages);

      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(1);
  }, [debouncedSearch, filters.sortBy, filters.sortOrder]);

  const handleFilterChange = (key: keyof StoreFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    fetchStores(page);
  };

  const paginationItems = useMemo(() => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  }, [currentPage, totalPages]);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1>Stores</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search stores by name or address..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
            <option value="createdAt">Sort by Date</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div>Loading stores...</div>
      ) : (
        <>
          <Row>
            {stores.map((store) => (
              <Col key={store.id} md={6} lg={4} className="mb-4">
                <StoreCard store={store} />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <Pagination>{paginationItems}</Pagination>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default StoreList;

