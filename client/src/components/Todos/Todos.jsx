import { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../AuthContext";
import { ApiUtils } from "../../utils/apiUtils";
import Navbar from "../Navbar/Navbar";
import Select from "react-select";
// import { Autocomplete, TextField, Checkbox } from "@mui/material";


function Todos() {
    const { user } = useContext(AuthContext);
    const [todos, setTodos] = useState([]);
    const [updatedTask, setUpdatedTask] = useState('')
    const [searchValue, setSearchValue] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [isEditing, setIsEditing] = useState(null); // לא לערוך אף משימה בהתחלה
    const [filterBy, setFilterBy] = useState(""); // ברירת מחדל: מיון לפי כותרת
    const [newTask, setNewTask] = useState({
        userId: user.id,
        title: '',
        completed: false
    })
    const apiUtils = new ApiUtils();


    const sortOptions = [
        { value: "title", label: "Title" },
        { value: "id", label: "ID" },
        { value: "completed", label: "Completed" },
    ];

    const filterOptions = [
        { value: "", label: "none" },
        { value: "title", label: "Title" },
        { value: "id", label: "ID" },
        { value: "completed", label: "Completed" },
    ];

    useEffect(() => {
        apiUtils.getItems(`todos`, `userId=${user.id}`).then(todos => {
            setTodos(todos);
        });
    }, []);

    const handleCheckboxChange = (e, idForUpdate) => {
        apiUtils.updateItem(idForUpdate, `todos`, { completed: e.target.checked })
            .then((updatedItem) => {
                setTodos((prevContent) =>
                    prevContent.map((todo) =>
                        todo.id === idForUpdate ? updatedItem : todo
                    )
                );
            })
            .catch((error) => {
                console.error("Error updating item:", error);
                alert("Failed to update item. Please try again.");
            });
    };

    const handleUpdate = (idForUpdate) => {
        apiUtils.updateItem(idForUpdate, `todos`, { title: updatedTask })
            .then((updatedItem) => {
                console.log(updatedItem);
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === idForUpdate ? updatedItem : todo
                    )
                );
                setIsEditing(null)
            })
            .catch((error) => {
                console.error("Error updating item:", error);
            });
    };


    const handleDelete = (idForDelete) => {
        apiUtils.deleteItem(`todos`, idForDelete)
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== idForDelete));
        // .catch((error) => {
        //     console.error("Error deleting item:", error);
        // alert("Failed to delete item. Please try again.");
        // });
    };

    const handleAddition = () => {
        apiUtils.addItem(`todos`, newTask)
            .then((newItem) => { setTodos((prevTodos) => [...prevTodos, newItem]); })
            .catch((error) => {
                console.error("Error adding item:", error);
                // alert("Failed to delete item. Please try again.");
            });

    };

    const conditionForFilteringBy = (todo) => {
        if (searchValue != "" && filterBy != "") {
            if (filterBy === "title") {
                return todo.title.includes(searchValue)
            } else if (filterBy === "id") {
                return todo.id == searchValue;
            } else if (filterBy === "completed") {
                return todo.completed == searchValue;
            }

        } else {
            return true; // ללא מיון
        }


        // סינון מורכב: רק משימות שהושלמו וכותרת כוללת מילה מסוימת
        // return todo[filterBy].includes(searchValue) === searchValue && todo.title.includes("important");
    };

    const conditionForSortingBy = (a, b) => {
        if (sortBy === "title") {
            return a.title.localeCompare(b.title);
        } else if (sortBy === "id") {
            return a.id - b.id;
        } else if (sortBy === "completed") {
            return b.completed - a.completed;
        } else {
            return 0; // ללא מיון
        }
    };

    return (
        <>
            <Navbar />
            <div>
                <label>
                    Sort:
                    <Select
                        options={sortOptions}
                        onChange={(e) => setSortBy(e.value)}
                        defaultValue={sortOptions.find((option) => option.value === sortBy)}
                    />
                </label>

                <div>
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
                    </label>

                    {filterBy && (
                        <input
                            placeholder={`Search by ${filterBy}`}
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ marginTop: "1rem" }}
                        />
                    )}
                </div>
            </div>

            <div>
                <h2>Todos</h2>
                <ul>
                    {todos
                        .filter(conditionForFilteringBy)
                        .sort(conditionForSortingBy)
                        .map((todo) => (
                            <li key={todo.id}>
                                {todo.id}:
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={(e) => handleCheckboxChange(e, todo.id)}
                                />
                                {isEditing === todo.id ? (
                                    // <input
                                    //     type="text"
                                    //     value={updatedTask}
                                    //     onChange={(e) => setUpdatedTask(e.target.value)}
                                    //     onBlur={() => handleUpdate(todo.id)} // יכול להסתיים בשדה
                                    //     autoFocus
                                    // />
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Update title"
                                            defaultValue={todo.title}
                                            onChange={(e) => setUpdatedTask(e.target.value)}
                                        />
                                    </>
                                ) : (
                                    <span>{todo.title}</span>
                                )}
                                <div>
                                    {isEditing === todo.id ? (
                                        <>
                                            <button onClick={() => handleUpdate(todo.id)}>
                                                Save
                                            </button>
                                            <button onClick={() => setIsEditing(null)}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setIsEditing(todo.id)}>
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(todo.id)}>
                                                🗑️
                                            </button>
                                        </>
                                    )}
                                </div>
                                {/* <button onClick={() => handleDelete(todo.id)}>🗑️</button>
                                <button onClick={() => setIsEditing(todo.id)}>✏️</button> */}
                            </li>
                        ))}
                </ul>

                <button onClick={handleAddition}>➕</button>
                <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                />
            </div>
        </>
    );

}

export default Todos;
