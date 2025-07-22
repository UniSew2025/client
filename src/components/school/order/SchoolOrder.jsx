import '../../../styles/school/SchoolOrder.css'
import {
    Button, Fade,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, Tooltip, tooltipClasses,
    Typography
} from "@mui/material";
import {Add, Info, Search} from "@mui/icons-material";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {viewOrders} from "../../../services/OrderService.jsx";

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

function RenderPage({orders}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    const handleCreateOrder = () => {
        localStorage.setItem("formStep", '0')
        window.location.href = "/school/d/order/form"
    }

    return (
        <div className={'d-flex flex-column align-items-center'}>
            <Paper square elevation={0} sx={{width: '78vw', marginTop: '2vh'}}>
                <div className={'d-flex flex-row justify-content-between my-3'}>
                    <Typography variant={"h4"}>Order History</Typography>
                    <Button
                        startIcon={<Add/>}
                        variant={"contained"}
                        sx={{
                            borderRadius: '50px',
                            height: '5vh'
                        }}
                        onClick={() => handleCreateOrder()}
                    >
                        Create
                    </Button>
                </div>
            </Paper>

            <Paper elevation={6} sx={{width: '78vw', marginTop: '2vh', overflow: 'hidden'}}>
                <TableContainer sx={{maxHeight: '50vh'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align={'center'} sx={{fontWeight: 'bold'}}>No</TableCell>
                                <TableCell align={'center'} sx={{fontWeight: 'bold'}}>Order Date</TableCell>
                                <TableCell align={'center'} sx={{fontWeight: 'bold'}}>Receive Date</TableCell>
                                <TableCell align={'center'} sx={{fontWeight: 'bold'}}>Status</TableCell>
                                <TableCell align={'center'} sx={{fontWeight: 'bold'}}>Action</TableCell>
                                <TableCell align={'center'} sx={{fontWeight: 'bold'}}>Detail</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                orders.map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell align={'center'}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {dayjs(order.orderDate).format('DD/MM/YYYY')}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {dayjs(order.deadline).format('DD/MM/YYYY')}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {order.status.substring(0, 1).toUpperCase() + order.status.substring(1).toLowerCase()}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            <IconButton onClick={() => {
                                                localStorage.setItem("sOrder", order.id)
                                                window.location.href = "/garment/list"
                                            }}>
                                                <RenderTooltip title={'Find your garment factory'}>
                                                    <Search color={'secondary'}/>
                                                </RenderTooltip>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            <IconButton>
                                                <RenderTooltip title={'View order detail'}>
                                                    <Info color={'primary'}/>
                                                </RenderTooltip>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component="div"
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}

export default function SchoolOrder() {
    document.title = 'Order'
    window.scrollTo(0,0)
    const [orders, setOrders] = useState([])


    async function GetOrders() {
        const response = await viewOrders()
        if (response && response.status === 200) {
            setOrders(response.data.data)
        }
    }

    useEffect(() => {
        GetOrders()
    }, []);

    console.log("Orders: ", orders)

    return (
        <RenderPage
            orders={orders}
        />
    )
}