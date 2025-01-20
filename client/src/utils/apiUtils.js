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
        return data;
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        throw error;
      });
  }

  deleteItem = (category, idForDelete) => {
    return fetch(`${this.baseUrl}/${category}/${idForDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete item with ID ${idForDelete}`);
        }
        console.log(`Item with ID ${idForDelete} deleted successfully`);

        return idForDelete;

      })
      .catch((error) => {
        console.error("Error deleting:", error);
        throw error
      });
  };

  updateItem = (idForUpdate, category, propToUpdate) => {
    return fetch(`${this.baseUrl}/${category}/${idForUpdate}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propToUpdate),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(`Item with ID ${idForUpdate} updated successfully`);
        return data;
      })
      .catch((error) => {
        console.error("Error updating:", error);
        throw error;
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
        throw error;
      });
  };
}



