import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Checkbox,
    Divider,
    Fade,
    FormControlLabel,
    Grid,
    IconButton,
    Paper,
    Rating,
    Tooltip,
    tooltipClasses,
    Typography
} from "@mui/material";
import {RestartAlt} from '@mui/icons-material';
import {Input, Select} from 'antd';
import {useEffect, useState} from "react";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {getAllGarmentProfile} from "../../../services/ProfileService.jsx";

function RenderCard({garment}) {
    return (
        <Card sx={{height: '100%', width: '100%', background: 'whitesmoke'}} raised>
            <CardMedia
                component="img"
                alt="green iguana"
                height="200"
                image={garment.profile.avatar}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 'bold'}}>
                    {garment.profile.name}
                </Typography>
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                    {garment.outsidePreview}
                </Typography>
                <Rating value={garment.rating} readOnly sx={{marginY: '1vh'}}/>
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                    <span
                        className={'fw-bold'}>Working time:</span> {garment.startTime.substring(0, 5)} - {garment.endTime.substring(0, 5)}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">View Detail</Button>
            </CardActions>
        </Card>
    )
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

function RenderStatusFilter() {
    const [checked, setChecked] = useState([false, false]);

    const checkAvailable = (e) => {
        setChecked([e.target.checked, checked[1]]);
    }

    const checkBusy = (e) => {
        setChecked([checked[0], e.target.checked]);
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', marginX: '1vw', marginY: '2vh'}}>
            <Typography
                variant={'body1'}
                sx={{
                    fontWeight: 'bold',
                    fontSize: '1.3rem'
                }}
            >
                Status
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <FormControlLabel
                    value={'available'}
                    control={<Checkbox size={'medium'} checked={checked[0] || (!checked[0] && !checked[1])}
                                       onChange={checkAvailable}/>}
                    label="Available"
                />
                <FormControlLabel
                    value={'busy'}
                    control={<Checkbox size={'medium'} checked={checked[1]} onChange={checkBusy}/>}
                    label="Busy"
                />
            </Box>
            <Divider variant={'fullWidth'} sx={{width: '100%', borderTop: '1px solid black', marginTop: '2vh'}}/>
        </Box>
    )
}

function RenderRatingFilter() {

    const [rating, setRating] = useState(0)

    const [hoverValue, setHoverValue] = useState(-1)

    const label = {
        0: 'Select all',
        1: '≤ 1 star',
        2: '≤ 2 stars',
        3: '≤ 3 stars',
        4: '≤ 4 stars',
        5: '≤ 5 stars'
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', marginX: '1vw', marginY: '2vh'}}>
            <Box sx={{display: 'flex', gap: '0.5vw', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography
                    variant={'body1'}
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '1.3rem'
                    }}
                >
                    Rating
                </Typography>
                <Button onClick={() => {
                    setRating(0)
                }}>Clear</Button>
            </Box>
            <Box sx={{display: 'flex', gap: '0.5vw', alignItems: 'center'}}>
                <Rating
                    value={rating}
                    onChange={(event, newValue) => {
                        setRating(newValue);
                    }}
                    onChangeActive={(e, newValue) => {
                        setHoverValue(newValue)
                    }}
                />
                <Typography
                    fontSize={'1rem'}>{hoverValue !== -1 ? label[hoverValue] : (rating === null ? label[0] : label[rating])}</Typography>
            </Box>
            <Divider variant={'fullWidth'} sx={{width: '100%', borderTop: '1px solid black', marginTop: '2vh'}}/>
        </Box>
    )
}

function RenderWorkingTimeFilter() {
    const minTime = dayjs().set('hour', 0).set('minute', 0).set('second', 0)
    const maxTime = dayjs().set('hour', 23).set('minute', 55).set('second', 0)

    const [time, setTime] = useState([null, null])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{display: 'flex', flexDirection: 'column', marginX: '1vw', marginY: '2vh'}}>
                <Box sx={{display: 'flex', gap: '0.5vw', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography
                        variant={'body1'}
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '1.3rem'
                        }}
                    >
                        Working time
                    </Typography>
                    <Button onClick={() => {
                        setTime([null, null])
                    }}>Clear</Button>
                </Box>
                <Box sx={{display: 'flex', gap: '0.5vw', marginTop: '2vh', alignItems: 'center'}}>
                    <TimePicker
                        label={"From"}
                        ampm={false}
                        value={time[0]}
                        onChange={(newValue) => {
                            setTime([newValue, time[1]])
                        }}
                        minTime={minTime}
                        maxTime={maxTime}
                        format={"HH:mm"}
                        sx={{width: '8vw',}}
                    />
                    <TimePicker
                        label={"To"}
                        ampm={false}
                        value={time[1] !== null ? time[1] : (time[0] === null ? null : time[0].add(5, 'minute'))}
                        onChange={(newValue) => {
                            setTime([time[0], newValue])
                        }}
                        disabled={time[0] === null}
                        minTime={time[0] === null ? null : time[0].add(5, 'minute')}
                        maxTime={maxTime}
                        format={"HH:mm"}
                        sx={{width: '8vw',}}
                    />
                </Box>
                <Divider variant={'fullWidth'} sx={{width: '100%', borderTop: '1px solid black', marginTop: '2vh'}}/>
            </Box>
        </LocalizationProvider>
    )
}

function RenderContentArea({garments}) {
    return (
        <Paper
            elevation={0}
            sx={{
                width: '90%',
                marginX: 'auto'
            }}
            component={"div"}
        >
            <Grid container spacing={3}>
                {
                    garments && garments.length > 0 ?
                        (
                            garments.map((garment, index) => (
                                <Grid key={index} size={3}>
                                    <RenderCard garment={garment}/>
                                </Grid>
                            ))
                        )
                        :
                        ""
                }
            </Grid>
        </Paper>
    )
}

function RenderSearchArea(
    {
        ClearSearch,
        UpdateNameAndSort
    }
) {
    const [input, setInput] = useState({
        text: "",
        type: "name1"
    })

    const handleSearch = (e, type) => {
        let newInput = null
        if(type === 'name'){
            newInput = {...input, text: e.target.value}
        }else {
            newInput = {...input, type: e.target.value}
        }
        setInput(newInput)
        UpdateNameAndSort(newInput.text, newInput.type)
    }



    return (
        <Paper
            elevation={0}
            sx={{
                marginTop: '10vh',
                width: '90%',
                marginX: 'auto'
            }}
            component={"div"}
        >
            <Box sx={{display: 'flex', gap: '1vw'}}>
                <Input
                    placeholder={"Enter garment factory name to search..."}
                    onChange={(e) => handleSearch(e, 'name')}
                    style={{width: '60vw'}}
                />
                <Select
                    prefix="Sort by:  "
                    defaultValue="name1"
                    style={{width: '12vw', height: '6vh'}}
                    onChange={(e) => handleSearch(e, 'sort')}
                    options={[
                        {value: 'name1', label: 'Name (A-Z)'},
                        {value: 'name2', label: 'Name (Z-A)'},
                        {value: 'rating1', label: 'Rating ↑'},
                        {value: 'rating2', label: 'Rating ↓'}
                    ]}
                />
                <RenderTooltip title={'Clear search information'}>
                    <IconButton
                        color={'error'}
                        sx={{
                            backgroundColor: 'red',
                            borderRadius: '10px',
                            "&:hover": {
                                backgroundColor: 'darkred',
                            }
                        }}
                    >
                        <RestartAlt sx={{fill: 'white'}}/>
                    </IconButton>
                </RenderTooltip>
            </Box>
        </Paper>
    )
}

function RenderFilterArea(
    {
        UpdateStatus,
        UpdateRating,
        UpdateStartTime,
        UpdateEndTime
    }
) {
    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                backgroundColor: "rgb(97% 98% 98%)",
            }}
            component={"div"}
        >
            <RenderStatusFilter/>
            <RenderRatingFilter/>
            <RenderWorkingTimeFilter/>
        </Paper>
    )
}

function RenderPage(
    {
        garments,
        ClearSearch,
        UpdateStatus,
        UpdateRating,
        UpdateStartTime,
        UpdateEndTime,
        UpdateNameAndSort
    }) {
    return (
        <Paper
            elevation={0}
            sx={{
                width: '100vw',
                display: 'flex',
            }}
            component={"div"}
        >
            <Paper
                elevation={0}
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flex: 1,
                }}
                component={"div"}
            >
                <RenderFilterArea
                    UpdateStatus={UpdateStatus}
                    UpdateRating={UpdateRating}
                    UpdateStartTime={UpdateStartTime}
                    UpdateEndTime={UpdateEndTime}
                />
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 5,
                    gap: '4vh',
                }}
                component={"div"}
            >
                <RenderSearchArea
                    ClearSearch={ClearSearch}
                    UpdateNameAndSort={UpdateNameAndSort}
                />
                <RenderContentArea garments={garments}/>
            </Paper>
        </Paper>
    )
}

export default function GarmentList() {
    document.title = "Garment Selection"

    const [garments, setGarments] = useState([])
    const [filterData, setFilterData] = useState({
        status: "available",
        rating: 0,
        time: {start: null, end: null},
        name: '',
        sort: "name1"
    })

    if (!localStorage.getItem("sOrder")) {
        window.location.href = "/school/d/order"
    }

    async function FetchGarments() {
        const response = await getAllGarmentProfile()
        if (response && response.status === 200) {
            setGarments(response.data.data)
        }
    }

    useEffect(() => {
        FetchGarments()
    }, [])

    function ClearSearch() {
        setFilterData({...filterData, name: "", sort: "name1"})
    }

    function UpdateStatus(value) {
        setFilterData({...filterData, status: value})
    }

    function UpdateRating(value) {
        setFilterData({...filterData, rating: value})
    }

    function UpdateStartTime(value) {
        setFilterData({...filterData, time: {...filterData.time, start: value}})
    }

    function UpdateEndTime(value) {
        setFilterData({...filterData, time: {...filterData.time, end: value}})
    }

    function UpdateNameAndSort(name, sort) {
        setFilterData({...filterData, name: name, sort: sort})
    }
    console.log("Filter data", filterData)
    console.log("Garments: ", garments)
    console.log("Filter: ", garments.filter(garment =>
        garment.profile.name.toLowerCase().includes(filterData.name.toLowerCase())
    ))
    return (
        <RenderPage
            garments={
                garments.filter(garment =>
                    garment.profile.name.toLowerCase().includes(filterData.name.toLowerCase())
                )
            }
            ClearSearch={ClearSearch}
            UpdateStatus={UpdateStatus}
            UpdateRating={UpdateRating}
            UpdateStartTime={UpdateStartTime}
            UpdateEndTime={UpdateEndTime}
            UpdateNameAndSort={UpdateNameAndSort}
        />
    )
}