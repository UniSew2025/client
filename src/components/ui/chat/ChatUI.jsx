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
    Typography
} from '@mui/material';
import {useLocation} from "react-router-dom";
import {getAllComments, getClothByRequestId} from "../../../services/DesignService.jsx";
import {getPackageInfo} from "../../../services/ProfileService.jsx";

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


const ActivityTab = ({commentInput, setCommentInput, handleSendComment, requestId, userRole}) => {
    const [listComment, setListComment] = useState([]);


    useEffect(() => {
        if (!requestId) return;
        const fetchComments = async () => {
            try {
                return await getAllComments(requestId);
            } catch (error) {
                console.error('Error loading comments:', error);
                return null;
            }
        };
        fetchComments().then(res => setListComment(res && Array.isArray(res.data) ? res.data : []));
    }, []);

    return (
        <Box>
            <List>
                {listComment.length === 0 && userRole === "school" ? (
                    <Typography color="gray" textAlign="center" mb={2}>
                        Waiting for designer response...
                    </Typography>
                ) : (
                    listComment.sort((c1, c2) => new Date(c1.createdAt) - new Date(c2.createdAt)).map((c, i) => {
                        const isSystem = c.senderRole === "System";
                        const isSchool = c.senderRole === "School";
                        let align = ""
                        let bgColor = ""
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
                        disabled={!commentInput.trim()}
                    >
                        Send
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

const DeliveryTab = () => {
    const delivery = {
        message: "",
        files: [
            {
                preview: "",
                name: ""
            }
        ]
    }

    return (
        <Box>
            <Typography variant="h6" mb={1}>Delivery #1</Typography>
            <Box bgcolor="#f7f7f7" p={2} borderRadius={2} mb={2}>
                <Typography variant="body2" dangerouslySetInnerHTML={{__html: delivery.message}}/>
            </Box>
            <Typography fontWeight="bold">Attachments:</Typography>
            <Box display="flex" gap={2} mt={1}>
                {delivery.files.map((file, i) => (
                    <Box key={i} textAlign="center">
                        <img src={file.preview} alt={file.name} width={70}
                             style={{borderRadius: 8, border: '1px solid #eee'}}/>
                        <Typography fontSize={12}>{file.name}</Typography>
                        <a href={file.url} download>
                            <Button size="small" variant="outlined" sx={{mt: 0.5}}>Download</Button>
                        </a>
                    </Box>
                ))}
            </Box>
        </Box>

    )
}


export default function ChatUI({initComments, packageId, requestId}) {
    const [tab, setTab] = useState(0);
    const [comments, setComments] = useState(initComments || []);
    const [commentInput, setCommentInput] = useState('');
    const userRole = JSON.parse(localStorage.getItem('user')).role;


    if (userRole === 'school') {
        if (!packageId || packageId === 0) {
            return (
                <Box mt={4} textAlign="center">
                    <Typography color="gray" mb={2}>
                        This request has not been assigned yet.
                    </Typography>
                    <Stack direction="column" spacing={2} alignItems="center">
                        <Button variant="contained" color="primary">
                            Find the designer for this request
                        </Button>
                    </Stack>
                </Box>
            );
        }
    }


    const handleSendComment = () => {
        if (commentInput.trim()) {
            setComments([...comments, {user: "You", text: commentInput, time: "just now"}]);
            setCommentInput('');
        }
    };

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
                    comments={comments}
                    commentInput={commentInput}
                    setCommentInput={setCommentInput}
                    handleSendComment={handleSendComment}
                    requestId={requestId}
                    userRole={userRole}
                />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <DetailsTab packageId={packageId} userRole={userRole}/>
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <RequirementsTab/>
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <DeliveryTab/>
            </TabPanel>
        </Paper>
    );
}
