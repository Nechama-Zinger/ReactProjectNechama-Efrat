import React, { useState, useContext, useEffect} from "react";
import Navbar from "../Navbar/Navbar";
import { AuthContext } from "../AuthContext";

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
                <div style={{ marginLeft: "1rem" }}>
                    {Object.entries(value).map(([subKey, subValue]) => (
                        <div key={subKey}>
                            <strong>{subKey}:</strong> {renderValue(subKey, subValue)}
                        </div>
                    ))}
                </div>
            );
        } else {
            return value;
        }
    };

    return (
        <>
            <Navbar />
            <div>
                <h2>Info</h2>
                <div>
                    {Object.entries(info).map(([key, value]) => (
                        <div key={key}>
                            <strong>{key}:</strong> {renderValue(key, value)}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Info;
