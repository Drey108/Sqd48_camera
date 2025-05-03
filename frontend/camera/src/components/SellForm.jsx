import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SellForm.css';

const SellForm = () => {
  const [price, setPrice] = useState('');
  const [modelName, setModelName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  // Function to get the value of the 'username' cookie
  function getUsernameFromCookie() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('username=')) {
        return cookie.substring('username='.length);
      }
    }
    return null;
  }

  const username = getUsernameFromCookie();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name: modelName,
        imgurl: imageUrl,
        price: parseFloat(price),
        created_by:username, // Include username in the form data
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/sell-cameras`, formData,{ withCredentials: true });

      if (response.status === 200) {
        console.log('Camera added successfully');
        setPrice('');
        setModelName('');
        setImageUrl('');
        navigate('/sell');
      } else {
        console.error('Failed to add camera');
      }
    } catch (error) {
      console.error('Error adding camera:', error);
    }
  };

  return (
    <div className="sell-form-container">
      <h2>Sell Your Camera</h2>
      <form onSubmit={handleSubmit} className="sell-form">
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="modelName">Model Name:</label>
          <input
            type="text"
            id="modelName"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SellForm;
