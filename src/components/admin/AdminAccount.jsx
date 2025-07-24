import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {Add, Block, Done, Search, Visibility} from '@mui/icons-material';
import {createAccount, getAllAccounts, updateAccount} from '../../services/AccountService.jsx';
import {enqueueSnackbar} from "notistack";

function AdminAccount() {
    const [accounts, setAccounts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        role: '',
        status: 'ACTIVE',
        packageIds: []
    });

    useEffect(() => {
        FetchAccounts();
    }, []);

    async function FetchAccounts() {
        const res = await getAllAccounts();
        const accountsData = res.data;
        console.log(accountsData);
        setAccounts(accountsData)
        if (accountsData.length === 0) {
            enqueueSnackbar(res?.message || "Get account fail!", {variant: "success"})
        }
    }

    const handleOpenDialog = (account = null) => {
        setSelectedAccount(account);

        if (account) {
            setFormData({
                id: account.id || '',
                email: account.email || '',
                role: account.role || '',
                status: account.status || ''
            });
        } else {
            setFormData({
                id: '',
                email: '',
                role: '',
                status: ''
            });
        }

        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAccount(null);
        setFormData({
            id: '',
            email: '',
            role: '',
            status: ''
        });
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const res = await createAccount(formData);
        await FetchAccounts();
        handleCloseDialog();
        enqueueSnackbar(res?.message || "Create account fail!", {variant: "error"});
    }

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'error';
            case 'school':
                return 'primary';
            case 'designer':
                return 'primary';
            case 'garment_factory':
                return 'primary';
            default:
                return 'default';
        }
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'success' : 'error';
    };

    const filteredAccounts = Array.isArray(accounts) ? accounts.filter(account => {
        const searchLower = searchTerm.toLowerCase();
        return (
            account.email?.toLowerCase().includes(searchLower) ||
            account.role?.toLowerCase().includes(searchLower) ||
            account.status?.toLowerCase().includes(searchLower) ||
            account.id?.toString().includes(searchLower)
        );
    }) : [];

    const paginatedAccounts = filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).sort((a, b) => a.id - b.id);
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    if (accounts.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress/>
            </Box>
        );
    }

    async function HandleBanOrUnban(account) {
        try {
            const updatedStatus = account.status === 'active' ? 'inactive' : 'active';
            const partnerId = account.partner?.id || '';
            const res = await updateAccount(account.id, {
                ...account,
                status: updatedStatus,
                packageIds: [account?.partner?.packages[0]?.id],
                garmentId: partnerId,
            });
            await FetchAccounts();
            enqueueSnackbar(res.message, {variant: "success"});
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update account status" + error;
            enqueueSnackbar(errorMessage, {variant: "error"});
        }
    }

    // -----------------------------------------------------------------------------
    return (
        <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Account Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add/>}
                    onClick={() => handleOpenDialog('create')}
                >
                    Create Account
                </Button>
            </Box>

            {/* Search Bar */}
            <Box mb={3}>
                <TextField
                    fullWidth
                    placeholder="Search accounts by email, role, status, or ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search/>
                            </InputAdornment>
                        ),
                    }}
                    sx={{maxWidth: 600}}
                />
            </Box>

            {/* Search Results Info */}
            {searchTerm && (
                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                        Found {filteredAccounts.length} account(s) matching "{searchTerm}"
                    </Typography>
                </Box>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell><strong>Register Date</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedAccounts.map((account, index) => (
                            <TableRow key={account.id} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{account.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={account.role}
                                        color={getRoleColor(account.role)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{account.registerDate || 'N/A'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={account.status}
                                        color={getStatusColor(account.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {/*ban || unban button*/}
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            HandleBanOrUnban(account)
                                        }}
                                        title={account.status === 'active' ? "Ban Account" : "Unban Account"}
                                    >
                                        {account.status === 'active' ? <Block/> : <Done/>}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={filteredAccounts.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="body1" gutterBottom sx={{textAlign: 'center'}} fontSize={'xx-large'}>
                        Create New Account
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{pt: 2}}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Role"
                            name="role"
                            select
                            SelectProps={{native: true}}
                            value={formData.role}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        >
                            <option value=""></option>
                            <option value="SCHOOL">School</option>
                            <option value="DESIGNER">Designer</option>
                            <option value="GARMENT_FACTORY">Garment Factory</option>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}>OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AdminAccount;