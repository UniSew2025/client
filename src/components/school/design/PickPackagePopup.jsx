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
    List, FormControl, InputLabel, MenuItem, Select, Table, TableHead, TableRow, TableBody, TableCell,
} from "@mui/material";
import {chooseDesignPackage} from "../../../services/DesignService.jsx";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";



export function RequestInfo({clothes}) {

    return (
        <>
            <Typography>
                Design request
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Note</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clothes === null ? (
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Button variant="outlined" fullWidth>Choose a design request</Button>
                            </TableCell>
                        </TableRow>
                    ) : (
                           <>
                               {clothes.map((item) => (
                                   <TableRow key={item.id}>
                                       <TableCell>{item.id}</TableCell>
                                       <TableCell>{item.type}</TableCell>
                                       <TableCell>{item.category}</TableCell>
                                       <TableCell>{item.note}</TableCell>
                                   </TableRow>
                                   )
                               )}
                           </>
                    )}
                </TableBody>
            </Table>
        </>

    );
}

export function PaymentPopup({ open, onClose, pkg, sDesign, onSuccess }) {

    const handleCancel =() =>{
        onClose();
    }

    const handleConfirm = async () => {
        try {
            const response = await chooseDesignPackage({
                designRequestId: sDesign.id,
                packageId: pkg.id,
                getPackagePrice: pkg.fee,
                packageName: pkg.pkgName,
                packageHeaderContent: pkg.headerContent,
                revisionTime: pkg.revisionTime,
                packageDeliveryDate: pkg.deliveryDuration

            });
            enqueueSnackbar(response.message, { variant: 'success' });
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1200);
        } catch (err) {
            const message = err.response?.data?.message || "Unexpected error occurred.";
            enqueueSnackbar(message, { variant: 'error' });
        }
    }
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Payment Information</DialogTitle>
            <DialogContent>
                <h1>QR code</h1>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleConfirm} autoFocus>
                    Next
                </Button>
            </DialogActions>
        </Dialog>
    );
}



export default function PickPackagePopup({pkg}) {
    const [open, setOpen] = useState(false);
    const [openPayment, setOpenPayment] = useState(false);

    const [clothes, setClothes] = useState([]);
    const sDesign = JSON.parse(localStorage.getItem('sDesign'));
    const navigate = useNavigate();
    useEffect(() => {
        if (sDesign && Array.isArray(sDesign.clothes)) {
            setClothes(sDesign.clothes);
        }
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePayment = () => {

        setOpenPayment(true);
    };
    const handleSuccessAfterPayment = () => {
        setOpen(false);
        setOpenPayment(false);
        navigate('/school/d/design');
    };

    const formatVND = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number);
    };
    console.log("pkg", pkg);
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
                        <Paper elevation={0}
                               sx={{gap: '2vw', display: 'flex', alignItems: 'center', justifyItems: 'center'}}>
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
                                <Divider sx={{my: 1}}/>
                                <Box display="flex" alignItems="center" gap={2} mb={1}>
                                    <Typography
                                        fontSize={15}>⏱ {pkg.deliveryDuration} day{pkg.deliveryDuration > 1 ? "s" : ""}</Typography>
                                    <Typography fontSize={15}>🔄 {pkg.revisionTime} Revisions</Typography>
                                </Box>
                                <Divider sx={{my: 1}}/>
                                <Stack>
                                    {Array.isArray(pkg.services) && pkg.services.length > 0
                                        ? pkg.services.map((p, idx) => (
                                            <Typography key={idx} sx={{p: 0, mb: 1}}>{p.rule}</Typography>
                                        ))
                                        : <Typography fontStyle="italic" color="text.secondary">No extra
                                            services</Typography>
                                    }
                                </Stack>
                            </Paper>
                            <Paper elevation={7} sx={{flex: 1, padding: "2vw"}}>
                                <RequestInfo clothes={clothes}/>
                            </Paper>
                        </Paper>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handlePayment} autoFocus>
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
            <PaymentPopup
                open={openPayment}
                onClose={() => setOpenPayment(false)}
                pkg={pkg}
                sDesign={sDesign}
                onSuccess={handleSuccessAfterPayment}
            />
        </Fragment>
    );
}
