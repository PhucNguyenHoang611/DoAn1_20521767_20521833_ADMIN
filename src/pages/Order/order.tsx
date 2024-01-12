/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainApi, baseURL } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { DataGrid, GridCellParams, GridColDef, GridRowId } from '@mui/x-data-grid';
import { ArrowPathIcon, CheckIcon, EyeIcon, InboxArrowDownIcon, TruckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import OrderDetailsModal from '@/components/modals/order/OrderDetailsModal';
import axios from 'axios';
import CancelOrderModal from '@/components/modals/order/CancelOrderModal';
import { getOrders } from '@/redux/reducers/import_reducer';

const filtersList: any[] = [
    {
        key: 1,
        name: "Tất cả"
    },
    {
        key: 2,
        name: "Đặt hàng"
    },
    {
        key: 3,
        name: "Đã xác nhận"
    },
    {
        key: 4,
        name: "Đang vận chuyển"
    },
    {
        key: 5,
        name: "Đã hoàn tất"
    },
    {
        key: 6,
        name: "Đã hủy"
    },
    {
        key: 7,
        name: "Bị trả lại"
    }
];

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "Mã đơn hàng",
        width: 160
    },
    {
        field: "name",
        headerName: "Tên khách hàng",
        width: 170
    },
    {
        field: "address",
        headerName:"Địa chỉ",
        width: 280
    },
    {
        field: "date",
        headerName:"Ngày đặt hàng",
        width: 120
    },
    {
        field: "total",
        headerName: "Tổng giá trị",
        width: 130
    },
    {
        field: "status",
        headerName: "Trạng thái",
        width: 130
    },
    {
        field: "action",
        headerName: "",
        width: 160,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell orderId={params.id} />
    }
];

interface RenderCellProps {
    orderId: GridRowId;
}
const RenderCell = ({ orderId }: RenderCellProps) => {
    const dispatch = useDispatch();
    const [currentOrder, setCurrentOrder] = useState<any>();
    const [openOrderDetailsModal, setOpenOrderDetailsModal] = useState(false);
    const [openCancelOrderModal, setOpenCancelOrderModal] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmSnackbar, setOpenConfirmSnackbar] = useState(false);
    const [openFailedSnackbar, setOpenFailedSnackbar] = useState(false);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const getOrd = useSelector((state: RootState) => state.import.getOrder);

    const getOrder = async () => {
        try {
            const ord = await mainApi.get(
                apiEndpoints.GET_ORDER(orderId.toString())
            );

            setCurrentOrder(ord.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleUpdateOrderStatus = async (stt: string) => {
        let staffID = "";

        if (currentOrder.orderStatus === "Đặt hàng")
            staffID = currentUser.id;
        else
            staffID = currentOrder.staffId;

        try {
            const data = apiEndpoints.getUpdateOrderStatusBody(staffID, stt, "");

            await axios({
                method: "PUT",
                url: `${baseURL}/orders/updateOrderStatus/${orderId.toString()}`,
                headers: {
                    Authorization: "Bearer " + currentUser.token
                },
                data: data
            });
        } catch (error: any) {
            const errorMessage = error.response.data.error;

            if (errorMessage === "Can't confirm this order because of product quantity") {
                setOpenFailedSnackbar(true);
                setOpenConfirmDialog(false);
            }

            return;
        }

        if (stt === "Đã xác nhận") {
            setOpenConfirmSnackbar(true);
            setOpenConfirmDialog(false);
        }
        dispatch(getOrders(true));
    }

    const handleCompleteOrder = async () => {
        try {
            const data = apiEndpoints.getCompleteOrderBody(new Date());

            await axios({
                method: "PUT",
                url: `${baseURL}/orders/completeOrder/${orderId.toString()}`,
                headers: {
                    Authorization: "Bearer " + currentUser.token
                },
                data: data
            });
        } catch (error: any) {
            console.log(error);
        }

        dispatch(getOrders(true));
    }

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    }

    const handleCloseConfirmSnackbar = () => {
        setOpenConfirmSnackbar(false);
    }

    const handleCloseFailedSnackbar = () => {
        setOpenFailedSnackbar(false);
    }

    useEffect(() => {
        getOrder();
    }, [orderId, getOrd]);

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="start" alignItems="center">
            <Tooltip title="Chi tiết">
                <IconButton onClick={() => setOpenOrderDetailsModal(true)} size="small" sx={{ backgroundColor: "#32435F" }}>
                    <EyeIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <OrderDetailsModal currentUser={currentUser} currentOrder={currentOrder} isModalOpen={openOrderDetailsModal} setIsModalOpen={setOpenOrderDetailsModal} />

            {(currentOrder?.orderStatus !== "Đã hoàn tất" && currentOrder?.orderStatus !== "Đã hủy" && currentOrder?.orderStatus !== "Bị trả lại") && (
                <>
                    {currentOrder?.orderStatus === "Đặt hàng" && (
                        <Tooltip title="Xác nhận">
                            <IconButton onClick={() => setOpenConfirmDialog(true)} size="small" sx={{ backgroundColor: "#A67F78", mx: 3 }}>
                                <InboxArrowDownIcon className="w-5 h-5 text-white" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {currentOrder?.orderStatus === "Đã xác nhận" && (
                        <Tooltip title="Vận chuyển">
                            <IconButton onClick={() => handleUpdateOrderStatus("Đang vận chuyển")} size="small" sx={{ backgroundColor: "#A67F78", mx: 3 }}>
                                <TruckIcon className="w-5 h-5 text-white" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {(currentOrder?.orderStatus === "Đặt hàng" || currentOrder?.orderStatus === "Đã xác nhận") && (
                        <>
                            <Tooltip title="Hủy đơn hàng">
                                <IconButton onClick={() => setOpenCancelOrderModal(true)} size="small" sx={{ backgroundColor: "#DE5656" }}>
                                    <XMarkIcon className="w-5 h-5 text-white" />
                                </IconButton>
                            </Tooltip>
                            <CancelOrderModal currentOrder={currentOrder} isModalOpen={openCancelOrderModal} setIsModalOpen={setOpenCancelOrderModal} />
                        </>
                    )}
                    
                    {currentOrder?.orderStatus === "Đang vận chuyển" && (
                        <>
                            <Tooltip title="Hoàn tất">
                                <IconButton onClick={handleCompleteOrder} size="small" sx={{ backgroundColor: "#A67F78", mx: 3 }}>
                                    <CheckIcon className="w-5 h-5 text-white" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Bị trả lại">
                                <IconButton onClick={() => handleUpdateOrderStatus("Bị trả lại")} size="small" sx={{ backgroundColor: "#DE5656" }}>
                                    <ArrowPathIcon className="w-5 h-5 text-white" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </>
            )}

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openConfirmSnackbar} autoHideDuration={2000} onClose={handleCloseConfirmSnackbar}>
                <Alert onClose={handleCloseConfirmSnackbar} severity="success" sx={{ width: "100%" }}>
                    Xác nhận đơn hàng thành công
                </Alert>
            </Snackbar>

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openFailedSnackbar} autoHideDuration={2000} onClose={handleCloseFailedSnackbar}>
                <Alert onClose={handleCloseFailedSnackbar} severity="error" sx={{ width: "100%" }}>
                    Không thể xác nhận đơn hàng do không đủ số lượng sản phẩm
                </Alert>
            </Snackbar>

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Xác nhận đơn hàng
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn muốn xác nhận đơn hàng này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmDialog}>Hủy bỏ</Button>
                        <Button onClick={() => handleUpdateOrderStatus("Đã xác nhận")}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const Order = () => {
    const dispatch = useDispatch();
    const [filter, setFilter] = useState("Tất cả");
    const [isLoading, setIsLoading] = useState(false);
    const [allOrders, setAllOrders] = useState<any[]>([]);
    const [tempArray, setTempArray] = useState([]);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const getOrder = useSelector((state: RootState) => state.import.getOrder);

    const getAllOrders = async () => {
        setIsLoading(true);
        try {
            const ordersList = await mainApi.get(
                apiEndpoints.GET_ALL_ORDERS,
                apiEndpoints.getAccessToken(currentUser.token)
            );

            setAllOrders(ordersList.data.data);
            setTempArray(ordersList.data.data);
            getTableRows(ordersList.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (ord: any) => {
                let voucher = null;
                if (ord.voucherId) {
                    voucher = await getVoucher(ord.voucherId);
                }

                const customer = await getCustomer(ord.customerId);
                const address = await getAddress(ord.orderAddress);
                const ordItems = await getOrderItems(ord._id);
                let sum = 0;
                await Promise.all(ordItems.map((item: any) => {
                    sum += item.productSalePrice
                }));
                sum += ord.orderShippingFee;

                if (voucher) {
                    if (voucher.voucherType === "MONEY") {
                        sum -= voucher.voucherValue;
                    } else {
                        const max = voucher.maxDiscountPrice;
                        const discount = sum * voucher.voucherValue / 100;
                        if (discount > max) {
                            sum -= max;
                        } else {
                            sum -= discount;
                        }
                    }
                }

                return {
                    id: ord._id,
                    name: customer.customerLastName + " " + customer.customerFirstName,
                    address: address.receiverAddress + ", " + address.receiverWard + ", " + address.receiverDistrict + ", " +address.receiverCity,
                    date: new Date(ord.createdAt).toLocaleDateString(),
                    total: sum.toLocaleString("vi-VN", {style : "currency", currency : "VND"}),
                    status: ord.orderStatus
                }
            })
        );

        setTableRows(rows);
        setIsLoading(false);
        dispatch(getOrders(false));
    }

    const getVoucher = async (id: string) => {
        try {
            const voucher = await mainApi.get(
                apiEndpoints.GET_VOUCHER(id)
            );

            return voucher.data.data;
        } catch (error: any) {
            console.log(error);
        }
    }

    const getCustomer = async (id: string) => {
        try {
            const customer = await mainApi.get(
                apiEndpoints.GET_CUSTOMER(id)
            );

            return customer.data.data;
        } catch (error: any) {
            console.log(error);
        }
    }

    const getOrderItems = async (id: string) => {
        try {
            const items = await mainApi.get(
                apiEndpoints.GET_ORDER_ITEMS_FOR_ORDERS(id)
            );
            return items.data.data;
        } catch (error: any) {
            console.log(error);
        }
    }

    const getAddress = async (id: string) => {
        try {
            const address = await mainApi.get(
                apiEndpoints.GET_CUSTOMER_ADDRESS(id)
            );

            return address.data.data;
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currentUser) {
            getAllOrders();
        }
    }, [currentUser]);

    useEffect(() => {
        if (allOrders.length > 0 && tempArray.length > 0) {
            if (filter !== "Tất cả") {
                getTableRows(tempArray.filter((item: any) => item.orderStatus === filter));
            } else {
                getTableRows(allOrders);
            }
        }
    }, [filter]);

    useEffect(() => {
        if (getOrder) {
            getAllOrders();
        }
    }, [getOrder]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="15%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Đơn hàng
                </Typography>
            </Box>
            <Box width="100%" height="10%" className="px-7 md:px-10">
                <Box height="100%" display="flex" justifyContent="end" alignItems="center">
                    <Typography
                        sx={{
                            whiteSpace: "nowrap",
                            fontSize: "1.1rem",
                            fontWeight: "medium"
                        }}>
                        Bộ lọc:
                    </Typography>
                    <TextField select value={filter}
                        sx={{
                            width: "150px",
                            ml: 2
                        }}
                        onChange={(event) => {
                            setFilter(event.target.value);
                        }}>
                        {filtersList.map((option) => (
                            <MenuItem key={option.key} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>
            <Box width="100%" height="70%" className="px-7 md:px-10">
                <DataGrid
                    loading={isLoading}
                    rows={tableRows}
                    columns={tableColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        }
                    }}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                    sx={{ fontSize: "1rem" }}
                    slots={{
                        noRowsOverlay: NoRowsOverlay
                    }} />
            </Box>
        </Box>
    )
}

export default Order;