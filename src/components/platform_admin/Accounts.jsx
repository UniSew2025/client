import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    TablePagination,
    Alert,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Visibility,
    Search
} from '@mui/icons-material';
import {
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountById
} from '../../services/AccountService.jsx';

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('create'); 
    const [selectedAccount, setSelectedAccount] = useState(null);
    
    // Form states
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        role: '',
        registerDate: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const response = await getAllAccounts();
            if (response && response.data) {
                const accountsData = response.data.data
                setAccounts(accountsData);
            } else {
                setAccounts([]);
            }
            setError(null);
            if (accounts.length === 0) {
                setError('No accounts found');
            }
        } catch (err) {
            setError('Failed to fetch accounts');
            console.error('Error fetching accounts:', err);
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (mode, account = null) => {
        setDialogMode(mode);
        setSelectedAccount(account);
        
        if (account) {
            setFormData({
                id: account.id || '',
                email: account.email || '',
                role: account.role || '',
                registerDate: account.registerDate || '',
                status: account.status || 'ACCOUNT_ACTIVE'
            });
        } else {
            setFormData({
                id: '',
                email: '',
                role: '',
                registerDate: '',
                status: 'ACCOUNT_ACTIVE'
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
            registerDate: '',
            status: 'ACCOUNT_ACTIVE'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            
            if (dialogMode === 'create') {
                await createAccount(formData);
            } else if (dialogMode === 'edit') {
                await updateAccount(selectedAccount.id, formData);
            }
            
            await fetchAccounts();
            handleCloseDialog();
        } catch (err) {
            setError(`Failed to ${dialogMode} account`);
            console.error(`Error ${dialogMode} account:`, err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (accountId) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                setLoading(true);
                await deleteAccount(accountId);
                await fetchAccounts();
            } catch (err) {
                setError('Failed to delete account');
                console.error('Error deleting account:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'error';
            case 'school':
                return 'primary';
            case 'designer':
                return 'secondary';
            case 'garment':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusColor = (status) => {
        return status === 'ACCOUNT_ACTIVE' ? 'success' : 'error';
    };

    // Filter accounts based on search term
    const filteredAccounts = Array.isArray(accounts) ? accounts.filter(account => {
        const searchLower = searchTerm.toLowerCase();
        return (
            account.email?.toLowerCase().includes(searchLower) ||
            account.role?.toLowerCase().includes(searchLower) ||
            account.status?.toLowerCase().includes(searchLower) ||
            account.id?.toString().includes(searchLower)
        );
    }) : [];

    const paginatedAccounts = filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Reset page when search term changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0); // Reset to first page when searching
    };

    if (loading && accounts.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Account Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
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
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 600 }}
                />
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

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
                        {paginatedAccounts.map((account) => (
                            <TableRow key={account.id} hover>
                                <TableCell>{account.id}</TableCell>
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
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog('view', account)}
                                        title="View Details"
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog('edit', account)}
                                        title="Edit Account"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(account.id)}
                                        title="Delete Account"
                                    >
                                        <Delete />
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

            {/* Create/Edit/View Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogMode === 'create' && 'Create New Account'}
                    {dialogMode === 'edit' && 'Edit Account'}
                    {dialogMode === 'view' && 'Account Details'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {dialogMode === 'view' && (
                            <TextField
                                fullWidth
                                label="ID"
                                name="id"
                                value={formData.id}
                                margin="normal"
                                disabled
                            />
                        )}
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            margin="normal"
                            disabled={dialogMode === 'view'}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Role"
                            name="role"
                            select
                            SelectProps={{ native: true }}
                            value={formData.role}
                            onChange={handleInputChange}
                            margin="normal"
                            disabled={dialogMode === 'view'}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="ADMIN">Admin</option>
                            <option value="SCHOOL">School</option>
                            <option value="DESIGNER">Designer</option>
                            <option value="GARMENT">Garment Factory</option>
                        </TextField>
                        <TextField
                            fullWidth
                            label="Register Date"
                            name="registerDate"
                            type="date"
                            value={formData.registerDate}
                            onChange={handleInputChange}
                            margin="normal"
                            disabled={dialogMode === 'view'}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Status"
                            name="status"
                            select
                            SelectProps={{ native: true }}
                            value={formData.status}
                            onChange={handleInputChange}
                            margin="normal"
                            disabled={dialogMode === 'view'}
                            required
                        >
                            <option value="ACCOUNT_ACTIVE">Active</option>
                            <option value="ACCOUNT_INACTIVE">Inactive</option>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        {dialogMode === 'view' ? 'Close' : 'Cancel'}
                    </Button>
                    {dialogMode !== 'view' && (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : dialogMode === 'create' ? 'Create' : 'Update'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Accounts;