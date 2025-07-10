import { createBrowserRouter } from "react-router-dom";
import Login from "./Components/Login";
import Todo from "./Components/Todo_list";
import AddTodo from "./Components/Add_todo";
import App from "./App";

const router = createBrowserRouter([
    
    { path: '', element: <App/> },
    { path: 'login', element: <Login/> },
    { path: 'todo_list', element: <Todo/> },
    {path: 'add', element: <AddTodo/> },
]);

export default router;