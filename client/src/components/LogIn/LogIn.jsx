import { useState, useContext} from 'react';
import styles from './LogIn.module.css';
import { useNavigate,Link } from 'react-router-dom';
import { AuthContext } from "../AuthContext";

function LogIn() {
    const [errorMessage, setErrorMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogIn = (e) => {
        e.preventDefault();
        fetch(`http://localhost:3000/users?username=${userName}&website=${password}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.length > 0){
                    // localStorage.setItem("currentUser", JSON.stringify(data));
                    login({"id":data[0].id,"name":data[0].name});
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
            });
    }

    return (
        <>
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