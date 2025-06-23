import { Box, Avatar, Card, CardContent, Typography, Grid, Chip, Stack, Link } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

const schoolData = {
    name: "Greenfield International School",
    avatar: "https://thietkewebchuyen.com/wp-content/uploads/logo-avatar-free-fire-cute-2.jpg",
    banner: "https://png.pngtree.com/thumb_back/fh260/background/20221011/pngtree-blue-gold-background-banner-idea-modern-simple-free-download-image_1467602.jpg",
    type: "Public School",
    status: "Active",
    address: "123 Nguyen Van Cu, District 5, HCMC",
    representative: "Mrs. Nguyen Thi Mai",
    email: "contact@greenfield.edu.vn",
    phone: "+84 28 8888 8888",
    website: "https://greenfield.edu.vn",
    joined: "Joined Sep 2021",
    description: "Greenfield International School is committed to providing world-class education and nurturing talent for the future. Our campus is home to 2000+ students from primary to high school levels.",
    stats: {
        projects: 8,
        members: 35,
        orders: 17
    },
    projects: [
        {
            id: 1,
            name: "Uniform Design 2023",
            img: "/assets/school-project1.jpg",
            status: "Completed",
            date: "Oct 2023"
        },
        {
            id: 2,
            name: "Sports Outfit Project",
            img: "/assets/school-project2.jpg",
            status: "In Progress",
            date: "Apr 2024"
        }
    ]
};

// Function hiển thị phần info bên banner
function SchoolInfo({ school }) {
    return (
        <Box
            sx={{
                position: "absolute",
                left: { xs: 12, md: 40 },
                bottom: { xs: -36, md: -45 },
                display: "flex",
                alignItems: "center",
                pl: { xs: 2, md: 12 }
            }}
        >
            <Avatar
                src={school.avatar}
                alt="School Avatar"
                sx={{
                    width: { xs: 66, md: 90 },
                    height: { xs: 66, md: 90 },
                    boxShadow: "0 2px 16px rgba(30,191,115,.11)",
                    border: "4px solid #fff"
                }}
            />
            <Box sx={{ ml: 4, display: { xs: "none", md: "block" } }}>
                <Typography variant="h5" fontWeight="bold">{school.name}</Typography>
                <Typography variant="body2" color="text.secondary">{school.type}</Typography>
                <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <Chip
                        label={school.status}
                        color={school.status === "Active" ? "success" : "warning"}
                        icon={school.status === "Active" ? <CheckCircleIcon /> : <PendingIcon />}
                        size="small"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {school.address}
                    </Typography>
                    <Typography variant="body2" color="text.disabled">{school.joined}</Typography>
                </Stack>
            </Box>
        </Box>
    );
}

// Function hiển thị phần Contact
function SchoolContact({ school }) {
    return (
        <Card sx={{ mb: 3, width: "1200px" }}>
            <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>Contact</Typography>
                <Typography variant="body2" mb={0.5}>
                    <b>Representative:</b> {school.representative}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                    <b>Email:</b> <Link href={`mailto:${school.email}`}>{school.email}</Link>
                </Typography>
                <Typography variant="body2" mb={0.5}>
                    <b>Phone:</b> <Link href={`tel:${school.phone}`}>{school.phone}</Link>
                </Typography>
                <Typography variant="body2">
                    <b>Website:</b> <Link href={school.website} target="_blank" rel="noopener">{school.website}</Link>
                </Typography>
            </CardContent>
        </Card>
    );
}

// Function hiển thị phần About
function SchoolAbout({ school }) {
    return (
        <Card sx={{ mb: 3, width: "1200px" }}>
            <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>About School</Typography>
                <Typography variant="body2" color="text.primary">{school.description}</Typography>
            </CardContent>
        </Card>
    );
}

// Function hiển thị phần Projects
function SchoolProjects({ projects }) {
    return (
        <>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>School Projects</Typography>
            <Grid container spacing={2}>
                {projects.map((proj) => (
                    <Grid item xs={12} md={6} key={proj.id}>
                        <Card sx={{ height: "100%" }}>
                            <Box
                                component="img"
                                src={proj.img}
                                alt={proj.name}
                                sx={{ width: "100%", height: 120, objectFit: "cover" }}
                            />
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                    <Typography fontWeight="medium">{proj.name}</Typography>
                                    <Chip
                                        label={proj.status}
                                        color={proj.status === "Completed" ? "success" : "warning"}
                                        size="small"
                                    />
                                </Stack>
                                <Typography variant="body2" color="text.secondary">{proj.date}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {projects.length === 0 && (
                    <Grid item xs={12}>
                        <Typography color="text.disabled">No projects yet.</Typography>
                    </Grid>
                )}
            </Grid>
        </>
    );
}

// Function hiển thị phần Stats
function SchoolStats({ stats }) {
    return (
        <Card sx={{ p: 3, width: "210px" }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>School Stats</Typography>
            <Stack direction="row" justifyContent="space-between" mb={1}>
                <span>Projects</span>
                <Typography color="success.main" fontWeight="medium">{stats.projects}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" mb={1}>
                <span>Members</span>
                <span>{stats.members}</span>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <span>Orders</span>
                <span>{stats.orders}</span>
            </Stack>
        </Card>
    );
}

export default function Profile() {
    const school = schoolData;
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f6fafd", pb: 5 }}>
            {/* Banner */}
            <Box
                sx={{
                    width: "100%",
                    minHeight: { xs: 120, md: 200 },
                    position: "relative",
                    backgroundImage: `url(${school.banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderBottom: "1px solid #e3e3e3"
                }}
            >
                <SchoolInfo school={school} />
            </Box>

            <Box sx={{ maxWidth: 1600, mx: "auto", mt: { xs: 7, md: 9 }, px: 2 }}>
                <Grid container spacing={4} >
                    {/* Bên trái */}
                    <Grid item xs={12} md={7}>
                        {/* Info cho mobile nếu muốn có thể bổ sung SchoolInfoMobile ở đây */}
                        <Box sx={{ display: { xs: "block", md: "none" }, textAlign: "center", mb: 4, mt: 2 }}>
                            <Typography variant="h5" fontWeight="bold">{school.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{school.type}</Typography>
                            <Stack direction="row" spacing={2} justifyContent="center" alig nItems="center" mb={2}>
                                <Chip
                                    label={school.status}
                                    color={school.status === "Active" ? "success" : "warning"}
                                    icon={school.status === "Active" ? <CheckCircleIcon /> : <PendingIcon />}
                                    size="small"
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    {school.address}
                                </Typography>
                                <Typography variant="body2" color="text.disabled">{school.joined}</Typography>
                            </Stack>
                        </Box>
                        <SchoolContact school={school} />
                        <SchoolAbout school={school} />
                        <SchoolProjects projects={school.projects} />
                    </Grid>
                    {/* Bên phải */}
                    <Grid item xs={12} md={5}>
                        <SchoolStats stats={school.stats} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
