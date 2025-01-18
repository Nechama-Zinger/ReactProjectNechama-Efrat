
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { AuthContext } from "../AuthContext";
import { ApiUtils } from "../../utils/apiUtils";
import Select from "react-select";

import styles from "./Posts.module.css";


function Posts() {
    const [updatedData, setupdatedData] = useState({ title: "", body: "" })
    const { user } = useContext(AuthContext); // משתמש פעיל
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [viewType, setViewType] = useState("myPosts"); // סוג הצגה
    const [selectedUser, setSelectedUser] = useState(""); // סוג הצגה
    const [searchValue, setSearchValue] = useState(""); // ערך חיפוש
    const [filterBy, setFilterBy] = useState(""); // קריטריון חיפוש
    const [error, setError] = useState(""); // קריטריון חיפוש

    const [newPost, setNewPost] = useState({ title: "", body: "" }); // פוסט חדש
    const apiUtils = new ApiUtils();

    const filterOptions = [
        { value: "", label: "none" },
        { value: "title", label: "Title" },
        { value: "id", label: "ID" },
        // { value: "userId", label: "User ID" },
    ];

    // useEffect(() => {
    //     let condition;
    //     if (viewType === "searchUserPosts")
    //         apiUtils.getItems("users", `username=${selectedUser}`).then((data) => {
    //      condition = `userId=${data.id}` })
    //     else{
    //         condition = viewType === "myPosts" ? `userId=${user.id}` : "";
    //     }
    //     apiUtils.getItems("posts", condition).then((data) => setPosts(data || []));
    // }, [viewType]);
    useEffect(() => {
        let condition = "";

        const fetchPosts = (cond) => {
            apiUtils.getItems("posts", cond)
                .then((posts) => setPosts(posts || []))
                .catch((error) => console.error("Error fetching posts:", error));
        };

        if (viewType === "searchUserPosts") {
            apiUtils.getItems("users", `username=${selectedUser}`)
                .then((data) => {
                    if (data.length > 0) {
                        condition = `userId=${data[0].id}`;
                        fetchPosts(condition);
                    }
                    else {
                        setPosts([]);
                        setError("user not found")
                        
                    }
                })
                .catch((error) => console.error("Error fetching user:", error));
        } else {
            condition = viewType === "myPosts" ? `userId=${user.id}` : "";
            fetchPosts(condition);
        }
    }, [viewType, selectedUser]);



    const handleAddPost = () => {
        const postData = {
            userId: user.id,
            title: newPost.title,
            body: newPost.body,
        };
        apiUtils.addItem("posts", postData).then((newPost) => {
            if (newPost) setPosts((prev) => [...prev, newPost]);
        });
        setNewPost({ title: "", body: "" });
    };

    const handleDeletePost = (postId) => {
        apiUtils.deleteItem("posts", postId)
            .then(() => {
                setPosts((prev) => prev.filter((post) => post.id !== postId));
            });
    };
    const conditionForFilteringBy = (post) => {
        if (searchValue != "" && filterBy != "") {
            if (filterBy === "title") {
                return post.title.includes(searchValue)
            } else if (filterBy === "id") {
                return post.id == searchValue;
            }
            //  if(filterBy === "userId") {
            //     return post.userId == searchValue;
            // } 
        } else {
            return true; // ללא מיון
        }

    };
    const handleUpdatePost = () => {
        const newFilteredObject = Object.fromEntries(
            Object.entries(updatedData).filter(([key, value]) => value !== "")
        );
        apiUtils.updateItem(selectedPost.id, "posts", newFilteredObject)
            .then((updatedPost) => {
                if (updatedPost) {
                    setPosts((prev) =>
                        prev.map((post) => (post.id === selectedPost.id ? updatedPost : post))
                    );
                    // setSelectedPost(null);
                }
            });
    }

    const handleSelectPost = (post) => {
        setSelectedPost(post.id === selectedPost?.id ? null : post);
    };

    // const handleViewComments = (postId) => {
    //     navigate(`${postId}/comments`);
    // };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h2>{viewType}</h2>
                <div className={styles.filters}>
                    <button onClick={() => { setViewType("myPosts"); setError(""); setSelectedUser("") }}>My Posts</button>
                    <button onClick={() => { setViewType("allPosts"); setError(""); setSelectedUser("")}}>All Posts</button>
                    <label>
                        <button onClick={() => setViewType("searchUserPosts")}>Select Posts Of Specific User</button>
                        <input
                            type="text"
                            placeholder={`Search by user name`}
                            value={selectedUser}
                            onChange={(e) =>{ setSelectedUser(e.target.value); setError("");}}
                            style={{ marginTop: "1rem" }}
                        />
                    </label>

                    <div className={styles.searchFilter}>
                        <label>
                            Search By:
                            <Select
                                onChange={(e) => {
                                    setFilterBy(e.value);
                                    setSearchValue("");
                                }}
                                options={filterOptions}
                            />
                        </label>
                        {filterBy && (
                            <input
                                type="text"
                                placeholder={`Search by ${filterBy}`}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                style={{ marginTop: "1rem" }}
                            />
                        )}
                    </div>
                </div>

                {viewType != "searchUserPosts" &&
                    <div>
                        <h3>Add a Post</h3>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newPost.title}
                            onChange={(e) =>
                                setNewPost((prev) => ({ ...prev, title: e.target.value }))
                            }
                        />
                        <input
                            type="text"
                            placeholder="Body"
                            value={newPost.body}
                            onChange={(e) =>
                                setNewPost((prev) => ({ ...prev, body: e.target.value }))
                            }
                        />
                        <button onClick={handleAddPost}>Add Post</button>
                    </div>
                }
                <h2>{error}</h2>
                <ul className={styles.postList}>
                    {posts
                        .filter(conditionForFilteringBy)
                        .map((post) => (
                            <li
                                key={post.id}
                                className={styles.postItem}
                                onClick={() => handleSelectPost(post)}
                            >
                                <div>
                                    <strong>ID:</strong> {post.id} | <strong>Title:</strong> {post.title}
                                </div>
                                {selectedPost?.id === post.id && (
                                    <div className={styles.postDetails}>
                                        <p>{post.body}</p>
                                        {post.userId == user.id && (
                                            <>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}>Delete</button>
                                                <label>
                                                    <input
                                                        type="text"
                                                        placeholder="Update Title"
                                                        defaultValue={post.title}
                                                        onChange={(e) => {
                                                            setupdatedData((prev) => ({ ...prev, title: e.target.value }))
                                                        }
                                                        }
                                                        onClick={(e) => e.stopPropagation()} // כדי למנוע פתיחה/סגירה בלחיצה על הקלט
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Update Body"
                                                        defaultValue={post.body}
                                                        onChange={(e) => {
                                                            setupdatedData((prev) => ({ ...prev, body: e.target.value }))                                                        // handleUpdatePost("body", e.target.value)
                                                            // handleUpdatePost("title", e.target.value)

                                                        }

                                                        }
                                                        onClick={(e) => e.stopPropagation()} // כדי למנוע פתיחה/סגירה בלחיצה על הקלט
                                                    />
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdatePost()

                                                    }}>✏️</button>
                                                </label>

                                            </>
                                        )}
                                        <button onClick={(e) => { e.stopPropagation();
                                             navigate(`${post.id}/comments`,{ state: post  });

                                            //  handleViewComments(post.id); 
                                            }
                                             }>
                                            View Comments
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                </ul>


            </div>
        </>
    );
}

export default Posts;

