import '../../styles/school/SchoolOrder.css'
import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider,
    Fade, FormControlLabel,
    Paper,
    Slide, Step, StepLabel, Stepper,
    TextField,
    Tooltip,
    tooltipClasses,
    Typography
} from "@mui/material";
import {Add} from "@mui/icons-material";
import {forwardRef, useEffect, useState} from "react";
import {getCompleteDesignRequest} from "../../services/DesignService.jsx";
import {useNavigate} from "react-router-dom";
import {enqueueSnackbar} from "notistack";

const lucky = false

function RenderTooltip({title, children}) {
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

function RenderStepper({step}) {
    const steps = [
        "Review design request information",
        "Fill quantity for uniform",
        "Recheck information",
        "Complete create order"
    ]

    return (
        <Stepper activeStep={step} alternativeLabel sx={{width: '100%'}}>
            {steps.map((label) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}

function RenderFillSizeArea({cloth}) {
    return (
        <Paper
            variant={'outlined'}
            sx={{
                width: '100%',
                marginTop: '3vh',
                paddingY: '2vh',
                paddingX: '2vw'
            }}
        >
            {
                cloth ?
                    (
                        <>
                            <Typography variant={"body1"}
                                        fontSize={18}
                                        fontWeight={500}
                                        fontStyle={"italic"}
                                        sx={{marginTop: '2vh', marginBottom: '2vh'}}
                            >
                                {cloth.clothType.substring(0, 1).toUpperCase() + cloth.clothType.substring(1).toUpperCase()}
                            </Typography>
                            <div className={'d-flex justify-content-center align-items-center'}>
                                <div className={'d-flex flex-column justify-content-center align-items-start w-100 ps-2'}>
                                    <p className={'h-100 w-100 mb-0'}>Info 1</p>
                                    <p className={'h-100 w-100 mb-0'}>Info 2</p>
                                    <p className={'h-100 w-100 mb-0'}>Info 3</p>
                                    <p className={'h-100 w-100 mb-0'}>Info 4</p>
                                    <p className={'h-100 w-100 mb-0'}>Info 5</p>
                                </div>
                                <Divider orientation={"vertical"} sx={{borderRight: '1px solid black'}} flexItem variant={'middle'}/>
                                <div className={'d-flex flex-column justify-content-center align-items-start w-100 ps-2'}>
                                    <p className={'h-100 w-100 mb-0'}>Size 1</p>
                                    <p className={'h-100 w-100 mb-0'}>Size 2</p>
                                    <p className={'h-100 w-100 mb-0'}>Size 3</p>
                                    <p className={'h-100 w-100 mb-0'}>Size 4</p>
                                    <p className={'h-100 w-100 mb-0'}>Size 5</p>
                                </div>

                            </div>
                        </>
                    )
                    :
                    <Typography variant={"body1"}
                                color={"error"}
                                fontSize={18}
                                fontWeight={500}
                                fontStyle={"italic"}
                                sx={{marginTop: '2vh', marginBottom: '2vh'}}
                    >
                        Invalid cloth part
                    </Typography>
            }
        </Paper>
    )
}

function RenderCreateOrderModal({open, CloseFunc, selectedRequest}) {
    const navigate = useNavigate()

    const [currentStep, setCurrentStep] = useState(0)

    const transition = forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const vietnamLocale = 'vi-VN';

    const shortDate = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    const hasRegular = !!(selectedRequest && selectedRequest.cloth.find(item => item.clothCategory === 'regular'))

    const hasPE = !!(selectedRequest && selectedRequest.cloth.find(item => item.clothCategory === 'pe'))

    function RenderFirstStep() {
        return (
            <Paper
                elevation={4}
                sx={{
                    width: '100%',
                    marginTop: '3vh',
                    paddingY: '2vh',
                    paddingX: '2vw'
                }}
            >
                <div className={'d-flex justify-content-between align-items-center gap-2 w-100'}>
                    <Typography variant={"body1"}
                                fontSize={20}
                                fontWeight={500}
                                fontStyle={"italic"}
                                sx={{marginTop: '2vh', marginBottom: '3vh'}}
                    >
                        Request Information
                    </Typography>
                    <Button
                        variant={'contained'}
                        color={'secondary'}
                        onClick={() => navigate('/school/design')}
                        size={"small"}
                        sx={{height: '4vh', width: '10vw', fontSize: '0.7rem', marginTop: '5vh', marginBottom: '2vh'}}
                    >
                        Choose another
                    </Button>
                </div>
                <TextField
                    variant={"standard"}
                    slotProps={{input: {readOnly: true}}}
                    size={"small"}
                    label={'ID'}
                    fullWidth
                    sx={{marginBottom: '3vh'}}
                    defaultValue={selectedRequest.id}
                />

                <TextField
                    variant={"standard"}
                    slotProps={{input: {readOnly: true}}}
                    size={"small"}
                    label={'Creation Date'}
                    fullWidth
                    sx={{marginBottom: '3vh'}}
                    defaultValue={new Intl.DateTimeFormat(vietnamLocale, shortDate).format(new Date(selectedRequest.creationDate))}
                />

                <TextField
                    variant={"standard"}
                    slotProps={{input: {readOnly: true}}}
                    size={"small"}
                    label={'Delivery Type'}
                    fullWidth
                    sx={{marginBottom: '3vh'}}
                    defaultValue={selectedRequest.private ? 'Private' : 'Public'}
                />

                <TextField
                    variant={"standard"}
                    slotProps={{input: {readOnly: true}}}
                    size={"small"}
                    label={'Status'}
                    fullWidth
                    sx={{marginBottom: '3vh'}}
                    defaultValue={selectedRequest.status.substring(0, 1).toUpperCase() + selectedRequest.status.substring(1).toLowerCase()}
                />
                <div className={'d-flex flex-column justify-content-center'}>
                    <Typography sx={{marginRight: '1vw'}} fontSize={18}>Selected Uniform Type:</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={hasRegular} slotProps={{input: {readOnly: true}}}
                                           color={hasRegular ? 'success' : 'default'}/>}
                        label="Regular"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={hasPE} slotProps={{input: {readOnly: true}}}
                                           color={hasPE ? 'success' : 'default'}/>}
                        label="Physical Education"
                    />
                </div>
            </Paper>
        )
    }

    function RenderSecondStep({cloths}) {

        const boyUpperRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'male' && cloth.clothType === 'shirt')
        const boyLowerRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'male' && cloth.clothType === 'pants')
        const girlUpperRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'female' && cloth.clothType === 'shirt')
        const girlLowerRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'female' && (cloth.clothType === 'pants' || cloth.clothType === 'skirt'))

        const boyUpperPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'male' && cloth.clothType === 'shirt')
        const boyLowerPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'male' && cloth.clothType === 'pants')
        const girlUpperPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'female' && cloth.clothType === 'shirt')
        const girlLowerPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'female' && cloth.clothType === 'pants')

        return (
            <>
                {/*Regular block*/}
                {
                    hasRegular &&
                    <Paper
                        elevation={4}
                        sx={{
                            width: '100%',
                            marginTop: '3vh',
                            paddingY: '2vh',
                            paddingX: '2vw'
                        }}
                    >
                        <Typography variant={"body1"}
                                    fontSize={20}
                                    fontWeight={500}
                                    fontStyle={"italic"}
                                    sx={{marginTop: '2vh', marginBottom: '2vh'}}
                        >
                            Regular Uniform
                        </Typography>
                        <Divider sx={{borderTop: '1px solid black'}} variant={"fullWidth"}/>
                        <Paper
                            variant={'outlined'}
                            sx={{
                                width: '100%',
                                marginTop: '3vh',
                                paddingY: '2vh',
                                paddingX: '2vw'
                            }}
                        >
                            <Typography variant={"body1"}
                                        fontSize={20}
                                        fontWeight={500}
                                        fontStyle={"italic"}
                                        sx={{marginTop: '2vh', marginBottom: '2vh'}}
                            >
                                Boy
                            </Typography>
                            <Divider sx={{borderTop: '1px solid black', marginBottom: '2vh'}} variant={"fullWidth"}/>
                            <RenderFillSizeArea cloth={boyUpperRE}/>
                            <RenderFillSizeArea cloth={boyLowerRE}/>
                        </Paper>

                        <Paper
                            variant={'outlined'}
                            sx={{
                                width: '100%',
                                marginTop: '3vh',
                                paddingY: '2vh',
                                paddingX: '2vw'
                            }}>
                            <Typography variant={"body1"}
                                        fontSize={20}
                                        fontWeight={500}
                                        fontStyle={"italic"}
                                        sx={{marginTop: '2vh', marginBottom: '2vh'}}
                            >
                                Girl
                            </Typography>
                            <Divider sx={{borderTop: '1px solid black', marginBottom: '2vh'}} variant={"fullWidth"}/>
                            <RenderFillSizeArea cloth={girlUpperRE}/>
                            <RenderFillSizeArea cloth={girlLowerRE}/>
                        </Paper>
                    </Paper>
                }

                {/*PE block*/}
                {
                    hasPE &&
                    <Paper
                        variant={'outlined'}
                        sx={{
                            width: '100%',
                            marginTop: '3vh',
                            paddingY: '2vh',
                            paddingX: '2vw'
                        }}
                    >
                        <Typography variant={"body1"}
                                    fontSize={20}
                                    fontWeight={500}
                                    fontStyle={"italic"}
                                    sx={{marginTop: '2vh', marginBottom: '2vh'}}
                        >
                            Physical Education Uniform
                        </Typography>
                        <Divider sx={{borderTop: '1px solid black', marginBottom: '2vh'}} variant={"fullWidth"}/>
                        <Paper
                            variant={'outlined'}
                            sx={{
                                width: '100%',
                                marginTop: '3vh',
                                paddingY: '2vh',
                                paddingX: '2vw'
                            }}
                        >
                            <Typography variant={"body1"}
                                        fontSize={20}
                                        fontWeight={500}
                                        fontStyle={"italic"}
                                        sx={{marginTop: '2vh', marginBottom: '2vh'}}
                            >
                                Boy
                            </Typography>
                            <Divider sx={{borderTop: '1px solid black', marginBottom: '2vh'}} variant={"fullWidth"}/>
                            <RenderFillSizeArea cloth={boyUpperPE}/>
                            <RenderFillSizeArea cloth={boyLowerPE}/>
                        </Paper>

                        <Paper
                            variant={'outlined'}
                            sx={{
                                width: '100%',
                                marginTop: '3vh',
                                paddingY: '2vh',
                                paddingX: '2vw'
                            }}>
                            <Typography variant={"body1"}
                                        fontSize={20}
                                        fontWeight={500}
                                        fontStyle={"italic"}
                                        sx={{marginTop: '2vh', marginBottom: '2vh'}}
                            >
                                Girl
                            </Typography>
                            <Divider sx={{borderTop: '1px solid black', marginBottom: '2vh'}} variant={"fullWidth"}/>
                            <RenderFillSizeArea cloth={girlUpperPE}/>
                            <RenderFillSizeArea cloth={girlLowerPE}/>
                        </Paper>
                    </Paper>
                }
            </>
        )
    }

    return (
        <Dialog
            maxWidth={'lg'}
            fullWidth
            open={open}
            onClose={CloseFunc}
            scroll={'paper'}
            slots={{
                transition: transition,
            }}
            sx={{
                maxHeight: '90vh'
            }}
            keepMounted
        >
            <DialogTitle sx={{padding: 0, height: '10vh', display: 'flex', alignItems: 'center'}}>
                <Typography
                    variant={'body2'}
                    fontSize={30}
                    fontWeight={'bold'}
                    sx={{
                        marginY: 0,
                        padding: 0,
                        width: '100%',
                        ml: 2,
                        flex: 1
                    }}
                    component="div"
                >
                    Create Order
                </Typography>
            </DialogTitle>
            <Divider sx={{borderTop: '1px solid black'}}/>
            <DialogContent>
                <>
                    {
                        !selectedRequest ?
                            <div className={'d-flex flex-column align-items-center'}>
                                <Typography variant={'body1'} fontSize={20} color={'error'} sx={{marginBottom: '2vh'}}>No
                                    selected design request, click the button
                                    to select one</Typography>
                                <Button variant={"contained"} color={"info"} onClick={() => navigate('/school/design')}>Select
                                    your design request</Button>
                            </div>
                            :
                            <div>
                                <div className={'d-flex flex-column align-items-start'}>
                                    <RenderStepper step={currentStep}/>
                                    {currentStep === 0 && <RenderFirstStep/>}
                                    {currentStep === 1 && <RenderSecondStep cloths={selectedRequest.cloth}/>}
                                </div>
                            </div>
                    }
                </>
            </DialogContent>
            <DialogActions>
                {currentStep === 0 && <Button variant={'outlined'} color={'error'} onClick={CloseFunc}>Close</Button>}
                {
                    currentStep > 0 &&
                    <RenderTooltip title={'Back to step ' + (currentStep)}>
                        <div>
                            <Button variant={'outlined'} color={'error'}
                                    onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>
                        </div>
                    </RenderTooltip>
                }
                {
                    currentStep < 3 &&
                    <RenderTooltip
                        title={!selectedRequest ? 'Select a design request first' : 'Move to step ' + (currentStep + 2)}>
                        <div>
                            <Button variant={'contained'} color={'primary'} onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={!selectedRequest}>Next</Button>
                        </div>
                    </RenderTooltip>
                }
                {
                    currentStep === 3 &&
                    <RenderTooltip title={''}>
                        <div>
                            <Button variant={'outlined'} color={'success'}
                                    onClick={() => {
                                        enqueueSnackbar('Create order successfully', {variant: 'success'})
                                        localStorage.removeItem('sRequest')
                                        CloseFunc()
                                        window.location.reload()
                                    }}>Create Order</Button>
                        </div>
                    </RenderTooltip>
                }
            </DialogActions>
        </Dialog>
    )
}

function RenderPage({selectedRequest}) {
    const [modal, setModal] = useState(false)

    function HandleClose() {
        setModal(false)
    }

    return (
        <div className={'d-flex flex-column align-items-center'}>
            <Paper square elevation={0} sx={{width: '78vw', marginTop: '2vh'}}>
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
            {lucky && <Typography variant={"body2"} color={"error"} fontSize={20} fontWeight={500} sx={{marginTop: '10vh'}}>There is 50% you can not see the list. Good luck</Typography>}
            {modal && <RenderCreateOrderModal open={modal} CloseFunc={HandleClose} selectedRequest={selectedRequest}/>}
        </div>
    )
}

export default function SchoolOrder() {
    document.title = 'Order'
    const selectedRequestID = localStorage.getItem('sRequest') || null
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

    return (
        <RenderPage
            selectedRequest={design.find(request => request.id.toLocaleString() === selectedRequestID) || null}/>
    )
}