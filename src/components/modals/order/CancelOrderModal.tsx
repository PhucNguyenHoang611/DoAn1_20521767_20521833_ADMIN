/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { baseURL } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getOrders } from "@/redux/reducers/import_reducer";

const CancelOrderModal = ({ currentOrder, isModalOpen, setIsModalOpen }: any) => {
    const [cancelReason, setCancelReason] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const dispatch = useDispatch();

    const handleCancelOrder = async () => {
        let staffID = "";

        if (currentOrder.orderStatus === "Đặt hàng")
            staffID = currentUser.id;
        else
            staffID = currentOrder.staffId;

        try {
            const data = apiEndpoints.getUpdateOrderStatusBody(staffID, "Đã hủy", cancelReason);

            await axios({
                method: "PUT",
                url: `${baseURL}/orders/updateOrderStatus/${currentOrder._id.toString()}`,
                headers: {
                    Authorization: "Bearer " + currentUser.token
                },
                data: data
            });
        } catch (error: any) {
            console.log(error);
        }

        setOpenConfirmDialog(false);
        setIsModalOpen(false);

        dispatch(getOrders(true));
    }

    const handleClose = () => {
        setIsModalOpen(false);
    }

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false)
    }

    useEffect(() => {
        if (!isModalOpen) {
            setCancelReason("");
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
					padding: "1.5rem",
					width: "40%",
					height: "max-content",
					overflowY: "auto" }}>
                        <Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                            <Typography sx={{
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                color: "black"
                            }}>
                                Hủy đơn hàng
                            </Typography>
                            <IconButton size="small" onClick={handleClose}>
                                <XMarkIcon className="w-5 h-5 text-black" />
                            </IconButton>
                        </Box>
                        <Box width="100%" height="90%" sx={{ mt: 4 }}>
                            <TextField
                                required
                                value={cancelReason}
                                fullWidth
                                label="Lý do hủy đơn"
                                placeholder="Nhập lý do hủy đơn..."
                                multiline
                                maxRows={10}
                                onChange={(event) => {
                                    setCancelReason(event.target.value);
                                }} />

                            {(cancelReason === "") && (
                                <Box width="100%" sx={{ my: 2 }}>
                                    <Typography sx={{
                                        color: "#DE5656"
                                    }}>
                                        Nhập đầy đủ lý do hủy đơn
                                    </Typography>
                                </Box>
                            )}

                            <Box width="100%" display="flex" justifyContent="end" alignItems="center" sx={{ my: 2 }}>
                                <button type="button" onClick={handleClose} className="bg-white text-lg text-primary-0 border-2 border-primary-0 rounded-sm p-2">Hủy bỏ</button>
                                <button disabled={cancelReason === ""} type="button" onClick={() => setOpenConfirmDialog(true)} className="bg-primary-0 text-lg text-white border-2 border-primary-0 ml-2 rounded-sm p-2">Xác nhận</button>
                            </Box>
                            <Dialog
                                open={openConfirmDialog}
                                onClose={handleCloseConfirmDialog}
                                aria-labelledby="dialog-title">
                                    <DialogTitle id="dialog-title">
                                        Hủy đơn hàng
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                                            Bạn muốn hủy đơn hàng này ?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseConfirmDialog}>Hủy bỏ</Button>
                                        <Button onClick={handleCancelOrder}>Xác nhận</Button>
                                    </DialogActions>
                            </Dialog>
                        </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default CancelOrderModal;