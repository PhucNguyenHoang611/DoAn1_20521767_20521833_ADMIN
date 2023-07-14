/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllImportItems } from "@/redux/reducers/import_reducer";
import { RootState } from "@/redux/store";
import { MinusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const EditItemModal = ({ itemIndex, isModalOpen, setIsModalOpen }: any) => {
    const [currentItem, setCurrentItem] = useState<any>(null);
    const dispatch = useDispatch();
    const importItems = useSelector((state: RootState) => state.import.importItems);
    const [quantity, setQuantity] = useState(0);
	const { register, handleSubmit } = useForm();


    const handleConfirmEdit: SubmitHandler<any> = (data) => {
        const temp = importItems.map((item: any) => {
            if (item.id === itemIndex) {
                return {
                    ...item,
                    quantity: data.quantity,
                    totalPrice: data.quantity * item.uPrice,
                    total: (data.quantity * item.uPrice).toLocaleString("vi-VN", {style : "currency", currency : "VND"})
                }
            } else {
                return item;
            }
        });

        dispatch(getAllImportItems(temp));
        setIsModalOpen(false);
    }

    const handleClose = () => {
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (isModalOpen) {
            setCurrentItem(importItems[itemIndex - 1]);
            setQuantity(importItems[itemIndex - 1].quantity);
        } else {
            setCurrentItem(null);
            setQuantity(0);
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
					width: "45%",
					height: "max-content",
					overflowY: "auto" }}>
                        <Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                            <Typography sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.5rem",
                                    color: "black"
                                }}>
                                    Chi tiết sản phẩm
                            </Typography>
                            <IconButton size="small" onClick={handleClose}>
                                <XMarkIcon className="w-5 h-5 text-black" />
                            </IconButton>
                        </Box>

                        <Box width="100%" height="90%" display="flex" flexDirection="column" sx={{ mt: 4 }}>
                            <form onSubmit={handleSubmit(handleConfirmEdit)} className="w-full flex flex-col">
                                <Box width="100%" sx={{ mb: 2 }}>
                                    <TextField fullWidth required label="Sản phẩm" value={currentItem?.name}
                                        inputProps={{
                                            readOnly: true
                                        }} />
                                </Box>

                                <Box width="100%" sx={{ mb: 2 }}>
                                    <TextField fullWidth required label="Nhà cung cấp" value={currentItem?.supplier}
                                        inputProps={{
                                            readOnly: true
                                        }} />
                                </Box>

                                <Box width="100%" sx={{ mb: 4 }}>
                                    <TextField fullWidth required label="Đơn giá" value={currentItem?.unitPrice}
                                        inputProps={{
                                            readOnly: true
                                        }} />
                                </Box>

                                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
                                    <Box width="40%" display="flex">
                                        <Typography
                                            sx={{
                                                mr: 2,
                                                fontWeight: "bold"
                                            }}>
                                            Màu:
                                        </Typography>
                                        <Box width="100%" sx={{ mr: 4 }}>
                                            <Box width="100%" height="100%" display="flex">
                                                <MinusCircleIcon className="h-6 w-6 mr-4" style={{ fill: currentItem?.colorHex, color: currentItem?.colorHex }} />
                                                {currentItem?.color}
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box width="60%">
                                        <TextField fullWidth type="number" {...register("quantity")} autoComplete="off" required label="Số lượng" value={quantity.toString()}
                                            InputProps={{
                                                inputProps: {
                                                    min: 1
                                                }
                                            }}
                                            onChange={(event) => setQuantity(event.target.value ? parseInt(event.target.value) : 0)} />
                                    </Box>
                                </Box>

                                <Box width="100%" display="flex" justifyContent="end" alignItems="center" sx={{ my: 2 }}>
                                    <button type="button" onClick={handleClose} className="bg-white text-lg text-primary-0 border-2 border-primary-0 rounded-sm p-2">Hủy bỏ</button>
                                    <button type="submit" className="bg-primary-0 text-lg text-white border-2 border-primary-0 ml-2 rounded-sm p-2">Xác nhận</button>
                                </Box>
                            </form> 
                        </Box>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default EditItemModal;