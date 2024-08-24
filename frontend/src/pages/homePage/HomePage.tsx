import React, { useState } from 'react';
import { Heading, Text, Box, Button } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { useAuth } from '../../context/AuthenticationContext';
import { ROLES } from '../../config/roles';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.hamburgerMenu} onClick={toggleMenu}>
        <div className={styles.hamburgerIcon}></div>
        <div className={styles.hamburgerIcon}></div>
        <div className={styles.hamburgerIcon}></div>
      </div>

      <div className={`${styles.sideMenu} ${menuOpen ? styles.open : ''}`}>
        {user?.role === ROLES.ADMIN && (
          <Link to="/admin">Admin</Link>
        )}
        <Link to="/login">Login</Link>
      </div>

      <div className={styles.centerContainer}>
        <img src={'/isfit_log.png'} alt="Logo" className={styles.logo} />
      </div>
      <br />
      <Link to="/applicationForm" className={styles.applyButtonLink}>
        <Button className={styles.applyButton}>Apply now!</Button>
      </Link>
      <div className={styles.container}>

      <h1>Welcome to the ISFiT 2025 Participant Web!</h1>
      <p>

ISFiT, the world’s largest international student festival, is held biennially in Trondheim, Norway, during the spring semester. Since its inception in 1990, ISFiT has brought together students from diverse national and cultural backgrounds, fostering dialogue and connection through stimulating discussions on important global issues.
</p>

<p>

Each festival centers around a unique theme, and for 2025, we will be exploring the theme of POWER. We invite you to join us from March 13th to 23rd, 2025, for this exciting event, where students from across the globe will gather in Trondheim to engage, learn, and inspire one another.
      </p>
      </div>
    </div>
  );
};

export default HomePage;
