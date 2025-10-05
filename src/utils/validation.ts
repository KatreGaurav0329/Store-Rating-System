import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character')
    .required('Password is required'),
});

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: loginValidationSchema.fields.password,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
  address: Yup.string()
    .max(400, 'Address must not exceed 400 characters')
    .required('Address is required'),
});

export const storeValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(20, 'Store name must be at least 20 characters')
    .max(60, 'Store name must not exceed 60 characters')
    .required('Store name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Store email is required'),
  address: Yup.string()
    .max(400, 'Address must not exceed 400 characters')
    .required('Store address is required'),
});

export const ratingValidationSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5')
    .required('Rating is required'),
});
