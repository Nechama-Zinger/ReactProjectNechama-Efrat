import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { ApiUtils } from "../../utils/apiUtils";
import styles from "./Comments.module.css";

function Comments() {
    const { postId } = useParams(); // מזהה הפוסט מתוך ה-URL
    const { user } = useContext(AuthContext); // פרטי המשתמש המחובר
    const [comments, setComments] = useState([]);
    const [postDetails, setPostDetails] = useState(null); // פרטי הפוסט
    const [newComment, setNewComment] = useState(""); // תגובה חדשה
    const [editingComment, setEditingComment] = useState(null); // עריכת תגובה
    const apiUtils = new ApiUtils();

    useEffect(() => {
        // טוענים את פרטי הפוסט
        apiUtils.getItems(`posts`, `id=${postId}`).then((data) => {
            if (data && data.length > 0) {
                setPostDetails(data[0]);
            }
        });

        // טוענים את התגובות
        apiUtils.getItems("comments", `postId=${postId}`).then((data) => {
            setComments(data || []);
        });
    }, [postId]);

    const handleAddComment = () => {
        const commentData = {
            postId: parseInt(postId, 10),
            name: user.name,
            email: user.email,
            body: newComment,
        };
        apiUtils.addItem("comments", commentData).then((newComment) => {
            if (newComment) {
                setComments((prev) => [...prev, newComment]);
                setNewComment(""); // מאפס את שדה ההוספה
            }
        });
    };

    const handleDeleteComment = (commentId) => {
        apiUtils.deleteItem("comments", commentId).then(() => {
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        });
    };

    const handleEditComment = (commentId, newContent) => {
        const updateData = { key: "body", content: newContent };
        apiUtils.updateItem(commentId, "comments", updateData).then((updatedComment) => {
            if (updatedComment) {
                setComments((prev) =>
                    prev.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment))
                );
                setEditingComment(null); // יוצא ממצב עריכה
            }
        });
    };

    return (
        <div className={styles.container}>
            <h2>Comments for Post {postId}</h2>

            {postDetails && (
                <div className={styles.postDetails}>
                    <h3>{postDetails.title}</h3>
                    <p>{postDetails.body}</p>
                </div>
            )}

            <ul className={styles.commentsList}>
                {comments.map((comment) => (
                    <li key={comment.id} className={styles.commentItem}>
                        <h4>{comment.name}</h4>
                        {editingComment === comment.id ? (
                            <textarea
                                value={comment.body}
                                onChange={(e) =>
                                    setComments((prev) =>
                                        prev.map((c) =>
                                            c.id === comment.id ? { ...c, body: e.target.value } : c
                                        )
                                    )
                                }
                            />
                        ) : (
                            <p>{comment.body}</p>
                        )}
                        <p>
                            <strong>{comment.email}</strong>
                        </p>
                        {comment.email === user.email && (
                            <div className={styles.commentActions}>
                                {editingComment === comment.id ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleEditComment(comment.id, comment.body)
                                            }
                                        >
                                            Save
                                        </button>
                                        <button onClick={() => setEditingComment(null)}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setEditingComment(comment.id)}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteComment(comment.id)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <div className={styles.addComment}>
                <h3>Add a Comment</h3>
                <textarea
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={handleAddComment}>Add Comment</button>
            </div>
        </div>
    );
}

export default Comments;
