import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Fade,
    FormControlLabel,
    IconButton,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    tooltipClasses,
    Typography
} from "@mui/material";
import ModalImage from "react-modal-image";
import {ColorPicker} from "antd";
import {Cancel, CheckCircle, RestartAlt} from "@mui/icons-material";
import dayjs from "dayjs";
import {DateField, DatePicker} from "@mui/x-date-pickers";
import {getCompleteDesignRequest} from "../../../services/DesignService.jsx";
import {enqueueSnackbar} from "notistack";
import {createOrder} from "../../../services/OrderService.jsx";

function SumSizeQty(size) {
    return size.S + size.M + size.L + size.XL + size.XXL + size.XXXL + size.XXXXL
}

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
        <Stepper activeStep={step} alternativeLabel sx={{width: '100%', marginY: '5vh'}}>
            {steps.map((label, index) => (
                <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}

function RenderSummarySizeQuantityArea({qty}) {
    return (
        <Paper elevation={6} sx={{padding: '5px'}}>
            <Typography color={qty > 0 ? 'success' : 'error'}>
                {
                    qty === 0 ? 'Require at least 1 uniform *' : 'Valid Quantity'
                }
            </Typography>
            <Typography>Quantity: {qty}</Typography>
        </Paper>
    )
}

function RenderFillSizeArea({upperDesignItem, lowerDesignItem, UpdateSizeFunc, initQty}) {

    const [qty, setQty] = useState(initQty ? initQty : {
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        XXL: 0,
        XXXL: 0,
        XXXXL: 0
    })

    const totalQty = SumSizeQty(qty)

    function HandleSetQty(newQty) {
        setQty(newQty)
    }

    return (
        <>
            <Paper
                elevation={6}
                sx={{
                    width: '100%',
                    marginTop: '3vh',
                    paddingY: '2vh',
                    paddingX: '2vw'
                }}
            >
                {
                    upperDesignItem && lowerDesignItem ?
                        (
                            <div className={'d-flex flex-column justify-content-start align-items-center w-100'}>
                                <div className={'d-flex justify-content-between align-items-start w-100'}>
                                    <Typography variant={"body1"}
                                                fontSize={20}
                                                fontWeight={600}
                                                fontStyle={"italic"}
                                                sx={{marginTop: '2vh', marginBottom: '2vh'}}
                                    >
                                        Uniform Information
                                    </Typography>
                                    <Typography variant={"body1"}
                                                fontSize={20}
                                                fontWeight={600}
                                                fontStyle={"italic"}
                                                sx={{marginTop: '2vh', marginBottom: '2vh'}}>
                                        Added Quantity: {totalQty}
                                    </Typography>
                                </div>
                                <Divider sx={{borderTop: '1px solid black', width: '100%', marginBottom: '2vh'}}
                                         variant={'fullWidth'}/>
                                <div className={'d-flex justify-content-start align-items-start w-100 gap-2 mb-3'}>
                                    <Paper variant={'outlined'} sx={{paddingLeft: '2vw', width: '50%'}}>
                                        <RenderUniFormInformation designItem={upperDesignItem}/>
                                    </Paper>
                                    <Paper variant={'outlined'} sx={{paddingLeft: '2vw', width: '50%'}}>
                                        <RenderUniFormInformation designItem={lowerDesignItem}/>
                                    </Paper>
                                </div>
                            </div>
                        )
                        :
                        <Typography variant={"body1"}
                                    color={"error"}
                                    fontSize={18}
                                    fontWeight={500}
                                    fontStyle={"italic"}
                                    sx={{marginTop: '2vh', marginBottom: '2vh'}}
                        >
                            Invalid designItem
                        </Typography>
                }
            </Paper>
            <div className={'w-100 mt-3 py-2'}>
                {
                    upperDesignItem && lowerDesignItem ?
                        (
                            <>
                                <div className={'d-flex flex-row justify-content-start align-items-start w-100 gap-2'}>
                                    <div className={'d-flex flex-column justify-content-center align-items-start w-50'}>
                                        <RenderSize name={'S'} size={'S'} minH={100} maxH={109} minW={18} maxW={27}
                                                    qty={qty}
                                                    SetQtyFunc={HandleSetQty} UpdateSizeFunc={UpdateSizeFunc}
                                                    designItem={upperDesignItem}/>
                                        <RenderSize name={'M'} size={'M'} minH={110} maxH={119} minW={28} maxW={37}
                                                    qty={qty}
                                                    SetQtyFunc={HandleSetQty} UpdateSizeFunc={UpdateSizeFunc}
                                                    designItem={upperDesignItem}/>
                                        <RenderSize name={'L'} size={'L'} minH={120} maxH={129} minW={38} maxW={47}
                                                    qty={qty}
                                                    SetQtyFunc={HandleSetQty} UpdateSizeFunc={UpdateSizeFunc}
                                                    designItem={upperDesignItem}/>
                                    </div>
                                    <div className={'d-flex flex-column justify-content-center align-items-start w-50'}>
                                        <RenderSize name={'XL'} size={'XL'} minH={130} maxH={139} minW={48} maxW={57}
                                                    qty={qty}
                                                    SetQtyFunc={HandleSetQty} UpdateSizeFunc={UpdateSizeFunc}
                                                    designItem={upperDesignItem}/>
                                        <RenderSize name={'XXL'} size={'XXL'} minH={140} maxH={149} minW={58} maxW={67}
                                                    qty={qty}
                                                    SetQtyFunc={HandleSetQty} UpdateSizeFunc={UpdateSizeFunc}
                                                    designItem={upperDesignItem}/>
                                        <RenderSize name={'XXXL'} size={'3XL'} minH={150} maxH={159} minW={68} maxW={77}
                                                    qty={qty}
                                                    SetQtyFunc={HandleSetQty} UpdateSizeFunc={UpdateSizeFunc}
                                                    designItem={upperDesignItem}/>
                                    </div>
                                </div>
                                <div className={'d-flex justify-content-start align-items-start w-100'}>
                                    <RenderSize name={'XXXXL'} size={'4XL'} minH={160} maxH={180} minW={78} maxW={100}
                                                qty={qty}
                                                SetQtyFunc={HandleSetQty} UpdateSizeFunc={UpdateSizeFunc}
                                                designItem={upperDesignItem}/>
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
                            Invalid designItem
                        </Typography>
                }
            </div>
        </>
    )
}

function RenderUniFormInformation({designItem}) {
    return (
        <div className={'d-flex flex-column justify-content-center align-items-start my-5'}>
            {/*Name*/}
            <Typography variant={'h5'} fontWeight={'bold'} sx={{marginBottom: '4vh'}}>
                {designItem.clothType.substring(0, 1).toUpperCase() + designItem.clothType.substring(1).toLowerCase()}
            </Typography>

            {/*Image*/}
            <Typography variant={'body1'} fontWeight={'bold'} sx={{marginBottom: '2vh'}}>
                1. Image:
            </Typography>
            <ModalImage className='uniform-img' small={designItem.finalImages[0].url} large={designItem.finalImages[0].url}
                        alt={""} hideDownload={false} hideZoom={true}/>

            {/*Logo image*/}
            <Typography variant={'body1'} fontWeight={'bold'} sx={{marginTop: '1vh', marginBottom: '0.2vh'}}>
                2. Logo:
            </Typography>
            <ModalImage className='uniform-img-logo' small={designItem.logoImage} large={designItem.logoImage}
                        alt={""} hideDownload={false} hideZoom={true}/>

            {/*Color*/}
            <Typography variant={'body1'} fontWeight={'bold'} sx={{marginTop: '2vh', marginBottom: '0.2vh'}}>
                3. Color:
            </Typography>
            <div className={'d-flex align-items-center gap-2'}>
                <ColorPicker defaultValue={designItem.color} size={'small'} disabled/>
                <span>{designItem.color}</span>
            </div>

            {/*Note*/}
            <Typography variant={'body1'} sx={{marginTop: '2vh', fontWeight: 'bold', marginBottom: '0.2vh'}}>
                4. Note:
            </Typography>
            <Typography variant={'body2'}>{designItem.note}</Typography>
        </div>
    )
}

function RenderSize({name, size, minH, maxH, minW, maxW, qty, SetQtyFunc, UpdateSizeFunc, designItem}) {

    const handleChangeQty = (e, resetValue) => {
        const value = resetValue === 0 ? resetValue : (e.target.value < 0 ? 0 : e.target.value)
        const newQty = {...qty, [name]: parseInt(value)}
        SetQtyFunc(newQty)
        if (
            newQty.S === 0 &&
            newQty.M === 0 &&
            newQty.L === 0 &&
            newQty.XL === 0 &&
            newQty.XXL === 0 &&
            newQty.XXXL === 0 &&
            newQty.XXXXL === 0
        ) {
            UpdateSizeFunc(designItem.gender, designItem.clothCategory === 'regular' ? 're' : 'pe', null)
        } else {
            UpdateSizeFunc(designItem.gender, designItem.clothCategory === 'regular' ? 're' : 'pe', newQty)
        }

    }

    return (
        <Paper elevation={6} className={'w-100 p-4 mb-2'}>
            <Typography variant={'body1'} fontWeight={'bold'} fontSize={20} sx={{marginBottom: '0.5vh'}}>
                Size {size.toUpperCase()} {name === 'XXXXL' ? '( Special Size )' : ''}
            </Typography>

            <Divider sx={{borderTop: '0.1px solid black'}} variant={'fullWidth'}/>

            <div className={'d-flex justify-content-start my-2'}>
                <Typography variant={'subtitle1'} fontSize={12} sx={{flex: 1}}>
                    <span className={'fw-bold'}>Height range:</span> {minH}cm - {maxH}cm
                </Typography>
                <Divider sx={{borderTop: '1px solid black', marginRight: '1vw'}} orientation={'vertical'} flexItem/>
                <Typography variant={'subtitle1'} fontSize={12} sx={{flex: 1}}>
                    <span className={'fw-bold'}>Weight range:</span> {minW}kg - {maxW}kg
                </Typography>
            </div>

            <div className={'designItem-size d-flex align-items-center'}>
                <Typography variant={'subtitle1'} fontSize={12} sx={{marginBottom: '0.2vh'}} fontWeight={'bold'}>
                    Quantity:
                </Typography>

                <TextField
                    type={'number'}
                    sx={{fontSize: '14px', marginX: '0.8vh', padding: 0}}
                    value={qty[name]}
                    hiddenLabel
                    variant={'filled'}
                    size={'small'}
                    onChange={(e) => handleChangeQty(e, -1)}
                />

                <Typography variant={'subtitle1'} fontSize={12}>
                    {designItem.clothType.toLowerCase()}
                </Typography>
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

function RenderFirstStep({selectedDesign, hasRegular, hasPE}) {
    const vietnamLocale = 'vi-VN';
    const shortDate = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    const navigate = useNavigate()

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
                    Design Information
                </Typography>
                <Button
                    variant={'contained'}
                    color={'secondary'}
                    onClick={() => navigate('/school/d/design')}
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
                defaultValue={selectedDesign.id}
            />

            <TextField
                variant={"standard"}
                slotProps={{input: {readOnly: true}}}
                size={"small"}
                label={'Creation Date'}
                fullWidth
                sx={{marginBottom: '3vh'}}
                defaultValue={new Intl.DateTimeFormat(vietnamLocale, shortDate).format(new Date(selectedDesign.creationDate))}
            />

            <TextField
                variant={"standard"}
                slotProps={{input: {readOnly: true}}}
                size={"small"}
                label={'Status'}
                fullWidth
                sx={{marginBottom: '3vh'}}
                defaultValue={selectedDesign.status.substring(0, 1).toUpperCase() + selectedDesign.status.substring(1).toLowerCase()}
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

function RenderSecondStep({designItems, hasRegular, hasPE, SetLockFunc}) {

    const designId = localStorage.getItem("sRequest") ? localStorage.getItem("sRequest") : null

    const [tab, setTab] = useState({
        main: '1',
        sub: '1'
    })

    const [size, setSize] = useState(localStorage.getItem('size_' + designId) ? JSON.parse(localStorage.getItem('size_' + designId)) : {
        reBoy: null,
        reGirl: null,
        peBoy: null,
        peGirl: null
    })

    if (!localStorage.getItem("size_" + designId)) {
        localStorage.setItem("size_" + designId, JSON.stringify(size))
    }

    //Get list for size
    //Regular
    const boyUpperRE = designItems.find(designItem => designItem.clothCategory === 'regular' && designItem.gender === 'boy' && designItem.clothType === 'shirt')
    const boyLowerRE = designItems.find(designItem => designItem.clothCategory === 'regular' && designItem.gender === 'boy' && designItem.clothType === 'pants')
    const girlUpperRE = designItems.find(designItem => designItem.clothCategory === 'regular' && designItem.gender === 'girl' && designItem.clothType === 'shirt')
    const girlLowerRE = designItems.find(designItem => designItem.clothCategory === 'regular' && designItem.gender === 'girl' && (designItem.clothType === 'pants' || designItem.clothType === 'skirt'))

    //Physical Education
    const boyUpperPE = designItems.find(designItem => designItem.clothCategory === 'pe' && designItem.gender === 'boy' && designItem.clothType === 'shirt')
    const boyLowerPE = designItems.find(designItem => designItem.clothCategory === 'pe' && designItem.gender === 'boy' && designItem.clothType === 'pants')
    const girlUpperPE = designItems.find(designItem => designItem.clothCategory === 'pe' && designItem.gender === 'girl' && designItem.clothType === 'shirt')
    const girlLowerPE = designItems.find(designItem => designItem.clothCategory === 'pe' && designItem.gender === 'girl' && designItem.clothType === 'pants')

    //Condition for displaying
    const isREBoySizeFilled = size.reBoy !== null // Both upper and lower existed
    const isREGirlSizeFilled = size.reGirl !== null
    const isPEBoySizeFilled = size.peBoy !== null
    const isPEGirlSizeFilled = size.peGirl !== null

    const isREBoyTabChecked = tab.main === '1' && isREBoySizeFilled
    const isREGirlTabChecked = tab.main === '1' && isREGirlSizeFilled
    const isPEBoyTabChecked = tab.main === '2' && isPEBoySizeFilled
    const isPEGirlTabChecked = tab.main === '2' && isPEGirlSizeFilled

    const isRESizeFilled = isREBoySizeFilled && isREGirlSizeFilled
    const isPESizeFilled = isPEBoySizeFilled && isPEGirlSizeFilled

    const checkLock = (newSize) => {
        const isRENewSizeFilled = newSize.reBoy !== null && newSize.reGirl !== null
        const isPENewSizeFilled = newSize.peBoy !== null && newSize.peGirl !== null

        const condition1 = hasRegular && hasPE && (!isRENewSizeFilled || !isPENewSizeFilled)
        const condition2 = hasRegular && !hasPE && !isRENewSizeFilled
        const condition3 = !hasRegular && hasPE && !isPENewSizeFilled

        return condition1 || condition2 || condition3
    }

    function UpdateSizes(gender, type, newValue) {
        switch (type) {
            case 're':
                switch (gender) {
                    case 'boy': {
                        const newSize = (prevSize) => ({...prevSize, reBoy: newValue})
                        setSize(newSize(size))
                        localStorage.setItem("size_" + designId, JSON.stringify(newSize(size)))
                        SetLockFunc(checkLock(newSize(size)))
                        break
                    }
                    default: {
                        const newSize = (prevSize) => ({...prevSize, reGirl: newValue})
                        setSize(newSize(size))
                        localStorage.setItem("size_" + designId, JSON.stringify(newSize(size)))
                        SetLockFunc(checkLock(newSize(size)))
                        break
                    }
                }
                break
            default:
                switch (gender) {
                    case 'boy': {
                        const newSize = (prevSize) => ({...prevSize, peBoy: newValue})
                        setSize(newSize(size))
                        localStorage.setItem("size_" + designId, JSON.stringify(newSize(size)))
                        SetLockFunc(checkLock(newSize(size)))
                        break
                    }
                    default: {
                        const newSize = (prevSize) => ({...prevSize, peGirl: newValue})
                        setSize(newSize(size))
                        localStorage.setItem("size_" + designId, JSON.stringify(newSize(size)))
                        SetLockFunc(checkLock(newSize(size)))
                        break
                    }
                }
                break
        }
    }

    const changeTab = (e, isMainChange, newValue) => {
        if (isMainChange) {// main not change
            setTab({...tab, main: newValue})
        } else {
            setTab({...tab, sub: newValue})
        }
    }

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
                            value={tab.main}
                            onChange={(e, newValue) => changeTab(e, true, newValue)}
                            variant={'fullWidth'}
                            slotProps={{
                                indicator: {
                                    style: {
                                        backgroundColor: (tab.main === '1' && isRESizeFilled) || (tab.main === '2' && isPESizeFilled) ? "green" : "red"
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
                                value={tab.sub}
                                onChange={(e, newValue) => changeTab(e, false, newValue)}
                                variant={'fullWidth'}
                                slotProps={{
                                    indicator: {
                                        style: {
                                            backgroundColor:
                                                (tab.sub === '1' && isREBoyTabChecked)
                                                || (tab.sub === '1' && isPEBoyTabChecked)
                                                || (tab.sub === '2' && isREGirlTabChecked)
                                                || (tab.sub === '2' && isPEGirlTabChecked)
                                                    ? "green" : "red"
                                        }
                                    }
                                }}
                            >
                                <Tab
                                    label="Boy"
                                    value={'1'}
                                    className={isREBoyTabChecked || isPEBoyTabChecked ? 'tab-custom-done' : 'tab-custom-undone'}
                                    iconPosition={'end'}
                                    icon={isREBoyTabChecked || isPEBoyTabChecked ? <CheckCircle/> : <Cancel/>}
                                />
                                <Tab
                                    label="Girl"
                                    value={'2'}
                                    className={isREGirlTabChecked || isPEGirlTabChecked ? 'tab-custom-done' : 'tab-custom-undone'}
                                    iconPosition={'end'}
                                    icon={isREGirlTabChecked || isPEGirlTabChecked ? <CheckCircle/> : <Cancel/>}
                                />
                            </Tabs>
                        </Box>
                    </Box>
                    <Divider sx={{borderTop: '1px solid black', marginBottom: '2vh'}} variant={"fullWidth"}/>
                    {
                        tab.main === '1' && tab.sub === '1' && hasRegular &&
                        <>
                            <RenderSummarySizeQuantityArea
                                qty={size.reBoy ? SumSizeQty(size.reBoy) : 0}
                            />
                            <RenderFillSizeArea
                                upperDesignItem={boyUpperRE}
                                lowerDesignItem={boyLowerRE}
                                UpdateSizeFunc={UpdateSizes}
                                initQty={size.reBoy}/>
                        </>
                    }
                    {
                        tab.main === '1' && tab.sub === '2' && hasRegular &&
                        <>
                            <RenderSummarySizeQuantityArea
                                qty={size.reGirl ? SumSizeQty(size.reGirl) : 0}
                            />
                            <RenderFillSizeArea
                                upperDesignItem={girlUpperRE}
                                lowerDesignItem={girlLowerRE}
                                UpdateSizeFunc={UpdateSizes}
                                initQty={size.reGirl}/>
                        </>
                    }
                    {
                        tab.main === '2' && tab.sub === '1' && hasPE &&
                        <>
                            <RenderSummarySizeQuantityArea
                                qty={size.peBoy ? SumSizeQty(size.peBoy) : 0}
                            />
                            <RenderFillSizeArea
                                upperDesignItem={boyUpperPE}
                                lowerDesignItem={boyLowerPE}
                                UpdateSizeFunc={UpdateSizes}
                                initQty={size.peBoy}/>
                        </>
                    }
                    {
                        tab.main === '2' && tab.sub === '2' && hasPE &&
                        <>
                            <RenderSummarySizeQuantityArea
                                qty={size.peGirl ? SumSizeQty(size.peGirl) : 0}
                            />
                            <RenderFillSizeArea
                                upperDesignItem={girlUpperPE}
                                lowerDesignItem={girlLowerPE}
                                UpdateSizeFunc={UpdateSizes}
                                initQty={size.peGirl}/>
                        </>
                    }
                </Paper>
            </Paper>
        </>
    )
}

function RenderFinalStep({hasRegular, hasPE}) {
    const sRequest = localStorage.getItem('sRequest') ? localStorage.getItem('sRequest') : null
    const today = dayjs()
    const tomorrow = dayjs().add(1, 'day')
    const [tab, setTab] = useState('1')
    const [orderData, setOrderData] = useState(localStorage.getItem('orderData_' + sRequest) ? JSON.parse(localStorage.getItem('orderData_' + sRequest)) : {
        deadline: tomorrow.format('YYYY-MM-DD'),
        note: ''
    })
    const sizes = localStorage.getItem('size_' + sRequest) ? JSON.parse(localStorage.getItem('size_' + sRequest)) : null

    const reBoy = sizes.reBoy
    const reGirl = sizes.reGirl
    const peBoy = sizes.peBoy
    const peGirl = sizes.peGirl

    if (!localStorage.getItem("orderData_" + sRequest)) {
        localStorage.setItem("orderData_" + sRequest, JSON.stringify(orderData))
    }

    const handleUpdateOrderData = (name, value) => {
        const newData = {...orderData, [name]: value}
        localStorage.setItem("orderData_" + sRequest, JSON.stringify(newData))
        setOrderData(newData)
    }

    return (
        <>
            <Paper elevation={4} sx={{paddingX: '2vw', paddingY: '2vh', marginTop: '2vh', width: '100%'}}>
                <Typography sx={{fontWeight: 'bold', fontSize: '1.3rem', fontStyle: 'italic'}}>
                    Let's review your order
                </Typography>
                <Divider sx={{width: '100%', borderTop: '1px solid black', marginTop: '1vh'}} variant={'fullWidth'}/>

                {/*Order date*/}
                <Paper elevation={0} sx={{marginTop: '2vh', width: '100%'}}>
                    <Typography sx={{fontSize: '1rem'}}>
                        1. Order date
                    </Typography>
                    <DateField
                        value={today}
                        sx={{marginTop: '0.5vh', width: '100%'}}
                        format={'DD/MM/YYYY'}
                        readOnly/>
                </Paper>

                {/*Size*/}
                <Paper elevation={0} sx={{marginTop: '2vh', width: '100%'}}>
                    <Typography sx={{fontSize: '1rem'}}>
                        2. Added size
                    </Typography>
                    <Paper variant={'outlined'} sx={{marginTop: '0.5vh', width: '100%'}}>
                        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered variant={'fullWidth'}
                              sx={{width: '100%'}}>
                            <Tab label={"Regular Uniform"} value={'1'}/>
                            <Tab label={"Physical Education Uniform"} value={'2'}/>
                        </Tabs>
                        {
                            tab === '1' && hasRegular &&
                            <Paper elevation={0} sx={{marginY: '2vh', paddingX: '1vw', display: 'flex', width: '100%'}}>
                                {/*Regular boy*/}
                                <Paper elevation={0} sx={{flex: 1, borderRadius: '0px'}}>
                                    <Typography>
                                        <span className={'fw-bold'}>Gender: </span> Boy
                                    </Typography>
                                    <Typography>
                                        <span
                                            className={'fw-bold'}>Qty: </span> {reBoy.S + reBoy.M + reBoy.L + reBoy.XL + reBoy.XXL + reBoy.XXXL + reBoy.XXXXL} uniform(s)
                                    </Typography>
                                    <Typography>
                                        <span className={'fw-bold'}>Including: </span>
                                    </Typography>
                                    <div className={'ms-2'}>
                                        {reBoy.S !== 0 && <Typography>S: {reBoy.S}</Typography>}
                                        {reBoy.M !== 0 && <Typography>M: {reBoy.M}</Typography>}
                                        {reBoy.L !== 0 && <Typography>L: {reBoy.L}</Typography>}
                                        {reBoy.XL !== 0 && <Typography>XL: {reBoy.XL}</Typography>}
                                        {reBoy.XXL !== 0 && <Typography>XXL: {reBoy.XXL}</Typography>}
                                        {reBoy.XXXL !== 0 && <Typography>3XL: {reBoy.XXXL}</Typography>}
                                        {reBoy.XXXXL !== 0 && <Typography>4XL: {reBoy.XXXXL}</Typography>}
                                    </div>
                                </Paper>

                                {/*Regular girl*/}
                                <Paper elevation={0} sx={{flex: 1, borderLeft: '2px solid black', borderRadius: '0px'}}>
                                    <Typography sx={{paddingLeft: '1vw'}}>
                                        <span className={'fw-bold'}>Gender: </span> Girl
                                    </Typography>
                                    <Typography sx={{paddingLeft: '1vw'}}>
                                        <span
                                            className={'fw-bold'}>Qty: </span> {reGirl.S + reGirl.M + reGirl.L + reGirl.XL + reGirl.XXL + reGirl.XXXL + reGirl.XXXXL} uniform(s)
                                    </Typography>
                                    <Typography sx={{paddingLeft: '1vw'}}>
                                        <span className={'fw-bold'}>Including: </span>
                                    </Typography>
                                    <div className={'ms-4'}>
                                        {reGirl.S !== 0 && <Typography>S: {reGirl.S}</Typography>}
                                        {reGirl.M !== 0 && <Typography>M: {reGirl.M}</Typography>}
                                        {reGirl.L !== 0 && <Typography>L: {reGirl.L}</Typography>}
                                        {reGirl.XL !== 0 && <Typography>XL: {reGirl.XL}</Typography>}
                                        {reGirl.XXL !== 0 && <Typography>XXL: {reGirl.XXL}</Typography>}
                                        {reGirl.XXXL !== 0 && <Typography>3XL: {reGirl.XXXL}</Typography>}
                                        {reGirl.XXXXL !== 0 && <Typography>4XL: {reGirl.XXXXL}</Typography>}
                                    </div>
                                </Paper>
                            </Paper>
                        }
                        {
                            tab === '2' && hasPE &&
                            <Paper elevation={0} sx={{marginY: '2vh', paddingX: '1vw', display: 'flex', width: '100%'}}>
                                {/*PE boy*/}
                                <Paper elevation={0} sx={{flex: 1, borderRadius: '0px'}}>
                                    <Typography>
                                        <span className={'fw-bold'}>Gender: </span> Boy
                                    </Typography>
                                    <Typography>
                                        <span
                                            className={'fw-bold'}>Qty: </span> {peBoy.S + peBoy.M + peBoy.L + peBoy.XL + peBoy.XXL + peBoy.XXXL + peBoy.XXXXL} uniform(s)
                                    </Typography>
                                    <Typography>
                                        <span className={'fw-bold'}>Including: </span>
                                    </Typography>
                                    <div className={'ms-2'}>
                                        {peBoy.S !== 0 && <Typography>S: {peBoy.S}</Typography>}
                                        {peBoy.M !== 0 && <Typography>M: {peBoy.M}</Typography>}
                                        {peBoy.L !== 0 && <Typography>L: {peBoy.L}</Typography>}
                                        {peBoy.XL !== 0 && <Typography>XL: {peBoy.XL}</Typography>}
                                        {peBoy.XXL !== 0 && <Typography>XXL: {peBoy.XXL}</Typography>}
                                        {peBoy.XXXL !== 0 && <Typography>3XL: {peBoy.XXXL}</Typography>}
                                        {peBoy.XXXXL !== 0 && <Typography>4XL: {peBoy.XXXXL}</Typography>}
                                    </div>
                                </Paper>

                                {/*PE girl*/}
                                <Paper elevation={0} sx={{flex: 1, borderLeft: '2px solid black', borderRadius: '0px'}}>
                                    <Typography sx={{paddingLeft: '1vw'}}>
                                        <span className={'fw-bold'}>Gender: </span> Girl
                                    </Typography>
                                    <Typography sx={{paddingLeft: '1vw'}}>
                                        <span
                                            className={'fw-bold'}>Qty: </span> {peGirl.S + peGirl.M + peGirl.L + peGirl.XL + peGirl.XXL + peGirl.XXXL + peGirl.XXXXL} uniform(s)
                                    </Typography>
                                    <Typography sx={{paddingLeft: '1vw'}}>
                                        <span className={'fw-bold'}>Including: </span>
                                    </Typography>
                                    <div className={'ms-4'}>
                                        {peGirl.S !== 0 && <Typography>S: {peGirl.S}</Typography>}
                                        {peGirl.M !== 0 && <Typography>M: {peGirl.M}</Typography>}
                                        {peGirl.L !== 0 && <Typography>L: {peGirl.L}</Typography>}
                                        {peGirl.XL !== 0 && <Typography>XL: {peGirl.XL}</Typography>}
                                        {peGirl.XXL !== 0 && <Typography>XXL: {peGirl.XXL}</Typography>}
                                        {peGirl.XXXL !== 0 && <Typography>3XL: {peGirl.XXXL}</Typography>}
                                        {peGirl.XXXXL !== 0 && <Typography>4XL: {peGirl.XXXXL}</Typography>}
                                    </div>
                                </Paper>
                            </Paper>
                        }
                    </Paper>
                </Paper>
            </Paper>

            <Paper elevation={4} sx={{paddingX: '2vw', paddingY: '2vh', marginTop: '2vh', width: '100%'}}>
                <Typography sx={{fontWeight: 'bold', fontSize: '1.3rem', fontStyle: 'italic'}}>
                    Almost done now, let's fill in the final information
                </Typography>
                <Divider sx={{width: '100%', borderTop: '1px solid black', marginTop: '1vh'}} variant={'fullWidth'}/>

                {/*Deadline*/}
                <Paper elevation={0} sx={{marginTop: '2vh', width: '100%'}}>
                    <Typography sx={{fontSize: '1rem'}}>
                        1. Select the date you want to receive <span className={'text-danger'}>*</span>
                    </Typography>
                    <DatePicker
                        sx={{marginTop: '0.5vh', width: '100%'}}
                        format={'DD/MM/YYYY'}
                        minDate={tomorrow}
                        value={orderData.deadline ? dayjs(orderData.deadline) : tomorrow}
                        onChange={(newValue) => handleUpdateOrderData('deadline', dayjs(newValue).format('YYYY-MM-DD'))}
                        slotProps={{
                            layout: {
                                sx: {
                                    borderRadius: '20px'
                                }
                            }
                        }}/>
                </Paper>

                {/*Note*/}
                <Paper elevation={0} sx={{marginTop: '2vh', width: '100%'}}>
                    <Typography sx={{fontSize: '1rem'}}>
                        2. Give your note
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={3}
                        value={orderData.note}
                        onChange={(e) => handleUpdateOrderData('note', e.target.value)}
                        type={'text'}
                    />
                </Paper>
            </Paper>
        </>
    )
}

function CheckExistedUniform(design, type) {
    return !!(design && design.cloth.find(item => item.clothCategory === type))
}

function CheckIfSizeHasNull(size) {
    for (const key in size) {
        if (Object.prototype.hasOwnProperty.call(size, key)) {
            const value = size[key]
            if (value === null) {
                return true
            }
        }
    }
    return false
}

function GetFilledSize() {
    return localStorage.getItem('sRequest') && localStorage.getItem('size_' + localStorage.getItem('sRequest')) ?
        JSON.parse(localStorage.getItem('size_' + localStorage.getItem('sRequest'))) :
        null
}

function BuildOrderDesignItem(hasRegular, hasPE, requestDesignItem, size) {
    const designItems = []

    const mapSize = (selectedSize) => {
        return Object.entries(selectedSize)
            .filter(([name, qty]) => name !== '' && typeof qty === 'number' && qty > 0)
            .map(([name, qty]) => ({name: name, quantity: qty}));
    }

    if (hasRegular) {
        const reBoyUpper = requestDesignItem.find(designItem => designItem.clothCategory === 'regular' && designItem.gender === 'boy' && designItem.clothType === 'shirt')
        const reBoyLower = requestDesignItem.find(designItem => designItem.clothCategory === 'regular' && designItem.gender === 'boy' && designItem.clothType === 'pants')
        const reGirlUpper = requestDesignItem.find(designItem => designItem.clothCategory === 'regular' && designItem.gender === 'girl' && designItem.clothType === 'shirt')
        const reGirlLower = requestDesignItem.find(designItem => designItem.clothCategory === 'regular' && designItem.gender === 'girl' && (designItem.clothType === 'pants' || designItem.clothType === 'skirt'))

        const boySize = mapSize(size.reBoy)
        const girlSize = mapSize(size.reGirl)

        const boyUpper = {
            id: reBoyUpper.id,
            type: reBoyUpper.clothType,
            gender: reBoyUpper.gender,
            sizeList: boySize
        }

        const boyLower = {
            id: reBoyLower.id,
            type: reBoyLower.clothType,
            gender: reBoyLower.gender,
            sizeList: boySize
        }

        const girlUpper = {
            id: reGirlUpper.id,
            type: reGirlUpper.clothType,
            gender: reGirlUpper.gender,
            sizeList: girlSize
        }

        const girlLower = {
            id: reGirlLower.id,
            type: reGirlLower.clothType,
            gender: reGirlLower.gender,
            sizeList: girlSize
        }

        designItems.push(boyUpper)
        designItems.push(boyLower)
        designItems.push(girlUpper)
        designItems.push(girlLower)
    }

    if (hasPE) {
        const peBoyUpper = requestDesignItem.find(designItem => designItem.clothCategory === 'pe' && designItem.gender === 'boy' && designItem.clothType === 'shirt')
        const peBoyLower = requestDesignItem.find(designItem => designItem.clothCategory === 'pe' && designItem.gender === 'boy' && designItem.clothType === 'pants')
        const peGirUpper = requestDesignItem.find(designItem => designItem.clothCategory === 'pe' && designItem.gender === 'girl' && designItem.clothType === 'shirt')
        const peGirLower = requestDesignItem.find(designItem => designItem.clothCategory === 'pe' && designItem.gender === 'girl' && designItem.clothType === 'pants')

        const boySize = mapSize(size.peBoy)
        const girlSize = mapSize(size.peGirl)

        const boyUpper = {
            id: peBoyUpper.id,
            type: peBoyUpper.clothType,
            gender: peBoyUpper.gender,
            sizeList: boySize
        }

        const boyLower = {
            id: peBoyLower.id,
            type: peBoyLower.clothType,
            gender: peBoyLower.gender,
            sizeList: boySize
        }

        const girlUpper = {
            id: peGirUpper.id,
            type: peGirUpper.clothType,
            gender: peGirUpper.gender,
            sizeList: girlSize
        }

        const girlLower = {
            id: peGirLower.id,
            type: peGirLower.clothType,
            gender: peGirLower.gender,
            sizeList: girlSize
        }

        designItems.push(boyUpper)
        designItems.push(boyLower)
        designItems.push(girlUpper)
        designItems.push(girlLower)
    }

    return designItems
}

function RenderPage({selectedDesign}) {
    const navigate = useNavigate()

    console.log("selectedDesign: ", selectedDesign)

    const [currentStep, setCurrentStep] = useState(parseInt(localStorage.getItem("formStep")))

    const hasRegular = CheckExistedUniform(selectedDesign, 'regular')

    const hasPE = CheckExistedUniform(selectedDesign, 'pe')

    const filledSize = GetFilledSize()

    const defaultLock = filledSize === null || CheckIfSizeHasNull(filledSize)

    const [lock, setLock] = useState(defaultLock)

    function HandleSetLock(lockStatus) {
        setLock(lockStatus)
    }

    async function CreateOrder(findGarment) {

        if (localStorage.getItem('orderData_' + selectedDesign.id) && localStorage.getItem('sRequest')) {
            const schoolId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null
            const deadline = localStorage.getItem('orderData_' + localStorage.getItem('sRequest')) ? JSON.parse(localStorage.getItem('orderData_' + localStorage.getItem('sRequest'))).deadline : null
            const note = localStorage.getItem('orderData_' + localStorage.getItem('sRequest')) ? JSON.parse(localStorage.getItem('orderData_' + localStorage.getItem('sRequest'))).note : null
            const requestDesignItem = selectedDesign.cloth
            const size = JSON.parse(localStorage.getItem('size_' + selectedDesign.id))
            const items = BuildOrderDesignItem(hasRegular, hasPE, requestDesignItem, size)

            await createOrder(schoolId, items, deadline, note).then(res => {
                if (res && res.status === 201) {
                    enqueueSnackbar(res.data.message, {variant: 'success'})
                    localStorage.removeItem('orderData_' + selectedDesign.id)
                    localStorage.removeItem('size_' + selectedDesign.id)
                    localStorage.removeItem('sRequest')
                    localStorage.removeItem('formStep')
                    if (findGarment) {
                        localStorage.setItem("sOrder", res.data.data.orderId)
                        window.location.href = "/list/garment"
                    } else {
                        window.location.href = "/school/d/order"
                    }
                }
            }).catch(e => {
                enqueueSnackbar(e.response.data.message, {variant: 'error'})
            })

        }
    }

    return (
        <div className={'d-flex flex-column align-items-center'}>
            <Paper square elevation={0} sx={{width: '78vw', marginTop: '2vh'}}>
                {/* Header */}
                <Paper elevation={0} sx={{padding: 0, height: '10vh', display: 'flex', alignItems: 'center'}}>
                    <Typography variant={'h4'}>Create Order</Typography>
                </Paper>

                {/* Content */}
                <Paper elevation={0} sx={{width: '100%', marginX: 'auto'}}>
                    {
                        !selectedDesign ?
                            (
                                <Paper elevation={6}>
                                    <Paper elevation={0}
                                           sx={{
                                               display: 'flex',
                                               flexDirection: 'column',
                                               alignItems: 'center'
                                           }}
                                    >
                                        <Typography variant={'body1'}
                                                    fontSize={20}
                                                    color={'error'}
                                                    sx={{
                                                        marginBottom: '2vh',
                                                        marginTop: '10vh'
                                                    }}
                                        >
                                            No selected design request, click the button to select one
                                        </Typography>
                                        <Button variant={"contained"}
                                                color={"info"}
                                                onClick={() => {
                                                    navigate('/school/d/design')
                                                }}
                                        >
                                            Select your design request
                                        </Button>
                                        <Divider variant={"middle"} sx={{width: '30%', opacity: 1, marginY: '2vh'}}
                                                 textAlign={"center"}>Or</Divider>
                                        <Button variant={"contained"}
                                                color={"error"}
                                                sx={{
                                                    marginBottom: '10vh'
                                                }}
                                                onClick={() => {
                                                    navigate('/school/d/order')
                                                }}
                                        >
                                            Go back to your order history
                                        </Button>
                                    </Paper>
                                </Paper>
                            )
                            :
                            (
                                <div className={'d-flex flex-column align-items-start'}>
                                    <Paper elevation={4} sx={{width: '100%'}}>
                                        <RenderStepper step={currentStep}/>
                                    </Paper>
                                    {
                                        currentStep === 0 &&
                                        <RenderFirstStep
                                            selectedDesign={selectedDesign}
                                            hasPE={hasPE}
                                            hasRegular={hasRegular}/>
                                    }
                                    {
                                        currentStep === 1 &&
                                        <RenderSecondStep
                                            designItems={selectedDesign.cloth}
                                            hasPE={hasPE}
                                            hasRegular={hasRegular}
                                            SetLockFunc={HandleSetLock}
                                        />
                                    }
                                    {
                                        currentStep === 2 &&
                                        <RenderFinalStep
                                            selectedDesign={selectedDesign}
                                            hasPE={hasPE}
                                            hasRegular={hasRegular}
                                        />
                                    }
                                    <Paper elevation={0} sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginTop: '3vh',
                                        gap: '1vw'
                                    }}>
                                        {
                                            currentStep > 0 &&
                                            <RenderTooltip title={'Back to step ' + (currentStep)}>
                                                <Button variant={'outlined'}
                                                        color={'error'}
                                                        onClick={() => setCurrentStep(currentStep - 1)}
                                                >
                                                    Back
                                                </Button>
                                            </RenderTooltip>
                                        }
                                        {
                                            currentStep < 2 &&
                                            <RenderTooltip
                                                title={'Move to step ' + (currentStep + 2)}>
                                                <Button variant={'contained'} color={'primary'}
                                                        onClick={() => setCurrentStep(currentStep + 1)}
                                                        disabled={currentStep === 1 && lock}
                                                >
                                                    Next
                                                </Button>
                                            </RenderTooltip>
                                        }
                                        {
                                            currentStep === 2 &&
                                            <>
                                                <RenderTooltip title={''}>
                                                    <Button variant={'contained'}
                                                            color={'success'}
                                                            onClick={() => CreateOrder(false)}
                                                    >
                                                        Create Only
                                                    </Button>
                                                </RenderTooltip>
                                                <RenderTooltip title={''}>
                                                    <Button variant={'contained'}
                                                            color={'secondary'}
                                                            onClick={() => CreateOrder(true)}
                                                    >
                                                        Create and select your garment
                                                    </Button>
                                                </RenderTooltip>
                                            </>
                                        }
                                    </Paper>
                                </div>
                            )
                    }
                </Paper>
            </Paper>
        </div>
    )
}

export default function OrderFillForm() {
    document.title = 'Create order'
    window.scrollTo(0, 0)
    const [design, setDesign] = useState([])

    async function GetCompletedDesignRequests() {
        const response = await getCompleteDesignRequest()
        if (response && response.status === 200) {
            setDesign(response.data.data)
        }
    }

    useEffect(() => {
        GetCompletedDesignRequests()
    }, [])

    return (
        <RenderPage selectedDesign={design.find(d => d.id.toLocaleString() === localStorage.getItem('sRequest'))}/>
    )
}