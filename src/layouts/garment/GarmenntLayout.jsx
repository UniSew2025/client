import {Dashboard, ManageAccounts} from '@mui/icons-material';
import DashboardUILayout from "../ui/DashboardUILayout.jsx";

function RenderLayout() {

    const navigation = [
        {
            kind: 'header',
            title: 'Dashboard',
        },
        {
            segment: 'garment/dashboard',
            title: 'Dashboard',
            icon: <Dashboard/>
        },
        {
            kind: 'header',
            title: 'Account Settings',
        },
        {
            segment: 'garment/profile',
            title: 'Profile',
            icon: <ManageAccounts/>
        },
    ]


    return (
        <DashboardUILayout
            navigation={navigation}
            title={'Dashboard'}
            header={'Garment Dashboard'}
        />
    )

}

export default function GarmentLayout() {
    return (
        <RenderLayout/>
    )
}