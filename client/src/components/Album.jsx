import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Album.module.css";

function Album({ album, handleUpdateAlbum, handleDeleteAlbum }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(album.title);

    const handleSave = () => {
        handleUpdateAlbum(album.id, editedTitle);
        setIsEditing(false);
    };

    return (
        <li className={styles.albumItem}>
            {isEditing ? (
                <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                />
            ) : (
                <Link to={`${album.id}/photos`} state={album.title} className={styles.albumLink}>
                    {album.title}
                </Link>
            )}
            <div className={styles.albumActions}>
                {isEditing ? (
                    <>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button className={styles.editButton} onClick={() => setIsEditing(true)}> Edit</button>
                        <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
                    </>
                )}
            </div>
        </li>
    );
}

export default Album;
