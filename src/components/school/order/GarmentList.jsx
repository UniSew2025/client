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
import {getAllGarmentProfile} from "../../../services/ProfileService.jsx";
import {useNavigate} from "react-router-dom";

function RenderCard({garment}) {
    const navigate = useNavigate()
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
                <Button size="small" onClick={() => navigate("/garment/detail", {
                    state: {
                        garmentId: garment.id
                    }
                })}>View Detail</Button>
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

function RenderStatusFilter({UpdateStatus}) {
    const [checked, setChecked] = useState([false, false]);

    if(!checked[0] && !checked[1]) setChecked([true, false]);

    const checkAvailable = (e) => {
        let newData = [e.target.checked, checked[1]]
        if(!newData[0] && !newData[1]) newData = [true, false]
        setChecked(newData);
        UpdateStatus(newData[0] && newData[1] ? "both" : (!newData[0] && newData[1] ? "busy" : "available"));
    }

    const checkBusy = (e) => {
        let newData = [checked[0], e.target.checked]
        if(!newData[0] && !newData[1]) newData = [true, false]
        setChecked(newData);
        UpdateStatus(newData[0] && newData[1] ? "both" : (!newData[0] && newData[1] ? "busy" : "available"));
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

function RenderRatingFilter({UpdateRating}) {

    const [rating, setRating] = useState(5)

    const [hoverValue, setHoverValue] = useState(-1)

    const label = {
        0: '0 star',
        1: '≤ 1 star',
        2: '≤ 2 stars',
        3: '≤ 3 stars',
        4: '≤ 4 stars',
        5: '≤ 5 stars'
    }

    const handleSetRating = (e, rating) => {
        setRating(rating)
        UpdateRating(rating)
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
            </Box>
            <Box sx={{display: 'flex', gap: '0.5vw', alignItems: 'center'}}>
                <Rating
                    value={rating}
                    onChange={(event, newValue) => handleSetRating(event, newValue)}
                    onChangeActive={(e, newValue) => setHoverValue(newValue)}
                />
                <Typography
                    fontSize={'1rem'}>{hoverValue !== -1 ? label[hoverValue] : (rating === null ? label[0] : label[rating])}</Typography>
            </Box>
            <Divider variant={'fullWidth'} sx={{width: '100%', borderTop: '1px solid black', marginTop: '2vh'}}/>
        </Box>
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

function RenderSearchArea({ClearSearch, UpdateNameAndSort}) {
    const [input, setInput] = useState({
        text: "",
        type: "name1"
    })

    const handleSearch = (e, type) => {
        let newInput = null
        if (type === 'name') {
            newInput = {...input, text: e.target.value}
        } else {
            newInput = {...input, type: e}
        }
        setInput(newInput)
        UpdateNameAndSort(newInput.text, newInput.type)
    }

    const handleClearSearch = () => {
        setInput({...input, text: "", type: "name1"})
        ClearSearch()
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
                    value={input.text}
                    onChange={(e) => handleSearch(e, 'name')}
                    style={{width: '60vw'}}
                />
                <Select
                    prefix="Sort by:  "
                    value={input.type}
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
                        onClick={handleClearSearch}
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

function RenderFilterArea({UpdateStatus, UpdateRating}) {
    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                backgroundColor: "rgb(97% 98% 98%)",
            }}
            component={"div"}
        >
            <RenderStatusFilter UpdateStatus={UpdateStatus}/>
            <RenderRatingFilter UpdateRating={UpdateRating}/>
        </Paper>
    )
}

function RenderPage(
    {
        garments,
        ClearSearch,
        UpdateStatus,
        UpdateRating,
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
                <Typography variant={'h4'} sx={{width: '90%', marginX: 'auto', marginTop: '1vh'}}>Garment Found: {garments.length}</Typography>
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
        rating: 5,
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

    function UpdateNameAndSort(name, sort) {
        setFilterData({...filterData, name: name, sort: sort})
    }

    let filterGarments = garments.filter(garment =>
        garment.profile.name.toLowerCase().includes(filterData.name.toLowerCase())
    )

    switch (filterData.sort) {
        case "name1": {
            filterGarments = filterGarments.sort((g1, g2) => g1.profile.name.localeCompare(g2.profile.name))
            break
        }
        case "name2": {
            filterGarments = filterGarments.sort((g1, g2) => g2.profile.name.localeCompare(g1.profile.name))
            break
        }
        case "rating1": {
            filterGarments = filterGarments.sort((g1, g2) => g1.rating - g2.rating)
            break
        }
        default: {
            filterGarments = filterGarments.sort((g1, g2) => g2.rating - g1.rating)
            break
        }
    }

    switch (filterData.status) {
        case "available":{
            filterGarments = filterGarments.filter(garment => !garment.busy)
            break
        }
        case "busy":{
            filterGarments = filterGarments.filter(garment => garment.busy)
            break
        }
    }

    filterGarments = filterGarments.filter(garment => garment.rating <= filterData.rating)

    return (
        <RenderPage
            garments={filterGarments}
            ClearSearch={ClearSearch}
            UpdateStatus={UpdateStatus}
            UpdateRating={UpdateRating}
            UpdateNameAndSort={UpdateNameAndSort}
        />
    )
}