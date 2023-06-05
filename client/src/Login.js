// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ hideTopBar }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Dummy authentication logic
    if (email === 'dummy@example.com' && password === 'password') {
      alert('Login successful');
      navigate('/app'); // Navigate to the desired page (App.js)
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="loginpage">
      {!hideTopBar && (
        <h1 className="login-heading">WatchYouWant</h1>
      )}
      <div className="login-box">
        <p>Login</p>
        <form onSubmit={handleLogin}>
          <div className="user-box">
            <input
              required
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>
          <button type="submit" className="submit-button">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </button>
        </form>
        <p>
          Don't have an account? <a href="/app" className="a2">Sign up!</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
