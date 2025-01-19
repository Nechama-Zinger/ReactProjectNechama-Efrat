import React, { createContext, useState, useEffect } from "react";
import { ApiUtils } from "../../utils/apiUtils";

export const AuthContext = createContext();

function Post(props) {
    const { setPosts } = props;
    const apiUtils = new ApiUtils();
    const [selectedPost, setSelectedPost] = useState(null);

    const handleDeletePost = (postId) => {
        apiUtils.deleteItem("posts", postId)
            .then(() => {
                setPosts((prev) => prev.filter((post) => post.id !== postId));
            });
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
    return (
        <>
            <div>
                <strong>ID:</strong> {post.id} | <strong>Title:</strong> {post.title}
            </div>
            {
                selectedPost?.id === post.id && (
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
                        <button onClick={(e) => {
                            e.stopPropagation();
                            navigate(`${post.id}/comments`, { state: post });
                        }
                        }>
                            View Comments
                        </button>
                    </div>
              }    </>)


}
export default Post