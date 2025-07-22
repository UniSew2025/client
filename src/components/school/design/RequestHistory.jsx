import React, {Fragment, useEffect, useRef, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip, Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Fade,
    MenuItem,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    tooltipClasses,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {createDesignRequest, getSampleImages, viewListHistory} from "../../../services/DesignService.jsx";
import {
    Add,
    AddCircleOutline,
    Info,
    KeyboardArrowDown,
    KeyboardArrowUp,
    RemoveCircleOutline
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import {useNavigate} from "react-router-dom";
import '../../../styles/school/RequestHistory.css'
import {enqueueSnackbar} from "notistack";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


const ClothItem = ({
                       label,
                       clothData,
                       index,
                       gender,
                       showClothTypeSelect = false,
                       onChange,
                       sharedLogo,
                       onSharedLogoChange,
                       expanded,
                       onExpand,
                       error = {},
                   }) => {
    const [images, setImages] = useState([]);
    const [sampleId, setSampleId] = useState(0);
    const [templateId, setTemplateId] = useState(0);
    const [color, setColor] = useState('');
    const [note, setNote] = useState('');
    const [clothType, setClothType] = useState(clothData.type);
    const [designType, setDesignType] = useState('UPLOAD');
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [templateList, setTemplateList] = useState([]);
    const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
    const [zoomDialogOpen, setZoomDialogOpen] = useState(false);
    const imageInputRef = useRef();
    const logoInputRef = useRef();

    const [logoPart1, setLogoPart1] = useState('front');
    const [logoPart2, setLogoPart2] = useState('top');
    const [logoPart3, setLogoPart3] = useState('left');
    const finalLogoPosition = `${logoPart1}-${logoPart2}-${logoPart3}`;

    const hasError = error && Object.keys(error).length > 0;

    useEffect(() => {
        if (onSharedLogoChange && clothType !== 'PANTS' && clothType !== 'SKIRT' && index === 0) {
            onSharedLogoChange({
                logoImage: sharedLogo?.logoImage || '',
                logoPosition: finalLogoPosition
            });
        }
    }, [logoPart1, logoPart2, logoPart3]);

    useEffect(() => {
        const newCloth = {
            images: images.map(url => ({url})),
            templateId: designType === 'TEMPLATE' ? templateId : 0,
            type: clothType,
            category: clothData.category,
            logoImage: (clothType !== 'PANTS' && clothType !== 'SKIRT') ? sharedLogo?.logoImage || '' : '',
            logoPosition: (clothType !== 'PANTS' && clothType !== 'SKIRT') ? sharedLogo?.logoPosition || '' : '',
            gender,
            color,
            note,
            designType,
        };
        onChange(index, newCloth);
    }, [images, templateId, clothType, color, note, designType, sharedLogo]);

    useEffect(() => {
        if (designType === 'TEMPLATE') fetchTemplates();
    }, [designType]);

    const fetchTemplates = async () => {
        try {
            const res = await getSampleImages();
            const data = res.data;
            const publicTemplates = data.filter(item => item.designRequest?.isPrivate === false);
            setTemplateList(publicTemplates.map(sample => ({
                sampleId: sample.id,
                imageUrl: sample.url,
                templateId: sample.clothId
            })));
        } catch (err) {
            console.error("Failed to fetch templates", err);
        }
    };

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
        setUploading(true);
        try {
            const uploadedUrls = await Promise.all(files.map(file => uploadToCloudinary(file)));
            setImages([...images, ...uploadedUrls]);
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Failed to upload one or more images.");
        } finally {
            setUploading(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = await uploadToCloudinary(file);
            if (onSharedLogoChange) {
                onSharedLogoChange(prev => ({
                    ...prev,
                    logoImage: url
                }));
            }
        }
        if (logoInputRef.current) logoInputRef.current.value = '';
    };


    return (
        <Accordion expanded={expanded} onChange={onExpand}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography fontWeight="bold">{label}</Typography>
                {typeof error === 'undefined'
                    ? null
                    : hasError
                        ? <CancelIcon sx={{color: "error.main", ml: 1}}/>
                        : <CheckCircleIcon sx={{color: "success.main", ml: 1}}/>}
            </AccordionSummary>
            <AccordionDetails>
                <TextField
                    select
                    fullWidth
                    label="Design Type"
                    value={designType}
                    onChange={(e) => setDesignType(e.target.value)}
                    margin="normal"
                    error={!!error.designType}
                    helperText={error.designType}
                >
                    <MenuItem value="UPLOAD">Upload</MenuItem>
                    <MenuItem value="TEMPLATE">Template</MenuItem>
                    <MenuItem value="NEW">New</MenuItem>
                </TextField>

                {designType === 'UPLOAD' && (
                    <Typography variant="caption" color="text.secondary" mt={1}>
                        UPLOAD → Choose your own picture to represent your design.
                    </Typography>
                )}
                {designType === 'TEMPLATE' && (
                    <Typography variant="caption" color="text.secondary" mt={1}>
                        TEMPLATE → Choose template from the platform gallery.
                    </Typography>
                )}
                {designType === 'NEW' && (
                    <Typography variant="caption" color="text.secondary" mt={1}>
                        NEW → Create from scratch. <strong>Note:</strong> Don’t forget to describe your idea clearly.
                    </Typography>
                )}

                {showClothTypeSelect && (
                    <TextField
                        select
                        fullWidth
                        label="Cloth Type"
                        value={clothType}
                        onChange={(e) => setClothType(e.target.value)}
                        margin="normal"
                        error={!!error.type}
                        helperText={error.type}
                    >
                        <MenuItem value="PANTS">Pant</MenuItem>
                        <MenuItem value="SKIRT">Skirt</MenuItem>
                    </TextField>
                )}

                {designType === 'UPLOAD' && (
                    <Box mt={2}>
                        <Typography variant="subtitle2">Upload your uniform images</Typography>
                        <Button variant="outlined" component="label" fullWidth disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload Images"}
                            <input
                                ref={imageInputRef}
                                hidden
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </Button>
                        {uploading && (
                            <Box display="flex" alignItems="center" mt={1}>
                                <CircularProgress size={24} style={{marginRight: 8}}/>
                                <Typography color="textSecondary">Uploading...</Typography>
                            </Box>
                        )}
                        {error.images && (
                            <Typography color="error">{error.images}</Typography>
                        )}
                        <Box display="flex" flexWrap="wrap" mt={1} gap={1}>
                            {images.map((img, i) => (
                                <Box key={i} position="relative" display="inline-block">
                                    <img
                                        src={img}
                                        alt={`img-${i}`}
                                        width={80}
                                        style={{cursor: 'pointer', borderRadius: 4, border: '1px solid #ccc'}}
                                        onClick={() => setPreviewImage(img)}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setImages(prev => prev.filter((_, idx) => idx !== i));
                                            if (imageInputRef.current) imageInputRef.current.value = '';
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            background: 'rgba(255,255,255,0.8)',
                                            '&:hover': {background: 'rgba(255,0,0,0.7)'}
                                        }}
                                    >
                                        <CloseIcon fontSize="small"/>
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {designType === 'TEMPLATE' && (
                    <>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => setTemplateDialogOpen(true)}
                            sx={{justifyContent: 'flex-start', textTransform: 'none', mt: 2}}
                        >
                            Choose Template
                        </Button>

                        {sampleId !== 0 && (
                            <Box mt={2} display="flex" alignItems="center" gap={2}>
                                <Box
                                    position="relative"
                                    sx={{cursor: 'pointer'}}
                                    onClick={() => setPreviewImage(templateList.find(t => t.sampleId === sampleId)?.imageUrl)}
                                >
                                    <img
                                        src={templateList.find(t => t.sampleId === sampleId)?.imageUrl}
                                        alt="Selected Template"
                                        width={100}
                                        style={{borderRadius: 8}}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSampleId(0);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: -10,
                                            right: -10,
                                            backgroundColor: 'white',
                                            border: '1px solid #ccc',
                                            '&:hover': {backgroundColor: '#f0f0f0'}
                                        }}
                                    >
                                        <CloseIcon fontSize="small"/>
                                    </IconButton>
                                </Box>
                            </Box>
                        )}

                        <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} fullWidth
                                maxWidth="md">
                            <DialogTitle>Select a Template</DialogTitle>
                            <DialogContent>
                                <Box display="flex" flexWrap="wrap" gap={2}>
                                    {templateList.map((template) => (
                                        <Box
                                            key={template.sampleId}
                                            onClick={() => {
                                                setSampleId(template.sampleId);
                                                setTemplateId(template.templateId);
                                                setTemplateDialogOpen(false);
                                                setZoomDialogOpen();
                                            }}
                                            sx={{
                                                border: templateId === template.sampleId ? '2px solid blue' : '1px solid gray',
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                padding: 1,
                                            }}
                                        >
                                            <img src={template.imageUrl} alt="" width={100}/>
                                        </Box>
                                    ))}
                                </Box>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={zoomDialogOpen} onClose={() => setZoomDialogOpen(false)} maxWidth="lg">
                            <DialogContent>
                                <img
                                    src={templateList.find(t => t.sampleId === templateId)?.imageUrl}
                                    alt=""
                                    style={{width: '100%', maxHeight: '80vh', objectFit: 'contain'}}
                                />
                            </DialogContent>
                        </Dialog>
                    </>
                )}

                {(clothType !== 'PANTS' && clothType !== 'SKIRT' && index === 0) && (
                    <>
                        <Box mt={2}>
                            <Typography variant="subtitle2" gutterBottom>
                                Upload your logo image
                            </Typography>
                            <Button variant="outlined" component="label" fullWidth>
                                Upload Logo
                                <input
                                    ref={logoInputRef}
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                />
                            </Button>
                            {error.logo && (
                                <Typography color="error">{error.logo}</Typography>
                            )}

                            {sharedLogo?.logoImage && (
                                <Box mt={1} position="relative" display="inline-block" width={80} height={80}>
                                    <img src={sharedLogo.logoImage} alt="logo" width={80} height={80}
                                         style={{borderRadius: 4, border: '1px solid #ccc', objectFit: 'cover'}}/>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            if (onSharedLogoChange) {
                                                onSharedLogoChange(prev => ({
                                                    ...prev,
                                                    logoImage: '',
                                                }));
                                                if (logoInputRef.current) logoInputRef.current.value = '';
                                            }
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            background: 'rgba(255,255,255,0.8)',
                                            '&:hover': {background: 'rgba(255,0,0,0.7)'}
                                        }}
                                    >
                                        <CloseIcon fontSize="small"/>
                                    </IconButton>
                                </Box>
                            )}
                        </Box>

                        <Box mt={2}>
                            <Typography variant="subtitle2" gutterBottom>
                                Logo Position
                            </Typography>
                            <Box display="flex" gap={2}>
                                <TextField select label="Body" value={logoPart1}
                                           onChange={(e) => setLogoPart1(e.target.value)} fullWidth>
                                    <MenuItem value="front">Front</MenuItem>
                                    <MenuItem value="back">Back</MenuItem>
                                    <MenuItem value="shoulder">Shoulder</MenuItem>
                                </TextField>
                                <TextField select label="Vertical" value={logoPart2}
                                           onChange={(e) => setLogoPart2(e.target.value)} fullWidth>
                                    <MenuItem value="top">Top</MenuItem>
                                    <MenuItem value="middle">Middle</MenuItem>
                                    <MenuItem value="bottom">Bottom</MenuItem>
                                </TextField>
                                <TextField select label="Horizontal" value={logoPart3}
                                           onChange={(e) => setLogoPart3(e.target.value)} fullWidth>
                                    <MenuItem value="left">Left</MenuItem>
                                    <MenuItem value="center">Center</MenuItem>
                                    <MenuItem value="right">Right</MenuItem>
                                </TextField>
                            </Box>
                        </Box>
                    </>
                )}


                <Typography mt={2} variant="subtitle2">Color of your uniform</Typography>
                <Box mt={1} display="flex" alignItems="center" gap={1}>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer'}}
                    />
                    <Typography variant="body2" sx={{minWidth: 70}}>
                        Color code: {color?.toUpperCase()}
                    </Typography>
                </Box>
                {error.color && (
                    <Typography color="error">{error.color}</Typography>
                )}


                <TextField
                    fullWidth
                    label="Note"
                    margin="normal"
                    multiline
                    minRows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </AccordionDetails>
            <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md">
                <Box p={2} display="flex" flexDirection="column" alignItems="center">
                    <img src={previewImage} alt="preview" style={{maxWidth: '90vw', maxHeight: '80vh'}}/>
                    <IconButton onClick={() => setPreviewImage(null)} sx={{alignSelf: 'flex-end'}}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
            </Dialog>
        </Accordion>
    );
};


const validateClothError = (cloth) => {
    const errors = {};
    if (!cloth?.designType) errors.designType = "Please select design type!";
    if (!cloth?.type) errors.type = "Please select cloth type!";
    if (cloth?.designType === "TEMPLATE" && (!cloth.templateId || cloth.templateId <= 0))
        errors.templateId = "Please choose a template!";
    if (cloth?.designType === "UPLOAD" && (!cloth.images || cloth.images.length === 0))
        errors.images = "Please upload at least 1 image!";
    const needLogo = cloth?.type !== 'PANTS' && cloth?.type !== 'SKIRT';
    if (needLogo && (!cloth.logoImage || !cloth.logoPosition))
        errors.logo = "Please upload logo image and choose position!";
    if (!cloth?.color) errors.color = "Please choose a color!";
    return errors;
};

const RegularForm = ({
                         clothes: clothesFromProps = [],
                         onClothesChange,
                         sharedLogo,
                         onSharedLogoChange,
                         steps,
                         onValidateChange
                     }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [clothes, setClothes] = useState([
        clothesFromProps[0] || {},
        clothesFromProps[1] || {},
        clothesFromProps[2] || {},
        clothesFromProps[3] || {},
    ]);
    const [clothErrors, setClothErrors] = useState({});
    const [clothTouched, setClothTouched] = useState({});

    useEffect(() => {
        const isValid = [0, 1, 2, 3].every(i => Object.keys(validateClothError(clothes[i] || {})).length === 0);
        if (onValidateChange) onValidateChange(isValid);
    }, [clothes, clothErrors]);

    const handleClothChange = (index, cloth) => {
        const newClothes = [...clothes];
        newClothes[index] = cloth;
        setClothes(newClothes);

        const error = validateClothError(cloth);
        setClothErrors(prev => ({...prev, [index]: error}));
        setClothTouched(prev => ({...prev, [index]: true}));

        if (onClothesChange) onClothesChange(newClothes);
    };

    return (
        <Box>
            <Box sx={{width: '100%'}}>
                <Stepper activeStep={1} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <Box mt={2}>
                <Typography fontWeight="bold">Boy</Typography>
                <ClothItem
                    label="Shirt"
                    clothData={{type: 'SHIRT', category: 'REGULAR'}}
                    gender="BOY"
                    index={0}
                    expanded={expandedIndex === 0}
                    onExpand={() => setExpandedIndex(expandedIndex === 0 ? null : 0)}
                    onChange={handleClothChange}
                    sharedLogo={sharedLogo}
                    onSharedLogoChange={onSharedLogoChange}
                    error={clothTouched[0] ? clothErrors[0] : undefined}
                />
                <ClothItem
                    label="Pant"
                    clothData={{type: 'PANTS', category: 'REGULAR'}}
                    gender="BOY"
                    index={1}
                    expanded={expandedIndex === 1}
                    onExpand={() => setExpandedIndex(expandedIndex === 1 ? null : 1)}
                    onChange={handleClothChange}
                    error={clothTouched[1] ? clothErrors[1] : undefined}
                />
            </Box>
            <Box mt={2}>
                <Typography fontWeight="bold">Girl</Typography>
                <ClothItem
                    label="Shirt"
                    clothData={{type: 'SHIRT', category: 'REGULAR'}}
                    gender="GIRL"
                    index={2}
                    expanded={expandedIndex === 2}
                    onExpand={() => setExpandedIndex(expandedIndex === 2 ? null : 2)}
                    onChange={handleClothChange}
                    sharedLogo={sharedLogo}
                    onSharedLogoChange={onSharedLogoChange}
                    error={clothTouched[2] ? clothErrors[2] : undefined}
                />
                <ClothItem
                    label="Pant / Skirt"
                    clothData={{type: 'PANTS', category: 'REGULAR'}}
                    gender="GIRL"
                    index={3}
                    expanded={expandedIndex === 3}
                    onExpand={() => setExpandedIndex(expandedIndex === 3 ? null : 3)}
                    onChange={handleClothChange}
                    showClothTypeSelect
                    error={clothTouched[3] ? clothErrors[3] : undefined}
                />
            </Box>
        </Box>
    );
};


const PhysicalForm = ({
                          clothes = [{}, {}, {}, {}],
                          onClothesChange,
                          sharedLogo,
                          onSharedLogoChange,
                          steps
                      }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [clothErrors, setClothErrors] = useState({});
    const [clothTouched, setClothTouched] = useState({});

    const handleClothChange = (index, cloth) => {
        const newClothes = [...clothes];
        newClothes[index] = cloth;
        if (onClothesChange) onClothesChange(newClothes);

        const error = validateClothError(cloth);
        setClothErrors(prev => ({...prev, [index]: error}));
        setClothTouched(prev => ({...prev, [index]: true}));
    };

    return (
        <Box>
            <Box sx={{width: '100%'}}>
                <Stepper activeStep={steps.length === 3 ? 1 : 2} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}><StepLabel>{label}</StepLabel></Step>
                    ))}
                </Stepper>
            </Box>
            <Box mt={2}>
                <Typography fontWeight="bold">Boy</Typography>
                <ClothItem
                    label="Shirt"
                    clothData={{type: 'SHIRT', category: 'PHYSICAL'}}
                    gender="BOY"
                    index={0}
                    expanded={expandedIndex === 0}
                    onExpand={() => setExpandedIndex(expandedIndex === 0 ? null : 0)}
                    onChange={handleClothChange}
                    sharedLogo={sharedLogo}
                    onSharedLogoChange={onSharedLogoChange}
                    error={clothTouched[0] ? clothErrors[0] : undefined}
                />
                <ClothItem
                    label="Pant"
                    clothData={{type: 'PANTS', category: 'PHYSICAL'}}
                    gender="BOY"
                    index={1}
                    expanded={expandedIndex === 1}
                    onExpand={() => setExpandedIndex(expandedIndex === 1 ? null : 1)}
                    onChange={handleClothChange}
                    error={clothTouched[1] ? clothErrors[1] : undefined}
                />
            </Box>
            <Box mt={2}>
                <Typography fontWeight="bold">Girl</Typography>
                <ClothItem
                    label="Shirt"
                    clothData={{type: 'SHIRT', category: 'PHYSICAL'}}
                    gender="GIRL"
                    index={2}
                    expanded={expandedIndex === 2}
                    onExpand={() => setExpandedIndex(expandedIndex === 2 ? null : 2)}
                    onChange={handleClothChange}
                    sharedLogo={sharedLogo}
                    onSharedLogoChange={onSharedLogoChange}
                    error={clothTouched[2] ? clothErrors[2] : undefined}
                />
                <ClothItem
                    label="Pant"
                    clothData={{type: 'PANTS', category: 'PHYSICAL'}}
                    gender="GIRL"
                    index={3}
                    expanded={expandedIndex === 3}
                    onExpand={() => setExpandedIndex(expandedIndex === 3 ? null : 3)}
                    onChange={handleClothChange}
                    error={clothTouched[3] ? clothErrors[3] : undefined}
                />
            </Box>
        </Box>
    );
};


function RenderTooltip({title, children}) {
    return (
        <Tooltip
            title={title}
            slots={{
                transition: Fade,
            }}
            slotProps={{
                transition: {timeout: 600},
                popper: {
                    sx: {
                        [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                            {
                                marginTop: '30px',
                            }
                    },
                },
            }}
            followCursor
        >
            {children}
        </Tooltip>
    )
}

const RequestHistory = () => {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [designTypes, setDesignTypes] = useState({regular: false, physical: false});
    const [designRequest, setDesignRequest] = useState({schoolId: 0, clothes: []});
    const [historyList, setHistoryList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sharedLogo, setSharedLogo] = useState({logoImage: '', logoPosition: ''});
    const [isRegularValid, setIsRegularValid] = useState(false);
    const [isPhysicalValid, setIsPhysicalValid] = useState(false);
    const [rowExpand, setRowExpand] = useState(-1)

    const steps =
        designTypes.regular && designTypes.physical
            ? ["Select type", "Create regular uniform", "Create physical education uniform", "Complete"]
            : designTypes.regular && !designTypes.physical
                ? ["Select type", "Create regular uniform", "Complete"]
                : ["Select type", "Create physical education uniform", "Complete"];

    useEffect(() => {
        getListRequest();
    }, []);

    const navigate = useNavigate();

    const paginatedData = historyList
        .slice()
        .reverse()
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleOpen = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const schoolId = user.id || 0;
        setOpen(true);
        setStep(0);
        setDesignTypes({regular: false, physical: false});
        setDesignRequest({schoolId, clothes: []});
    };

    const handleClose = () => {
        setOpen(false);
        setDesignRequest({schoolId: 0, clothes: []});
    };

    const handleCheckboxChange = (name) => {
        setDesignTypes(prev => ({...prev, [name]: !prev[name]}));
    };

    const handleClothesChange = (clothes) => {
        setDesignRequest(prev => ({...prev, clothes}));
    };

    const handleRegularValidate = (isValid) => {
        setIsRegularValid(isValid);
    };

    const handlePhysicalValidate = (isValid) => {
        setIsPhysicalValid(isValid);
    };

    const handleNext = async () => {
        if (step === 0) {
            if (!designTypes.regular && !designTypes.physical) {
                enqueueSnackbar('Please choose at least one uniform type', {variant: "warning"});
                return;
            }
            if (designTypes.regular) setStep(1);
            else setStep(2);
        } else if (step === 1 && designTypes.physical) {
            if (!isRegularValid) {
                enqueueSnackbar("Please complete all required fields in Regular Uniform!", {variant: "error"});
                return;
            }
            setStep(2);
        } else {
            try {
                const res = await createDesignRequest(designRequest);
                enqueueSnackbar("Created successfully!", {variant: "success"});
                setHistoryList(prev => [...prev, res?.data || {}]);
                await getListRequest();
                handleClose();
            } catch (err) {
                enqueueSnackbar("Create failed", {variant: "error"});
                console.log("error", err);
            }
        }
    };

    const handleBack = () => {
        if (step === 1) {
            setStep(0);
            setDesignRequest(prev => ({
                ...prev,
                clothes: (prev.clothes || []).filter(c => c && c.category !== "REGULAR")
            }));
        } else if (step === 2) {
            if (designTypes.regular) setStep(1);
            else {
                setStep(0);
                setDesignRequest(prev => ({
                    ...prev,
                    clothes: prev.clothes.filter(c => c && c.category !== "PHYSICAL")
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

    const handleViewDetail = (item) => {
        console.log("item", item);
        navigate('/school/d/detail', {
            state: {
                requestId: item.id,
                packageId: item.package,
                request: item
            }
        });
    };

    function RenderRadioSelection() {
        return (
            <div className={'d-flex justify-content-center align-content-center mb-lg-5 gap-3'}>
                <RenderTooltip
                    title={designTypes.regular ? "Click to unselect regular uniform" : "Click to select regular uniform"}>
                    <Card>
                        <CardActionArea
                            onClick={() => handleCheckboxChange('regular')}
                            data-active={designTypes.regular ? '' : undefined}
                            sx={{
                                height: '100%',
                                width: '25vw',
                                '&[data-active]': {
                                    backgroundColor: 'action.selected',
                                    '&:hover': {backgroundColor: 'action.selectedHover'}
                                }
                            }}
                        >
                            <CardContent sx={{height: '100%'}}>
                                <CardMedia component="img" height="400" image="/regular.png" alt="Regular"/>
                                <Typography variant="h5" component="div" align={"center"} sx={{marginTop: '3vh'}}>
                                    Regular Uniform {designTypes.regular ?
                                    <Typography fontWeight={"bold"} color={"success"}>Selected</Typography> :
                                    <Typography fontWeight={"bold"} color={"error"}>Unselected</Typography>}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </RenderTooltip>
                <RenderTooltip
                    title={designTypes.physical ? "Click to unselect physical education uniform" : "Click to select physical education uniform"}>
                    <Card>
                        <CardActionArea
                            onClick={() => handleCheckboxChange('physical')}
                            data-active={designTypes.physical ? '' : undefined}
                            sx={{
                                height: '100%',
                                width: '25vw',
                                '&[data-active]': {
                                    backgroundColor: 'action.selected',
                                    '&:hover': {backgroundColor: 'action.selectedHover'}
                                }
                            }}
                        >
                            <CardContent sx={{height: '100%'}}>
                                <CardMedia component="img" height="400" image="/PE.jpg" alt="Physical Education"/>
                                <Typography variant="h5" component="div" align={"center"} sx={{marginTop: '3vh'}}>
                                    Physical Education Uniform {designTypes.physical ?
                                    <Typography fontWeight={"bold"} color={"success"}>Selected</Typography> :
                                    <Typography fontWeight={"bold"} color={"error"}>Unselected</Typography>}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </RenderTooltip>
            </div>
        )
    }

    function RenderStatusDisplay({status}) {
        const color = status === 'created' ? 'secondary' :
            status === 'paid' ? 'primary' :
                status === 'designing' ? 'info' : 'success'

        return (
            <Chip
                color={color}
                variant={"filled"}
                label={status}
                size={"small"}
                sx={{textTransform: 'capitalize'}}
            />
        )
    }

    function HandleViewDesignList(item) {
        localStorage.setItem("sDesign", JSON.stringify(item))
        navigate("/school/designer/list")
    }

    function HandleCreateOrder(request) {
        localStorage.setItem("formStep", '0')
        localStorage.setItem("sRequest", request.id)
        navigate('/school/d/order/form')
    }

    return (
        <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Design History</Typography>
                <Button
                    variant="contained"
                    onClick={handleOpen}
                    startIcon={<Add/>}
                    sx={{borderRadius: '20px', gap: '0.1vw'}}
                >
                    Create
                </Button>
            </Box>

            <Paper elevation={2}>
                <TableContainer sx={{mt: 3}}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                                <TableCell align={"center"} sx={{width: '5%'}}/>
                                <TableCell align={"center"} sx={{width: '5%'}}><strong>ID</strong></TableCell>
                                <TableCell align={"center"} sx={{width: '20%'}}><strong>Design Type</strong></TableCell>
                                <TableCell align={"center"} sx={{width: '30%'}}><strong>Feedback</strong></TableCell>
                                <TableCell align={"center"} sx={{width: '20%'}}><strong>Status</strong></TableCell>
                                <TableCell align={"center"} sx={{width: '20%'}}><strong>View Detail</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((item, index) => (
                                <Fragment key={index}>
                                    <TableRow>
                                        <TableCell align={"center"}>
                                            {item.status === 'completed' || item.status === 'created' ?
                                                (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setRowExpand(rowExpand === index ? -1 : index)}
                                                    >
                                                        {rowExpand === index ? <KeyboardArrowUp/> :
                                                            <KeyboardArrowDown/>}
                                                    </IconButton>
                                                )
                                                :
                                                ""
                                            }
                                        </TableCell>
                                        <TableCell align={"center"} sx={{width: '0.3vw'}}>{item.id}</TableCell>
                                        <TableCell align={"center"}>{item.private ? "Private" : "Public"}</TableCell>
                                        <TableCell align={"center"}>{item.feedback ? item.feedback : "N/A"}</TableCell>
                                        <TableCell align={"center"}>
                                            <RenderStatusDisplay status={item.status}/>
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <IconButton
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleViewDetail(item)}
                                            >
                                                <Info fontSize={"medium"} color={"info"}/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{padding: 0, width: '100%', backgroundColor: '#EEF0F3'}}
                                                   colSpan={12}>
                                            {item.status === 'completed' || item.status === 'created' ?
                                                (
                                                    <Collapse in={rowExpand === index} timeout="auto" unmountOnExit>
                                                        <Box sx={{
                                                            marginY: '1vh',
                                                            width: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'flex-end'
                                                        }}>
                                                            {item.status === 'completed' ?
                                                                (
                                                                    <Button variant={'contained'}
                                                                            sx={{marginRight: '3vw'}}
                                                                            color={'success'}
                                                                            onClick={() => HandleCreateOrder(item)}
                                                                    >
                                                                        Create Order
                                                                    </Button>
                                                                )
                                                                :
                                                                (
                                                                    <Button variant={'contained'}
                                                                            sx={{marginRight: '2vw'}}
                                                                            color={'secondary'}
                                                                            onClick={() => HandleViewDesignList(item)}
                                                                    >
                                                                        Select Designer
                                                                    </Button>
                                                                )
                                                            }
                                                        </Box>
                                                    </Collapse>
                                                )
                                                :
                                                ""
                                            }
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={historyList.length}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 5));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </TableContainer>
            </Paper>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" scroll={'paper'}>
                <DialogTitle variant="h4">Create Design Request</DialogTitle>
                <Divider variant="middle" sx={{borderTop: '1px solid black'}}/>
                <DialogContent>
                    {step === 0 && (
                        <>
                            <Typography variant="h5" sx={{marginBottom: '1vh'}}>
                                Choose uniform type you want to design
                                <Typography color="error">Select at least 1 type *</Typography>
                            </Typography>
                            <RenderRadioSelection/>
                        </>
                    )}
                    {step === 1 && designTypes.regular && (
                        <RegularForm
                            clothes={designRequest.clothes}
                            onClothesChange={handleClothesChange}
                            sharedLogo={sharedLogo}
                            onSharedLogoChange={setSharedLogo}
                            steps={steps}
                            onValidateChange={handleRegularValidate}
                        />
                    )}
                    {step === 2 && designTypes.physical && (
                        <PhysicalForm
                            clothes={designRequest.clothes}
                            onClothesChange={handleClothesChange}
                            sharedLogo={sharedLogo}
                            onSharedLogoChange={setSharedLogo}
                            steps={steps}
                            onValidateChange={handlePhysicalValidate}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    {step > 0 && <Button onClick={handleBack}>Back</Button>}
                    {step === 0 && <Button onClick={handleClose}>Close</Button>}
                    <Button onClick={handleNext} variant="contained">
                        {step === 0 ? 'Next' : (step === 1 && designTypes.physical ? 'Next' : 'Submit')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RequestHistory;
