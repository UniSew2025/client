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
    Stack, TextField,
    Typography
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarRateIcon from "@mui/icons-material/StarRate";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import '../../styles/school/SchoolProfile.css';
import {dateFormatter} from "../../utils/DateFormatter.jsx";
import {useNavigate} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {motion, AnimatePresence} from "framer-motion";
import {useState} from "react";
import {enqueueSnackbar} from "notistack";
import {updateSchoolProfile} from "../../services/ProfileService.jsx";


const user = JSON.parse(localStorage.getItem('user'))

const checklist = [
    {
        icon: <InfoOutlinedIcon color="primary" />,
        title: "...",
        desc: "...",
        action: "Add"
    },
    {
        icon: <AddCircleOutlineIcon color="primary" />,
        title: "Add contact for your profile",
        desc: "Upload a photo and info for more experience...",
        action: "Add"
    },
    {
        icon: <WorkOutlineIcon color="primary" />,
        title: "...",
        desc: "...",
        action: "Add"
    },
    {
        icon: <AccessTimeIcon color="primary" />,
        title: "...",
        desc: "...",
        action: "Add"
    }
];

function RenderLeftArea({onEditProfile, user}){
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
                                <Typography variant="body2">Located in Viet Nam</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarMonthIcon fontSize="small" color="action" />
                                <Typography variant="body2">Joined in {dateFormatter(user.registerDate)}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AccessTimeIcon fontSize="small" color="action" />
                                <Typography variant="body2">Preferred working hours</Typography>
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
                            sx={{ mb:1, borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                            onClick={() => navigate("/home")}
                        >
                            Explore UniSew
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<EditIcon />}
                            sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                            onClick={onEditProfile}
                        >
                            Edit profile
                        </Button>
                    </CardContent>
                </Card>
            </Paper>
        </>
    )
}

//api
async function handleUpdateSchoolProfile(updatedUser, setUserData, setShowEdit) {
        const req = {
            accountId: updatedUser.accountId || updatedUser.id || updatedUser.profile.accountId,
            name: updatedUser.profile.name,
            phone: updatedUser.profile.phone
        };

        const res = await updateSchoolProfile(req);
        if (res && res.status === 200) {
            enqueueSnackbar(res?.message || "Profile updated!", { variant: "success" });
            setUserData(updatedUser);
            setShowEdit(false);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
            enqueueSnackbar(res?.message || "Update failed!", { variant: "error" });
        }
}

function EditProfileForm({user, onClose, onSave}) {
    const [name, setName] = useState(user.profile.name || "");
    const [phone, setPhone] = useState(user.profile.phone || "");

    const handleSave = () => {
        const updatedUser = {
            ...user,
            profile: {
                ...user.profile,
                name,
                phone
            },
        };
        onSave(updatedUser);
        onClose();
    };

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    bgcolor: "rgba(0,0,0,0.45)",
                    zIndex: 1300
                }}
                onClick={onClose}
            />
            <motion.div
                initial={{x: "100%"}}
                animate={{x: 0}}
                exit={{x: "100%"}}
                transition={{type: "spring", stiffness: 300, damping: 30}}
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "100vw",
                    maxWidth: 480,
                    height: "100vh",
                    zIndex: 1301,
                }}
            >
                <Paper
                    elevation={24}
                    sx={{
                        width: "100%",
                        height: "100vh",
                        bgcolor: "background.paper",
                        boxShadow: 12,
                        borderRadius: 0,
                        p: 0
                    }}
                >
                    <Card sx={{minWidth: 400, maxWidth: 500, width: "90vw", p: 3, position: "relative"}}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            Edit Profile
                        </Typography>
                        <Divider sx={{mb: 2}}/>

                        <Stack spacing={2}>
                            <TextField
                                label="Name"
                                fullWidth
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <TextField
                                label="Contact (Phone)"
                                fullWidth
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                            <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
                            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                        </Stack>
                    </Card>
                </Paper>
            </motion.div>
        </>
    );
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
                                My feedback history
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography variant="body2" color="text.secondary">
                                    You haven't left any feedback yet.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Paper>
            </Grid>
        </>
    )
}

export default function SchoolProfile() {
    const [showEdit, setShowEdit] = useState(false);
    const [userData, setUserData] = useState(user);

    const handleSave = (updatedUser) => {
        handleUpdateSchoolProfile(updatedUser, setUserData, setShowEdit);
    };
    return (
        <Box sx={{minHeight: "100vh", py: 5 }}>

            <Box sx={{ maxWidth: 1400, mx: "auto" }}>
                <Grid container spacing={3} >
                    <RenderLeftArea onEditProfile={() => setShowEdit(true)} user={userData}/>
                    <RenderRightArea user={userData}/>
                </Grid>
            </Box>
            <AnimatePresence>
                {showEdit && (
                    <EditProfileForm
                        user={userData}
                        onClose={() => setShowEdit(false)}
                        onSave={handleSave}
                    />
                )}
            </AnimatePresence>
        </Box>
    );
}
