import {Dashboard, ManageAccounts, Trolley, RequestQuote} from '@mui/icons-material';
import DashboardUILayout from "../ui/DashboardUILayout.jsx";

function RenderLayout() {

    const navigation = [
        {
            kind: 'header',
            title: 'Dashboard',
        },
        {
            segment: 'designer/dashboard',
            title: 'Dashboard',
            icon: <Dashboard/>
        },
        {
            kind: 'header',
            title: 'Account Settings',
        },
        {
            segment: 'designer/profile',
            title: 'Profile',
            icon: <ManageAccounts/>
        },
        {
            segment: 'designer/packages',
            title: 'Packages',
            icon: <Trolley/>
        },
        {
            kind: 'header',
            title: 'Design Management',
        },
        {
            segment: 'designer/requests',
            title: 'Design Requests',
            icon: <RequestQuote/>
        },
    ]


    return (
        <DashboardUILayout
            navigation={navigation}
            title={'Dashboard'}
            header={'Designer Dashboard'}
        />
    )

}

export default function DesignerLayout() {
    return (
        <RenderLayout/>
    )
}