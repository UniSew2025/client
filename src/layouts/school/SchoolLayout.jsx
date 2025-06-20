import DashBoardWebUILayout from "../ui/DashBoardWebUILayout.jsx";

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
    }
]

function RenderPage(){
    return (
        <DashBoardWebUILayout navigation={navigation}/>
    )
}

export default function SchoolLayout(){
    return (
        <RenderPage/>
    )
}