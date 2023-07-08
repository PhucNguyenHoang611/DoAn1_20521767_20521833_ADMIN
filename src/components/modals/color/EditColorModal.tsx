/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { SketchPicker } from 'react-color'
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getAllColors } from "@/redux/reducers/auth_reducer";

const EditColorModal = ({ token, colorId, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
	const { register, formState: { errors }, setError, setValue, handleSubmit } = useForm<any>();
    const [colorName, setColorName] = useState("");
    const [colorHex, setColorHex] = useState("#000000");

    const getColor = async () => {
        try {
            const col = await mainApi.get(
                apiEndpoints.GET_COLOR(colorId)
            );

            setColorName(col.data.data.colorName);
            setColorHex(col.data.data.colorHex);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleEditColor: SubmitHandler<any> = async (data) => {
        try {
            await mainApi.put(
                apiEndpoints.UPDATE_COLOR(colorId),
                apiEndpoints.getColorBody(data.colorName, colorHex),
                apiEndpoints.getAccessToken(token)
            );

            const colors = await mainApi.get(
                apiEndpoints.GET_ALL_COLORS
            );

            dispatch(getAllColors(colors.data.data));
        } catch (error: any) {
            const errorMessage = error.response.data.error;

            if (errorMessage === "Color existed in database") {
                setError("colorHex", { message: "Mã màu này đã tồn tại" });
            }

            return;
        }

        setOpenSnackbar(true);
        handleClose();
    }

    const handleClose = () => {
		setIsModalOpen(false);
        
        setValue("colorName", "");
        setValue("colorHex", "#000000");

        setError("colorHex", { message: "" });
	};

    useEffect(() => {
        if (isModalOpen) {
            getColor();
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
					width: "31%",
					height: "max-content",
					overflowY: "auto" }}>
					<Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "black"
                        }}>
                            Chỉnh sửa màu
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleEditColor)} className="w-full flex flex-col">
                            {/* Tên màu */}
							<Box width="100%" sx={{ mb: 4 }}>
                                <TextField value={colorName} fullWidth autoComplete="off" {...register("colorName")} required label="Tên màu" placeholder="Nhập tên màu"
                                    onChange={(event) => {
                                        setColorName(event.target.value);
                                    }} />
                            </Box>

                            {/* Mã màu */}
							<Box width="100%" display="flex" sx={{ mb: 2 }}>
                                <Box width="40%" sx={{ mr: 4 }}>
                                    <TextField value={colorHex} fullWidth autoComplete="off" {...register("colorHex")} required label="Mã màu" placeholder="Nhập mã màu"
                                        InputProps={{
                                            inputProps: {
                                                readOnly: true
                                            }
                                        }} />
                                    <p className="text-red-700 text-base mb-4">{errors.colorHex?.message?.toString()}</p>
                                </Box>

                                <Box width="50%">
                                    <SketchPicker 
                                        color={colorHex}
                                        onChange={(updatedColor: any) => setColorHex(updatedColor.hex)} />
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
    )
}

export default EditColorModal;