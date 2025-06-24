import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import CallIcon from '@mui/icons-material/Call';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarRateIcon from "@mui/icons-material/StarRate";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import '../../styles/school/SchoolProfile.css'
import {dateFormatter} from "../../utils/DateFormatter.jsx";
import {useNavigate} from "react-router-dom";


const user = JSON.parse(localStorage.getItem('user'))

function formatTimeToAMPM(timeStr) {
    if (!timeStr) return "";
    const [h, m, s] = timeStr.split(":").map(Number);
    let hour = h % 12 || 12;
    let period = h < 12 ? "am" : "pm";
    let minStr = String(m).padStart(2, "0");
    return `${hour}:${minStr} ${period}`;
}

function formatPhoneDash(phone) {
    if (!phone) return "";
    phone = phone.replace(/\D/g, "");
    if (phone.length === 10)
        return `${phone.slice(0,4)}-${phone.slice(4,7)}-${phone.slice(7,10)}`;
    return phone;
}

function RenderLeftArea(){
    const navigate = useNavigate()
    return (
        <>
            <Paper elevation={6}>
                <Card className={'profile-left-card'}>
                    <CardContent>
                        <img src={user.profile.avatar} referrerPolicy={"no-referrer"} alt={user.profile.name}/>
                        <Typography variant="h6" fontWeight="bold">{user.profile.name}</Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>@{user.profile.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").join("")}</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Stack spacing={1} sx={{ textAlign: "left", pl: 2, mb: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CallIcon fontSize="small" color="action" />
                                <Typography variant="body2">Contact: {formatPhoneDash(user.profile.phone)}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarMonthIcon fontSize="small" color="action" />
                                <Typography variant="body2">Joined date: {dateFormatter(user.registerDate)}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AccessTimeIcon fontSize="small" color="action" />
                                <Typography variant="body2">Working time: {formatTimeToAMPM(user.profile.designer.startTime)} - {formatTimeToAMPM(user.profile.designer.endTime)}</Typography>
                            </Stack>
                        </Stack>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<RemoveRedEyeIcon />}
                            sx={{ mb: 1, borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                            onClick={() => navigate("/school/order")}
                        >
                            View my designs
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            endIcon={<ArrowForwardIcon />}
                            sx={{ mb: 1, borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                            onClick={() => navigate("/home")}
                        >
                            Explore your packages
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<EditIcon />}
                            sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                            onClick={() => navigate("/home")}
                        >
                            Edit profile
                        </Button>
                    </CardContent>
                </Card>
            </Paper>
        </>
    )
}

function RenderRightArea(){
    return(
        <>
            <Grid item xs={12} md={8}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold" mb={1}>
                        Hi {user.profile.name} <span role="img" aria-label="wave">👋</span> Let’s help UniSew get to know you
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Get the most out of UniSew by sharing a bit more about yourself and how you prefer to work with us.
                    </Typography>
                </Box>

                <Paper elevation={6}>
                    <Card sx={{ mb: 3}}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={1.5}>
                                About
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.profile.designer.bio}
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={1.5}>
                                Short review
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.profile.designer.shortPreview || "You haven't added a short review yet."}
                            </Typography>
                        </CardContent>
                    </Card>
                </Paper>

                <Paper elevation={6}>
                    <Card sx={{textAlign: "center" }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                                Reviews from schools
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Stack direction="row" spacing={0.3} mb={1.5}>
                                    {[...Array(5)].map((_, i) => (
                                        <StarRateIcon key={i} color="warning" />
                                    ))}
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    You don't have any reviews yet.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Paper>
            </Grid>
        </>
    )
}

export default function DesignerProfile() {
    return (
        <Box sx={{minHeight: "100vh", py: 5 }}>

            <Box sx={{ maxWidth: 1400, mx: "auto" }}>
                <Grid container spacing={3} >
                    <RenderLeftArea/>
                    <RenderRightArea/>
                </Grid>
            </Box>
        </Box>
    );
}
