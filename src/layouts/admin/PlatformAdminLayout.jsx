import {Dashboard, ManageAccounts, Paid} from '@mui/icons-material';
import DashboardUILayout from "../ui/DashboardUILayout.jsx";
import AdminTransaction from "../../components/admin/AdminTransaction.jsx";

function RenderLayout() {

    const navigation = [
        {
            kind: 'header',
            title: 'Dashboard',
        },
        {
            segment: 'admin/dashboard',
            title: 'Dashboard',
            icon: <Dashboard/>
        },
        {
            kind: 'header',
            title: 'Account Management',
        },
        {
            segment: 'admin/account',
            title: 'Accounts',
            icon: <ManageAccounts/>
        },
        {
            kind: 'header',
            title: 'Transaction Management',
        },
        {
            segment: 'admin/transaction',
            title: 'Transaction history',
            icon: <Paid/>
        },
    ]


    return (
        <DashboardUILayout
            navigation={navigation}
            title={'Dashboard'}
            header={'Admin Dashboard'}
        />
    )

}

export default function PlatformAdminLayout() {
    return (
        <RenderLayout/>
    )
}