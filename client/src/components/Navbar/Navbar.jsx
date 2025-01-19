import React from "react";
import { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Navbar() {
    // const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={styles.navbar}>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.links}>
                <Link to={`/home/users/${user.id}`} style={styles.link}>Home</Link>
                <Link to={`/home/users/${user.id}/info`} style={styles.link}>Info</Link>
                <Link to={`/home/users/${user.id}/todos`} style={styles.link}>Todos</Link>
                <Link to={`/home/users/${user.id}/posts`} style={styles.link}>Posts</Link>
                <Link to={`/home/users/${user.id}/albums`} style={styles.link}>Albums</Link>
            </div>
            <button onClick={() => { logout() }} style={styles.logoutButton}>Log Out</button>
        </nav>
    );
}

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#333",
        color: "white",
    },
    userName: {
        marginLeft: "1rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
    },
    links: {
        display: "flex",
        gap: "1rem",
    },
    link: {
        color: "white",
        textDecoration: "none",
        fontSize: "1rem",
    },
    logoutButton: {
        marginRight: "1rem",
        backgroundColor: "#ff4d4d",
        color: "white",
        border: "none",
        padding: "0.5rem 1rem",
        cursor: "pointer",
    },
};

export default Navbar;
