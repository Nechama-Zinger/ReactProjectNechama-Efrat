// import React, { useState, useEffect } from "react";


export class ApiUtils {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
  }
  getItems = (category, condition = '') => {
    return fetch(`${this.baseUrl}/${category}?${condition}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        return data; // החזרת הנתונים
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        // throw error; // העברת השגיאה למי שקורא לפונקציה
      });
    }
      
  deleteItem = (category, idForDelete) => {
    fetch(`${this.baseUrl}/${category}/${idForDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete item with ID ${idForDelete}`);
        }
      })
      .then(() => {
       
        // setState((prevState) => prevState.filter((item) => item.id !== id));
        console.log(`Item with ID ${idForDelete} deleted successfully`);
        return idForDelete;
      })
      .catch((error) => {
        console.error("Error during deletion:", error);
      });
  };

  updateItem = (idForUpdate, category, propToUpdate) => {
    return fetch(`${this.baseUrl}/${category}/${idForUpdate}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [propToUpdate.key]: propToUpdate.content,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // מחזירים את ה-Promise מה-JSON
      })
      .then((data) => {
        console.log(`Item with ID ${idForUpdate} updated successfully`);
        return data; // מחזירים את ה-data (הפריט המעודכן)
      })
      .catch((error) => {
        console.error("Error updating:", error);
        throw error; // חשוב לזרוק את השגיאה מחדש כדי שה-catch יתפוס אותה
      });
  };
  

  addItem = (category, item) => {
    return fetch(`${this.baseUrl}/${category}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Item added:', data);
        return data;
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  };
}

// export const deleteItem = (id, url, setState) => {
//   fetch(`${url}${id}`, {
//     method: "DELETE",
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`Failed to delete item with ID ${id}`);
//       }
//     })
//     .then(() => {
//       setState((prevState) => prevState.filter((item) => item.id !== id));
//       console.log(`Item with ID ${id} deleted successfully`);
//     })
//     .catch((error) => {
//       console.error("Error during deletion:", error);
//     });
// };
///export const updateItem = (id, url, setState, value) => {

/* fetch(`${url}/${id}`, {
   method: 'PUT', // מציין את סוג הבקשה
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify(value), // הנתונים שברצונך לעדכן
 })
   .then((response) => {
     if (!response.ok) {
       throw new Error('Error updating the todo');
     }
     return response.json(); // מחזירים את התגובה
   })
   .then((data) => {
     setState((prevState) => prevState.filter((item) => item.id !== id));
     console.log('Todo updated:', data); // יכול לשדרג את הנתונים בסטייט כאן אם צריך
   })
   .catch((error) => {
     console.error('Error:', error);
   });
//};*/

// export default ApiUtils
// const updateItem = (id, url, setData, key, updatedContent) => {

//   fetch(`${url}${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       [key]: updatedContent,
//     }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       setData((prevContent) =>
//         prevContent.map((item) =>
//           item.id === id ? { ...item, data } : item
//         )
//       );
//     })
//     .catch((error) => {
//       console.error("Error updating:", error);
//     });
// };
