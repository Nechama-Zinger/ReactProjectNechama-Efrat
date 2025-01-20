import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import styles from '../styles/Navbar.module.css'; // ייבוא קובץ ה-CSS מודול

function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className={styles.navbar}>
            <div className={styles.userName}>Hello {user.name}</div>
            <div className={styles.links}>
                <Link to={`/home/users/${user.id}`} className={styles.link}>Home</Link>
                <Link to={`/home/users/${user.id}/info`} className={styles.link}>Info</Link>
                <Link to={`/home/users/${user.id}/todos`} className={styles.link}>Todos</Link>
                <Link to={`/home/users/${user.id}/posts`} className={styles.link}>Posts</Link>
                <Link to={`/home/users/${user.id}/albums`} className={styles.link}>Albums</Link>
            </div>
            <button onClick={logout} className={styles.logoutButton}>Log Out</button>
        </nav>
    );
}

export default Navbar;

