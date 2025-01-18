import React from "react";
import styles from "./NotFound.module.css";
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className={styles.homeLink}>Go Back Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
