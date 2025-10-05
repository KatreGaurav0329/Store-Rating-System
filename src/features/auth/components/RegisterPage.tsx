import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Row, Col, Card, Button, Form as BootstrapForm, Alert } from 'react-bootstrap';
import * as Yup from 'yup';
import { useAuth } from '../../../contexts/AuthContext';
import { CreateUserRequest } from '../../../types/user.types';

const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must be at most 60 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  address: Yup.string()
    .max(400, 'Address cannot exceed 400 characters')
    .required('Address is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [error, setError] = React.useState<string>('');

  const initialValues: Omit<CreateUserRequest, 'role'> & { confirmPassword: string } = {
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      setError('');
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
      resetForm();
      alert('Registration successful, please login.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Register</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Formik
                initialValues={initialValues}
                validationSchema={registerValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, touched, errors }) => (
                  <Form>
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label htmlFor="name">Name</BootstrapForm.Label>
                      <Field
                        as={BootstrapForm.Control}
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        isInvalid={touched.name && !!errors.name}
                      />
                      <ErrorMessage name="name" component={BootstrapForm.Control.Feedback} />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label htmlFor="email">Email</BootstrapForm.Label>
                      <Field
                        as={BootstrapForm.Control}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        isInvalid={touched.email && !!errors.email}
                      />
                      <ErrorMessage name="email" component={BootstrapForm.Control.Feedback} />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label htmlFor="address">Address</BootstrapForm.Label>
                      <Field
                        name="address"
                      >
                        {({ field, meta }: any) => (
                          <BootstrapForm.Control
                            {...field}
                            id="address"
                            as="textarea"
                            rows={3}
                            placeholder="Enter your address"
                            isInvalid={meta.touched && !!meta.error}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="address" component={BootstrapForm.Control.Feedback} />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label htmlFor="password">Password</BootstrapForm.Label>
                      <Field
                        as={BootstrapForm.Control}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        isInvalid={touched.password && !!errors.password}
                      />
                      <ErrorMessage name="password" component={BootstrapForm.Control.Feedback} />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label htmlFor="confirmPassword">Confirm Password</BootstrapForm.Label>
                      <Field
                        as={BootstrapForm.Control}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                      />
                      <ErrorMessage name="confirmPassword" component={BootstrapForm.Control.Feedback} />
                    </BootstrapForm.Group>

                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-100">
                      {isSubmitting ? 'Registering...' : 'Register'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
