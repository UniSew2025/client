import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Fragment, useEffect, useState} from "react";
import {
    Box,
    Divider,
    Paper,
    Stack,
    Typography,
    List, FormControl, InputLabel, MenuItem, Select,
} from "@mui/material";
import {viewListHistory} from "../../services/DesignService.jsx";


export function ListRequest() {
    const [listRequest, setListRequest] = useState([]);

    const handleChange = (event) => {
        setListRequest(event.target.value);
    };

    // useEffect(() => {
    //     async function fetchData() {
    //         const response = await viewListHistory();
    //         const requestData = response.data.filter((item) =>
    //             item.status === "created"
    //         );
    //         setListRequest(requestData);
    //     }
    //
    //     fetchData();
    // },[])



    return (
        <>
        <Typography>
            Pick a design request
        </Typography>
            <Box sx={{ minWidth: 120, mt:"3vh" }}>
                <FormControl fullWidth>
                    <InputLabel>Design request</InputLabel>
                    {/*<Select*/}
                    {/*    label="Design request"*/}
                    {/*    onChange={handleChange}*/}
                    {/*    variant={"outlined"}>*/}
                    {/*    {listRequest.map((item) => (*/}
                    {/*        <MenuItem key={item.id} value={item.id}>{item.id}</MenuItem>*/}
                    {/*    ))}*/}
                    {/*</Select>*/}

                </FormControl>
            </Box>
        </>

    );
}




export default function PickPackagePopup({pkg}) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const formatVND = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number);
    };
    return (
        <Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Continue
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="alert-dialog-title">
                    Package Information
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Paper elevation={0}  sx={{gap:'2vw' , display: 'flex', alignItems: 'center', justifyItems: 'center'}}>
                            <Paper elevation={7} sx={{flex: 1, padding: "2vw"}}>
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
                            </Paper>
                            <Paper elevation={7} sx={{flex: 1, padding: "2vw"}}>
                                <ListRequest/>
                            </Paper>
                        </Paper>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose} autoFocus>
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
