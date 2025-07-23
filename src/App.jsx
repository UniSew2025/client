import './styles/App.css'
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
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
import DesignerDetail from "./components/school/design/DesignerDetail.jsx";
import SchoolProfile from "./components/school/profile/SchoolProfile.jsx";
import DesignerProfile from "./components/designer/DesignerProfile.jsx";
import GarmentProfile from "./components/garment/GarmentProfile.jsx";
import RequestHistory from "./components/school/design/RequestHistory.jsx";
import DesignerList from "./components/school/design/DesignerList.jsx";
import SchoolOrder from "./components/school/order/SchoolOrder.jsx";
import SchoolLayout from "./layouts/school/SchoolLayout.jsx";
import RequestDetail from "./components/school/design/RequestDetail.jsx";
import RequestList from "./components/school/design/RequestList.jsx";
import AdminAccount from "./components/admin/AdminAccount.jsx";
import UploadZip from "./components/designer/UploadZip.jsx";
import DesignerLayout from "./layouts/designer/DesignerLayout.jsx";
import DesignerDashboard from "./components/designer/DesignerDashboard.jsx";
import GarmentDashboard from "./components/garment/GarmentDashboard.jsx";
import GarmentLayout from "./layouts/garment/GarmenntLayout.jsx";
import DesignerRequest from "./components/designer/DesignerRequest.jsx";
import DesignerPackage from "./components/designer/DesignerPackage.jsx";
import FeedbackHistory from "./components/school/feedback/FeedbackHistory.jsx";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {viVN} from "@mui/x-date-pickers/locales"
import GarmentList from "./components/school/order/GarmentList.jsx";
import OrderFillForm from "./components/school/order/OrderFillForm.jsx";
import AdminTransaction from "./components/admin/AdminTransaction.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <WebAppUILayout/>
        ),
        children: [
            {
                index: true,
                element: <Navigate to={'/home'}/>
            },
            {
                path: 'home',
                element: <Home/>
            },
            {
                path: "school/profile",
                element: <SchoolProfile/>
            },
            {
                path: "request-list",
                element: <RequestList/>
            },
            {
                path: "designer/list",
                element: <DesignerList/>
            },
            {
                path: "designer/detail",
                element: <DesignerDetail/>
            },
            {
                path: "garment/list",
                element: <GarmentList/>
            },
            {
                path: "garment/detail",
                element: <DesignerDetail/>
            },
            {
                path: "school/d",
                element: <SchoolLayout/>,
                children: [
                    {
                        index: true,
                        element: <Navigate to={"/school/d/design"}/>
                    },
                    {
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
                        path: 'order/form',
                        element: <OrderFillForm/>
                    },
                    {
                        path: 'feedback',
                        element: <FeedbackHistory/>
                    }
                ]
            },
        ]
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
            }, {
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
        path: "/signin",
        element: <SignIn/>
    },
    {
        path: "/upload",
        element: <UploadZip/>
    },
    {
        path: "/google/result",
        element: <GoogleResponse/>
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
            },
            {
                path: 'transaction',
                element: <AdminTransaction/>
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to={"/home"}/>
    }
])

function App() {

    // useEffect(() => {
    //     const disableDevToolsShortcuts = (e) => {
    //         if (
    //             e.key === 'F12' ||
    //             (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
    //             (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J
    //             (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C
    //             (e.metaKey && e.altKey && e.key === 'I') // Cmd+Option+I for Mac
    //         ) {
    //             e.preventDefault();
    //         }
    //     };
    //
    //     const handleBlockInspect = (e) => {
    //         e.preventDefault()
    //     }
    //
    //     window.addEventListener('contextmenu', handleBlockInspect);
    //     window.addEventListener('keydown', disableDevToolsShortcuts);
    //
    //     return function cleanup() {
    //         window.removeEventListener('contextmenu', handleBlockInspect);
    //         window.removeEventListener('keydown', disableDevToolsShortcuts);
    //     };
    // }, []);

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
            <LocalizationProvider dateAdapter={AdapterDayjs}
                                  localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
                <RouterProvider router={router}/>
            </LocalizationProvider>
        </SnackbarProvider>
    )
}

export default App
