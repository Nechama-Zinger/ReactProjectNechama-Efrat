import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import { ApiUtils } from "../utils/apiUtils";
import { AuthContext } from "./AuthContext";
import Select from "react-select";
import Album from "./Album.jsx";
import styles from "../styles/Albums.module.css";

function Albums() {
    const [albums, setAlbums] = useState([]);
    const apiUtils = new ApiUtils();
    const { user } = useContext(AuthContext);
    const [newAlbum, setNewAlbum] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [filterBy, setFilterBy] = useState("");
    const filterOptions = [
        { value: "", label: "none" },
        { value: "title", label: "Title" },
        { value: "id", label: "ID" },
    ];

    useEffect(() => {
        apiUtils.getItems("albums", `userId=${user.id}`).then((data) => setAlbums(data));
    }, []);

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

    const handleUpdateAlbum = (albumId, newTitle) => {
        const updateData = { title: newTitle };
        apiUtils.updateItem(albumId, "albums", updateData).then((updatedAlbum) => {
            if (updatedAlbum) {
                setAlbums((prev) =>
                    prev.map((album) => (album.id === updatedAlbum.id ? updatedAlbum : album))
                );
            }
        });
    };

    const handleDeleteAlbum = (albumId) => {
        apiUtils.deleteItem("albums", albumId).then(() => {
            setAlbums((prev) => prev.filter((album) => album.id !== albumId));
        });
    };

    const conditionForFilteringBy = (album) => {
        if (searchValue !== "" && filterBy !== "") {
            if (filterBy === "title") return album.title.includes(searchValue);
            if (filterBy === "id") return album.id == searchValue;
        }
        return true;
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.searchWrapper}>
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
                            <input
                                placeholder={`Search by ${filterBy}`}
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                    </label>
                </div>

                <div className={styles.addAlbumWrapper}>
                    <h3>Add an Album:</h3>
                    <input
                        type="text"
                        placeholder="Album Title"
                        value={newAlbum}
                        onChange={(e) => setNewAlbum(e.target.value)}
                    />
                    <button className={styles.addAlbumButton} onClick={handleAddAlbum}>
                        Add Album
                    </button>
                </div>

                <ul>
                    {albums.filter(conditionForFilteringBy).map((album) => (
                        <Album
                            key={album.id}
                            album={album}
                            onUpdate={handleUpdateAlbum}
                            onDelete={handleDeleteAlbum}
                        />
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Albums;
