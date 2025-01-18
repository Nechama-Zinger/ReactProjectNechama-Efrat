import React, { useState, useEffect,useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { ApiUtils } from "../../utils/apiUtils";
import { AuthContext } from "../AuthContext";
import Select from "react-select";

import styles from "./Albums.module.css";

function Albums() {
    const [albums, setAlbums] = useState([]);
    const apiUtils = new ApiUtils();
    const { user } = useContext(AuthContext); // משתמש פעיל
    const [newAlbum, setNewAlbum] = useState(""); // פוסט חדש
    const [searchValue, setSearchValue] = useState("");
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [filterBy, setFilterBy] = useState(""); // ברירת מחדל: מיון לפי כותרת
    const filterOptions = [
        { value: "", label: "none" },
        { value: "title", label: "Title" },
        { value: "id", label: "ID" },
    ];
    useEffect(() => {
        apiUtils.getItems("albums",`userId=${user.id}`).then((data) => setAlbums(data));
    }, []);
    const handleEditAlbum = (albumId, newContent) => {
        const updateData = {title:newContent };
        apiUtils.updateItem(albumId, "albums", updateData).then((updatedAlbum) => {
            if (updatedAlbum) {
                setAlbums((prev) =>
                    prev.map((album) => (album.id === updatedAlbum.id ? updatedAlbum : album))
                );
                setEditingAlbum(null);
            }
        });
    };
    const handleAddAlbum = () => {
        const albumData = {
            userId: user.id,
            title: newAlbum,
        };
        apiUtils.addItem("albums", albumData).then((newAlbum) => {
            if (newAlbum) setAlbums((prev) => [...prev, newAlbum]);
        });
        setNewAlbum("");
    };

    const handleDeleteAlbum = (albumId) => {
        apiUtils.deleteItem("albums", albumId)
            .then(() => {
                setAlbums((prev) => prev.filter((album) => album.id !== albumId));
            });
    };
    const conditionForFilteringBy = (album) => {
        if (searchValue != "" && filterBy != "") {
            if (filterBy === "title") {
                return album.title.includes(searchValue)
            } else if (filterBy === "id") {
                return album.id == searchValue;
            }

        } else {
            return true; // ללא מיון
        }


        // סינון מורכב: רק משימות שהושלמו וכותרת כוללת מילה מסוימת
        // return todo[filterBy].includes(searchValue) === searchValue && todo.title.includes("important");
    };
    
  
    return (
        <>
            <Navbar />
            <div>
                <h2>Albums</h2>
                <label>
                    Search:
                    <Select
                        options={filterOptions}
                        onChange={(e) => {
                            setFilterBy(e.value);
                            setSearchValue("");
                        }}
                        defaultValue={filterOptions.find((option) => option.value === filterBy)}
                    />
                    {filterBy && (
                        <input
                            placeholder={`Search by ${filterBy}`}
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ marginTop: "1rem" }}
                        />
                    )}
                </label>
                <div>
                    <h3>Add a Album</h3>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newAlbum}
                        onChange={(e) =>
                            setNewAlbum(e.target.value)
                        }
                    />
                    <button onClick={handleAddAlbum}>Add Album</button>
                </div>
                <ul>

                    {albums.filter(conditionForFilteringBy).map((album) => (
                        <li key={album.id}>
                            {editingAlbum === album.id ? (
                                <textarea
                                    value={album.title}
                                    onChange={(e) =>
                                        setAlbums((prev) =>
                                            prev.map((c) =>
                                                c.id === album.id ? { ...c, title: e.target.value } : c
                                            )
                                        )
                                    }
                                />
                            ) : (
                                <Link to={`${album.id}/photos`}state={album.title}>{album.title}</Link>
                            )}
                            <div className={styles.AlbumActions}>
                                {editingAlbum === album.id ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleEditAlbum(album.id, album.title)
                                            }
                                        >
                                            Save
                                        </button>
                                        <button onClick={() => setEditingAlbum(null)}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setEditingAlbum(album.id)}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteAlbum(album.id)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Albums;
