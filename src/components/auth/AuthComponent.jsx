import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import bcrypt from 'bcryptjs';
import { getFromStorage, setToStorage } from '../../utils/storage';
import { generateId } from '../../utils/idGenerator';
import { getCurrentDate } from '../../utils/dateUtils';
import Button from '../common/Button';
import Input from '../common/Input';
import Form from '../common/Form';
import styles from './AuthComponent.module.css';

function AuthComponent({ mode = 'login' }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  
  const isRegisterMode = mode === 'register';
  
  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    return null;
  };
  
  const validatePassword = (password) => {
    if (!password || password.trim() === '') {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[a-zA-Z]/.test(password)) {
      return 'Password must contain at least one letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = name === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }
    
    if (isRegisterMode) {
      await handleRegister();
    } else {
      await handleLogin();
    }
  };
  
  const handleRegister = async () => {
    showLoading('Creating account...');
    
    try {
      // Check email uniqueness
      const users = getFromStorage('users') || [];
      const existingUser = users.find(u => u.email === formData.email);
      
      if (existingUser) {
        setErrors({ email: 'Email already registered' });
        return;
      }
      
      // Hash password (async, ~100-300ms)
      const passwordHash = await bcrypt.hash(formData.password, 10);
      
      // Create user
      const newUser = {
        userId: generateId(),
        email: formData.email,
        passwordHash,
        createdAt: getCurrentDate()
      };
      
      users.push(newUser);
      
      // Save to storage
      const saved = setToStorage('users', users);
      if (!saved) {
        alert('Storage quota exceeded. Please try again.');
        return;
      }
      
      // Auto-login
      login(newUser.userId);
      navigate('/books');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      hideLoading();
    }
  };
  
  const handleLogin = async () => {
    showLoading('Logging in...');
    
    try {
      // Find user
      const users = getFromStorage('users') || [];
      const user = users.find(u => u.email === formData.email);
      
      if (!user) {
        setErrors({ email: 'Invalid email or password' });
        return;
      }
      
      // Verify password (async, ~100-300ms)
      const isValid = await bcrypt.compare(formData.password, user.passwordHash);
      
      if (!isValid) {
        setErrors({ email: 'Invalid email or password' });
        return;
      }
      
      // Login
      login(user.userId);
      navigate('/books');
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      hideLoading();
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {isRegisterMode ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className={styles.subtitle}>
          {isRegisterMode 
            ? 'Register to start tracking your reading list' 
            : 'Login to access your reading list'}
        </p>
        
        <Form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email *</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={handleBlur}
              placeholder="your@email.com"
              hasError={!!errors.email}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          
          <div className={styles.field}>
            <label htmlFor="password">Password *</label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onBlur={handleBlur}
              placeholder={isRegisterMode ? 'Min 8 chars, 1 letter, 1 number' : 'Enter your password'}
              hasError={!!errors.password}
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>
          
          <Button type="submit" variant="primary" fullWidth>
            {isRegisterMode ? 'Register' : 'Login'}
          </Button>
        </Form>
        
        <div className={styles.footer}>
          {isRegisterMode ? (
            <p>
              Already have an account?{' '}
              <button 
                className={styles.link} 
                onClick={() => navigate('/login')}
              >
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button 
                className={styles.link} 
                onClick={() => navigate('/register')}
              >
                Register here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
