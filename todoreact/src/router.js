import { createBrowserRouter } from "react-router-dom";
import Login from "./Components/Login";
import Todo from "./Components/Todo_list";
import AddTodo from "./Components/Add_todo";
import App from "./App";
import Layout from "./Layout";

const router = createBrowserRouter([
  {
   path: '/',
    element: <Layout />,
    children: [
      { path: "", element: <App /> },
      { path: "login", element: <Login /> },
      { path: "todo_list", element: <Todo /> },
      { path: "add", element: <AddTodo /> },
    ],
  }, // Login outside layout (no navbar)
]);
export default router;