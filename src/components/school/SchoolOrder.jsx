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
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Paper,
    Slide,
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
import {ColorPicker} from 'antd'
import {Add, Cancel, CheckCircle, RestartAlt} from "@mui/icons-material";
import {GiPoloShirt, GiSkirt} from "react-icons/gi"
import {PiPantsFill} from "react-icons/pi";
import {forwardRef, useEffect, useState} from "react";
import {getCompleteDesignRequest} from "../../services/DesignService.jsx";
import {useNavigate} from "react-router-dom";
import {enqueueSnackbar} from "notistack";
import ModalImage from "react-modal-image";

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
        <Stepper activeStep={step} alternativeLabel sx={{width: '100%'}}>
            {steps.map((label) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}

function RenderSummarySizeQuantityArea({upper, lower, upperQty, lowerQty}) {

    const handleClickScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    };

    return (
        <Paper variant={"outlined"} sx={{padding: '5px'}}>
            <Typography color={upperQty > 0 && lowerQty > 0 && upperQty === lowerQty ? 'success' : 'error'}>
                {
                    upperQty === 0 && lowerQty === 0 ?
                        '* Require at least 1 ' + upper.clothType.toLowerCase() + ' and 1 ' + lower.clothType.toLowerCase()
                        :
                        upperQty !== lowerQty ?
                            '* The quantity of ' + upper.clothType.toLowerCase() + ' must the same as ' + lower.clothType.toLowerCase()
                            :
                            'Valid Quantity'
                }
            </Typography>
            <List
                subheader={<ListSubheader sx={{height: '5vh', position: 'static'}}>Quantity:</ListSubheader>}
            >
                {/*Upper*/}
                <ListItem sx={{paddingY: 0}}>
                    <ListItemIcon sx={{minWidth: '1.8vw'}}>
                        <GiPoloShirt/>
                    </ListItemIcon>
                    <Link
                        href="#cloth1"
                        underline={"none"}
                        variant={'body1'}
                        color={'textPrimary'}
                        onClick={(e) => {
                            e.preventDefault()
                            handleClickScroll('cloth1')
                        }}
                    >
                        <ListItemText primary={upper.clothType.toLowerCase() + ': ' + upperQty}/>
                    </Link>
                </ListItem>

                {/*Lower*/}
                <ListItem sx={{paddingY: 0}}>
                    <ListItemIcon sx={{minWidth: '1.8vw'}}>
                        {lower.clothType.toLowerCase() === 'pants' ? <PiPantsFill/> : <GiSkirt/>}
                    </ListItemIcon>
                    <Link
                        href="#cloth2"
                        underline={"none"}
                        variant={'body1'}
                        color={'textPrimary'}
                        onClick={(e) => {
                            e.preventDefault()
                            handleClickScroll('cloth2')
                        }}
                    >
                        <ListItemText primary={lower.clothType.toLowerCase() + ': ' + lowerQty}/>
                    </Link>
                </ListItem>
            </List>
        </Paper>
    )
}

function RenderFillSizeArea({cloth, UpdateSizeFunc, initQty, id}) {

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
            id={id}
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
                            <div className={'d-flex justify-content-between'}>
                                <Typography variant={"body1"}
                                            fontSize={20}
                                            fontWeight={600}
                                            fontStyle={"italic"}
                                            sx={{marginTop: '2vh', marginBottom: '2vh'}}
                                >
                                    {cloth.clothType.substring(0, 1).toUpperCase() + cloth.clothType.substring(1).toUpperCase()}
                                </Typography>
                                <Typography variant={"body1"}
                                            fontSize={20}
                                            fontWeight={600}
                                            fontStyle={"italic"}
                                            sx={{marginTop: '2vh', marginBottom: '2vh'}}>
                                    Added Quantity: {totalQty} {cloth.clothType.toLowerCase()}
                                </Typography>
                            </div>
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

function RenderFirstStep({selectedRequest, hasRegular, hasPE}) {
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

function RenderSecondStep({cloths, hasRegular, hasPE, SetLockFunc}) {

    const [tab, setTab] = useState({
        main: '1',
        sub: '1'
    })

    const [size, setSize] = useState(localStorage.getItem('size') ? JSON.parse(localStorage.getItem('size')) : {
        reBoy: {upper: null, lower: null},
        reGirl: {upper: null, lower: null},
        peBoy: {upper: null, lower: null},
        peGirl: {upper: null, lower: null}
    })

    //Get list for size
    const boyUpperRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'boy' && cloth.clothType === 'shirt')
    const boyLowerRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'boy' && cloth.clothType === 'pants')
    const girlUpperRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'girl' && cloth.clothType === 'shirt')
    const girlLowerRE = cloths.find(cloth => cloth.clothCategory === 'regular' && cloth.gender === 'girl' && (cloth.clothType === 'pants' || cloth.clothType === 'skirt'))

    const boyUpperPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'boy' && cloth.clothType === 'shirt')
    const boyLowerPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'boy' && cloth.clothType === 'pants')
    const girlUpperPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'girl' && cloth.clothType === 'shirt')
    const girlLowerPE = cloths.find(cloth => cloth.clothCategory === 'pe' && cloth.gender === 'girl' && cloth.clothType === 'pants')

    //Condition for displaying
    const isREBoySizeFilled = size.reBoy.upper !== null && size.reBoy.lower !== null // Both upper and lower existed
    const isREGirlSizeFilled = size.reGirl.upper !== null && size.reGirl.lower !== null
    const isPEBoySizeFilled = size.peBoy.upper !== null && size.peBoy.lower !== null
    const isPEGirlSizeFilled = size.peGirl.upper !== null && size.peGirl.lower !== null

    const isREBoyTabChecked = tab.main === '1' && isREBoySizeFilled
    const isREGirlTabChecked = tab.main === '1' && isREGirlSizeFilled
    const isPEBoyTabChecked = tab.main === '2' && isPEBoySizeFilled
    const isPEGirlTabChecked = tab.main === '2' && isPEGirlSizeFilled

    const isRESizeFilled = isREBoySizeFilled && isREGirlSizeFilled
    const isPESizeFilled = isPEBoySizeFilled && isPEGirlSizeFilled

    const checkLock = (newSize) => {
        const isRENewSizeFilled = newSize.reBoy.upper !== null && newSize.reBoy.lower !== null && newSize.reGirl.upper !== null && newSize.reGirl.lower !== null
        const isPENewSizeFilled = newSize.peBoy.upper !== null && newSize.peBoy.lower !== null && newSize.peGirl.upper !== null && newSize.peGirl.lower !== null

        const condition1 = hasRegular && hasPE && (!isRENewSizeFilled || !isPENewSizeFilled)
        const condition2 = hasRegular && !hasPE && !isRENewSizeFilled
        const condition3 = !hasRegular && hasPE && !isPENewSizeFilled

        return condition1 || condition2 || condition3
    }

    function UpdateSizes(gender, type, position, newValue) {
        switch (type) {
            case 're':
                switch (gender) {
                    case 'boy':
                        switch (position) {
                            case 'upper': {
                                const newSize = (prevSize) => ({
                                    ...prevSize,
                                    reBoy: {...prevSize.reBoy, upper: newValue}
                                })
                                setSize(newSize(size))
                                localStorage.setItem("size", JSON.stringify(newSize(size)))
                                SetLockFunc(checkLock(newSize(size)))
                                break
                            }
                            default: {
                                const newSize = (prevSize) => ({
                                    ...prevSize,
                                    reBoy: {...prevSize.reBoy, lower: newValue}
                                })
                                setSize(newSize(size))
                                localStorage.setItem("size", JSON.stringify(newSize(size)))
                                SetLockFunc(checkLock(newSize(size)))
                                break
                            }
                        }
                        break
                    default:
                        switch (position) {
                            case 'upper': {
                                const newSize = (prevSize) => ({
                                    ...prevSize,
                                    reGirl: {...prevSize.reGirl, upper: newValue}
                                })
                                setSize(newSize(size))
                                localStorage.setItem("size", JSON.stringify(newSize(size)))
                                SetLockFunc(checkLock(newSize(size)))
                                break
                            }
                            default: {
                                const newSize = (prevSize) => ({
                                    ...prevSize,
                                    reGirl: {...prevSize.reGirl, lower: newValue}
                                })
                                setSize(newSize(size))
                                localStorage.setItem("size", JSON.stringify(newSize(size)))
                                SetLockFunc(checkLock(newSize(size)))
                                break
                            }
                        }
                        break
                }
                break
            default:
                switch (gender) {
                    case 'boy':
                        switch (position) {
                            case 'upper': {
                                const newSize = (prevSize) => ({
                                    ...prevSize,
                                    peBoy: {...prevSize.peBoy, upper: newValue}
                                })
                                setSize(newSize(size))
                                localStorage.setItem("size", JSON.stringify(newSize(size)))
                                SetLockFunc(checkLock(newSize(size)))
                                break
                            }
                            default: {
                                const newSize = (prevSize) => ({
                                    ...prevSize,
                                    peBoy: {...prevSize.peBoy, lower: newValue}
                                })
                                setSize(newSize(size))
                                localStorage.setItem("size", JSON.stringify(newSize(size)))
                                SetLockFunc(checkLock(newSize(size)))
                                break
                            }
                        }
                        break
                    default:
                        switch (position) {
                            case 'upper': {
                                const newSize = (prevSize) => ({
                                    ...prevSize,
                                    peGirl: {...prevSize.peGirl, upper: newValue}
                                })
                                setSize(newSize(size))
                                localStorage.setItem("size", JSON.stringify(newSize(size)))
                                SetLockFunc(checkLock(newSize(size)))
                                break
                            }
                            default: {
                                const newSize = (prevSize) => ({
                                    ...prevSize,
                                    peGirl: {...prevSize.peGirl, lower: newValue}
                                })
                                setSize(newSize(size))
                                localStorage.setItem("size", JSON.stringify(newSize(size)))
                                SetLockFunc(checkLock(newSize(size)))
                                break
                            }
                        }
                        break
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
                                upper={boyUpperRE}
                                lower={boyLowerRE}
                                upperQty={size.reBoy.upper ? SumSizeQty(size.reBoy.upper) : 0}
                                lowerQty={size.reBoy.lower ? SumSizeQty(size.reBoy.lower) : 0}
                            />
                            <RenderFillSizeArea cloth={boyUpperRE} UpdateSizeFunc={UpdateSizes}
                                                initQty={size.reBoy.upper} id={'cloth1'}/>
                            <RenderFillSizeArea cloth={boyLowerRE} UpdateSizeFunc={UpdateSizes}
                                                initQty={size.reBoy.lower} id={'cloth2'}/>
                        </>
                    }
                    {
                        tab.main === '1' && tab.sub === '2' && hasRegular &&
                        <>
                            <RenderSummarySizeQuantityArea
                                upper={girlUpperRE}
                                lower={girlLowerRE}
                                upperQty={size.reGirl.upper ? SumSizeQty(size.reGirl.upper) : 0}
                                lowerQty={size.reGirl.lower ? SumSizeQty(size.reGirl.lower) : 0}
                            />
                            <RenderFillSizeArea cloth={girlUpperRE} UpdateSizeFunc={UpdateSizes}
                                                initQty={size.reGirl.upper} id={'cloth1'}/>
                            <RenderFillSizeArea cloth={girlLowerRE} UpdateSizeFunc={UpdateSizes}
                                                initQty={size.reGirl.lower} id={'cloth2'}/>
                        </>
                    }
                    {
                        tab.main === '2' && tab.sub === '1' && hasPE &&
                        <>
                            <RenderSummarySizeQuantityArea
                                upper={boyUpperPE}
                                lower={boyLowerPE}
                                upperQty={size.peBoy.upper ? SumSizeQty(size.peBoy.upper) : 0}
                                lowerQty={size.peBoy.lower ? SumSizeQty(size.peBoy.lower) : 0}
                            />
                            <RenderFillSizeArea cloth={boyUpperPE} UpdateSizeFunc={UpdateSizes}
                                                initQty={size.peBoy.upper} id={'cloth1'}/>
                            <RenderFillSizeArea cloth={boyLowerPE} UpdateSizeFunc={UpdateSizes}
                                                initQty={size.peBoy.lower} id={'cloth2'}/>
                        </>
                    }
                    {
                        tab.main === '2' && tab.sub === '2' && hasPE &&
                        <>
                            <RenderSummarySizeQuantityArea
                                upper={girlUpperPE}
                                lower={girlLowerPE}
                                upperQty={size.peGirl.upper ? SumSizeQty(size.peGirl.upper) : 0}
                                lowerQty={size.peGirl.lower ? SumSizeQty(size.peGirl.lower) : 0}
                            />
                            <RenderFillSizeArea cloth={girlUpperPE} UpdateSizeFunc={UpdateSizes}
                                                initQty={size.peGirl.upper} id={'cloth1'}/>
                            <RenderFillSizeArea cloth={girlLowerPE} UpdateSizeFunc={UpdateSizes}
                                                initQty={size.peGirl.lower} id={'cloth2'}/>
                        </>
                    }
                </Paper>
            </Paper>
        </>
    )
}

function RenderCreateOrderModal({open, CloseFunc, selectedRequest}) {
    const navigate = useNavigate()

    const [currentStep, setCurrentStep] = useState(0)

    const transition = forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const hasRegular = !!(selectedRequest && selectedRequest.cloth.find(item => item.clothCategory === 'regular'))

    const hasPE = !!(selectedRequest && selectedRequest.cloth.find(item => item.clothCategory === 'pe'))

    const [lock, setLock] = useState(true)

    function HandleSetLock(lockStatus) {
        console.log("Input status: ", lockStatus)
        setLock(lockStatus)
    }

    console.log("Lock: ", lock)

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
                                    {
                                        currentStep === 0 &&
                                        <RenderFirstStep
                                            selectedRequest={selectedRequest}
                                            hasPE={hasPE}
                                            hasRegular={hasRegular}/>
                                    }
                                    {currentStep === 1 &&
                                        <RenderSecondStep
                                            cloths={selectedRequest.cloth}
                                            hasPE={hasPE}
                                            hasRegular={hasRegular}
                                            SetLockFunc={HandleSetLock}
                                        />
                                    }
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
                                    disabled={
                                        !selectedRequest ||
                                        (currentStep === 1 && lock)
                                    }>
                                Next
                            </Button>
                        </div>
                    </RenderTooltip>
                }
                {
                    currentStep === 2 &&
                    <RenderTooltip title={''}>
                        <div>
                            <Button variant={'contained'} color={'success'}
                                    onClick={() => {
                                        enqueueSnackbar('Create order successfully', {variant: 'success'})
                                        localStorage.removeItem('sRequest')
                                        CloseFunc()
                                        window.location.reload()
                                    }}>Create</Button>
                        </div>
                    </RenderTooltip>
                }
            </DialogActions>
        </Dialog>
    )
}

function RenderPage({selectedRequest}) {
    const [modal, setModal] = useState(localStorage.getItem('sRequest'))

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