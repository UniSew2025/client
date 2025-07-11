import DashboardWebUILayout from "../ui/DashboardWebUILayout.jsx";

const navigation = [
    {
        type: "caption",
        label: "My Design",
    },
    {
        type: "sub",
        label: "Design History",
        segment: "/school/design",
    },
    {
        type: "caption",
        label: "My Orders",
    },
    {
        type: "sub",
        label: "Order History",
        segment: "/school/order"
    },
    {
        type: "caption",
        label: "Feedback",
    },
    {
        type: "sub",
        label: "Feedback history",
        segment: "/school/feedback"
    }
]

function RenderPage(){
    return (
        <DashboardWebUILayout navigation={navigation}/>
    )
}

export default function SchoolLayout(){
    window.scrollTo(0, 0);
    return (
        <RenderPage/>
    )
}