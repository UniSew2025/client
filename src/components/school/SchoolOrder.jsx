import '../../styles/school/SchoolOrder.css'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    Paper,
    Tooltip, tooltipClasses,
    Typography
} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {getCompleteDesignRequest} from "../../services/DesignService.jsx";
import {useNavigate} from "react-router-dom";

const selectedRequest = JSON.parse(localStorage.getItem('sRequest'))

function RenderTooltip({title, children}){
    return (
        <Tooltip
            title={title}
            slots={{
                transition: Fade,
            }}
            slotProps={{
                transition: {timeout: 600},
                popper: {
                    sx: {
                        [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                            {
                                marginTop: '30px',
                            }
                    },
                },
            }}
            followCursor
        >
            {children}
        </Tooltip>
    )
}

function RenderCreateOrderModal({open, CloseFunc}) {
    const navigate = useNavigate()
    return (
        <Dialog
            maxWidth={'md'}
            fullWidth
            open={open}
            onClose={CloseFunc}
            scroll={'paper'}
        >
            <DialogTitle>
                <Typography variant={'body2'} fontSize={30} fontWeight={'bold'}>Create Order</Typography>
            </DialogTitle>
            <DialogContent>
                <div className={'d-flex flex-column align-items-center'}>
                    {
                        !selectedRequest ?
                            <>
                                <Typography variant={'body1'} fontSize={20} color={'error'} sx={{marginBottom: '2vh'}}>No selected design request, click the button
                                    to select one</Typography>
                                <Button variant={"contained"} color={"info"} onClick={() => navigate('/school/design')}>Select your design request</Button>
                            </>
                            :
                            <>
                                <Typography variant={'body1'} fontSize={20}>{selectedRequest.name}</Typography>
                            </>
                    }
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant={'outlined'} color={'error'} onClick={CloseFunc}>Close</Button>
                <RenderTooltip title={!selectedRequest ? 'Select a design request first' : ''}>
                    <div>
                        <Button variant={'contained'} color={'primary'} onClick={CloseFunc} disabled={!selectedRequest}>Create</Button>
                    </div>
                </RenderTooltip>
            </DialogActions>
        </Dialog>
    )
}

function RenderPage() {
    const [modal, setModal] = useState(false)

    function HandleClose() {
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
    const [design, setDesign] = useState([])

    async function GetCompletedDesignRequests() {
        const response = await getCompleteDesignRequest()
        if (response && response.status === 200) {
            setDesign(response.data.data)
        }
    }

    useEffect(() => {
        GetCompletedDesignRequests()
    }, []);

    console.log("Design: ", design)

    return (
        <RenderPage/>
    )
}