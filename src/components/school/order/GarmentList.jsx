function RenderPage(){
    return (<h1>Garment list</h1>);
}

export default function GarmentList(){
    document.title= "Garment Selection"
    console.log(!localStorage.getItem("sOrder"))
    if(!localStorage.getItem("sOrder")){
        window.location.href = "/school/d/order"
    }
    return (
        <RenderPage/>
    )
}