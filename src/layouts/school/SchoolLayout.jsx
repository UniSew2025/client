import DashboardWebUILayout from "../ui/DashboardWebUILayout.jsx";

const navigation = [
    {
        type: "caption",
        label: "My Design",
    },
    {
        type: "sub",
        label: "Design History",
        segment: "/school/d/design",
    },
    {
        type: "caption",
        label: "My Orders",
    },
    {
        type: "sub",
        label: "Order History",
        segment: "/school/d/order"
    },
    {
        type: "sub",
        label: "Quotation",
        segment: "/school/d/quotation"
    },
    {
        type: "caption",
        label: "Feedback",
    },
    {
        type: "sub",
        label: "Feedback history",
        segment: "/school/d/feedback"
    }
]

function RenderPage({children}){
    return (
        <DashboardWebUILayout navigation={navigation} children={children}/>
    )
}

export default function SchoolLayout({children}){
    window.scrollTo(0, 0);
    return (
        <RenderPage children={children}/>
    )
}