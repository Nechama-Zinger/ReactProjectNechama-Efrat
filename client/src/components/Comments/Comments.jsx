import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Comments() {
  const { userId, postId } = useParams(); // משתמשים בפרמטרים userId ו-postId מה-URL
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // טוענים את התגובות לפוסט מה-API
    fetch(`http://localhost:3000/comments?postId=${postId}`)
      .then((response) => response.json())
      .then((data) => setComments(data));
  }, [postId]);

  return (
    <div>
      <h2>Comments for Post {postId}</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <h4>{comment.name}</h4>
            <p>{comment.body}</p>
            <p><strong>{comment.email}</strong></p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Comments;
