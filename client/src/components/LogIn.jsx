import { useState, useContext } from 'react';
import styles from '../styles/LogIn.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "./AuthContext";
import { ApiUtils } from "../utils/apiUtils";

function LogIn() {
    const [errorMessage, setErrorMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const apiUtils = new ApiUtils();

    const handleLogIn = (e) => {
        e.preventDefault();
        apiUtils.getItems(`users`, `username=${userName}&website=${password}`).then((data) => {
            if (data.length > 0) {
                login({
                    id: data[0].id,
                    name: data[0].username,
                    email: data[0].email
                });
                navigate(`/home/users/${data[0].id}`);
            }
            else {
                setErrorMessage("try Again");
                setUserName('');
                setPassword('');
            }

        })
            .catch(error => {
                console.error('Error:', error);
                alert('Error: ')
            });
    }

    return (
        <>
            <h2>Log In</h2>
            <form className={styles.loginForm} onSubmit={handleLogIn}>
                <div className={styles.formGroup}>
                    <label>Name: </label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className={styles.loginButton} type="submit">Log in</button>
            </form>
            <Link to="/register" className={styles.signupLink}>  Don't have an account? Sign up</Link>
            <div data>{errorMessage}</div>
        </>
    );

};

export default LogIn