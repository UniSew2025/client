import React, {useEffect, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {createDesignRequest, viewListHistory} from "../../services/DesignService.jsx";
import {Add} from '@mui/icons-material';


const ClothItem = ({label, clothData, index, gender, showClothTypeSelect = false, onChange}) => {
    const [images, setImages] = useState([]);
    const [templateId, setTemplateId] = useState(0);
    const [logoImage, setLogoImage] = useState('');
    const [logoPosition, setLogoPosition] = useState('');
    const [color, setColor] = useState('');
    const [note, setNote] = useState('');
    const [clothType, setClothType] = useState(clothData.type);
    const [designType, setDesignType] = useState('UPLOAD');

    useEffect(() => {
        const newCloth = {
            images: images.map(url => ({url})),
            templateId: designType === 'TEMPLATE' ? templateId : 0,
            type: clothType,
            category: clothData.category,
            logoImage: (clothType !== 'PANTS' && clothType !== 'SKIRT') ? logoImage : '',
            logoPosition: (clothType !== 'PANTS' && clothType !== 'SKIRT') ? logoPosition : '',
            gender,
            color,
            note,
            designType,
        };
        onChange(index, newCloth);
    }, [images, templateId, clothType, logoImage, logoPosition, color, note, designType]);

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "SmartSew");
        formData.append("cloud_name", "di1aqthok");
        const res = await fetch("https://api.cloudinary.com/v1_1/di1aqthok/image/upload", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        return data.secure_url;
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const maxUpload = 8;

        if (images.length + files.length > maxUpload) {
            alert(`You can upload a maximum of ${maxUpload} images.`);
            return;
        }

        try {
            const uploadedUrls = await Promise.all(files.map(file => uploadToCloudinary(file)));
            setImages([...images, ...uploadedUrls]);
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Failed to upload one or more images.");
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = await uploadToCloudinary(file);
            setLogoImage(url);
        }
    };

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography fontWeight="bold">{label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <TextField select fullWidth label="Design Type" value={designType}
                           onChange={(e) => setDesignType(e.target.value)} margin="normal">
                    <MenuItem value="UPLOAD">Upload</MenuItem>
                    <MenuItem value="TEMPLATE">Template</MenuItem>
                    <MenuItem value="NEW">New</MenuItem>
                </TextField>

                {showClothTypeSelect && (
                    <TextField select fullWidth label="Cloth Type" value={clothType}
                               onChange={(e) => setClothType(e.target.value)} margin="normal">
                        <MenuItem value="PANTS">Pant</MenuItem>
                        <MenuItem value="SKIRT">Skirt</MenuItem>
                    </TextField>
                )}

                {designType === 'UPLOAD' && (
                    <Box mt={2}>
                        <Typography variant="subtitle2">Images</Typography>
                        <Button variant="outlined" component="label" fullWidth>
                            Upload Images
                            <input hidden type="file" multiple accept="image/*" onChange={handleImageUpload}/>
                        </Button>
                        <Box display="flex" flexWrap="wrap" mt={1} gap={1}>
                            {images.map((img, i) => <img key={i} src={img} alt="img" width={80}/>)}
                        </Box>
                    </Box>
                )}

                {designType === 'TEMPLATE' && (
                    <TextField fullWidth type="number" label="Template ID" value={templateId}
                               onChange={(e) => setTemplateId(Number(e.target.value))} margin="normal"/>
                )}

                {(clothType !== 'PANTS' && clothType !== 'SKIRT') && (
                    <>
                        <Button variant="outlined" component="label" fullWidth>
                            Upload Logo
                            <input hidden type="file" accept="image/*" onChange={handleLogoUpload}/>
                        </Button>
                        {logoImage && <img src={logoImage} alt="logo" width={80}/>}
                        <TextField fullWidth label="Logo Position" margin="normal" value={logoPosition}
                                   onChange={(e) => setLogoPosition(e.target.value)}/>
                    </>
                )}

                <TextField fullWidth label="Color" margin="normal" value={color}
                           onChange={(e) => setColor(e.target.value)}/>
                <TextField fullWidth label="Note" margin="normal" multiline minRows={2} value={note}
                           onChange={(e) => setNote(e.target.value)}/>
            </AccordionDetails>
        </Accordion>
    );
};

const RegularForm = ({onClothChange}) => (
    <Box>
        <Typography variant="h6">Regular Request</Typography>
        <Box mt={2}>
            <Typography fontWeight="bold">Boy</Typography>
            <ClothItem label="Shirt" clothData={{type: 'SHIRT', category: 'REGULAR'}} gender="BOY" index={0}
                       onChange={onClothChange}/>
            <ClothItem label="Pant" clothData={{type: 'PANTS', category: 'REGULAR'}} gender="BOY" index={1}
                       onChange={onClothChange}/>
        </Box>
        <Box mt={2}>
            <Typography fontWeight="bold">Girl</Typography>
            <ClothItem label="Shirt" clothData={{type: 'SHIRT', category: 'REGULAR'}} gender="GIRL" index={2}
                       onChange={onClothChange}/>
            <ClothItem label="Pant / Skirt" clothData={{type: 'PANTS', category: 'REGULAR'}} gender="GIRL" index={3}
                       onChange={onClothChange} showClothTypeSelect/>
        </Box>
    </Box>
);

const PhysicalForm = ({onClothChange}) => (
    <Box>
        <Typography variant="h6">Physical Education</Typography>
        <Box mt={2}>
            <Typography fontWeight="bold">Boy</Typography>
            <ClothItem label="Shirt" clothData={{type: 'SHIRT', category: 'PHYSICAL'}} gender="BOY" index={4}
                       onChange={onClothChange}/>
            <ClothItem label="Pant" clothData={{type: 'PANTS', category: 'PHYSICAL'}} gender="BOY" index={5}
                       onChange={onClothChange}/>
        </Box>
        <Box mt={2}>
            <Typography fontWeight="bold">Girl</Typography>
            <ClothItem label="Shirt" clothData={{type: 'SHIRT', category: 'PHYSICAL'}} gender="GIRL" index={6}
                       onChange={onClothChange}/>
            <ClothItem label="Pant" clothData={{type: 'PANTS', category: 'PHYSICAL'}} gender="GIRL" index={7}
                       onChange={onClothChange}/>
        </Box>
    </Box>
);

const RequestHistory = () => {
    const [open, setOpen] = useState(localStorage.getItem("createDesignPopup"));
    const [step, setStep] = useState(0);
    const [designTypes, setDesignTypes] = useState({regular: false, physical: false});
    const [designRequest, setDesignRequest] = useState({schoolId: 0, clothes: []});

    const [historyList, setHistoryList] = useState([]);

    if(localStorage.getItem("createDesignPopup")){
        localStorage.removeItem("createDesignPopup");
    }

    useEffect(() => {
        getListRequest();
    }, []);

    const handleOpen = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const schoolId = user?.id || 0;
        setOpen(true);
        setStep(0);
        setDesignTypes({regular: false, physical: false});
        setDesignRequest({schoolId, clothes: []});
    };

    const handleClose = () => {
        setOpen(false);
        setDesignRequest({schoolId: 0, clothes: []});
    };

    const handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        setDesignTypes(prev => ({...prev, [name]: checked}));
    };

    const handleClothChange = (index, cloth) => {
        setDesignRequest(prev => {
            const newClothes = [...prev.clothes];
            newClothes[index] = cloth;
            return {...prev, clothes: newClothes};
        });
    };

    const handleNext = async () => {
        if (step === 0) {
            if (!designTypes.regular && !designTypes.physical) {
                alert('Choose at least one uniform type');
                return;
            }
            if (designTypes.regular) setStep(1);
            else setStep(2);
        } else if (step === 1 && designTypes.physical) {
            setStep(2);
        } else {
            try {
                const res = await createDesignRequest(designRequest);
                alert("Created successfully!");
                setHistoryList(prev => [...prev, res?.data || {}]);
                handleClose();
            } catch (err) {
                console.error("Error creating request:", err);
                alert("Create failed");
            }
        }
    };

    const handleBack = () => {
        if (step === 1) {
            setStep(0);
            setDesignRequest(prev => ({
                ...prev,
                clothes: prev.clothes.filter(c => c.category !== "REGULAR")
            }));
        } else if (step === 2) {
            if (designTypes.regular) setStep(1);
            else {
                setStep(0);
                setDesignRequest(prev => ({
                    ...prev,
                    clothes: prev.clothes.filter(c => c.category !== "PHYSICAL")
                }));
            }
        }
    };


    const getListRequest = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const schoolId = user?.id || 0;

        try {
            const response = await viewListHistory();
            const data = response.data;

            const filtered = data.filter(item => item.school === schoolId);
            setHistoryList(filtered);
        } catch (error) {
            console.error("Failed to fetch design requests:", error);
        }
    };

    return (

            <Box p={4}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5">History</Typography>
                    <Button variant="contained" onClick={handleOpen} startIcon={<Add/>}>Create new</Button>
                </Box>

                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>School Name</strong></TableCell>
                                <TableCell><strong>Private</strong></TableCell>
                                <TableCell><strong>Feedback</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historyList.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.school}</TableCell>
                                    <TableCell>{item.private ? "Yes" : "No"}</TableCell>
                                    <TableCell>{item.feedback}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>
                                        <Button size="small" variant="outlined">View Detail</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                    <DialogTitle>Create Design Request</DialogTitle>
                    <DialogContent>
                        {step === 0 && (
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={designTypes.regular} onChange={handleCheckboxChange}
                                                       name="regular"/>} label="Regular Uniform"/>
                                <FormControlLabel
                                    control={<Checkbox checked={designTypes.physical} onChange={handleCheckboxChange}
                                                       name="physical"/>} label="Physical Education"/>
                            </FormGroup>
                        )}
                        {step === 1 && designTypes.regular &&
                            <RegularForm onClothChange={handleClothChange} currentClothes={designRequest.clothes}/>}
                        {step === 2 && designTypes.physical &&
                            <PhysicalForm onClothChange={handleClothChange} currentClothes={designRequest.clothes}/>}
                    </DialogContent>
                    <DialogActions>
                        {step > 0 && <Button onClick={handleBack}>Back</Button>}
                        <Button onClick={handleNext} variant="contained">
                            {step === 0 ? 'Next' : (step === 1 && designTypes.physical ? 'Next' : 'Submit')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

    );
};

export default RequestHistory;
