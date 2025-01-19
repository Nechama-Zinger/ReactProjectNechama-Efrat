
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { ApiUtils } from "../../utils/apiUtils";
import styles from "./Photos.module.css"

const LIMIT = 10; 

function Photos() {
  const { albumId } = useParams(); 
  const apiUtils = new ApiUtils();
  const [newPhoto, setNewPhoto] = useState({ title: "", url: "" }) 
  const [photos, setPhotos] = useState([]); 
  const [page, setPage] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // האם יש עוד תמונות לטעון
  const [editingPhoto, setEditingPhoto] = useState(null);
  const location = useLocation()|| {};
  const fetchPhotos = () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true); // עדכון מצב הטעינה
    try {
      apiUtils.getItems(`photos`, `albumId=${albumId}&_start=${page * LIMIT}&_limit=${LIMIT}`).then((data) => {
        if (data.length < LIMIT) {
          setHasMore(false); // אם אין עוד תמונות, נסמן שאין עוד נתונים לטעון
        }
        setPhotos((prevPhotos) => [...prevPhotos, ...data]); // הוספת התמונות החדשות למערך הקיים
      }
      ).then(setIsLoading(false))
    } catch (error) {
      console.error("Error fetching photos:", error);

    };
  };
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 200
    ) {
      setPage((prevPage) => prevPage + 1); // הגדל את מספר הדף
    }
  };

  // טעינה ראשונית והוספת מאזין לגלילה
  useEffect(() => {
    fetchPhotos(); // טעינה ראשונית
  }, [page]); // בכל פעם שהדף משתנה, נטעין את התמונות המתאימות

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // מאזין לגלילה
    return () => {
      window.removeEventListener("scroll", handleScroll); // ניקוי מאזין בגלילה
    };
  }, []);

  const handleEditPhoto = (photoId, newContent) => {
    const updateData = { title: newContent };
    apiUtils.updateItem(photoId, "photos", updateData).then((updatedPhoto) => {
      if (updatedPhoto) {
        setPhotos((prev) =>
          prev.map((photo) => (photo.id === updatedPhoto.id ? updatedPhoto : photo))
        );
        setEditingPhoto(null);
      }
    });
  };
  const handleDeletePhoto = (photoId) => {
    apiUtils.deleteItem("photos", photoId)
      .then(() => {
        setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
      });
  };
  const handleAddPhoto = () => {
    const photoData = {
      albumId: albumId,
      title: newPhoto.title,
      url: newPhoto.url,
      thumbnailUrl: newPhoto.url
    };
    apiUtils.addItem("photos", photoData).then((newPhoto) => {
      if (newPhoto) setPhotos((prev) => [...prev, newPhoto]);
    });
    setNewPhoto({ title: "", body: "" });
  };

  return (
    <>
      <Navbar />
      <div>
        <h3>Add a Photo</h3>
        <input
          type="text"
          placeholder="Title"
          value={newPhoto.title}
          onChange={(e) =>
            setNewPhoto((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Url"
          value={newPhoto.url}
          onChange={(e) =>
            setNewPhoto((prev) => ({ ...prev, url: e.target.value }))
          }
        />
        <button onClick={handleAddPhoto}>Add Photo</button>
      </div>
      <div>
        <h2>{location.state}</h2>
        <h3>Photos</h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {photos.map((photo) => (
            // key={`photo.${photo.id}`}
            <div  style={{ width: "200px", textAlign: "center" }}>
              <img
                //  src={photo.thumbnailUrl}
                src={'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Anemone-coronaria-2016-Zachi-Evenor.jpg/800px-Anemone-coronaria-2016-Zachi-Evenor.jpg'}
                alt={photo.title}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              {editingPhoto === photo.id ? (
                <input
                  value={photo.title}
                  onChange={(e) =>
                    setPhotos((prev) =>
                      prev.map((c) =>
                        c.id === photo.id ? { ...c, title: e.target.value } : c
                      )
                    )
                  }
                />
              ) : (
                <p>{photo.title}</p>
              )}
              <div className={styles.photoActions}>
                {editingPhoto === photo.id ? (
                  <>
                    <button
                      onClick={() =>
                        handleEditPhoto(photo.id, photo.title)
                      }
                    >
                      Save
                    </button>
                    <button onClick={() => setEditingPhoto(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingPhoto(photo.id)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeletePhoto(photo.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {isLoading && <p>Loading...</p>}
        {!hasMore && <p>No more photos to load</p>}
      </div>
    </>

  );
}

export default Photos;

