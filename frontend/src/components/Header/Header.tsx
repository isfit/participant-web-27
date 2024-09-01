import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  linkTo?: string;
}

const Header: React.FC<HeaderProps> = ({ linkTo = '/' }) => {
  const logo = (
    <img
      src='./src/assets/Isfitlogo_power_red_version2.png'
      alt="Logo"
      style={{ 
        width: '90%', 
        marginTop: '-100px', 
        marginBottom: '-100px' 
      }}
    />
  );
  
  return (
    <header>
      <Link to={linkTo}>{logo}</Link>
    </header>
  );
};

export default Header;