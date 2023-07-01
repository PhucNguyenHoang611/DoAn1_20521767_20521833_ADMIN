/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'

const CustomerDetailsModal = ({ customerId, isModalOpen, setIsModalOpen }: any) => {
    const [currentCustomer, setCurrentCustomer] = useState<any>(null);
    const [currentCustomerCity, setCurrentCustomerCity] = useState<any>(null);
    
    const getCustomer = async () => {
        try {
            const customer = await mainApi.get(
                apiEndpoints.GET_CUSTOMER(customerId)
            );

            const city = await mainApi.get(
                apiEndpoints.GET_CUSTOMER_DEFAULT_ADDRESS(customerId)
            );

            setCurrentCustomer(customer.data.data);
            if (city.data.data) {
                setCurrentCustomerCity(city.data.data.receiverCity);
            }
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
        } else {
            setCurrentCustomer(null);
            setCurrentCustomerCity(null);
        }
    }, [isModalOpen]);
    
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
                    padding: "2rem",
                    width: "50%",
                    height: "max-content",
                    overflowY: "auto" }}>
                    <Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                color: "black"
                            }}>
                                Chi tiết khách hàng
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
                                        Mã khách hàng:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        fontStyle: "italic",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {customerId}
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
                                        Tên khách hàng:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentCustomer?.customerLastName + " " + currentCustomer?.customerFirstName}
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
                                        Email:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentCustomer?.customerEmail}
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
                                        Giới tính:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentCustomer?.customerGender}
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
                                        Sinh nhật:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentCustomer ? new Date(currentCustomer.customerBirthday).toLocaleDateString() : ""}
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
                                        Tỉnh / Thành phố:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentCustomerCity ? currentCustomerCity : ""}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default CustomerDetailsModal;