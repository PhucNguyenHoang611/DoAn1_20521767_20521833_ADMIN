/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getAllSubcategories } from "@/redux/reducers/subcategory_reducer";

const AddSubcategoryModal = ({ token, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
	const { register, setValue, formState: { errors }, setError, handleSubmit } = useForm<any>();

    const handleAddSubcategory: SubmitHandler<any> = async (data) => {
        try {
            await mainApi.post(
                apiEndpoints.CREATE_SUBCATEGORY,
                apiEndpoints.getSubcategoryBody(data.subcategoryName, data.subcategorySlug),
                apiEndpoints.getAccessToken(token)
            );

            const subcategories = await mainApi.get(
                apiEndpoints.GET_ALL_SUBCATEGORIES
            );

            dispatch(getAllSubcategories(subcategories.data.data));
        } catch (error: any) {
            const errorMessage = error.response.data.error;

            if (errorMessage === "Subcategory slug existed in database") {
                setError("subcategorySlug", { message: "Đường dẫn này đã tồn tại" });
            }

            return;
        }

        setOpenSnackbar(true);
        handleClose();
    }

    const handleClose = () => {
		setIsModalOpen(false);

        setValue("subcategoryName", "");
        setValue("subcategorySlug", "");

        setError("subcategorySlug", { message: "" });
	};
    
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
					width: "50%",
					height: "max-content",
					overflowY: "auto" }}>
					<Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "black"
                        }}>
                            Thêm loại phòng
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleAddSubcategory)} className="w-full flex flex-col">
                            {/* Tên loại phòng */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" {...register("subcategoryName")} required label="Tên loại phòng" placeholder="Nhập tên loại phòng" />
                            </Box>

                            {/* Slug */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" {...register("subcategorySlug")} required label="Đường dẫn" placeholder="Nhập đường dẫn" />
                                <p className="text-red-700 text-base mb-4">{errors.subcategorySlug?.message?.toString()}</p>
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

export default AddSubcategoryModal;