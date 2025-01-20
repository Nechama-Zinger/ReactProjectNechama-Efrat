import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar.jsx";
import { AuthContext } from "./AuthContext.jsx";
import { ApiUtils } from "../utils/apiUtils.js";
import Select from "react-select";
import Post from './Post.jsx'
import styles from "../styles/Posts.module.css";


function Posts() {
    const [updatedData, setUpdatedData] = useState({ title: "", body: "" })
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState("");
    const [viewType, setViewType] = useState("myPosts");
    const [selectedUser, setSelectedUser] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [filterBy, setFilterBy] = useState("");
    const [error, setError] = useState("");
    const [editingPost, setEditingPost] = useState(null);
    const [newPost, setNewPost] = useState({ title: "", body: "" });
    const apiUtils = new ApiUtils();

    const filterOptions = [
        { value: "", label: "none" },
        { value: "title", label: "Title" },
        { value: "id", label: "ID" }
    ];

    useEffect(() => {
        let condition = "";

        const fetchPosts = (cond) => {
            apiUtils.getItems("posts", cond)
                .then((posts) => setPosts(posts || []))
                .catch((error) => console.error("Error fetching posts:", error));
        };

        if (viewType == "searchUserPosts") {
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
            condition = viewType == "myPosts" ? `userId=${user.id}` : "";
            fetchPosts(condition);
        }
    }, [viewType]);

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
            if (filterBy == "title") {
                return post.title.includes(searchValue)
            } else if (filterBy == "id") {
                return post.id == searchValue;
            }
        } else {
            return true;
        }

    };

    const handleUpdatePost = () => {
        const newUpdatedData = Object.fromEntries(
            Object.entries(updatedData).filter(([key, value]) => value !== "")
        );
        apiUtils.updateItem(selectedPost.id, "posts", newUpdatedData)
            .then((updatedPost) => {
                if (updatedPost) {
                    console.log(updatedPost);
                    setPosts((prev) =>
                        prev.map((post) => (post.id == selectedPost.id ? updatedPost : post))
                    );
                    setEditingPost(null)
                }
            });
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h2>{viewType}</h2>
                <div className={styles.filters}>
                    <button onClick={() => { setViewType("myPosts"); setError(""); setSelectedUser("") }}>My Posts</button>
                    <button onClick={() => { setViewType("allPosts"); setError(""); setSelectedUser("") }}>All Posts</button>
                    <label>
                        <button style={{ width: "600px" }} onClick={() => setViewType("searchUserPosts")}>Select Posts Of Specific User</button>
                        <input
                            type="text"
                            placeholder={`Search by user name`}
                            value={selectedUser}
                            onChange={(e) => { setSelectedUser(e.target.value); setError(""); }}
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
                        <input
                            type="text"
                            placeholder={`Search by ${filterBy}`}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>

                {viewType != "searchUserPosts" &&
                    <div>
                        <h3>Add a Post</h3>
                        <div className={styles.addPost}>
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
                    </div>
                }
                <h2>{error}</h2>
                <ul className={styles.postList}>
                    {posts
                        .filter(conditionForFilteringBy)
                        .map((post) => (
                            <Post
                                key={post.id}
                                post={post}
                                user={user}
                                selectedPost={selectedPost}
                                setSelectedPost={setSelectedPost}
                                editingPost={editingPost}
                                setEditingPost={setEditingPost}
                                handleUpdatePost={handleUpdatePost}
                                handleDeletePost={handleDeletePost}
                                setUpdatedData={setUpdatedData}
                            />
                        ))}
                </ul>
            </div>
        </>
    );
}

export default Posts;

