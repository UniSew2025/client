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

function formatPhoneDash(phone) {
    if (!phone) return "";
    phone = phone.replace(/\D/g, "");
    if (phone.length === 10)
        return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7, 10)}`;
    return phone;
}

//api
async function handleUpdateGarmentProfile(updatedUser, setUserData, setShowEdit) {
        const req = {
            accountId: updatedUser.accountId || updatedUser.id || updatedUser.profile.accountId,
            name: updatedUser.profile.name,
            phone: updatedUser.profile.phone,
            street: updatedUser.profile.partner.street,
            ward: updatedUser.profile.partner.ward,
            district: updatedUser.profile.partner.district,
            province: updatedUser.profile.partner.province,
        };

        const res = await updateDesignerProfile(req)
        if (res && res.status === 200) {
            enqueueSnackbar(res?.message || "Profile updated!", { variant: "success" });
            setUserData(updatedUser);
            setShowEdit(false);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
            enqueueSnackbar(res?.message || "Update failed!", { variant: "error" });
        }
}

function EditProfileForm({ user, onClose, onSave }) {
    const [name, setName] = useState(user.profile.name || "");
    const [phone, setPhone] = useState(user.profile.phone || "");
    const [street, setStreet] = useState(user.profile.street || user.profile.partner?.street || "");
    const [ward, setWard] = useState(user.profile.ward || user.profile.partner?.ward || "");
    const [district, setDistrict] = useState(user.profile.district || user.profile.partner?.district || "");
    const [province, setProvince] = useState(user.profile.province || user.profile.partner?.province || "");

    const handleSave = () => {
        const updatedUser = {
            ...user,
            profile: {
                ...user.profile,
                name,
                phone,
                partner: {
                    ...user.profile.partner,
                    street,
                    ward,
                    district,
                    province,
                }
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
            {/* Slide-in Form */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                    <Card sx={{
                        minWidth: 400,
                        maxWidth: 500,
                        width: "90vw",
                        p: 3,
                        position: "relative",
                        borderRadius: 3,
                        mt: 3,
                        mx: "auto"
                    }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            Edit Profile
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={2}>
                            <TextField
                                label="Name"
                                fullWidth
                                value={name}
                                onChange={e => setName(e.target.value)}
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                            />
                            <TextField
                                label="Contact (Phone)"
                                fullWidth
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                            />
                        </Stack>

                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 1 }}>
                            Address
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Street"
                                    fullWidth
                                    value={street}
                                    onChange={e => setStreet(e.target.value)}
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Ward"
                                    fullWidth
                                    value={ward}
                                    onChange={e => setWard(e.target.value)}
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="District"
                                    fullWidth
                                    value={district}
                                    onChange={e => setDistrict(e.target.value)}
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Province"
                                    fullWidth
                                    value={province}
                                    onChange={e => setProvince(e.target.value)}
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                />
                            </Grid>
                        </Grid>

                        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
                            <Button variant="outlined" color="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Save
                            </Button>
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

                        </CardContent>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={1.5}>
                                Short review
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
    const [userData, setUserData] = useState(user); // dùng cho UI

    const handleSave = (updatedUser) => {
        handleUpdateGarmentProfile(updatedUser, setUserData, setShowEdit);
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
