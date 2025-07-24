import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {enqueueSnackbar} from "notistack";
import {getAllTransactions} from "../../services/AccountService.jsx";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";


function TransactionTableHead() {
    return (
        <TableHead>
            <TableRow>
                <TableCell sx={{fontWeight: 'bold', width: '20px'}}>ID</TableCell>
                <TableCell sx={{fontWeight: 'bold', width: '90px'}}>Sender Name</TableCell>
                <TableCell sx={{fontWeight: 'bold', width: '60px'}}>Amount</TableCell>
                <TableCell sx={{fontWeight: 'bold', width: '40px'}}>Method</TableCell>
                <TableCell sx={{fontWeight: 'bold', width: '40px'}}>Date</TableCell>
                <TableCell sx={{fontWeight: 'bold', width: '40px'}}>Status</TableCell>
                <TableCell sx={{fontWeight: 'bold', width: '50px'}}>Action</TableCell>
            </TableRow>
        </TableHead>
    )
}

function TransactionTableBody({transactions, page, rowsPerPage}) {
    const [selected, setSelected] = useState(null);
    return (
        <>
            <TableBody>
                {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((trans, index) => (
                        <TableRow key={trans.id || index}>
                            <TableCell>{trans.id}</TableCell>
                            <TableCell>{trans.senderName}</TableCell>
                            <TableCell>
                                {Number(trans.amount).toLocaleString("vi-VN", {style: "currency", currency: "VND"})}
                            </TableCell>
                            <TableCell>{trans.paymentType}</TableCell>
                            <TableCell>{trans.creationDate}</TableCell>
                            <TableCell>
                                <Chip
                                    label={trans.status?.startsWith("TXN_") ? trans.status.substring(4).toLowerCase() : trans.status}
                                    color={trans.status === "TXN_COMPLETED" ? "success" : "danger"}>
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <span
                                    style={{color: "#1565c0", cursor: "pointer", fontWeight: 600}}
                                    onClick={() => setSelected(trans)}
                                >
                                    VIEW
                                </span>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
            {selected && (
                <TransactionDetailCard
                    transaction={selected}
                    onClose={() => setSelected(null)}
                />
                )}
        </>
    );
}

function field(label, value, valueColor = "text.primary", valueBold = false) {
    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" sx={{  paddingRight: 1 }}>{label}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
                <Typography
                    variant="body2"
                    color={valueColor}
                    fontWeight={valueBold ? 700 : 400}
                    sx={{ wordBreak: "break-all"}}
                >
                    {value}
                </Typography>
            </Grid>
        </Grid>
    );
}

function TransactionDetailCard({ transaction, onClose }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!transaction) return null;

    // Status mapping
    const statusObj = {
        TXN_COMPLETED: { label: "Success", color: "success.main" },
        TXN_FAILED: { label: "Failed", color: "error.main" },
        TXN_PENDING: { label: "Pending", color: "warning.main" },
        TXN_REFUNDED: { label: "Refunded", color: "info.main" },
    };
    const stt = statusObj[transaction.status] || {
        label: transaction.status?.replace(/^TXN_/, "").toLowerCase() || "",
        color: "text.primary",
    };

    // Format date
    function formatDate(dateStr) {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    // Main
    return (
        <Box
            sx={{
                position: "fixed",
                zIndex: 2000,
                top: 0, left: 0, width: "100vw", height: "100vh",
                bgcolor: "rgba(24,24,40,0.26)",
                display: "flex", alignItems: "center", justifyContent: "center"
            }}
            onClick={onClose}
        >
            <Card
                sx={{
                    minWidth: 320,
                    width: "94vw",
                    maxWidth: 370,
                    borderRadius: 3,
                    boxShadow: 16,
                    px: 0,
                    py: 2,
                    position: "relative",
                    bgcolor: "#fff",
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <Box sx={{ px: 2, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        size="small"
                        sx={{ position: "absolute", left: 0, top: 4 }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ m: "auto", textAlign: "center", fontWeight: 700, pt: 1 }}>
                        Transaction Detail
                    </Typography>
                </Box>

                {/* Icon */}
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                    <Avatar
                        src={user.profile.avatar || ""}
                        sx={{
                            bgcolor: "#f2f6fd",
                            color: "#2e51f5",
                            width: 54,
                            height: 54,
                            mb: 0.5,
                        }}
                    >
                        {!user.profile.avatar && <ArrowForwardIcon fontSize="large" />}
                    </Avatar>
                </Box>
                <Typography
                    align="center"
                    sx={{ fontWeight: 700, color: "#23272f", mb: 1, letterSpacing: 0.3 }}
                >
                    Payment {stt.label}
                </Typography>
                {/* Status */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Chip
                        label={stt.label}
                        sx={{
                            bgcolor: stt.color + "10",
                            color: stt.color,
                            fontWeight: 600,
                            fontSize: 14,
                            px: 2,
                            textTransform: "capitalize"
                        }}
                        size="small"
                    />
                </Box>
                <Divider sx={{ mb: 0.5 }} />

                {/* Body */}
                <CardContent sx={{ py: 1.5 }}>
                    <Stack spacing={1.2}>
                        {field("Sender: ", transaction.senderName)}
                        {field("Receiver: ", transaction.receiverName)}
                        {field("Payment Type: ", transaction.paymentType)}
                        {field("PG Code: ", transaction.paymentGatewayCode)}
                        {field("PG Message: ", transaction.paymentGatewayMessage)}
                        {transaction.note && field("Note: ", transaction.note)}
                        {field("Date: ", formatDate(transaction.creationDate))}
                    </Stack>
                </CardContent>

                {/* Amount */}
                <Divider sx={{ mt: 1.5, mb: 1.5 }} />
                <Box sx={{ px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography color="text.secondary" fontWeight={700}>
                        Amount
                    </Typography>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        color="primary"
                        sx={{ letterSpacing: 1 }}
                    >
                        {Number(transaction.amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </Typography>
                </Box>
                <Box sx={{ textAlign: "center", pt: 1.5, pb: 0.5 }}>
                    <Button
                        variant="contained"
                        sx={{ minWidth: 100, fontWeight: 700, borderRadius: 2, letterSpacing: 1 }}
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}


function TransactionTable({transactions}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{width: "100%", overflow: "hidden"}}>
            <TableContainer sx={{maxHeight: 540}}>
                <Table stickyHeader size="small">
                    <TransactionTableHead/>
                    <TransactionTableBody
                        transactions={transactions}
                        page={page}
                        rowsPerPage={rowsPerPage}
                    />
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20]}
                component="div"
                count={transactions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default function AdminTransaction() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        FetchTransactions();
    }, []);

    async function FetchTransactions() {
        const res = await getAllTransactions();
        setTransactions(res.data);
        if (res.data.length <= 0) {
            enqueueSnackbar(res.data.message || "No transactions found")
        }
    }

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h5" fontWeight={600} mb={3}>
                Admin Transaction Management
            </Typography>
            <TransactionTable transactions={transactions}/>
        </Box>
    );
}