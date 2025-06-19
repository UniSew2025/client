import '../../styles/school/SchoolOrder.css'

function RenderPage(){
    return (
        <h1>School order</h1>
    )
}

export default function SchoolOrder(){
    document.title = 'Order'
    return (
        <RenderPage/>
    )
}