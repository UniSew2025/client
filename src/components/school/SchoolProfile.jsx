import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LanguageIcon from "@mui/icons-material/Language";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarRateIcon from "@mui/icons-material/StarRate";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {forwardRef} from "react";
import '../../styles/school/SchoolProfile.css'
import {dateFormatter} from "../../utils/DateFormatter.jsx";

const profile = {
    name: "Your Fiverr Name",
    username: "@trieumn",
    location: "Vietnam",
    joined: "June 2025",
    industry: "",
    languages: "",
    workingHours: "",
};

const user = JSON.parse(localStorage.getItem('user'))

const checklist = [
    {
        icon: <InfoOutlinedIcon color="primary" />,
        title: "Share how you plan to use Fiverr",
        desc: "Tell us if you’re here to find services or offer them.",
        percent: 75,
        done: false
    },
    {
        icon: <AddCircleOutlineIcon color="action" />,
        title: "Add details for your profile",
        desc: "Upload a photo and info for a more tailored experience.",
        action: "Add"
    },
    {
        icon: <WorkOutlineIcon color="action" />,
        title: "Tell us about your business",
        desc: "Get tailored recommendations and tips to help it grow.",
        action: "Add"
    },
    {
        icon: <AccessTimeIcon color="action" />,
        title: "Set your communication preferences",
        desc: "Let freelancers know your collaboration preferences.",
        action: "Add"
    }
];

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
                                <PublicIcon fontSize="small" color="action" />
                                <Typography variant="body2">Located in {user.profile.partner.province}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarMonthIcon fontSize="small" color="action" />
                                <Typography variant="body2">Joined in {dateFormatter(user.registerDate)}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AccessTimeIcon fontSize="small" color="action" />
                                <Typography variant="body2">Work from {"6am to 5pm"}</Typography>
                            </Stack>
                        </Stack>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<RemoveRedEyeIcon />}
                            sx={{ mb: 1, borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                            onClick={() => navigate("/school/order")}
                        >
                            View my orders
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            endIcon={<ArrowForwardIcon />}
                            sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                            onClick={() => navigate("/home")}
                        >
                            Explore UniSew
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
                            <Typography variant="subtitle1" fontWeight="bold" mb={1.5}>
                                Profile checklist
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={25}
                                sx={{ height: 7, borderRadius: 5, mb: 2, bgcolor: "#e0e8ef" }}
                            />
                            <List disablePadding>
                                {checklist.map((item, i) => (
                                    <ListItem key={i} disablePadding sx={{ alignItems: "flex-start", mb: 1.5 }}>
                                        <ListItemIcon sx={{ mt: 0.5 }}>{item.icon}</ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {item.title}
                                                    </Typography>
                                                    {item.percent && (
                                                        <Chip
                                                            label={`${item.percent}%`}
                                                            color={item.percent === 100 ? "success" : "primary"}
                                                            size="small"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    )}
                                                </Stack>
                                            }
                                            secondary={item.desc}
                                            secondaryTypographyProps={{ color: "text.secondary" }}
                                        />
                                        <Box>
                                            {item.percent === 75 ? (
                                                <Typography variant="body2" color="primary" fontWeight="bold">75%</Typography>
                                            ) : (
                                                <Button
                                                    size="small"
                                                    sx={{ textTransform: "none", fontWeight: 600, color: "#3488e2" }}
                                                    endIcon={<ChevronRightIcon fontSize="small" />}
                                                >
                                                    {item.action}
                                                </Button>
                                            )}
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Paper>

                <Paper elevation={6}>
                    <Card sx={{textAlign: "center" }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                                Reviews from freelancers
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Stack direction="row" spacing={0.3} mb={1.5}>
                                    {[...Array(5)].map((_, i) => (
                                        <StarRateIcon key={i} color="warning" />
                                    ))}
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    trieumn doesn't have any reviews yet.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Paper>
            </Grid>
        </>
    )
}

export default function FiverrBuyerProfile() {
    return (
        <Box sx={{minHeight: "100vh", py: 5 }}>

            <Box sx={{ maxWidth: 1200, mx: "auto" }}>
                <Grid container spacing={3} >
                    <RenderLeftArea/>
                    <RenderRightArea/>
                </Grid>
            </Box>
        </Box>
    );
}
