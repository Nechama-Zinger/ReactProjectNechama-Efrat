import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { ApiUtils } from "../utils/apiUtils";
import styles from "../styles/Comments.module.css";
import Navbar from "./Navbar";

function Comments() {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ title: "", body: "" });
  const [editingComment, setEditingComment] = useState(null);
  const apiUtils = new ApiUtils();
  const location = useLocation();
  useEffect(() => {
    apiUtils.getItems("comments", `postId=${postId}`).then((data) => {
      setComments(data || []);
    });
  }, [postId]);

  const handleAddComment = () => {
    const commentData = {
      postId: parseInt(postId, 10),
      email: user.email,
      name: newComment.title,
      body: newComment.body,
    };
    apiUtils.addItem("comments", commentData).then((newComment) => {
      if (newComment) {
        setComments((prev) => [...prev, newComment]);
        setNewComment({ title: "", body: "" });
      }
    });
  };

  const handleDeleteComment = (commentId) => {
    apiUtils.deleteItem("comments", commentId).then(() => {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    });
  };

  const handleEditComment = (commentId, newContent) => {
    const updateData = { body: newContent };
    apiUtils.updateItem(commentId, "comments", updateData).then((updatedComment) => {
      if (updatedComment) {
        setComments((prev) =>
          prev.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment))
        );
        setEditingComment(null);
      }
    });
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h2>Comments for Post:</h2>
        <div>
         <h2 style={{color:'blue'}}>{location.state.title}</h2> 
         <p>{location.state.body}</p>
        </div>
        <ul className={styles.commentsList}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.commentItem}>
              {editingComment === comment.id ? (
                <><input
                  value={comment.name}
                  onChange={(e) =>
                    setComments((prev) =>
                      prev.map((c) =>
                        c.id === comment.id ? { ...c, name: e.target.value } : c
                      )
                    )
                  }
                />
                <br/>
                  <input
                    value={comment.body}
                    onChange={(e) =>
                      setComments((prev) =>
                        prev.map((c) =>
                          c.id === comment.id ? { ...c, body: e.target.value } : c
                        )
                      )
                    }
                  />
                </>


              ) : (
                <>
                  <h4>{comment.name}</h4>
                  <p>{comment.body}</p>
                </>
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
            placeholder="Write your title..."
            value={newComment.title}
            onChange={(e) => setNewComment((prev) => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            placeholder="Write your comment..."
            value={newComment.body}
            onChange={(e) => setNewComment((prev) => ({ ...prev, body: e.target.value }))} />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      </div>
    </>

  );
}

export default Comments;
