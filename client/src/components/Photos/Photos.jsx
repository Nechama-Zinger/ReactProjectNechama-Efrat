// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Navbar from "../Navbar/Navbar";

// function Photos() {
//     const { albumId } = useParams(); // שימוש בפרמטרים מה-URL
//     const [photos, setPhotos] = useState([]);

//     useEffect(() => {
//         fetch(`http://localhost:3000/photos?albumId=${albumId}`)
//             .then((response) => response.json())
//             .then((data) => setPhotos(data.slice(0, 10))); // מגביל ל-10 תמונות
//     }, []);

//     return (
//         <>
//             <Navbar />
//             <div>
//                 <h2>Photos from Album {albumId}</h2>
//                 <ul>
//                     {photos.map((photo) => (
//                         <li key={photo.id}>
//                             <img src={photo.thumbnailUrl} alt={photo.title} />
//                             <p>{photo.title}</p>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </>
//     );
// }

// export default Photos;
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { ApiUtils } from "../../utils/apiUtils";


const LIMIT = 10; // מספר התמונות בכל טעינה

function Photos() {
 const { albumId } = useParams(); // שימוש בפרמטרים מה-URL
 const apiUtils = new ApiUtils();

  const [photos, setPhotos] = useState([]); // רשימת התמונות
  const [page, setPage] = useState(0); // מספר הדף הנוכחי (מתחיל מ-0)
  const [isLoading, setIsLoading] = useState(false); // מצב טעינה
  const [hasMore, setHasMore] = useState(true); // האם יש עוד תמונות לטעון

  // פונקציה לטעינת התמונות
  const fetchPhotos = ()=>{
    if (isLoading || !hasMore) return; // מניעת בקשות כפולות או טעינה מעבר למה שיש
    setIsLoading(true); // עדכון מצב הטעינה
    try {
        apiUtils.getItems(`photos`, `albumId=${albumId}&_start=${page * LIMIT}&_limit=${LIMIT}`).then((data)=>{
              if (data.length < LIMIT) {
                setHasMore(false); // אם אין עוד תמונות, נסמן שאין עוד נתונים לטעון
              }
              setPhotos((prevPhotos) => [...prevPhotos, ...data]); // הוספת התמונות החדשות למערך הקיים
        }
        ).then( setIsLoading(false) )
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

  return (
    <>
    <Navbar />
        <div>
      <h2>Photos</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ width: "200px", textAlign: "center" }}>
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <p>{photo.title}</p>
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

