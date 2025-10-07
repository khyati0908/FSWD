import React, { useState } from 'react';
import './Sidebar.css';
import { FaHome, FaInfoCircle, FaEnvelope, FaBars } from 'react-icons/fa';

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('home');

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleMenuClick = (section) => {
    setActive(section);
    setIsOpen(false); // Close sidebar on click (mobile)
  };

  return (
    <div className="app">
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2 className="logo">MyApp</h2>
        <ul>
          <li
            className={active === 'home' ? 'active' : ''}
            onClick={() => handleMenuClick('home')}
          >
            <FaHome /> <span>Home</span>
          </li>
          <li
            className={active === 'about' ? 'active' : ''}
            onClick={() => handleMenuClick('about')}
          >
            <FaInfoCircle /> <span>About</span>
          </li>
          <li
            className={active === 'contact' ? 'active' : ''}
            onClick={() => handleMenuClick('contact')}
          >
            <FaEnvelope /> <span>Contact</span>
          </li>
        </ul>
      </div>

      <div className="main">
        <button className="toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className="content">
          <h1>
            {active === 'home'
              ? 'Welcome to My Website'
              : active === 'about'
              ? 'About Us'
              : 'Contact Us'}
          </h1>
          <p>
            {active === 'home'
              ? 'This is the main content of the homepage.'
              : active === 'about'
              ? 'We are passionate developers building awesome UIs.'
              : 'Get in touch at contact@myapp.com'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;

