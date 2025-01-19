import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Posts.module.css";

function Post({ post, user, selectedPost, setSelectedPost, editingPost, setEditingPost, handleUpdatePost, handleDeletePost, setUpdatedData }) {
    const navigate = useNavigate();
    const isEditing = editingPost == post.id;
    const isSelected = selectedPost?.id == post.id;
    const isOwnPost = post.userId == user.id;

    const handleSelectPost = (post) => {
        setSelectedPost(post.id == selectedPost?.id ? null : post);
    };

    return (
        <li
            key={post.id}
            className={styles.postItem}
            onClick={() => handleSelectPost(post)}
        >
            <div>
                <strong>ID:</strong> {post.id} |
                {isEditing ? (
                    <input
                        type="text"
                        placeholder="Update Title"
                        defaultValue={post.title}
                        onChange={(e) => setUpdatedData((prev) => ({ ...prev, title: e.target.value }))}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <>
                        <strong>Title:</strong> {post.title}
                    </>
                )}
            </div>
            {isSelected &&
                <div className={styles.postDetails}>
                    {isOwnPost ? (
                        <>
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Update Body"
                                        defaultValue={post.body}
                                        onChange={(e) => setUpdatedData((prev) => ({ ...prev, body: e.target.value }))}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </>
                            ) : (
                                <p>{post.body}</p>
                            )}
                            <div>
                                {isEditing ? (
                                    <>
                                        <button onClick={(e) => { e.stopPropagation(); handleUpdatePost(); }}>
                                            Save
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setEditingPost(null); }}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={(e) => { e.stopPropagation(); setEditingPost(post.id); }}>
                                            ✏️
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <p>{post.body}</p>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`${post.id}/comments`, { state: post });
                        }}
                    >
                        View Comments
                    </button>
                </div>
            }
        </li>
    );
}

export default Post;