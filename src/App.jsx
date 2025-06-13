import './styles/App.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {SnackbarProvider} from 'notistack'
import {Grow} from "@mui/material";
import WebAppUILayout from "./layouts/ui/WebAppUILayout.jsx";
import Home from "./components/auth/Home.jsx";
import SignIn from "./components/auth/SignIn.jsx";
import {useEffect} from "react";
import UniSewConsole from "./components/ui/UniSewConsole.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'
import PlatformAdminLayout from "./layouts/platform_admin/PlatformAdminLayout.jsx";
import PlatformAdminDashboard from "./components/platform_admin/PlatformAdminDashboard.jsx";
import GoogleResponse from "./components/auth/GoogleResponse.jsx";

const router = createBrowserRouter([
    {
        path: "/home",
        element: (
            <WebAppUILayout title={"Home"}>
                <Home/>
            </WebAppUILayout>
        )
    },
    {
        path: "/sign-in",
        element: (
            <WebAppUILayout title={"Sign in"}>
                <SignIn/>
            </WebAppUILayout>
        )
    },
    {
        path: "/google/result",
        element: (
            <GoogleResponse/>
        )
    },
    {
        path: "/admin",
        element: <PlatformAdminLayout/>,
        children: [
            {
                index: true,
                element: <Navigate to={'/admin/dashboard'}/>
            },
            {
                path: 'dashboard',
                element: <PlatformAdminDashboard/>
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to={"/home"}/>
    }
])

function App() {

    useEffect(() => {
        UniSewConsole()
    }, []);

    return (
        <SnackbarProvider
            maxSnack={4}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            autoHideDuration={1500}
            TransitionComponent={Grow}
        >
            <RouterProvider router={router}/>
        </SnackbarProvider>
    )
}

export default App
