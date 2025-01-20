import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/ContinuationRegistration.module.css';
import { AuthContext } from "./AuthContext";
import { ApiUtils } from "../utils/apiUtils";

function ContinuationRegistration(props) {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const apiUtils = new ApiUtils();

    const [userData, setUserData] = useState({
        name: '',
        username: props.userName,
        email: '',
        address: {
            street: '',
            city: ''
        },
        phone: '',
        website: props.password,
        company: {
            name: ''
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setUserData({
                ...userData,
                [parent]: {
                    ...userData[parent],
                    [child]: value
                }
            });
        } else {
            setUserData({
                ...userData,
                [name]: value
            });
        }
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        apiUtils.addItem("users", userData)
            .then(data => {
                console.log('Success:', data);
                login({
                    id: data.id,
                    name: data.name,
                    email: data.email
                });
                navigate(`/home/users/${data.id}`);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <>
            <h2>Finish Registration</h2>
            <form onSubmit={handleSignUp} className={styles.loginForm}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Name:</label>
                    <input type="text" name="name" value={userData.name} onChange={handleChange} className={styles.input} required />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email:</label>
                    <input type="email" name="email" value={userData.email} onChange={handleChange} className={styles.input} required />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Street:</label>
                    <input type="text" name="address.street" value={userData.address.street} onChange={handleChange} className={styles.input} required />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>City:</label>
                    <input type="text" name="address.city" value={userData.address.city} onChange={handleChange} className={styles.input} required />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Phone:</label>
                    <input type="tel" name="phone" value={userData.phone} onChange={handleChange} className={styles.input} required />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Company Name:</label>
                    <input type="text" name="company.name" value={userData.company.name} onChange={handleChange} className={styles.input} required />
                </div>

                <button type="submit" className={styles.loginButton}>Sign Up</button>
            </form>
            <Link to="/login" className={styles.loginLink}> Have an account? Log in</Link>
        </>
    );
}

export default ContinuationRegistration;
