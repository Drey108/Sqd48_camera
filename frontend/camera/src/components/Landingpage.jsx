import React, { useState, useEffect } from 'react';
import './Landingpage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Landingpage = () => {
  const [cameras, setCameras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [budget, setBudget] = useState(500000);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCameras();
    checkLoginStatus();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/datas`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch cameras');
      }
      setCameras(response.data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const checkLoginStatus = () => {
    const username = document.cookie.split('; ').find(row => row.startsWith('username='));
    setIsLoggedIn(!!username);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleBudgetChange = (event) => {
    setBudget(event.target.value);
  };

  const filterCamerasByBudgetAndBrand = (cameras, budget, searchTerm) => {
    return cameras
      .sort((a, b) => b.price - a.price)
      .filter((camera) => camera.price <= budget)
      .filter((camera) => camera.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const handleShowSellForm = () => {
    navigate('/sell');
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/logout`);
      setIsLoggedIn(false);
      document.cookie = 'username=; Max-Age=0; path=/'; // Clear the cookie
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="landing-page">
      <div className="header">
        <div className="logo">
          <h1>Cloto</h1>
        </div>
        <nav className="navbar">
          <ul>
            <li>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by brand..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </li>
            <li>
              <div className="budget-slider">
                <div className="budget-label">Budget: INR. {budget}</div>
                <input
                  type="range"
                  id="budget-range"
                  min="30000"
                  max="500000"
                  value={budget}
                  onChange={handleBudgetChange}
                />
              </div>
            </li>
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/signup" className="login-btn signup-btn">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="login-btn">
                    Login
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <button className="sell-btn" onClick={handleShowSellForm}>
                    Sell
                  </button>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="content">
        <>
          <h2>Welcome to the Camera Project</h2>
          <p>Explore our collection of high-quality cameras and accessories.</p>
          <div className="cameras-container">
            <div className="row">
              {filterCamerasByBudgetAndBrand(cameras, budget, searchTerm).map((camera, index) => (
                <div key={index} className="column">
                  <div className="camera-item">
                    <img src={camera.imgurl} alt={camera.name} />
                    <div className="camera-details">
                      <strong>
                        <p className="camera-model">{camera.name}</p>
                      </strong>
                      <strong>
                        <p className="camera-price">INR. {camera.price}</p>
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      </div>

      <footer>
        <p>&copy; 2023 Camera Project</p>
      </footer>
    </div>
  );
};

export default Landingpage;
