// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App'
import './Login.css';

const Login = ({ hideTopBar, handleLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = {
        identifier: username, 
        password: password
      }
    
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json()


      
      if (response.ok) {
        alert('Login successful');
        navigate('/app');
        if (typeof handleLoginSuccess === 'function') {
          handleLoginSuccess(result);
        }
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    handleLogin(e);
  };
  
  return (
    <div className="loginpage">
      <div className="login-logo">
        <img src="https://i.postimg.cc/bw8rYjsP/2watchyouwant.png" alt="WatchYouWant Logo" className="login-img" />
      </div>
      <h1 className="register-heading">WatchYouWant </h1>
      <div className="login-box">
        <p>Login</p>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          Don't have an account? <a href="/register" className="a2">Sign up!</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
