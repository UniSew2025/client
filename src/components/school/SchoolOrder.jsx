import '../../styles/school/SchoolOrder.css'
import {Button, Dialog, DialogActions, DialogTitle, Paper, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useState} from "react";

function RenderCreateOrderModal({open, CloseFunc}){
    return(
        <Dialog
            maxWidth={'md'}
            fullWidth
            open={open}
            onClose={CloseFunc}
            scroll={'paper'}
        >
            <DialogTitle>
                <Typography variant={'h5'} fontWeight={'bold'}>Create Order</Typography>
            </DialogTitle>
            <DialogActions>
                <Button variant={'outlined'} color={'error'} onClick={CloseFunc}>Close</Button>
                <Button variant={'contained'} color={'primary'} onClick={CloseFunc}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}

function RenderPage() {
    const [modal, setModal] = useState(false)

    function HandleClose(){
        setModal(false)
    }

    return (
        <div className={'d-flex justify-content-center'}>
            <Paper square elevation={8} sx={{width: '78vw', marginTop: '2vh'}}>
                <div className={'d-flex flex-row justify-content-between my-3'}>
                    <Typography variant={"h4"}>Order History</Typography>
                    <Button
                        startIcon={<Add/>}
                        variant={"contained"}
                        sx={{
                            borderRadius: '50px',
                            height: '5vh'
                        }}
                        onClick={() => setModal(true)}
                    >
                        Create
                    </Button>
                </div>
            </Paper>

            {modal && <RenderCreateOrderModal open={modal} CloseFunc={HandleClose}/>}
        </div>
    )
}

export default function SchoolOrder() {
    document.title = 'Order'
    return (
        <RenderPage/>
    )
}