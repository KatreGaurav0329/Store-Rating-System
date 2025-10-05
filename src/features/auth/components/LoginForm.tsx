import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Form as BootstrapForm, Alert } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import { loginValidationSchema } from '../../../utils/validation';
import { LoginRequest } from '../../../types/user.types';
import { Link } from 'react-router-dom';


interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [error, setError] = React.useState<string>('');

  const initialValues: LoginRequest = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: LoginRequest,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setError('');
      await login(values);
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-form">
      <h2 className="text-center mb-4">Login</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Formik
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
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
              <BootstrapForm.Label htmlFor="password">Password</BootstrapForm.Label>
              <Field
                as={BootstrapForm.Control}
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                isInvalid={touched.password && !!errors.password}
              />
              <ErrorMessage name="password" component={BootstrapForm.Control.Feedback} />
            </BootstrapForm.Group>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-100"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        )}
      </Formik>
      <div className="text-center mt-3">
  <span>Don't have an account? </span>
  <Link to="/register">Register here</Link>
</div>

    </div>
  );
};

export default LoginForm;
