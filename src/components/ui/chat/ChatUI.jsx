import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    Paper,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
    CircularProgress
} from '@mui/material';
import {useLocation, useNavigate} from "react-router-dom";
import {
    getAllComments,
    getAllDelivery,
    getClothByRequestId,
    sendComment,
    submitDelivery, submitRevision
} from "../../../services/DesignService.jsx";
import {getPackageInfo} from "../../../services/ProfileService.jsx";
import UploadZip from "../../designer/UploadZip.jsx";
import {enqueueSnackbar} from "notistack";

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


const ActivityTab = ({ requestId, userRole, onSend }) => {
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
                                <ListItem key={i} sx={{ justifyContent: align }}>
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

const DetailsTab = ({packageId, userRole}) => {

    const [packageInfo, setPackageInfo] = useState(null);


    useEffect(() => {
        if (!packageId) return;
        const fetchPackage = async () => {
            try {
                const res = await getPackageInfo(packageId);
                if (res && res.data) {
                    return res.data
                }
            } catch (error) {
                console.error("Failed to load package info:", error);
                return null;
            }
        };
        fetchPackage().then(res => setPackageInfo(res));
    }, [packageId]);

    if (!packageInfo) {
        return <Typography>Loading package info...</Typography>;
    }

    return (
        <>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                {packageInfo.pkgName}
            </Typography>

            <Typography color="text.secondary" mb={2}>
                {packageInfo.headerContent}
            </Typography>

            <Typography><b>Fee:</b> ${packageInfo.fee}</Typography>
            <Typography><b>Delivery:</b> {packageInfo.deliveryDuration} days</Typography>
            <Typography><b>Revisions:</b> {packageInfo.revisionTime}</Typography>
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
    console.log(designDetails);

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

const DeliveryTab = ({ requestId, userRole }) => {
    const [note, setNote] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [googleAccessToken, setGoogleAccessToken] = useState("");

    useEffect(() => {
        if (!requestId) return;
        setLoading(true);
        getAllDelivery(requestId)
            .then((res) => {
                console.log("res", res);
                if (res?.data?.deliveries && Array.isArray(res.data.deliveries)) {
                    setDeliveries(res.data.deliveries);
                } else if (res?.data && Array.isArray(res.data)) {
                    setDeliveries(res.data);
                } else {
                    setDeliveries([]);
                }

                if (res?.data?.google_access_token) {
                    setGoogleAccessToken(res.data.google_access_token);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    console.log("de", deliveries)

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const submit = await submitDelivery(requestId, fileUrl, note);
            setNote("");
            setFileUrl("");
            const res = await getAllDelivery(requestId);
            let list = [];

            if (Array.isArray(res)) {
                list = res;
            } else if (res?.data && Array.isArray(res.data)) {
                list = res.data;
            } else if (res && typeof res === "object") {
                list = [res];
            }
            setDeliveries(list);
            enqueueSnackbar(submit.message, {variant: "success"});
        } catch  {
            alert("Error submitting delivery");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (userRole === "designer") {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>Submit Delivery</Typography>
                <TextField
                    label="Note"
                    multiline
                    minRows={3}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <UploadZip onUploadSuccess={url => setFileUrl(url)} accessToken={googleAccessToken} />
                {fileUrl && (
                    <Typography mt={1} color="green">
                        File uploaded! <a href={fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
                    </Typography>
                )}
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={!fileUrl || !note || isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Submitting..." : "Submit Delivery"}
                </Button>
                <Box mt={4}>
                    <Typography variant="h6">Previous Deliveries</Typography>
                    {loading ? <CircularProgress /> : <DeliveryList deliveries={deliveries} userRole={userRole} />}
                </Box>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Delivery History</Typography>
            {loading ? <CircularProgress /> : <DeliveryList deliveries={deliveries} userRole={userRole} />}
        </Paper>
    );
};

function DeliveryList({ deliveries, userRole }) {

    const [openRevision, setOpenRevision] = useState(false);
    const [revisionNote, setRevisionNote] = useState("");
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const user = JSON.parse(localStorage.getItem("user")) || {};

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
            console.log("submit", submit)
            setOpenRevision(false);
            enqueueSnackbar(submit?.message ?? "Success", {variant: "success"});
        } catch (err) {
            console.log("error", err, err?.response)
            enqueueSnackbar("Failed to submit revision request!", {variant: "error"});
        }
    }



    if (!deliveries || deliveries.length === 0) {
        return <Typography>No deliveries yet.</Typography>;
    }
    return (
        <Box>
            {deliveries.map((d, i) => (
                <Box key={d.id || i} mb={2} p={2} border="1px solid #eee" borderRadius={2}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography fontWeight="bold">
                            Delivery #{d.deliveryNumber}
                        </Typography>
                        {userRole === "school" && (
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleRequestRevision(d)}
                            >
                                Request Revision
                            </Button>
                        )}
                    </Box>
                    <Typography variant="body2" mb={1} color="text.secondary">
                        {d.submitDate ? new Date(d.submitDate).toLocaleString() : ""}
                    </Typography>
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
                    {d.isFinal && <Typography color="success.main">Final Delivery</Typography>}
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
                        sx={{ mb: 2 }}
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


export default function ChatUI({ packageId, requestId }) {
    const [tab, setTab] = useState(0);
    const userRole = JSON.parse(localStorage.getItem('user')).role;
    const navigate = useNavigate();
    function handleViewDesignList() {

        navigate("/designer/list")
    }


    if (userRole === 'school') {
        if (!packageId || packageId === 0) {
            return (
                <Box mt={4} textAlign="center">
                    <Typography color="gray" mb={2}>
                        This request has not been assigned yet.
                    </Typography>
                    <Stack direction="column" spacing={2} alignItems="center">
                        <Button variant="contained" color="primary" onClick={handleViewDesignList}>
                            Find the designer for this request
                        </Button>
                    </Stack>
                </Box>
            );
        }
    }


    return (
        <Paper elevation={2} sx={{width: "100%", maxWidth: "80vw", mx: "auto", mt: 3}}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
                <Tab label="Activity"/>
                <Tab label="Details"/>
                <Tab label="Requirements"/>
                <Tab label="Delivery"/>
            </Tabs>
            <Divider/>
            <TabPanel value={tab} index={0}>
                <ActivityTab
                    requestId={requestId}
                    userRole={userRole}
                    onSend={(comment) => {
                        console.log("New comment:", comment);
                    }}
                />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <DetailsTab packageId={packageId} userRole={userRole}/>
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <RequirementsTab/>
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <DeliveryTab requestId={requestId} userRole={userRole}/>
            </TabPanel>
        </Paper>
    );
}
