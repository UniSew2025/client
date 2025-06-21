import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button, List, ListItem, Avatar, Paper, Divider } from '@mui/material';
import {useLocation} from "react-router-dom";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
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

export default function OrderPage() {
    const [tab, setTab] = useState(0);
    const location = useLocation();
    const requestId = location.state?.requestId;
    const details = {
        packageName: "Standard Logo + T-Shirt",
        price: "40$",
        deliveryTime: "3 days",
        includes: ["Logo design", "T-shirt mockup", "2 Revisions"]
    };

    const requirements = [
        { label: 'Shirt', type: 'SHIRT', color: 'White', note: 'Use bold font' },
        { label: 'Pant', type: 'PANTS', color: 'Black', note: 'Simple style' }
    ];

    const delivery = {
        message: (
            <>
                Delivering the order this one is just for my fiverr portfolio, If you still want any MODIFICATION/REVISION just let me know I am always here to HELP YOU out. All files will be sent as soon as the order is marked closed. If you feel I did a Great job, feel free to tip me, I would really appreciate it.<br/><br/>
                Thanks for your business and patience :)<br/><br/>
                Before you RATE my services, Kindly do keep in mind all my hard-work on your design and if you think it needs modification I am ALWAYS here to help YOU out to fix it or offer REFUND.<br/><br/>
                If you are happy, kindly leave a review with few Kind words as it really helps MY Business to grow and keep providing my services to Awesome buyers like yourself.
            </>
        ),
        files: [
            { name: 'BESTREVIEWS.jpg', url: '/download/BESTREVIEWS.jpg', size: '2MB', preview: '/images/BESTREVIEWS.jpg' },
            { name: 'BESTRE.jpg', url: '/download/BESTRE.jpg', size: '376KB', preview: '/images/BESTRE.jpg' },
        ]
    };

    const [comments, setComments] = useState([
        { user: "Buyer", text: "Can you add a red color option?", time: "1 day ago" },
        { user: "Seller", text: "Sure! I will update it soon.", time: "22 hours ago" }
    ]);
    const [commentInput, setCommentInput] = useState('');

    const handleSendComment = () => {
        if (commentInput.trim()) {
            setComments([...comments, { user: "You", text: commentInput, time: "just now" }]);
            setCommentInput('');
        }
    };

    return (
        <Paper elevation={2} sx={{ width: "100%", maxWidth: 700, mx: "auto", mt: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
                <Tab label="Activity" />
                <Tab label="Details" />
                <Tab label="Requirements" />
                <Tab label="Delivery" />
            </Tabs>
            <Divider />
            <TabPanel value={tab} index={0}>
                <Box>
                    <List>
                        {comments.map((c, i) => (
                            <ListItem key={i} alignItems="flex-start">
                                <Avatar>{c.user[0]}</Avatar>
                                <Box ml={2}>
                                    <Typography fontWeight="bold">{c.user}</Typography>
                                    <Typography>{c.text}</Typography>
                                    <Typography variant="caption" color="gray">{c.time}</Typography>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                    <Box display="flex" gap={1} mt={2}>
                        <TextField
                            fullWidth
                            placeholder="Write a comment..."
                            size="small"
                            value={commentInput}
                            onChange={e => setCommentInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                        />
                        <Button variant="contained" onClick={handleSendComment}>Send</Button>
                    </Box>
                </Box>
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Typography variant="h6" mb={1}>{details.packageName}</Typography>
                <Typography>Price: <b>{details.price}</b></Typography>
                <Typography>Delivery Time: <b>{details.deliveryTime}</b></Typography>
                <Typography mt={1} fontWeight="bold">Includes:</Typography>
                <ul>
                    {details.includes.map((inc, i) => (
                        <li key={i}><Typography>{inc}</Typography></li>
                    ))}
                </ul>
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <Typography variant="h6" mb={1}>Your Requirements</Typography>
                <List>
                    {requirements.map((r, i) => (
                        <ListItem key={i}>
                            <Box>
                                <Typography fontWeight="bold">{r.label}</Typography>
                                <Typography>Type: {r.type}</Typography>
                                <Typography>Color: {r.color}</Typography>
                                <Typography>Note: {r.note}</Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <Typography variant="h6" mb={1}>Delivery #1</Typography>
                <Box bgcolor="#f7f7f7" p={2} borderRadius={2} mb={2}>
                    <Typography variant="body2" dangerouslySetInnerHTML={{__html: delivery.message}} />
                </Box>
                <Typography fontWeight="bold">Attachments:</Typography>
                <Box display="flex" gap={2} mt={1}>
                    {delivery.files.map((file, i) => (
                        <Box key={i} textAlign="center">
                            <img src={file.preview} alt={file.name} width={70} style={{borderRadius:8, border:'1px solid #eee'}} />
                            <Typography fontSize={12}>{file.name}</Typography>
                            <a href={file.url} download>
                                <Button size="small" variant="outlined" sx={{mt: 0.5}}>Download</Button>
                            </a>
                        </Box>
                    ))}
                </Box>
            </TabPanel>
        </Paper>
    );
}
