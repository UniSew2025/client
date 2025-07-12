import {Box, Button, Card, CardContent, Divider, Grid, Paper, Stack, TextField, Typography} from "@mui/material";
import CallIcon from '@mui/icons-material/Call';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarRateIcon from "@mui/icons-material/StarRate";
import '../../styles/school/SchoolProfile.css'
import {dateFormatter} from "../../utils/DateFormatter.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import { updateDesignerProfile } from "../../services/ProfileService.jsx";
import { enqueueSnackbar } from "notistack";

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
        return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7, 10)}`;
    return phone;
}

//api
async function handleUpdateDesignerProfile(updatedUser, setUserData, setShowEdit) {
        const req = {
            accountId: updatedUser.accountId || updatedUser.id || updatedUser.profile.accountId,
            name: updatedUser.profile.name,
            phone: updatedUser.profile.phone,
            bio: updatedUser.profile.designer.bio,
            shortProfile: updatedUser.profile.designer.shortPreview,
            startDate: updatedUser.profile.designer.startTime?.slice(0, 5),
            endDate: updatedUser.profile.designer.endTime?.slice(0, 5),
        };

        const res = await updateDesignerProfile(req);
        if (res && res.status === 200) {
            enqueueSnackbar("Profile updated!", { variant: "success" });
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
    const [bio, setBio] = useState(user.profile.designer.bio || "");
    const [shortPreview, setShortPreview] = useState(user.profile.designer.shortPreview || "");
    const [startTime, setStartTime] = useState(user.profile.designer.startTime || "08:00:00");
    const [endTime, setEndTime] = useState(user.profile.designer.endTime || "17:00:00");


    const handleSave = () => {
        const updatedUser = {
            ...user,
            profile: {
                ...user.profile,
                name,
                phone,
                designer: {
                    ...user.profile.designer,
                    bio,
                    shortPreview,
                    startTime,
                    endTime,
                },
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
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Working Time (From)"
                                    type="time"
                                    fullWidth
                                    value={startTime.slice(0, 5)}
                                    onChange={e => setStartTime(e.target.value + ":00")}
                                    InputLabelProps={{shrink: true}}
                                    inputProps={{step: 300}}
                                />
                                <TextField
                                    label="Working Time (To)"
                                    type="time"
                                    fullWidth
                                    value={endTime.slice(0, 5)}
                                    onChange={e => setEndTime(e.target.value + ":00")}
                                    InputLabelProps={{shrink: true}}
                                    inputProps={{step: 300}}
                                />
                            </Stack>
                            <TextField
                                label="About (Bio)"
                                fullWidth
                                multiline
                                minRows={3}
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                            />
                            <TextField
                                label="Short Review"
                                fullWidth
                                multiline
                                minRows={2}
                                value={shortPreview}
                                onChange={e => setShortPreview(e.target.value)}
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

function RenderLeftArea({onEditProfile, user}) {
    const navigate = useNavigate()
    return (
        <>
            <Paper elevation={6} sx={{maxWidth: "500px", maxHeight: "440px"}}>
                <Card className={'profile-left-card'}>
                    <CardContent>
                        <img src={user.profile.avatar} referrerPolicy={"no-referrer"} alt={user.profile.name}/>
                        <Typography variant="h6" fontWeight="bold">{user.profile.name}</Typography>
                        <Typography variant="body2" color="text.secondary"
                                    mb={2}>@{user.profile.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").join("")}</Typography>
                        <Divider sx={{my: 1.5}}/>
                        <Stack spacing={1} sx={{textAlign: "left", pl: 2, mb: 2}}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CallIcon fontSize="small" color="action"/>
                                <Typography variant="body2">Contact: {formatPhoneDash(user.profile.phone)}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarMonthIcon fontSize="small" color="action"/>
                                <Typography variant="body2">Joined date: {dateFormatter(user.registerDate)}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AccessTimeIcon fontSize="small" color="action"/>
                                <Typography variant="body2">Working
                                    time: {formatTimeToAMPM(user.profile.designer.startTime)} - {formatTimeToAMPM(user.profile.designer.endTime)}</Typography>
                            </Stack>
                        </Stack>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<RemoveRedEyeIcon/>}
                            sx={{mb: 1, borderRadius: 2, textTransform: "none", fontWeight: "bold"}}
                            onClick={() => navigate("/designer/requests")}
                        >
                            View my designs
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            endIcon={<ArrowForwardIcon/>}
                            sx={{mb: 1, borderRadius: 2, textTransform: "none", fontWeight: "bold"}}
                            onClick={() => navigate("/designer/packages")}
                        >
                            Explore your packages
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<EditIcon/>}
                            sx={{borderRadius: 2, textTransform: "none", fontWeight: "bold"}}
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

function RenderRightArea({user}) {
    return (
        <>
            <Grid item xs={12} md={8}>
                <Box sx={{mb: 2}}>
                    <Typography variant="h5" fontWeight="bold" mb={1}>
                        Hi {user.profile.name} <span role="img" aria-label="wave">👋</span> Let’s help UniSew get to know
                        you
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Get the most out of UniSew by sharing a bit more about yourself and how you prefer to work with
                        us.
                    </Typography>
                </Box>

                <Paper elevation={6}>
                    <Card sx={{mb: 3}}>
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
                    <Card sx={{textAlign: "center"}}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                                Reviews from schools
                            </Typography>
                            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <Stack direction="row" spacing={0.3} mb={1.5}>
                                    {[...Array(5)].map((_, i) => (
                                        <StarRateIcon key={i} color="warning"/>
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
    const [showEdit, setShowEdit] = useState(false);
    const [userData, setUserData] = useState(user);

    const handleSave = (updatedUser) => {
        handleUpdateDesignerProfile(updatedUser, setUserData, setShowEdit);
    };
    return (
        <Box sx={{minHeight: "100vh", py: 5}}>

            <Box sx={{maxWidth: 1400, mx: "auto"}}>
                <Grid container spacing={3}>
                    <RenderLeftArea onEditProfile={() => setShowEdit(true)} user={userData} />
                    <RenderRightArea user={userData} />
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
