import './styles/App.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {SnackbarProvider} from 'notistack'
import {Grow} from "@mui/material";
import WebAppUILayout from "./layouts/ui/WebAppUILayout.jsx";
import Home from "./components/auth/Home.jsx";
import {useEffect} from "react";
import UniSewConsole from "./components/ui/UniSewConsole.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'
import PlatformAdminLayout from "./layouts/platform_admin/PlatformAdminLayout.jsx";
import PlatformAdminDashboard from "./components/platform_admin/PlatformAdminDashboard.jsx";
import Accounts from "./components/platform_admin/Accounts.jsx";
import GoogleResponse from "./components/auth/GoogleResponse.jsx";
import SignIn from "./components/auth/SignIn.jsx";
import DesignerDetail from "./components/school/DesignerDetail.jsx";
import SchoolProfile from "./components/school/SchoolProfile.jsx";
import DesignerProfile from "./components/designer/Profile.jsx";
import GarmentProfile from "./components/garment/Profile.jsx";
import RequestHistory from "./components/school/RequestHistory.jsx";
import DesignerList from "./components/school/DesignerList.jsx";
import SchoolOrder from "./components/school/SchoolOrder.jsx";
import SchoolLayout from "./layouts/school/SchoolLayout.jsx";
import RequestDetail from "./components/school/RequestDetail.jsx";

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
        path: "/school-profile",
        element: (
            <WebAppUILayout title={"Profile"}>
                <SchoolProfile/>
            </WebAppUILayout>
        )
    },
    {
        path: "/designer-profile",
        element: (
            <WebAppUILayout title={"Profile"}>
                <DesignerProfile/>
            </WebAppUILayout>
        )
    },
    {
        path: "/garment-profile",
        element: (
            <WebAppUILayout title={"Profile"}>
                <GarmentProfile/>
            </WebAppUILayout>
        )
    },
    {
        path: "/school",
        element: (
            <WebAppUILayout title={"School"}>
                <SchoolLayout/>
            </WebAppUILayout>
        ),
        children: [
            {
                index: true,
                element: <Navigate to={"/school/design"}/>
            },{
                path: 'design',
                element: <RequestHistory/>
            },
            {
                path: 'detail',
                element: <RequestDetail/>
            },
            {
                path: 'order',
                element: <SchoolOrder/>
            }
        ]
    },
    {
        path: "/designer-profile",
        element: (
            <WebAppUILayout title={"Profile"}>
                <DesignerDetail/>
            </WebAppUILayout>
        )
    },
    {
        path: "/sign-in",
        element: (
            <SignIn/>
        )
    },
    {
        path: "/google/result",
        element: (
            <GoogleResponse/>
        )
    },
    {
        path: "/designer/list",
        element: (
            <DesignerList/>
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
            },
            {
                path: 'accounts',
                element: <Accounts/>
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
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            autoHideDuration={1500}
            TransitionComponent={Grow}
            // style={{marginTop: "7vh"}}
        >
            <RouterProvider router={router}/>
        </SnackbarProvider>
    )
}

export default App
