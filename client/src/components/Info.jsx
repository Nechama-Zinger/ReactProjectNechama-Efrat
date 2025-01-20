import React, { useState, useContext, useEffect } from "react";
import Navbar from "./Navbar";
import { AuthContext } from "./AuthContext";
import styles from "../styles/Info.module.css";

function Info() {
  const { user } = useContext(AuthContext);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/users?id=${user.id}`)
      .then((response) => response.json())
      .then((data) => setInfo(data[0]));
  }, []);

  const renderValue = (key, value) => {
    if (typeof value === "object" && value !== null) {
      return (
        <div className={styles.nested}>
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className={styles.nestedItem}>
              <strong>{subKey}:</strong> {renderValue(subKey, subValue)}
            </div>
          ))}
        </div>
      );
    } else {
      return <span>{value}</span>;
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Info</h2>
        <div className={styles.info}>
          {Object.entries(info)
            .filter(([subKey]) => subKey !== "website" && subKey !== "id")
            .map(([key, value]) => (
              <div key={key} className={styles.item}>
                <strong>{key}:</strong> {renderValue(key, value)}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Info;
