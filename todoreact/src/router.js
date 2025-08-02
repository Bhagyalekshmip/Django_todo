import { createBrowserRouter } from "react-router-dom";
import Login from "./Components/Login";
import Todo from "./Components/Todo_list";
import AddTodo from "./Components/Add_todo";
import ForgetPassword from "./Components/ForgetPassword";
import App from "./App";
import Layout from "./Layout";
import ResetPassword from "./Components/ResetPassword";

const router = createBrowserRouter([
  {
   path: '/',
    element: <Layout />,
    children: [
      { path: "", element: <App /> },
      { path: "login", element: <Login /> },
      { path: "todo_list", element: <Todo /> },
      { path: "add", element: <AddTodo /> },
      { path: "fgpassword", element: <ForgetPassword /> },
      { path: "resetpassword", element: <ResetPassword /> },
    ],
  }, // Login outside layout (no navbar)
]);
export default router;