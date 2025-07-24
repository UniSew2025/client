import {createRef, useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    Radio, RadioGroup,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem, DialogActions
} from '@mui/material';
import {useLocation} from "react-router-dom";
import {
    getAllComments,
    getAllDelivery,
    getClothByRequestId, getRequestById, getRevisionUnUseList, makeDeliveryFinalAndRequestComplete,
    sendComment,
    submitDelivery,
    submitRevision
} from "../../../services/DesignService.jsx";
import {getPackageInfo} from "../../../services/ProfileService.jsx";
import UploadZip from "../../designer/UploadZip.jsx";
import {enqueueSnackbar} from "notistack";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function TabPanel(props) {
    const {children, value, index, ...other} = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box p={2}>{children}</Box>
            )}
        </div>
    );
}


const ActivityTab = ({requestId, userRole, onSend}) => {
    const [listComment, setListComment] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (!requestId) return;
        const fetchComments = async () => {
            try {
                const res = await getAllComments(requestId);
                if (res && Array.isArray(res.data)) {
                    setListComment(res.data);
                }
            } catch (error) {
                console.error('Error loading comments:', error);
            }
        };
        fetchComments()
    }, []);

    const handleSendComment = async () => {
        if (!commentInput.trim()) return;
        setIsSending(true);
        try {
            await sendComment(requestId, commentInput);
            const newComment = {
                senderRole: userRole,
                content: commentInput,
                createdAt: new Date().toISOString()
            };
            setListComment(prev => [...prev, newComment]);
            onSend?.(newComment);
            setCommentInput('');
        } catch (error) {
            console.error('Failed to send comment:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Box>
            <List>
                {listComment.length === 0 && userRole === "school" ? (
                    <Typography color="gray" textAlign="center" mb={2}>
                        Waiting for designer response...
                    </Typography>
                ) : (
                    listComment
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                        .map((c, i) => {
                            const isSystem = c.senderRole === "" || c.senderId === 0;
                            const isSchool = c.senderRole === "School";

                            let align = "", bgColor = "";
                            if (userRole === "school") {
                                align = isSystem ? "center" : isSchool ? "right" : "left";
                                bgColor = isSystem ? "#f0f0f0" : isSchool ? "#e3f2fd" : "#fce4ec";
                            } else {
                                align = isSystem ? "center" : isSchool ? "left" : "right";
                                bgColor = isSystem ? "#f0f0f0" : isSchool ? "#fce4ec" : "#e3f2fd";
                            }

                            return (
                                <ListItem key={i} sx={{justifyContent: align}}>
                                    <Box
                                        p={1.5}
                                        maxWidth="70%"
                                        borderRadius={2}
                                        bgcolor={bgColor}
                                        textAlign={align}
                                    >
                                        {!isSystem && (
                                            <Typography fontWeight="bold" fontSize={13}>
                                                {c.senderRole}
                                            </Typography>
                                        )}
                                        <Typography>{c.content}</Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {new Date(c.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            );
                        })
                )}
            </List>

            {((userRole === "school" && listComment.length !== 0) || userRole === "designer") && (
                <Box display="flex" gap={1} mt={2}>
                    <TextField
                        fullWidth
                        placeholder="Write a comment..."
                        size="small"
                        value={commentInput}
                        onChange={e => setCommentInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSendComment}
                        disabled={!commentInput.trim() || isSending}
                    >
                        {isSending ? 'Sending...' : 'Send'}
                    </Button>
                </Box>
            )}

            {userRole === "school" && listComment.length === 0 && (
                <Typography color="gray" mt={2}>
                    Please wait for the designer to start the conversation.
                </Typography>
            )}
        </Box>
    );
};

const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
};
const DetailsTab = ({packageInfo, request}) => {


    if (!packageInfo) {
        return <Typography>Loading package info...</Typography>;
    }

    return (
        <>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                {request.packageName}
            </Typography>

            <Typography color="text.secondary" mb={2}>
                {request.headerContent}
            </Typography>

            <Typography><b>Fee:</b> {formatVND(request.packagePrice)}VND</Typography>
            <Typography><b>Delivery:</b> {request.deliveryDate} days</Typography>
            <Typography><b>Revisions:</b> {request.revisionTime}</Typography>
        </>
    );
};

const RequirementsTab = () => {
    const [designDetails, setDesignDetails] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [zoomedImage, setZoomedImage] = useState(null);

    const location = useLocation();
    const requestId = location.state?.requestId;

    useEffect(() => {
        const fetchDesign = async () => {
            try {
                const res = await getClothByRequestId(requestId);
                if (res && Array.isArray(res)) {
                    setDesignDetails(res);

                }
            } catch (error) {
                console.error("Failed to load design details:", error);
            }
        };
        if (requestId) fetchDesign();
    }, [requestId]);


    const handleViewImages = (images) => {
        setSelectedImages(images);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedImages([]);
    };

    return (
        <Box>
            <Typography variant="h6" mb={2}>Your Requirements</Typography>
            {designDetails.length === 0 ? (
                <Typography color="gray">No design requirements found.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Type</b></TableCell>
                                <TableCell><b>Category</b></TableCell>
                                <TableCell><b>Color</b></TableCell>
                                <TableCell><b>Fabric</b></TableCell>
                                <TableCell><b>Note</b></TableCell>
                                <TableCell><b>Logo Image</b></TableCell>
                                <TableCell><b>Cloth Image</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {designDetails.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.cloth_type}</TableCell>
                                    <TableCell>{item.cloth_category}</TableCell>
                                    <TableCell>{item.color}</TableCell>
                                    <TableCell>{item.fabric}</TableCell>
                                    <TableCell>{item.note}</TableCell>
                                    <TableCell>
                                        {item.logo_image ? (
                                            <img
                                                src={item.logo_image}
                                                alt="Logo"
                                                style={{width: 50, height: 'auto', borderRadius: 4}}
                                            />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">No logo</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewImages(item.images || [])}
                                            disabled={!item.images || item.images.length === 0}
                                        >
                                            View Images
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Cloth Images</DialogTitle>
                <DialogContent>
                    {selectedImages.length > 0 ? (
                        <Box display="flex" flexWrap="wrap" gap={2}>
                            {selectedImages.map((img, i) => (
                                <Box
                                    key={i}
                                    p={1}
                                    border="1px solid #ccc"
                                    borderRadius={2}
                                    sx={{backgroundColor: '#f9f9f9', cursor: 'pointer'}}
                                    onClick={() => setZoomedImage(img.url)}
                                >
                                    <img
                                        src={img.url}
                                        alt={`Cloth ${i}`}
                                        style={{width: 140, height: 'auto', borderRadius: 4}}
                                    />
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography>No images available.</Typography>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={!!zoomedImage} onClose={() => setZoomedImage(null)} maxWidth="md">
                <DialogContent sx={{textAlign: 'center'}}>
                    <img
                        src={zoomedImage}
                        alt="Zoomed"
                        style={{maxWidth: '100%', maxHeight: '80vh', borderRadius: 8}}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

const DeliveryTab = ({requestId, userRole, request, refreshKey}) => {
    const [note, setNote] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [googleAccessToken, setGoogleAccessToken] = useState("");
    const [resetUploadKey, setResetUploadKey] = useState(0);
    const [submitType, setSubmitType] = useState("normal");
    const [selectedRevisionId, setSelectedRevisionId] = useState(null);
    const [revisionList, setRevisionList] = useState([]);
    const [highlightedId, setHighlightedId] = useState(null);


    const deliveryRefs = useRef({});
    const selectedRevision = revisionList.find(rev => rev.id === Number(selectedRevisionId));
    const revisionDelivery = deliveries.filter((item) => item.isRevision);
    const revisionCount = revisionDelivery.length;
    const isRevisionDisabled = revisionCount >= request.revisionTime;


    useEffect(() => {
        if (!requestId) return;
        setLoading(true);
        getAllDelivery(requestId)
            .then((res) => {
                setDeliveries(res.data.deliveries);
                setGoogleAccessToken(res?.data?.google_access_token || "");
            })
            .finally(() => setLoading(false));

        getRevisionUnUseList(requestId).then((data) => {
            setRevisionList(data.data || []);
        });

    }, [requestId, refreshKey]);

    useEffect(() => {
        if (deliveries && deliveries.length > 0) {
            deliveries.forEach((d) => {
                if (!deliveryRefs.current[d.id]) {
                    deliveryRefs.current[d.id] = createRef();
                }
            });
        }
    }, [deliveries]);

    useEffect(() => {
        if (!requestId) return;
        fetchAllData();
    }, [requestId]);


    const fetchAllData = async () => {
        setLoading(true);
        try {
            const res = await getAllDelivery(requestId);
            setDeliveries(res.data.deliveries);
            setGoogleAccessToken(res?.data?.google_access_token || "");

            getRevisionUnUseList(requestId).then((data) => {
                setRevisionList(data.data || []);
            });
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const revision = submitType === "revision";
            const revisionId = revision ? selectedRevisionId : null;


            const submit = await submitDelivery(requestId, fileUrl, note, revisionId, revision);

            const res = await getAllDelivery(requestId);
            setDeliveries(res.data.deliveries);

            setNote("");
            setFileUrl("");
            setResetUploadKey(k => k + 1);

            getRevisionUnUseList(requestId).then((data) => {
                setRevisionList(data.data || []);
            });

            enqueueSnackbar(submit.message, {variant: "success"});
        } catch (err) {
            const errorMsg = err?.response?.data?.message || "Error submitting delivery";
            enqueueSnackbar(errorMsg, {variant: "error"});
            console.log("error", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoToDelivery = (deliveryId) => {
        const target = deliveryRefs.current[deliveryId];
        if (target) {
            target.scrollIntoView({behavior: "smooth", block: "center"});
            setHighlightedId(deliveryId);
            setTimeout(() => setHighlightedId(null), 2000);
        }
    };

    if (userRole === "designer" && revisionDelivery.length !== request.revisionTime) {
        return (
            <Paper sx={{p: 3}}>
                <Typography variant="h3" mb={2}>Submit Delivery</Typography>

                <RadioGroup
                    row
                    value={submitType}
                    onChange={e => {
                        setSubmitType(e.target.value);
                        setSelectedRevisionId("");
                    }}
                    sx={{mb: 2}}
                >
                    <FormControlLabel value="normal" control={<Radio/>} label="Normal"/>
                    <FormControlLabel value="revision" control={<Radio/>} label="Revision submit"
                                      disabled={isRevisionDisabled}/>
                </RadioGroup>

                {submitType === "revision" && (
                    <Box display="flex" alignItems="center" gap={2} sx={{mb: 2}}>
                        <FormControl sx={{minWidth: 180}}>
                            <InputLabel>Revision request id</InputLabel>
                            <Select
                                value={selectedRevisionId ?? ""}
                                label="Revision request id"
                                onChange={e => setSelectedRevisionId(Number(e.target.value))}
                                variant="filled"
                            >
                                {revisionList.map((rev) => (
                                    <MenuItem key={rev.id} value={rev.id}>
                                        {rev.id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box>

                        </Box>
                        <Divider orientation="vertical" flexItem sx={{mx: 1}}/>
                        <Typography>
                            Delivery ID: {selectedRevision?.deliveryId}
                        </Typography>
                        {selectedRevision?.deliveryId && (
                            <Button
                                variant="outlined"
                                onClick={() => handleGoToDelivery(selectedRevision?.deliveryId)}
                            >
                                Go to Delivery
                            </Button>
                        )}
                    </Box>
                )}

                <Typography variant="body2" color="text.secondary" fontWeight="bold"
                            sx={{display: "flex", alignItems: "center"}}>
                    <InfoOutlined sx={{mr: 0.5, fontSize: 18, color: "primary.main"}}/>
                    Note from School:
                </Typography>
                <Box
                    sx={{
                        background: "#f5f5f5",
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        mb: 1,
                        border: "1px solid #eee"
                    }}
                >
                    {selectedRevision?.note ? selectedRevision.note : "No note"}
                </Box>

                <Divider sx={{borderTop: "1px solid #000000", marginY: "3vh"}}/>
                <TextField
                    label="Your note to School "
                    multiline
                    minRows={3}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    fullWidth
                    sx={{mb: 2, mt: 1}}
                />

                <UploadZip
                    key={resetUploadKey}
                    onUploadSuccess={url => setFileUrl(url)}
                    accessToken={googleAccessToken}
                />

                {fileUrl && (
                    <Typography mt={1} color="green">
                        File uploaded! <a href={fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
                    </Typography>
                )}

                <Button
                    variant="contained"
                    sx={{mt: 2}}
                    disabled={
                        !fileUrl ||
                        !note ||
                        isSubmitting ||
                        (submitType === "revision" && !selectedRevisionId)
                    }
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Submitting..." : "Submit Delivery"}
                </Button>

                <Box mt={4}>
                    <Typography variant="h6">Previous Deliveries</Typography>
                    {loading ? <CircularProgress/> :
                        <DeliveryList
                            deliveries={deliveries}
                            userRole={userRole}
                            request={request}
                            deliveryRefs={deliveryRefs.current}
                            highlightedId={highlightedId}
                        />}
                </Box>
            </Paper>
        );
    } else if (userRole === "designer" && revisionDelivery.length === request.revisionTime) {
        return (
            <>
                <Typography variant="h2">Out of submit</Typography>
                <Paper sx={{p: 3}}>
                    <Typography variant="h6" mb={2}>Delivery History</Typography>
                    {loading ? <CircularProgress/> :
                        <DeliveryList
                            deliveries={deliveries}
                            userRole={userRole}
                            request={request}
                            deliveryRefs={deliveryRefs.current}
                            highlightedId={highlightedId}
                        />}
                </Paper>
            </>
        );
    }

    return (
        <Paper sx={{p: 3}}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h6" mb={0}>Delivery History</Typography>
            </Box>
            {loading ? <CircularProgress/> :
                <DeliveryList
                    deliveries={deliveries}
                    userRole={userRole}
                    request={request}
                    deliveryRefs={deliveryRefs.current}
                    highlightedId={highlightedId}
                />}
        </Paper>
    );
};

const SpecificationPopUp = ({open, onClose, request}) => {
    const [specs, setSpecs] = useState(
        (request?.clothes || []).map(c => ({
            ...c,
            specification: "",
            file: null,
            filePreview: null,
        }))
    );

    const handleChange = (index, key, value) => {
        setSpecs(prev => {
            const updated = [...prev];
            updated[index][key] = value;
            return updated;
        });
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const filePreview = URL.createObjectURL(file);
            handleChange(index, "file", file);
            handleChange(index, "filePreview", filePreview);
        }
    };

    const handleSubmit = () => {
        console.log("Specs to submit:", specs);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth={"md"} fullWidth>
            <DialogTitle>Upload image for each item</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={3}>
                    {specs.map((item, i) => (
                        <Box
                            key={item.id || i}
                            p={2}
                            border="1px solid #eee"
                            borderRadius={2}
                            bgcolor="#fafafa"
                        >
                            <Typography variant="h6">{item.type} - {item.category}</Typography>
                            <TextField
                                label="Specification / Notes"
                                value={item.specification}
                                onChange={e => handleChange(i, "specification", e.target.value)}
                                fullWidth
                                sx={{my: 2}}
                            />
                            <Box display="flex" alignItems="center" gap={2}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<FileUploadIcon/>}
                                >
                                    Upload Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={e => handleFileChange(i, e)}
                                    />
                                </Button>
                                {item.filePreview && (
                                    <img
                                        src={item.filePreview}
                                        alt="Preview"
                                        style={{height: 60, borderRadius: 8, border: '1px solid #ccc'}}
                                    />
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

const DeliveryList = ({deliveries, userRole, request, deliveryRefs, highlightedId}) => {
    console.log('resquest:', request);
    console.log('deliveries:', deliveries);
    const [openRevision, setOpenRevision] = useState(false);
    const [revisionNote, setRevisionNote] = useState("");
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [openSpec, setOpenSpec] = useState(false);
    const user = JSON.parse(localStorage.getItem("user")) || {};


    const isDisabled = request.revisionCount >= request.revisionTime;

    const setDeliveryRef = (id) => (el) => {
        if (el) deliveryRefs[id] = el;
    };
    const anyFinal = deliveries.some(delivery => delivery.isFinal);

    function handleRequestRevision(delivery) {
        setSelectedDelivery(delivery);
        setRevisionNote("");
        setOpenRevision(true);
    }

    async function handleSubmitRevision() {
        if (!revisionNote.trim()) {
            alert("Please enter a note for revision!");
            return;
        }
        try {
            const submit = await submitRevision(selectedDelivery.id, revisionNote, user.id, userRole)
            setOpenRevision(false);
            enqueueSnackbar(submit?.message ?? "Success", {variant: "success"});

        } catch (err) {
            console.log("error", err, err?.response)
            enqueueSnackbar("Failed to submit revision request!", {variant: "error"});
        }
    }

    async function handleMakeFinal(deliveryId, requestId) {
        try {
            const response = await makeDeliveryFinalAndRequestComplete(deliveryId, requestId);
            enqueueSnackbar(response.data?.message ?? "Success", {variant: "success"});
        } catch (err) {
            console.log(err);
        }
    }

    function handleSpecification() {
        setOpenSpec(true);
    }

    console.log("deliveries", deliveries);

    if (!deliveries || deliveries.length === 0) {
        return <Typography>No deliveries yet.</Typography>;
    }
    return (
        <Box>
            {deliveries.map((d, i) => (
                <Box
                    key={d.id || i}
                    ref={setDeliveryRef(d.id)}
                    sx={{
                        mb: 2,
                        p: 2,
                        border: "2px solid",
                        borderColor: d.id === highlightedId ? "primary.main" : "#eee",
                        borderRadius: 2,
                        backgroundColor: d.id === highlightedId ? "rgba(33,150,243,0.08)" : "#fff",
                        transition: "background 0.5s, border 0.5s"
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography fontWeight="bold">
                            Delivery #{d.deliveryNumber}
                        </Typography>
                        {d.isFinal ? (
                            user.role === "designer" && (
                                <Box>
                                    <CheckCircleOutlineIcon color="success" fontSize="large"
                                                            titleAccess="Final Delivery"/>
                                    <Button
                                        variant="outlined"
                                        onClick={handleSpecification}
                                    >
                                        Upload Image
                                    </Button>
                                    <SpecificationPopUp
                                        open={openSpec}
                                        onClose={() => setOpenSpec(false)}
                                        request={request}
                                    />
                                </Box>
                            )
                        ) : (
                            !anyFinal && userRole === "school" && request.status !== "complete" && (
                                <Box display="flex" gap={1}>
                                    <Tooltip title={isDisabled ? "Out of revision time" : ""}
                                             disableHoverListener={!isDisabled}>
                                        <span>
                                          <Button
                                              variant="outlined"
                                              color="error"
                                              size="small"
                                              disabled={isDisabled}
                                              onClick={() => handleRequestRevision(d)}
                                          >
                                            Request Revision
                                          </Button>
                                        </span>
                                    </Tooltip>
                                    <Button
                                        onClick={() => handleMakeFinal(d.id, request.id)}
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                    >
                                        Make Final
                                    </Button>
                                </Box>
                            )
                        )}
                    </Box>

                    <Box display="flex" alignItems="center" justifyContent="space-between" marginTop={1}>
                        <Typography variant="body2" mb={1} color="text.secondary">
                            {d.submitDate ? new Date(d.submitDate).toLocaleString() : ""}
                        </Typography>
                    </Box>
                    <Typography mb={1}>{d.note}</Typography>
                    <Typography>
                        {d.fileUrl ? (
                            <a href={d.fileUrl} target="_blank" rel="noopener noreferrer">
                                Download File
                            </a>
                        ) : (
                            "No file"
                        )}
                    </Typography>
                    {d.isFinal && (
                        <Typography color="success.main" fontWeight="bold"
                                    sx={{mt: 1, display: "flex", alignItems: "center"}}>
                            <CheckCircleOutlineIcon color="success" sx={{mr: 1}}/> Final Delivery
                        </Typography>
                    )}
                </Box>
            ))}
            <Dialog open={openRevision} onClose={() => setOpenRevision(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Request Revision</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Note"
                        multiline
                        minRows={3}
                        value={revisionNote}
                        onChange={e => setRevisionNote(e.target.value)}
                        sx={{mb: 2}}
                    />
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Button onClick={() => setOpenRevision(false)}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmitRevision}>
                            Submit
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}


export default function ChatUI({packageId, requestId, request}) {
    const [tab, setTab] = useState(0);
    const [packageInfo, setPackageInfo] = useState(null);
    const [requestDetail, setRequestDetail] = useState(request || null);
    const [loadingRequest, setLoadingRequest] = useState(!request);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!packageId) return;
        getPackageInfo(packageId).then(res => setPackageInfo(res?.data || null));
    }, [packageId]);

    const fetchRequestDetail = async () => {
        setLoadingRequest(true);
        try {
            const res = await getRequestById(requestId);
            setRequestDetail(res.data);
        } catch (err) {
            console.error("Failed to load request detail:", err);
        } finally {
            setLoadingRequest(false);
        }
    };

    useEffect(() => {
        if (requestId) fetchRequestDetail();
    }, [requestId]);

    const handleRefreshAll = async () => {
        await fetchRequestDetail();
        setRefreshKey(prev => prev + 1)
    };

    const userRole = JSON.parse(localStorage.getItem('user')).role;

    if (!requestDetail) return <CircularProgress sx={{m: 4}}/>;

    return (
        <Paper elevation={2} sx={{width: "100%", maxWidth: "80vw", mx: "auto", mt: 3}}>
            <h1>Request : {requestId}</h1>
            <Button
                variant="outlined"
                onClick={handleRefreshAll}
                startIcon={<RefreshIcon/>}
                disabled={loadingRequest}
            >
                Refresh
            </Button>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
                {requestDetail.status !== "created" && <Tab label="Activity"/>}
                {requestDetail.status !== "created" && <Tab label="Package & Payment"/>}
                <Tab label="Requirements"/>
                {requestDetail.status !== "created" && <Tab label="Delivery"/>}
            </Tabs>
            <Divider/>
            {requestDetail.status !== "created" &&
                <TabPanel value={tab} index={0}>
                    <ActivityTab requestId={requestId} userRole={userRole}/>
                </TabPanel>
            }
            {requestDetail.status !== "created" &&
                <TabPanel value={tab} index={1}>
                    <DetailsTab packageInfo={packageInfo} request={requestDetail}/>
                </TabPanel>
            }
            <TabPanel value={tab} index={requestDetail.status !== "created" ? 2 : 0}>
                <RequirementsTab/>
            </TabPanel>
            {requestDetail.status !== "created" &&
                <TabPanel value={tab} index={3}>
                    <DeliveryTab requestId={requestId} userRole={userRole} request={requestDetail}
                                 packageInfo={packageInfo} refreshKey={refreshKey}/>
                </TabPanel>
            }
        </Paper>
    );
}

