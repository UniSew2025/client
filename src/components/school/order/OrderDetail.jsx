import {useLocation} from "react-router-dom";
import {Box, Grid, Paper, TextField, Typography} from "@mui/material";

function RenderDisplayText({label, text}){
    return(
        <TextField
            size={'small'}
            variant={'filled'}
            label={label}
            fullWidth
            multiline
            defaultValue={text}
            sx={{
                height: '2vh'
            }}
            slotProps={{
                input: {
                    readOnly: true
                }
            }}
        />
    )
}

function RenderData({order}){

    return(
        <Paper elevation={6} sx={{width: '85vw', minHeight: '100vh', marginRight: '2vw', marginTop: '3vh', padding: '2vh 2vw'}}>
            <Grid container spacing={2} rowSpacing={5} sx={{marginBottom: '10vh'}}>
                <Grid size={6}>
                    <RenderDisplayText label={"Order ID"} text={order.id}/>
                </Grid>
                <Grid size={6}>
                    <RenderDisplayText label={"Order Date"} text={new Date(order.orderDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}/>
                </Grid>
                <Grid size={12}>
                    <RenderDisplayText label={"Delivery Date Expected"} text={order.deadline}/>
                </Grid>
                <Grid size={12}>
                    <RenderDisplayText label={"Note"} text={order.note}/>
                </Grid>
            </Grid>

        </Paper>
    )
}

export default function OrderDetail(){
    document.title = "Order Detail";
    const location = useLocation();
    const {order} = location.state
    console.log(order);

    return (
        <Box sx={{marginY: '4vh', marginX: '2vw', width: '100%'}}>
            <Typography variant={"body1"} sx={{fontSize: '2rem'}}>
                Order Detail
            </Typography>
            <RenderData order={order}/>
        </Box>
    )
}