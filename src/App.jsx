import './styles/App.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {SnackbarProvider} from 'notistack'
import {Grow} from "@mui/material";
import WebAppUILayout from "./layouts/ui/WebAppUILayout.jsx";
import Home from "./components/auth/Home.jsx";
import {useEffect} from "react";
import {UniSewConsole} from "./components/ui/UniSewConsole.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'
import PlatformAdminLayout from "./layouts/admin/PlatformAdminLayout.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import GoogleResponse from "./components/auth/GoogleResponse.jsx";
import SignIn from "./components/auth/SignIn.jsx";
import DesignerDetail from "./components/school/DesignerDetail.jsx";
import SchoolProfile from "./components/school/SchoolProfile.jsx";
import DesignerProfile from "./components/designer/DesignerProfile.jsx";
import GarmentProfile from "./components/garment/GarmentProfile.jsx";
import RequestHistory from "./components/school/RequestHistory.jsx";
import DesignerList from "./components/school/DesignerList.jsx";
import SchoolOrder from "./components/school/SchoolOrder.jsx";
import SchoolLayout from "./layouts/school/SchoolLayout.jsx";
import RequestDetail from "./components/school/RequestDetail.jsx";
import RequestList from "./components/school/RequestList.jsx";
import AdminAccount from "./components/admin/AdminAccount.jsx";
import UploadZip from "./components/designer/UploadZip.jsx";
import DashboardUILayout from "./layouts/ui/DashboardUILayout.jsx";
import DesignerLayout from "./layouts/designer/DesignerLayout.jsx";
import DesignerDashboard from "./components/designer/DesignerDashboard.jsx";
import GarmentDashboard from "./components/garment/GarmentDashboard.jsx";
import GarmentLayout from "./layouts/garment/GarmenntLayout.jsx";
import DesignerRequest from "./components/designer/DesignerRequest.jsx";
import DesignerPackage from "./components/designer/DesignerPackage.jsx";
import FeedbackHistory from "./components/school/FeedbackHistory.jsx";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {viVN} from "@mui/x-date-pickers/locales"

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
        path: "/school/profile",
        element: (
            <WebAppUILayout title={"Profile"}>
                <SchoolProfile/>
            </WebAppUILayout>
        )
    },
    {
        path: "/request-list",
        element: (
            <WebAppUILayout title={"Request List"}>
                <RequestList/>
            </WebAppUILayout>
        )
    },
    {
        path: "/designer",
        element: <DesignerLayout/>,
        children: [
            {
                index: true,
                element: <Navigate to={'/designer/dashboard'}/>
            },
            {
                path: 'dashboard',
                element: <DesignerDashboard/>
            },
            {
                path: 'profile',
                element: <DesignerProfile/>
            },
            {
                path: 'requests',
                element: <DesignerRequest/>
            },
            {
                path: 'packages',
                element: <DesignerPackage/>
            },{
                path: 'detail',
                element: <RequestDetail/>
            }
        ]
    },
    {
        path: "/garment",
        element: <GarmentLayout/>,
        children: [
            {
                index: true,
                element: <Navigate to={'/garment/dashboard'}/>
            },
            {
                path: 'dashboard',
                element: <GarmentDashboard/>
            },
            {
                path: 'profile',
                element: <GarmentProfile/>
            }
        ]
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
            }, {
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
            },
            {
                path: 'feedback',
                element: <FeedbackHistory/>
            }
        ]
    },
    {
        path: "/school/designer/detail",
        element: (
            <WebAppUILayout title={"Profile"}>
                <DesignerDetail/>
            </WebAppUILayout>
        )
    },
    {
        path: "/signin",
        element: (
            <SignIn/>
        )
    },
    {
        path: "/upload",
        element: (
            <UploadZip/>
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
                element: <AdminDashboard/>
            },
            {
                path: 'account',
                element: <AdminAccount/>
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
        const disableDevToolsShortcuts = (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
                (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J
                (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C
                (e.metaKey && e.altKey && e.key === 'I') // Cmd+Option+I for Mac
            ) {
                e.preventDefault();
            }
        };

        const handleBlockInspect = (e) => {
            e.preventDefault()
        }

        window.addEventListener('contextmenu', handleBlockInspect);
        window.addEventListener('keydown', disableDevToolsShortcuts);

        return function cleanup() {
            window.removeEventListener('contextmenu', handleBlockInspect);
            window.removeEventListener('keydown', disableDevToolsShortcuts);
        };
    }, []);

    useEffect(() => {
        UniSewConsole()
    }, []);

    return (
        <SnackbarProvider
            maxSnack={4}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            autoHideDuration={1500}
            TransitionComponent={Grow}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
                <RouterProvider router={router}/>
            </LocalizationProvider>
        </SnackbarProvider>
    )
}

export default App
