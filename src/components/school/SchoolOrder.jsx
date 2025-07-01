import '../../styles/school/SchoolOrder.css'
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Fade,
    FormControlLabel,
    IconButton,
    Paper,
    Slide,
    Step,
    StepLabel,
    Stepper, Tab, Tabs,
    TextField,
    Tooltip,
    tooltipClasses,
    Typography
} from "@mui/material";
import {ColorPicker} from 'antd'
import {Add, Cancel, CheckCircle, RestartAlt} from "@mui/icons-material";
import {forwardRef, useEffect, useState} from "react";
import {getCompleteDesignRequest} from "../../services/DesignService.jsx";
import {useNavigate} from "react-router-dom";
import {enqueueSnackbar} from "notistack";
import ModalImage from "react-modal-image";

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

function RenderFillSizeArea({cloth, UpdateSizeFunc, initQty}) {

    const [qty, setQty] = useState(initQty ? initQty : {
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        XXL: 0,
        XXXL: 0,
        XXXXL: 0
    })

    const totalQty = qty.S + qty.M + qty.L + qty.XL + qty.XXL + qty.XXXL + qty.XXXXL

    function RenderSize({name, size, minH, maxH, minW, maxW}) {

        const handleChangeQty = (e, resetValue) => {
            const value = resetValue === 0 ? resetValue : (e.target.value < 0 ? 0 : e.target.value)
            const newQty = {...qty, [name]: parseInt(value)}

            setQty(newQty)
            if (
                newQty.S === 0 &&
                newQty.M === 0 &&
                newQty.L === 0 &&
                newQty.XL === 0 &&
                newQty.XXL === 0 &&
                newQty.XXXL === 0 &&
                newQty.XXXXL === 0
            ) {
                UpdateSizeFunc(cloth.gender, cloth.clothCategory === 'regular' ? 're' : 'pe', cloth.clothType === 'shirt' ? 'upper' : 'lower', null)
            } else {
                UpdateSizeFunc(cloth.gender, cloth.clothCategory === 'regular' ? 're' : 'pe', cloth.clothType === 'shirt' ? 'upper' : 'lower', newQty)
            }

        }

        return (
            <Paper elevation={6} className={'w-100 p-2 mb-2'}>
                <Typography variant={'body1'} fontWeight={'bold'} fontSize={20}
                            sx={{marginBottom: '0.5vh'}}>Size {size.toUpperCase()}</Typography>
                <Divider sx={{borderTop: '1px solid black'}} variant={'fullWidth'}/>
                <div className={'d-flex justify-content-start my-2'}>
                    <Typography variant={'subtitle1'} fontSize={12} sx={{flex: 1}}><span className={'fw-bold'}>Height range:</span> {minH}cm
                        - {maxH}cm</Typography>
                    <Divider sx={{borderTop: '1px solid black', marginRight: '1vw'}} orientation={'vertical'} flexItem/>
                    <Typography variant={'subtitle1'} fontSize={12} sx={{flex: 1}}><span className={'fw-bold'}>Weight range:</span> {minW}kg
                        - {maxW}kg</Typography>
                </div>
                <div className={'cloth-size d-flex align-items-center'}>
                    <Typography variant={'subtitle1'} fontSize={12} sx={{marginBottom: '0.2vh'}}
                                fontWeight={'bold'}>Quantity: </Typography>

                    <TextField
                        type={'number'}
                        sx={{fontSize: '14px', marginX: '0.8vh', padding: 0}}
                        value={qty[name]}
                        hiddenLabel
                        variant={'filled'}
                        size={'small'}
                        onChange={(e) => handleChangeQty(e, -1)}
                    />

                    <Typography variant={'subtitle1'} fontSize={12}>{cloth.clothType.toLowerCase()}</Typography>
                    <RenderTooltip title={"Reset quantity"}>
                        <IconButton
                            size={'small'}
                            sx={{marginRight: '2vw'}}
                            onClick={(e) => handleChangeQty(e, 0)}
                        >
                            <RestartAlt sx={{fontSize: '20px'}}/>
                        </IconButton>
                    </RenderTooltip>
                </div>
            </Paper>
        )
    }

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
                            <div className={'d-flex justify-content-start align-items-start'}>
                                <div
                                    className={'d-flex flex-column justify-content-center align-items-start w-50 px-2'}>
                                    {/*Image*/}
                                    <Typography variant={'body1'} fontWeight={'bold'} sx={{marginBottom: '4vh'}}>1.
                                        Image: </Typography>
                                    <ModalImage
                                        className='uniform-img'
                                        small={cloth.finalImages[0].url}
                                        large={cloth.finalImages[0].url}
                                        alt={""}
                                        hideDownload={false}
                                        hideZoom={true}
                                    />

                                    {/*Logo image*/}
                                    <Typography
                                        variant={'body1'}
                                        fontWeight={'bold'}
                                        sx={{
                                            marginTop: '1vh',
                                            marginBottom: '0.2vh'
                                        }}>
                                        2. Logo image:
                                    </Typography>
                                    <ModalImage
                                        className='uniform-img-logo'
                                        small={cloth.logoImage}
                                        large={cloth.logoImage}
                                        alt={""}
                                        hideDownload={false}
                                        hideZoom={true}
                                    />

                                    {/*Color*/}
                                    <Typography
                                        variant={'body1'}
                                        fontWeight={'bold'}
                                        sx={{
                                            marginTop: '2vh',
                                            marginBottom: '0.2vh'
                                        }}>
                                        3. Color:
                                    </Typography>
                                    <div className={'d-flex align-items-center gap-2'}>
                                        <ColorPicker defaultValue={cloth.color} size={'small'} disabled/>
                                        <span>{cloth.color}</span>
                                    </div>

                                    {/*Note*/}
                                    <Typography
                                        variant={'body1'}
                                        sx={{
                                            marginTop: '2vh',
                                            fontWeight: 'bold',
                                            marginBottom: '0.2vh'
                                        }}>
                                        4. Note:
                                    </Typography>
                                    <Typography variant={'body2'}>{cloth.note}</Typography>

                                    {/*Cloth count*/}
                                    <Typography
                                        variant={'body1'}
                                        sx={{
                                            marginTop: '2vh',
                                            marginBottom: '0.2vh'
                                        }}>
                                        <span
                                            className={'fw-bold me-2'}>5. Total quantity:
                                        </span>{totalQty} {cloth.clothType}
                                    </Typography>
                                    {
                                        totalQty === 0 &&
                                        <Typography variant={'body2'} fontSize={10} color={'error'}>* If the amount is 0
                                            means you haven't selected the quantity on the right side</Typography>
                                    }
                                    {
                                        totalQty > 0 &&
                                        <>
                                            <Typography variant={'body2'} fontSize={10}>Including: </Typography>
                                            {qty.S > 0 && <Typography variant={'body2'} fontSize={10}>{qty.S} size
                                                S</Typography>}
                                            {qty.M > 0 && <Typography variant={'body2'} fontSize={10}>{qty.M} size
                                                M</Typography>}
                                            {qty.L > 0 && <Typography variant={'body2'} fontSize={10}>{qty.L} size
                                                L</Typography>}
                                            {qty.XL > 0 &&
                                                <Typography variant={'body2'} fontSize={10}>{qty.XL} size
                                                    XL</Typography>}
                                            {qty.XXL > 0 &&
                                                <Typography variant={'body2'} fontSize={10}>{qty.XXL} size
                                                    XXL</Typography>}
                                            {qty.XXXL > 0 &&
                                                <Typography variant={'body2'} fontSize={10}>{qty.XXXL} size
                                                    3Xl</Typography>}
                                            {qty.XXXXL > 0 &&
                                                <Typography variant={'body2'} fontSize={10}>{qty.XXXXL} size
                                                    4XL</Typography>}
                                        </>
                                    }
                                </div>
                                <Divider orientation={"vertical"}
                                         sx={{borderLeft: '0.1px solid rgba(197, 198, 199, 0.1)'}} flexItem
                                         variant={'fullWidth'}/>
                                <div
                                    className={'d-flex flex-column justify-content-start align-items-start w-100 ps-3'}>
                                    <RenderSize name={'S'} size={'S'} minH={100} maxH={109} minW={18} maxW={27}/>
                                    <RenderSize name={'M'} size={'M'} minH={110} maxH={119} minW={28} maxW={37}/>
                                    <RenderSize name={'L'} size={'L'} minH={120} maxH={129} minW={38} maxW={47}/>
                                    <RenderSize name={'XL'} size={'XL'} minH={130} maxH={139} minW={48} maxW={57}/>
                                    <RenderSize name={'XXL'} size={'XXL'} minH={140} maxH={149} minW={58} maxW={67}/>
                                    <RenderSize name={'XXXL'} size={'3XL'} minH={150} maxH={159} minW={68} maxW={77}/>
                                    <RenderSize name={'XXXXL'} size={'4XL'} minH={160} maxH={180} minW={78} maxW={100}/>
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
                        Design Request Information
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

        const [tab, setTab] = useState('1')

        const [subTab, setSubTab] = useState('1')

        const [size, setSize] = useState({
            reBoy: {upper: null, lower: null},
            reGirl: {upper: null, lower: null},
            peBoy: {upper: null, lower: null},
            peGirl: {upper: null, lower: null}
        })

        function UpdateSizes(gender, type, position, newValue) {
            switch (type) {
                case 're':
                    switch (gender) {
                        case 'boy':
                            switch (position) {
                                case 'upper':
                                    setSize(prevSize => ({...prevSize, reBoy: {...prevSize.reBoy, upper: newValue}}))
                                    break
                                default:
                                    setSize(prevSize => ({...prevSize, reBoy: {...prevSize.reBoy, lower: newValue}}))
                                    break
                            }
                            break
                        default:
                            switch (position) {
                                case 'upper':
                                    setSize(prevSize => ({...prevSize, reGirl: {...prevSize.reGirl, upper: newValue}}))
                                    break
                                default:
                                    setSize(prevSize => ({...prevSize, reGirl: {...prevSize.reGirl, lower: newValue}}))
                                    break
                            }
                            break
                    }
                    break
                default:
                    switch (gender) {
                        case 'boy':
                            setSize({...size, peBoy: newValue})
                            break
                        default:
                            setSize({...size, peGirl: newValue})
                            break
                    }
                    break
            }
        }

        const changeTab = (e, newTab) => {
            setTab(newTab)
        }

        const changeSubTab = (e, newSubTab) => {
            setSubTab(newSubTab)
        }

        const boyUpperRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'boy' && cloth.clothType === 'shirt')
        const boyLowerRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'boy' && cloth.clothType === 'pants')
        const girlUpperRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'girl' && cloth.clothType === 'shirt')
        const girlLowerRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'girl' && (cloth.clothType === 'pants' || cloth.clothType === 'skirt'))

        const boyUpperPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'boy' && cloth.clothType === 'shirt')
        const boyLowerPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'boy' && cloth.clothType === 'pants')
        const girlUpperPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'girl' && cloth.clothType === 'shirt')
        const girlLowerPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'girl' && cloth.clothType === 'pants')

        const isREBoySizeFilled = tab === '1' && size.reBoy.upper !== null && size.reBoy.lower !== null // In RE tab and both boy upper and lower existed
        const isREGirlSizeFilled = tab === '1' && size.reGirl.upper !== null && size.reGirl.lower !== null // In RE tab and both girl upper and lower existed
        const isPEBoySizeFilled = tab === '2' && size.peBoy.upper !== null && size.peBoy.lower !== null // In PE tab and both boy upper and lower existed
        const isPEGirlSizeFilled = tab === '2' && size.peGirl.upper !== null && size.peGirl.lower !== null // In PE tab and both girl upper and lower existed

        const isBoySizeFilled = isREBoySizeFilled || isPEBoySizeFilled // Boy tab will green in case PE boy filled or RE boy filled
        const isGirlSizeFilled = isREGirlSizeFilled || isPEGirlSizeFilled // Girl tab will green in case PE girl filled or RE girl filled

        const isRESizeFilled = size.reBoy.upper !== null && size.reBoy.lower !== null && size.reGirl.upper !== null && size.reGirl.lower !== null
        const isPESizeFilled = size.peBoy.upper !== null && size.peBoy.lower !== null && size.peGirl.upper !== null && size.peGirl.lower !== null

        return (
            <>
                <Paper
                    elevation={4}
                    sx={{
                        width: '100%',
                        marginTop: '3vh',
                        paddingY: '2vh',
                        paddingX: '2vw'
                    }}
                >
                    <Box sx={{width: '100%'}} className={'tab-custom-border'}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <Tabs
                                value={tab}
                                onChange={changeTab}
                                variant={'fullWidth'}
                                slotProps={{
                                    indicator: {
                                        style: {
                                            backgroundColor: (tab === '1' && isRESizeFilled) || (tab === '2' && isPESizeFilled) ? "green" : "red"
                                        }
                                    }
                                }}>
                                {hasRegular &&
                                    <Tab
                                        label="Regular"
                                        value={'1'}
                                        className={isRESizeFilled ? 'tab-custom-done' : 'tab-custom-undone'}
                                        icon={isRESizeFilled ? <CheckCircle/> : <Cancel/>}
                                        iconPosition={'end'}
                                    />
                                }
                                {hasPE &&
                                    <Tab
                                        label="Physical Education"
                                        value={'2'}
                                        className={isPESizeFilled ? 'tab-custom-done' : 'tab-custom-undone'}
                                        icon={isPESizeFilled ? <CheckCircle/> : <Cancel/>}
                                        iconPosition={'end'}
                                    />
                                }
                            </Tabs>
                        </Box>
                    </Box>
                    <Paper
                        variant={'outlined'}
                        sx={{
                            width: '100%',
                            marginTop: '3vh',
                            paddingY: '2vh',
                            paddingX: '2vw'
                        }}
                    >
                        <Box sx={{width: '100%'}}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs
                                    value={subTab}
                                    onChange={changeSubTab}
                                    variant={'fullWidth'}
                                    slotProps={{
                                        indicator: {
                                            style: {
                                                backgroundColor:
                                                    (subTab === '1' && isBoySizeFilled) || (subTab === '2' && isGirlSizeFilled) ? "green" : "red"
                                            }
                                        }
                                    }}
                                >
                                    <Tab
                                        label="Boy"
                                        value={'1'}
                                        className={isBoySizeFilled ? 'tab-custom-done' : 'tab-custom-undone'}
                                        iconPosition={'end'}
                                        icon={isBoySizeFilled ? <CheckCircle/> : <Cancel/>}
                                    />
                                    <Tab
                                        label="Girl"
                                        value={'2'}
                                        className={isGirlSizeFilled ? 'tab-custom-done' : 'tab-custom-undone'}
                                        iconPosition={'end'}
                                        icon={isGirlSizeFilled ? <CheckCircle/> : <Cancel/>}
                                    />
                                </Tabs>
                            </Box>
                        </Box>
                        <Divider sx={{borderTop: '1px solid black', marginBottom: '2vh'}} variant={"fullWidth"}/>
                        {
                            tab === '1' && subTab === '1' && hasRegular &&
                            <>
                                <RenderFillSizeArea cloth={boyUpperRE} UpdateSizeFunc={UpdateSizes}
                                                    initQty={size.reBoy.upper}/>
                                <RenderFillSizeArea cloth={boyLowerRE} UpdateSizeFunc={UpdateSizes}
                                                    initQty={size.reBoy.lower}/>
                            </>
                        }
                        {
                            tab === '1' && subTab === '2' && hasRegular &&
                            <>

                                <RenderFillSizeArea cloth={girlUpperRE} UpdateSizeFunc={UpdateSizes}
                                                    initQty={size.reGirl.upper}/>
                                <RenderFillSizeArea cloth={girlLowerRE} UpdateSizeFunc={UpdateSizes}
                                                    initQty={size.reGirl.lower}/>
                            </>
                        }
                        {
                            tab === '2' && subTab === '1' && hasPE &&
                            <>

                                <RenderFillSizeArea cloth={boyUpperPE} UpdateSizeFunc={UpdateSizes}
                                                    initQty={size.peBoy.upper}/>
                                <RenderFillSizeArea cloth={boyLowerPE} UpdateSizeFunc={UpdateSizes}
                                                    initQty={size.peBoy.lower}/>
                            </>
                        }
                        {
                            tab === '2' && subTab === '2' && hasPE &&
                            <>

                                <RenderFillSizeArea cloth={girlUpperPE} UpdateSizeFunc={UpdateSizes}
                                                    initQty={size.peGirl.upper}/>
                                <RenderFillSizeArea cloth={girlLowerPE} UpdateSizeFunc={UpdateSizes}
                                                    initQty={size.peGirl.lower}/>
                            </>
                        }
                    </Paper>
                </Paper>
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
                maxHeight: '95vh'
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
                    currentStep < 2 &&
                    <RenderTooltip
                        title={!selectedRequest ? 'Select a design request first' : 'Move to step ' + (currentStep + 2)}>
                        <div>
                            <Button variant={'contained'} color={'primary'}
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={!selectedRequest}>Next</Button>
                        </div>
                    </RenderTooltip>
                }
                {
                    currentStep === 2 &&
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
            {lucky &&
                <Typography variant={"body2"} color={"error"} fontSize={20} fontWeight={500} sx={{marginTop: '10vh'}}>There
                    is 50% you can not see the list. Good luck</Typography>}
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