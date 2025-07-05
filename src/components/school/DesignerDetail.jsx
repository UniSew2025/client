import React, { useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Tabs,
    Tab,
    Button,
    Divider,
    Avatar,
    Stack,
    List,
    ListItem,
    ListItemText,
    MobileStepper,
    useTheme
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

const mockDesigner = {
    title: "I will do modern custom logo design for your brand in 24hrs",
    bio: "Experienced logo & uniform designer, creative and professional service for your brand!",
    profile: {
        avatar: "https://randomuser.me/api/portraits/men/44.jpg",
        name: "San",
        level: 2,
        rating: 4.9,
        reviewCount: 102,
        country: "Vietnam",
        joined: "2022",
    },
    portfolioImages: [
        "https://www.shutterstock.com/image-vector/technical-flat-sketch-girls-school-260nw-2287745045.jpg",
        "https://thumbs.dreamstime.com/b/baby-girl-s-school-uniform-design-template-vector-design-baby-girl-s-school-uniform-design-button-down-short-sleeves-template-382461332.jpg",
        "https://static.vecteezy.com/system/resources/previews/033/952/505/non_2x/work-or-school-uniform-front-and-back-view-illustration-vector.jpg",
        "https://media.istockphoto.com/id/1321431524/vector/vector-sketch-set-of-school-uniform-clothes.jpg?s=1024x1024&w=is&k=20&c=MWasRYc5U_v3Co7Ggp6CNC1DJLoVZbA4KZRw5n1OMWA="
    ],
    packages: [
        {
            name: "Basic",
            fee: 100000,
            header_content: "1 HQ Basic Logo + Logo Transparency",
            delivery_duration: 2,
            revision_time: 5,
            description: "No AI generated artwork. Get a high quality basic logo for your business, with transparency."
        },
        {
            name: "Standard",
            fee: 200000,
            header_content: "2 HQ Logo Concepts + Vector File",
            delivery_duration: 3,
            revision_time: 10,
            description: "Standard package includes two concepts, vector files, and unlimited minor revisions."
        },
        {
            name: "Premium",
            fee: 300000,
            header_content: "3 HQ Logo Concepts + Full Brand Kit",
            delivery_duration: 5,
            revision_time: 20,
            description: "Best for brand identity! Three logo concepts, source files, social kit, and much more."
        }
    ],
    stats: {
        "Orders Completed": "98%",
        "Response Time": "1 Hour",
        "Delivered on Time": "On Time",
        "Repeat Clients": "21%"
    }
};

function GallerySection({ images = [] }) {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);

    const maxSteps = images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    if (images.length === 0) return null;

    return (
        <Box sx={{ maxWidth: 520, flexGrow: 1, mx: "auto", mb: 3 }}>
            <Box
                sx={{
                    width: "100%",
                    height: 0,
                    paddingTop: "75%",
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 2,
                    background: "#f9f9f9",
                }}
            >
                <Box
                    component="img"
                    src={images[activeStep]}
                    alt={`Portfolio ${activeStep + 1}`}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        borderRadius: 2,
                        transition: "0.2s"
                    }}
                />
            </Box>
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                sx={{ bgcolor: "transparent", justifyContent: "center", mt: 1 }}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Next
                        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                    >
                        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        Back
                    </Button>
                }
            />
        </Box>
    );
}



function PackageTabs({ packages, onContinue }) {
    const [tab, setTab] = useState(0);
    const pkg = packages[tab];

    return (
        <Paper elevation={4} sx={{ maxWidth: "500px" , p: 3, borderRadius: 2, position: "sticky", top: 40 }}>
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                sx={{ mb: 2 }}
            >
                {packages.map((p, idx) => (
                    <Tab key={idx} label={p.name} sx={{ fontWeight: "bold" }} />
                ))}
            </Tabs>
            <Typography variant="subtitle2" fontWeight="bold" mb={0.5}>
                {pkg.name} Package
            </Typography>
            <Typography color="text.secondary" mb={1}>
                {pkg.header_content}
            </Typography>
            <Typography fontWeight="bold" fontSize={24} mb={1}>
                {pkg.fee} VND
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography fontSize={15}>⏱ {pkg.delivery_duration} day{pkg.delivery_duration > 1 ? "s" : ""}</Typography>
                <Typography fontSize={15}>🔄 {pkg.revision_time} Revisions</Typography>
            </Box>
            <Typography color="text.secondary" mb={2}>{pkg.description}</Typography>
            <Button
                fullWidth
                variant="contained"
                sx={{ borderRadius: 2, fontWeight: "bold", py: 1.2 }}
                onClick={() => onContinue(pkg)}
            >
                Continue
            </Button>
            <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 1, borderRadius: 2, textTransform: "none", py: 1.2 }}
            >
                Contact me
            </Button>
        </Paper>
    );
}

function ProfileStats({ stats }) {
    return (
        <Paper elevation={4} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
            <Typography fontWeight="bold" mb={2}>Profile Stats</Typography>
            <List dense disablePadding>
                {Object.entries(stats).map(([label, value], idx) => (
                    <ListItem key={idx} disableGutters sx={{ px: 0, py: 0.5 }}>
                        <ListItemText primary={label} />
                        <Typography fontWeight="bold">{value}</Typography>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default function DesignerDetail() {
    const [designer] = useState(mockDesigner);

    const handleContinue = (pkg) => {
        alert(`You have selected package "${pkg.name}" with price $${pkg.fee}`);
    };

    return (
        <Box sx={{ background: "#fff", minHeight: "100vh", pb: 8 }}>
            <Box sx={{ maxWidth: 1300, mx: "auto", pt: 4 }}>
                <Typography color="text.secondary" fontSize={14} mb={1}>
                    Graphics & Design / Logo Design
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" fontWeight="bold" mb={1}>
                            {designer.title}
                        </Typography>
                        <Stack direction="row" alignItems="center" gap={2} mb={2}>
                            <Avatar src={designer.profile.avatar} sx={{ width: 54, height: 54 }} />
                            <Box>
                                <Typography fontWeight="bold" fontSize={18}>{designer.profile.name}</Typography>
                                <Stack direction="row" alignItems="center" gap={1} fontSize={14}>
                                    <span style={{ color: "#F59E42" }}>★ {designer.profile.rating}</span>
                                    <span style={{ color: "#aaa" }}>({designer.profile.reviewCount} reviews)</span>
                                    <span style={{ color: "#aaa" }}>Level {designer.profile.level}</span>
                                    <span style={{ color: "#aaa" }}>{designer.profile.country}</span>
                                    <span style={{ color: "#aaa" }}>Joined {designer.profile.joined}</span>
                                </Stack>
                            </Box>
                        </Stack>
                        <GallerySection images={designer.portfolioImages} />

                        <Typography variant="h6" fontWeight="bold" mt={2} mb={1}>
                            About
                        </Typography>
                        <Typography color="text.secondary" mb={3}>
                            {designer.bio}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <PackageTabs packages={designer.packages} onContinue={handleContinue} />
                        <ProfileStats stats={designer.stats} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

