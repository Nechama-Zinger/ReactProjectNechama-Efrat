import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../Albums/Albums.module.css";

function Album({ album, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(album.title);

    const handleSave = () => {
        onUpdate(album.id, editedTitle);
        setIsEditing(false);
    };

    return (
        <li>
            {isEditing ? (
                <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                />
            ) : (
                <Link to={`${album.id}/photos`} state={album.title}>
                    {album.title}
                </Link>
            )}
            <div className={styles.AlbumActions}>
                {isEditing ? (
                    <>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={() => onDelete(album.id)}>Delete</button>
                    </>
                )}
            </div>
        </li>
    );
}

export default Album;
