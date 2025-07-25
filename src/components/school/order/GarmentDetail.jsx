import {Box, Button, Divider, Paper, Rating, Typography} from "@mui/material";
import {Send} from '@mui/icons-material';
import {Avatar, Carousel, Image} from 'antd';
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAllGarmentProfile} from "../../../services/ProfileService.jsx";
import {createQuotation} from "../../../services/OrderService.jsx";
import {enqueueSnackbar} from "notistack";

function RenderGarmentInformation({garment}) {
    return (
        <Box sx={{display: 'flex', alignItems: 'flex-start', marginTop: '2vh', gap: '2vw'}}>
            <Avatar size={80} style={{border: '1px solid black'}}
                    src={<Image src={garment.profile.avatar} alt={garment.profile.name}/>}/>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography
                    variant={'body1'}
                    sx={{
                        fontWeight: 'bold',
                    }}
                    color={'textPrimary'}
                >
                    {garment.profile.name}
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.4vw'}}>
                    <Rating value={garment.rating} readOnly sx={{marginY: '1vh'}}/>
                    <Typography sx={{fontWeight: 'bold'}}>{garment.rating + ".0"}</Typography>
                </Box>
                <Typography>
                    <span style={{fontWeight: 'bold'}}>Status: </span>
                    <span style={{color: garment.busy ? "red" : "green"}}>{garment.busy ? "Busy" : "Available"}</span>
                </Typography>
            </Box>
        </Box>
    )
}

function RenderInfoArea({garment}) {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: '100vh',
                paddingLeft: '2vw'
            }}
        >
            <Typography sx={{
                marginTop: '5vh',
                fontWeight: 'bold',
                fontSize: '1.5rem'
            }}>{garment.outsidePreview ? garment.outsidePreview : "Lorem ipsum dolor sit amet, consectetur adipisicing elit!"}</Typography>
            <RenderGarmentInformation garment={garment}/>
            <Carousel
                style={{
                    width: '100%',
                    height: '80vh',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                    marginTop: '3vh'
                }}
                autoplay={{dotDuration: true}}
                autoplaySpeed={4000}
                arrows
            >
                {
                    garment.thumbnails.map((thumbnail, index) => (
                        <div
                            key={index}
                        >
                            <Image style={{width: '55vw', height: '80vh'}} src={thumbnail.imageUrl}
                                   alt={thumbnail.name}/>
                        </div>
                    ))
                }
            </Carousel>
            <Paper variant={'outlined'} sx={{marginTop: '5vh', padding: '3vh 3vw'}}>
                <Typography sx={{marginTop: '2vh', fontWeight: 'bold', fontSize: '1.5rem'}}>About Us</Typography>
                <Divider sx={{width: '100%', borderTop: '2px solid black'}} variant={'fullWidth'}/>
                <Typography
                    sx={{marginTop: '2vh', marginBottom: '5vh'}}
                >
                    {garment.insidePreview ? garment.insidePreview : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti ea expedita harum ipsum iure molestias temporibus vero voluptatem? Asperiores dignissimos distinctio est possimus quisquam quo reiciendis repellat repudiandae! A accusamus aliquam dignissimos distinctio, dolorum eligendi esse excepturi necessitatibus perferendis possimus quia quos rem ullam vel voluptates! Culpa cumque dolorem dolores, error id molestiae, necessitatibus quae quam quo quod quos repellat temporibus voluptas. Adipisci amet blanditiis corporis cum deleniti dolorem est ex exercitationem fugiat hic illo inventore iste itaque minima nesciunt nostrum odit, officia possimus quae qui ratione recusandae, rerum sapiente sed tempore ut velit. Accusantium ad, aliquam assumenda consectetur cupiditate dolor dolore ducimus esse explicabo, inventore ipsum nihil nostrum nulla porro reiciendis veritatis voluptate? Alias doloremque iusto magnam possimus praesentium quidem! Accusantium ad aliquid aspernatur atque consectetur earum error est eum expedita facere fugiat ipsam magni maxime nam perspiciatis quam quisquam reiciendis saepe, sed sit temporibus tenetur velit veniam voluptas."}
                </Typography>
            </Paper>
        </Box>
    )
}

function RenderPage({garment}) {
    const navigate = useNavigate()

    const handleCreateOrder = async (orderId, garmentId) => {
        const response = await createQuotation(orderId, garmentId, "");
        if(response && response.status === 201) {
            enqueueSnackbar(response.data.message, {variant: 'success'});
            localStorage.removeItem("sOrder")
            setTimeout(() => {
                navigate("/school/d/order")
            }, 3000)
        }else {
            enqueueSnackbar(response.data.message, {variant: 'error'});
        }
    }

    return (
        <div className={'d-flex'}>
            <Box
                sx={{
                    width: '60vw',
                    marginLeft: '2vw',
                    marginRight: '1vw'
                }}
            >
                <RenderInfoArea garment={garment}/>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Paper
                    elevation={2}
                    sx={{
                        marginX: 'auto',
                        height: '55vh',
                        width: '30vw',
                        marginTop: '27vh',
                        padding: '2vh 1vw'
                    }}
                >
                    <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2vh'}}>
                        <Avatar size={200} style={{border: '1px solid black', marginRight: 'auto', marginLeft: 'auto'}}
                                src={<Image src={garment.profile.avatar} alt={garment.profile.name}/>}/>
                    </Box>
                    <Typography sx={{fontWeight: 'bold', fontSize: '1.3rem', marginTop: '1.5vh'}}>
                        Hi there, we are {garment.profile.name}
                    </Typography>
                    <Typography sx={{fontSize: '1rem', marginTop: '2vh'}}>
                        Glad to see you visit us, <br/> If you are interested in us, please leave a click on the button below for your quotation.
                    </Typography>
                </Paper>
                <Paper
                    elevation={2}
                    sx={{
                        marginX: 'auto',
                        height: '10vh',
                        width: '30vw',
                        marginTop: '2vh',
                        padding: '2vh 1vw'
                    }}
                >
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        sx={{
                            width: '100%',
                        }}
                        endIcon={<Send/>}
                        onClick={() => handleCreateOrder(parseInt(JSON.parse(localStorage.getItem('sOrder'))), garment.id)}
                    >
                        Contact us now
                    </Button>
                </Paper>
            </Box>
        </div>
    )
}

export default function GarmentDetail() {
    document.title = "Garment Detail";
    const location = useLocation()
    const [garments, setGarments] = useState([]);
    const [loading, setLoading] = useState(true)
    const {garmentId} = location.state
    let selectedGarment = null

    if (!garmentId) {
        window.location.href = "/list/garment"
    }

    async function FetchGarments() {
        const response = await getAllGarmentProfile()
        if (response && response.status === 200) {
            setGarments(response.data.data)
            setLoading(false)
        }
    }

    useEffect(() => {
        FetchGarments()
    }, [])


    if (loading) {
        return (
            <h1>Loading</h1>
        )
    } else {
        selectedGarment = garments.find(garment => garment.id.toString() === garmentId.toString())
        if(!localStorage.getItem("sOrder")){
            window.location.href = "/school/d/order"
        }

        if (garments.length === 0 || !selectedGarment) {
            window.location.href = "/list/garment"
        }
    }

    return (
        <RenderPage garment={selectedGarment}/>
    )
}