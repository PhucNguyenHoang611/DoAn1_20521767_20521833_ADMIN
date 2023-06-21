/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "Mã sản phẩm",
        width: 220
    },
    {
        field: "name",
        headerName: "Tên sản phẩm",
        width: 230
    },
    {
        field: "color",
        headerName:"Màu",
        width: 150
    },
    {
        field: "unitPrice",
        headerName:"Đơn giá",
        width: 170
    },
    {
        field: "quantity",
        headerName:"Số lượng",
        width: 100
    },
    {
        field: "total",
        headerName: "Tổng",
        width: 170
    }
];

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const OrderDetailsModal = ({ currentUser, currentOrder, isModalOpen, setIsModalOpen }: any) => {
    const [customer, setCustomer] = useState<any>(null);
    const [address, setAddress] = useState<any>(null);
    const [staff, setStaff] = useState<any>(null);
    const [payment, setPayment] = useState<any>(null);
    const [totalPrice, setTotalPrice] = useState(0);

    const [tableRows, setTableRows] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const getOrder = useSelector((state: RootState) => state.import.getOrder);


    const getCustomer = async () => {
        try {
            const customer = await mainApi.get(
                apiEndpoints.GET_CUSTOMER(currentOrder.customerId)
            );

            setCustomer(customer.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }
    
    const getAddress = async () => {
        try {
            const address = await mainApi.get(
                apiEndpoints.GET_CUSTOMER_ADDRESS(currentOrder.orderAddress)
            );

            setAddress(address.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getStaff = async (id: string) => {
        try {
            const staff = await mainApi.get(
                apiEndpoints.GET_STAFF(id),
                apiEndpoints.getAccessToken(currentUser.token)
            );

            setStaff(staff.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getPayment = async () => {
        try {
            const payment = await mainApi.get(
                apiEndpoints.GET_PAYMENT(currentOrder.paymentMethod)
            );

            setPayment(payment.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getOrderItems = async (id: string) => {
        setIsLoading(true)
        try {
            const ordItems = await mainApi.get(
                apiEndpoints.GET_ORDER_ITEMS_FOR_ORDERS(id)
            );

            getTableRows(ordItems.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        let sum = 0;
        const rows = await Promise.all(
            result.map(async (item: any) => {
                const product = await getProduct(item.productId);
                const color = await getColor(item.productColorId);

                sum += item.productPrice;
                
                return {
                    key: item._id,
                    id: product._id,
                    name: product.productName,
                    color: color.color.colorName,
                    unitPrice: product.productPrice.toLocaleString("vi-VN", {style : "currency", currency : "VND"}),
                    quantity: item.productQuantity,
                    total: item.productPrice.toLocaleString("vi-VN", {style : "currency", currency : "VND"})
                }
            })
        );

        setTotalPrice(sum);
        setTableRows(rows);
        setIsLoading(false);
    }

    const getProduct = async (id: string) => {
        try {
            const prod = await mainApi.get(
                apiEndpoints.GET_PRODUCT(id)
            );

            return prod.data.data;
        } catch (error: any) {
            console.log(error);
        }
    }

    const getColor = async (id: string) => {
        try {
            const color = await mainApi.get(
                apiEndpoints.GET_PRODUCT_COLOR(id)
            );

            return color.data;
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleClose = () => {
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (isModalOpen) {
            getCustomer();
            getAddress();
            getPayment();

            if (currentOrder?.staffId) {
                getStaff(currentOrder.staffId);
            }

            getOrderItems(currentOrder?._id);
        } else {
            setTableRows([])
            setCustomer(null);
            setAddress(null);
            setStaff(null);
            setPayment(null);
            setTotalPrice(0);
        }
    }, [isModalOpen, getOrder]);

    return (
        <React.Fragment>
            <Modal
				open={isModalOpen}
				onClose={handleClose}>
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					backgroundColor: "white",
					padding: "1.5rem",
					width: "75%",
					height: "90%",
					overflowY: "auto" }}>
                        <Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                            <Typography sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.5rem",
                                    color: "black"
                                }}>
                                    Chi tiết đơn hàng
                            </Typography>
                            <IconButton size="small" onClick={handleClose}>
                                <XMarkIcon className="w-5 h-5 text-black" />
                            </IconButton>
                        </Box>

                        <Box width="100%" height="90%" display="flex" flexDirection="column" sx={{ mt: 4 }}>
                            <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                <Box width="20%" sx={{ mr: 4 }}>
                                    <Typography sx={{
                                            fontWeight: "medium",
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right"
                                        }}>
                                            ID đơn hàng:
                                    </Typography>
                                </Box>
                                <Box width="80%">
                                    <Typography sx={{
                                            fontSize: "1.1rem",
                                            fontStyle: "italic",
                                            color: "black",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {currentOrder?._id}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                <Box width="20%" sx={{ mr: 4 }}>
                                    <Typography sx={{
                                            fontWeight: "medium",
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right"
                                        }}>
                                            Mã đơn hàng:
                                    </Typography>
                                </Box>
                                <Box width="80%">
                                    <Typography sx={{
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap"
                                        }}>
                                            #{currentOrder?.orderCode}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                <Box width="20%" sx={{ mr: 4 }}>
                                    <Typography sx={{
                                            fontWeight: "medium",
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right"
                                        }}>
                                            Họ và tên khách hàng:
                                    </Typography>
                                </Box>
                                <Box width="80%">
                                    <Typography sx={{
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {customer?.customerLastName + " " + customer?.customerFirstName}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                <Box width="20%" sx={{ mr: 4 }}>
                                    <Typography sx={{
                                            fontWeight: "medium",
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right"
                                        }}>
                                            Trạng thái đơn hàng:
                                    </Typography>
                                </Box>
                                <Box width="80%">
                                    {currentOrder?.orderStatus === "Đặt hàng" && (
                                        <Typography sx={{
                                                fontWeight: "bold",
                                                fontSize: "1.1rem",
                                                color: "#32435f",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {currentOrder?.orderStatus}
                                        </Typography>
                                    )}
                                    {currentOrder?.orderStatus === "Đã xác nhận" && (
                                        <Typography sx={{
                                                fontWeight: "bold",
                                                fontSize: "1.1rem",
                                                color: "#805f17",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {currentOrder?.orderStatus}
                                        </Typography>
                                    )}
                                    {currentOrder?.orderStatus === "Đang vận chuyển" && (
                                        <Typography sx={{
                                                fontWeight: "bold",
                                                fontSize: "1.1rem",
                                                color: "#a67f78",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {currentOrder?.orderStatus}
                                        </Typography>
                                    )}
                                    {currentOrder?.orderStatus === "Đã hoàn tất" && (
                                        <Typography sx={{
                                                fontWeight: "bold",
                                                fontSize: "1.1rem",
                                                color: "#27c93f",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {currentOrder?.orderStatus}
                                        </Typography>
                                    )}
                                    {currentOrder?.orderStatus === "Đã hủy" && (
                                        <Typography sx={{
                                                fontWeight: "bold",
                                                fontSize: "1.1rem",
                                                color: "#de5656",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {currentOrder?.orderStatus}
                                        </Typography>
                                    )}
                                    {currentOrder?.orderStatus === "Bị trả lại" && (
                                        <Typography sx={{
                                                fontWeight: "bold",
                                                fontSize: "1.1rem",
                                                color: "#ffbd2e",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {currentOrder?.orderStatus}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {currentOrder?.orderStatus === "Đã hoàn tất" && (
                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                    <Box width="20%" sx={{ mr: 4 }}>
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap",
                                                textAlign: "right"
                                            }}>
                                                Ngày hoàn tất:
                                        </Typography>
                                    </Box>
                                    <Box width="80%">
                                        <Typography sx={{
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {new Date(currentOrder?.orderCompleteDay).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {staff && (
                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                    <Box width="20%" sx={{ mr: 4 }}>
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap",
                                                textAlign: "right"
                                            }}>
                                                Nhân viên xác nhận:
                                        </Typography>
                                    </Box>
                                    <Box width="80%">
                                        <Typography sx={{
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {staff?.staffLastName + " " + staff?.staffFirstName}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            <Box width="100%" sx={{ borderBottom: "1px solid gray", mb: 2 }}></Box>

                            <Box width="100%" display="flex" flexDirection="column" sx={{ mb: 2 }}>
                                <Box width="100%" display="flex" justifyContent="start" alignItems="center" sx={{ ml: 2, mb: 2 }}>
                                    <Typography sx={{
                                            fontWeight: "bold",
                                            fontSize: "1.2rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right"
                                        }}>
                                            Thông tin đơn hàng:
                                    </Typography>
                                </Box>

                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                    <Box width="20%" sx={{ mr: 4 }}>
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap",
                                                textAlign: "right"
                                            }}>
                                                Ngày đặt hàng:
                                        </Typography>
                                    </Box>
                                    <Box width="80%">
                                        <Typography sx={{
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {new Date(currentOrder?.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                    <Box width="20%" sx={{ mr: 4 }}>
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap",
                                                textAlign: "right"
                                            }}>
                                                Địa chỉ nhận hàng:
                                        </Typography>
                                    </Box>
                                    <Box width="80%">
                                        <Typography sx={{
                                                fontSize: "1.1rem",
                                                color: "black",
                                                overflowWrap: "break-word"
                                            }}>
                                                {address?.receiverAddress + ", " + address?.receiverWard + ", " + address?.receiverDistrict + ", " +address?.receiverCity}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                    <Box width="20%" sx={{ mr: 4 }}>
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap",
                                                textAlign: "right"
                                            }}>
                                                Họ và tên người nhận:
                                        </Typography>
                                    </Box>
                                    <Box width="80%">
                                        <Typography sx={{
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {address?.receiverLastName + " " + address?.receiverFirstName}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                    <Box width="20%" sx={{ mr: 4 }}>
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap",
                                                textAlign: "right"
                                            }}>
                                                SĐT người nhận:
                                        </Typography>
                                    </Box>
                                    <Box width="80%">
                                        <Typography sx={{
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {address?.receiverPhone}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                    <Box width="20%" sx={{ mr: 4 }}>
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap",
                                                textAlign: "right"
                                            }}>
                                                Ghi chú:
                                        </Typography>
                                    </Box>
                                    <Box width="80%">
                                        <Typography sx={{
                                                fontSize: "1.1rem",
                                                color: "black",
                                                overflowWrap: "break-word"
                                            }}>
                                                {(currentOrder?.orderNote === "") ? "Không có ghi chú" : currentOrder?.orderNote}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                    <Box width="20%" sx={{ mr: 4 }}>
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap",
                                                textAlign: "right"
                                            }}>
                                                Phương thức thanh toán:
                                        </Typography>
                                    </Box>
                                    <Box width="80%">
                                        <Typography sx={{
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {payment?.paymentType}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                    <Box width="20%" sx={{ mr: 4 }}>
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap",
                                                textAlign: "right"
                                            }}>
                                                Phí giao hàng:
                                        </Typography>
                                    </Box>
                                    <Box width="80%">
                                        <Typography sx={{
                                                fontSize: "1.1rem",
                                                color: "black",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {currentOrder?.orderShippingFee.toLocaleString("vi-VN", {style : "currency", currency : "VND"})}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
                                    <Box width="100%">
                                        <DataGrid
                                            loading={isLoading}
                                            rows={tableRows}
                                            columns={tableColumns}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: {
                                                        pageSize: 5
                                                    }
                                                }
                                            }}
                                            pageSizeOptions={[5]}
                                            disableRowSelectionOnClick
                                            sx={{ fontSize: "1rem", height: "300px" }}
                                            slots={{
                                                noRowsOverlay: NoRowsOverlay
                                            }} />
                                    </Box>
                                </Box>

                                <Box width="100%" display="flex" justifyContent="end" alignItems="center" sx={{ mb: 4 }}>
                                    <Typography sx={{
                                            fontWeight: "bold",
                                            fontSize: "1.2rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right",
                                            mr: 2
                                        }}>
                                            Tổng giá trị đơn hàng:
                                    </Typography>
                                    <Typography sx={{
                                            fontWeight: "medium",
                                            fontSize: "1.5rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right"
                                        }}>
                                            {(totalPrice + currentOrder?.orderShippingFee).toLocaleString("vi-VN", {style : "currency", currency : "VND"})}
                                    </Typography>
                                </Box>
                            </Box>

                        </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default OrderDetailsModal;