import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Post.module.css";

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
            className={styles.postItem}
            onClick={() => handleSelectPost(post)}
        >
            <div className={styles.postHeader}>
                <div>
                    <strong>ID:</strong> {post.id} | <strong>Title:</strong> {post.title}
                </div>
            </div>

            {isSelected && (
                <div className={styles.postDetails}>
                    {isOwnPost ? (
                        <>
                            {isEditing ? (
                                <>
                                    {console.log(isEditing)}
                                    <input
                                        type="text"
                                        placeholder="Update Title"
                                        defaultValue={post.title}
                                        onChange={(e) => setUpdatedData((prev) => ({ ...prev, title: e.target.value }))}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Update Body"
                                        defaultValue={post.body}
                                        onChange={(e) => setUpdatedData((prev) => ({ ...prev, body: e.target.value }))}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className={styles.actions}>
                                        <button onClick={(e) => { e.stopPropagation(); handleUpdatePost(); }}>
                                            Save
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setEditingPost(null); }}>
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{post.body}</p>
                                    <div className={styles.actions}>
                                        <button onClick={(e) => { e.stopPropagation(); setEditingPost(post.id); }}>
                                            ✏️ Edit
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <p>{post.body}</p>
                    )}
                    <button
                        className={styles.closeButton}
                        onClick={() => navigate(`${post.id}/comments`, { state: post })}
                    >
                        View Comments
                    </button>
                </div>
            )}
        </li>
    );
}

export default Post;
