import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {login} from "../../services/AuthService.jsx";
import axios from "axios";
import {enqueueSnackbar} from "notistack";
import {Box, Paper, Typography} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

async function Login(email, avatar, name, refreshToken) {
    const response = await login(email, avatar, name, refreshToken)
    return response ? response : null
}


function HandleResponse() {
    const location = useLocation()
    const navigate = useNavigate()
    const code = new URLSearchParams(location.search).get('code')
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
    const returnUri = import.meta.env.VITE_GOOGLE_RETURN_URI
    const tokenResponse = localStorage.getItem("GGR") ? JSON.parse(localStorage.getItem("GGR")) : null
    const profileResponse = localStorage.getItem("PR") ? JSON.parse(localStorage.getItem("PR")) : null
    const progress = localStorage.getItem("user") ? 100 : (
        localStorage.getItem("GGR") && localStorage.getItem("PR") ? 100 : (
            localStorage.getItem("GGR") && !localStorage.getItem("PR") ? 50 : 0
        )
    )

    useEffect(() => {
        if (code) {
            async function ExchangeTokens() {
                return await axios.post('https://oauth2.googleapis.com/token', {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code,
                    grant_type: 'authorization_code',
                    redirect_uri: returnUri
                })
            }

            ExchangeTokens().then(res => {
                if (res) {
                    localStorage.setItem("GGR", JSON.stringify(res.data))
                    window.location.reload()
                }
            })
        }
    }, [code])

    useEffect(() => {
        if (tokenResponse) {
            const accessToken = tokenResponse.access_token
            const url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken

            async function GetInfo() {
                return await axios.get(url)
            }

            GetInfo().then(res => {
                if (res) {
                    localStorage.setItem("PR", JSON.stringify(res.data))
                    window.location.reload()
                }
            })
        }
    }, [tokenResponse])

    useEffect(() => {
        if (profileResponse) {
            const email = profileResponse.email
            const avatar = profileResponse.picture
            const name = profileResponse.name
            const refresh = tokenResponse.refresh_token
            Login(email, avatar, name, refresh)
                .then(res => {
                        if (res.status === 200) {
                            localStorage.setItem("user", JSON.stringify(res.data.data))
                            localStorage.setItem("message", res.data.message)
                            localStorage.setItem("variant", "success")
                            if(refresh){
                                localStorage.removeItem("GGR")
                                localStorage.removeItem("PR")
                            }
                            switch (res.data.data.role) {
                                case "admin":
                                    navigate('/admin/dashboard')
                                    break;
                                case "school":
                                    navigate('/home')
                                    break;
                                case "designer":
                                    navigate('/designer/dashboard')
                                    break;
                                case "garment":
                                    navigate('/garment/dashboard')
                                    break;
                                default:
                                    navigate('/signin')
                                    break;
                            }
                        }
                    }
                ).catch(err => {
                    enqueueSnackbar(err.response.data.message, {variant: "error"})
                    setTimeout(() => {
                        navigate('/signin')
                    }, 1500)
                }
            )
        }
    }, [profileResponse])

    function CircularProgressWithLabel(props) {
        return (
            <Box sx={{position: 'relative', display: 'inline-flex'}}>
                <CircularProgress variant="determinate" {...props} color={"secondary"} size={150}/>
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        fontSize={40}
                        sx={{color: 'white'}}
                    >
                        {`${Math.round(props.value)}%`}
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Paper elevation={0} sx={{
            backgroundColor: 'black',
            opacity: 1,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2vh'
        }}>
            <CircularProgressWithLabel value={progress}/>
            <Typography fontSize={40} color={'secondary'}>SIGNING IN...</Typography>
        </Paper>
    )
}

export default function GoogleResponse() {
    return <HandleResponse/>
}
