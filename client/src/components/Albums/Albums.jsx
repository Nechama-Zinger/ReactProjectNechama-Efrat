import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";


function Albums() {
    const { userId } = useParams(); // שימוש בפרמטר userId מה-URL
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}/albums`)
            .then((response) => response.json())
            .then((data) => setAlbums(data.slice(0, 5))); // מגביל ל-5 אלבומים
    }, [userId]);

    return (
        <>
            <Navbar />
            <div>
                <h2>Albums</h2>
                <ul>
                    {albums.map((album) => (
                        <li key={album.id}>
                            <Link to={`${album.id}/photos`}>{album.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Albums;
