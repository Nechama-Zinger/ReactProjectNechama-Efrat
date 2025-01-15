import React, { useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { AuthContext } from "../AuthContext";

function Posts() {
    const { user } = useContext(AuthContext); //useParams??????
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // טוענים את רשימת הפוסטים מה-API
        fetch(`http://localhost:3000/posts?userId=${user.id}`)
            .then((response) => response.json())
            .then((data) => setPosts(data));
    }, []);

    return (
        <>
            <Navbar />
            <div>
                <h2>Posts</h2>
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>
                            <Link to={`${post.id}/comments`}>View Comments</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Posts;
