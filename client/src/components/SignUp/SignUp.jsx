import { useState } from 'react';
import { Link } from 'react-router-dom'
import styles from './SignUp.module.css';
// import ContinuationRegistration from '../ContinuationRegistration/ContinuationRegistration'
import ContinuationRegistration from '../ContinuationRegistration/ContinuationRegistration'
import { ApiUtils } from "../../utils/apiUtils";

function SignUp() {
    const [errorMessage, setErrorMessage] = useState('');
    const [userName, setuserName] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showRegistration, setShowRegistration] = useState(true);
    const apiUtils = new ApiUtils();

    const handleSignUp = (e) => {
        e.preventDefault();

        if (verifyPassword != password) {
            setErrorMessage('not verify password')
            return;
        }
        apiUtils.getItems(`users`, `username=${userName}`).then((data) => {
            if (data.length > 0) {
                setErrorMessage('Registration failed - enter other details');
                setuserName('');
                setPassword('');
                setVerifyPassword('');
            }
            else {
                setShowRegistration(false);
            }
        })
            .catch(error => {
                console.error('Error:', error);
            });

    };

    return (
        showRegistration ? <>
            <form onSubmit={handleSignUp} className={styles.loginForm}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>User Name: </label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setuserName(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>verify password: </label>
                    <input
                        type="password"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        onPaste={(e) => { e.preventDefault() }}
                        required
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.loginButton}>Continue</button>
            </form>
            <Link to="/login" className={styles.loginLink}> Have an account? Log in</Link>
            <div className={styles.errorMessage} >{errorMessage}</div>

        </> : <ContinuationRegistration password={password} userName={userName} />

    );
}

export default SignUp;
