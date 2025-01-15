import React from "react";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className={styles.homeLink}>Go Back Home</a>
      </div>
    </div>
  );
};

export default NotFound;
