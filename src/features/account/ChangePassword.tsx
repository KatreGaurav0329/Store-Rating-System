// src/features/account/ChangePassword.tsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { accountService } from '../../services/accountService';

const ChangePassword: React.FC = () => {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await accountService.changePassword({ oldPassword: oldPwd, newPassword: newPwd });
      setMessage('Password updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating password');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group>
        <Form.Label>Current Password</Form.Label>
        <Form.Control type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>New Password</Form.Label>
        <Form.Control type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} required />
      </Form.Group>
      <Button type="submit" className="mt-2">Update Password</Button>
    </Form>
  );
};

export default ChangePassword;
