import { useContext, useState, useEffect } from 'react';
import { AuthContext } from "./AuthContext";
import { ApiUtils } from "../utils/apiUtils";
import Navbar from "./Navbar";
import Select from "react-select";
import styles from '../styles/Todos.module.css';

function Todos() {
    const { user } = useContext(AuthContext);
    const [todos, setTodos] = useState([]);
    const [updatedTask, setUpdatedTask] = useState('');
    const [searchValue, setSearchValue] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [isEditing, setIsEditing] = useState(null);
    const [filterBy, setFilterBy] = useState("");
    const [newTask, setNewTask] = useState({
        userId: user.id,
        title: '',
        completed: false
    });
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
                        todo.id == idForUpdate ? updatedItem : todo
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
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id == idForUpdate ? updatedItem : todo
                    )
                );
                setIsEditing(null);
            })
            .catch((error) => {
                console.error("Error updating item:", error);
            });
    };

    const handleDelete = (idForDelete) => {
        apiUtils.deleteItem(`todos`, idForDelete);
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== idForDelete));
    };

    const handleAddition = () => {
        if (newTask.title != "") {
            apiUtils.addItem(`todos`, newTask)
                .then((newItem) => {
                    setTodos((prevTodos) => [...prevTodos, newItem]);
                    setNewTask({ ...newTask, title: ''})
                })
                .catch((error) => {
                    console.error("Error adding item:", error);
                });
        }
    };

    const conditionForFilteringBy = (todo) => {
        if (searchValue !== "" && filterBy !== "") {
            if (filterBy == "title") {
                return todo.title.includes(searchValue);
            } else if (filterBy == "id") {
                return todo.id == searchValue;
            } else if (filterBy == "completed") {
                return todo.completed == (searchValue == "true");
            }
        } else {
            return true;
        }
    };

    const conditionForSortingBy = (a, b) => {
        if (sortBy == "title") {
            return a.title.localeCompare(b.title);
        } else if (sortBy == "id") {
            return a.id - b.id;
        } else if (sortBy == "completed") {
            return b.completed - a.completed;
        } else {
            return 0;
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 style={{ marginLeft: "1rem" }}>Todos</h2>
                    <div className={styles.sortFilter}>
                        <label>
                            Sort:
                            <Select
                                options={sortOptions}
                                onChange={(e) => setSortBy(e.value)}
                                defaultValue={sortOptions.find((option) => option.value == sortBy)}
                            />
                        </label>
                        <label>
                            Search:
                            <Select
                                options={filterOptions}
                                onChange={(e) => {
                                    setFilterBy(e.value);
                                    setSearchValue("");
                                }}
                                defaultValue={filterOptions.find((option) => option.value == filterBy)}
                            />
                        </label>
                    </div>
                    {filterBy == "completed" ? (
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="completedFilter"
                                    value="true"
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    checked={searchValue == "true"}
                                />
                                Completed
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="completedFilter"
                                    value="false"
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    checked={searchValue == "false"} />
                                Not Completed
                            </label>
                        </div>
                    ) : (
                        (
                            <input
                                placeholder={`Search by ${filterBy}`}
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        )
                    )}
                </div>


                <div className={styles.addSection}>
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Add a new task"
                    />
                    <button onClick={handleAddition}>Add Task</button>
                </div>
                <ul className={styles.list}>
                    {todos
                        .filter(conditionForFilteringBy)
                        .sort(conditionForSortingBy)
                        .map((todo) => (
                            <li key={todo.id} className={styles.item}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={(e) => handleCheckboxChange(e, todo.id)}
                                />
                                <strong>ID:</strong> {todo.id} |
                                {isEditing == todo.id ? (
                                    <input
                                        type="text"
                                        value={todo.title}
                                        onChange={(e) => setUpdatedTask(e.target.value)}
                                    />
                                ) : (
                                    <span>{todo.title}</span>
                                )}
                                <div>
                                    {isEditing == todo.id ? (
                                        <>
                                            <button onClick={() => handleUpdate(todo.id)}>Save</button>
                                            <button onClick={() => setIsEditing(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setIsEditing(todo.id)}>Edit</button>
                                            <button onClick={() => handleDelete(todo.id)}>Delete</button>
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

export default Todos;
