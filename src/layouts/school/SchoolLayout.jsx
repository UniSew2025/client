import SchoolDashboardUILayout from "./SchoolDashboardUILayout.jsx";

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

function RenderPage(){
    return (
        <SchoolDashboardUILayout navigation={navigation}/>
    )
}

export default function SchoolLayout(){
    window.scrollTo(0, 0);
    return (
        <RenderPage/>
    )
}