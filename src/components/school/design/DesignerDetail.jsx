import React, {useEffect, useState} from "react";
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
import {getALlPackageByDesignerId} from "../../../services/ProfileService.jsx";
import PickPackagePopup from "../PickPackagePopup.jsx";

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
                    src={images[activeStep].imageUrl}
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

const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
};


function PackageTabs({ packages, onContinue }) {
    const [tab, setTab] = useState(0);
    if (!packages || packages.length === 0) {
        return <Typography>No Packages</Typography>;
    }
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
                    <Tab key={idx} label={p.pkgName} sx={{ fontWeight: "bold" }} />
                ))}
            </Tabs>
            <Typography variant="subtitle2" fontWeight="bold" mb={0.5}>
                {pkg.pkgName}
            </Typography>
            <Typography color="text.secondary" mb={1}>
                {pkg.headerContent}
            </Typography>
            <Typography fontWeight="bold" fontSize={24} mb={1}>
                {formatVND(pkg.fee)} ₫
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography fontSize={15}>⏱ {pkg.deliveryDuration} day{pkg.deliveryDuration > 1 ? "s" : ""}</Typography>
                <Typography fontSize={15}>🔄 {pkg.revisionTime} Revisions</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Stack>
                {Array.isArray(pkg.services) && pkg.services.length > 0
                    ? pkg.services.map((p, idx) => (
                        <Typography key={idx} sx={{ p: 0, mb: 1 }}>{p.rule}</Typography>
                    ))
                    : <Typography fontStyle="italic" color="text.secondary">No extra services</Typography>
                }
            </Stack>
            <PickPackagePopup pkg={pkg} />
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

export default function DesignerDetail() {
    const [packages, setPackages] = useState([]);
    const data = JSON.parse(localStorage.getItem("designer"));
    const designerId = data.id;

    const handleContinue = (pkg) => {
        alert(`You have selected package "${pkg.pkgName}" with price $${pkg.fee}`);
    };

    async function GetDesignerDetail() {
        const res = await getALlPackageByDesignerId(designerId);
        setPackages(res.data);
    }

    useEffect(() => {
        GetDesignerDetail()
    }, []);

    console.log("In ra data ne:", data);

    return (
        <Box sx={{ background: "#fff", minHeight: "100vh", pb: 8 }}>
            <Box sx={{ maxWidth: 1300, mx: "auto", pt: 4 }}>
                <Typography color="text.secondary" fontSize={14} mb={1}>
                    Graphics & Design / Logo Design
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8} minWidth="700px">
                        <Typography variant="h5" fontWeight="bold" mb={1}>
                            {data.bio}
                        </Typography>
                        <Stack direction="row" alignItems="center" gap={2} mb={2}>
                            <Avatar src={data.profile.avatar} sx={{ width: 54, height: 54 }} />
                            <Box>
                                <Typography fontWeight="bold" fontSize={18}>{data.profile.name}</Typography>
                                <Stack direction="row" alignItems="center" gap={1} fontSize={14}>
                                    <span style={{ color: "#F59E42" }}>★ 3 sao</span>
                                    <span style={{ color: "#aaa" }}>(10 reviews)</span>
                                    <span style={{ color: "#aaa" }}>Level 8</span>
                                    <span style={{ color: "#aaa" }}>VN</span>
                                    <span style={{ color: "#aaa" }}>Joined 12/3/2025</span>
                                </Stack>
                            </Box>
                        </Stack>
                        <GallerySection images={data.thumbnails} />

                        <Typography variant="h6" fontWeight="bold" mt={2} mb={1}>
                            About
                        </Typography>
                        <Typography color="text.secondary" mb={3}>
                            {data.short_review}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <PackageTabs packages={packages} onContinue={handleContinue} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

