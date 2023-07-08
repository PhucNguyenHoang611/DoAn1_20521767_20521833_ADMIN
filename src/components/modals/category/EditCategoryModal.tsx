/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getAllCategories } from "@/redux/reducers/category_reducer";

const EditCategoryModal = ({ token, categoryId, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
	const { register, setValue, formState: { errors }, setError, handleSubmit } = useForm<any>();
    const [categoryName, setCategoryName] = useState("");
    const [categorySlug, setCategorySlug] = useState("");

    const getCategory = async () => {
        try {
            const category = await mainApi.get(
                apiEndpoints.GET_CATEGORY(categoryId)
            );

            setCategoryName(category.data.data.categoryName);
            setCategorySlug(category.data.data.categorySlug);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleEditCategory: SubmitHandler<any> = async () => {
        try {
            await mainApi.put(
                apiEndpoints.UPDATE_CATEGORY(categoryId),
                apiEndpoints.getCategoryBody(categoryName, categorySlug),
                apiEndpoints.getAccessToken(token)
            );

            const categories = await mainApi.get(
                apiEndpoints.GET_ALL_CATEGORIES
            );

            dispatch(getAllCategories(categories.data.data));
        } catch (error: any) {
            const errorMessage = error.response.data.error;

            if (errorMessage === "Category slug existed in database") {
                setError("categorySlug", { message: "Đường dẫn này đã tồn tại" });
            }

            return;
        }

        setOpenSnackbar(true);
        handleClose();
    }

    const handleClose = () => {
		setIsModalOpen(false);

        setValue("categoryName", "");
        setValue("categorySlug", "");

        setError("categorySlug", { message: "" });
	};

    useEffect(() => {
        if (isModalOpen) {
            getCategory();
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
					width: "50%",
					height: "max-content",
					overflowY: "auto" }}>
					<Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "black"
                        }}>
                            Chỉnh sửa loại sản phẩm
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleEditCategory)} className="w-full flex flex-col">
                            {/* Tên loại sản phẩm */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField value={categoryName} fullWidth autoComplete="off" {...register("categoryName")} required label="Tên loại sản phẩm" placeholder="Nhập tên loại sản phẩm"
                                    onChange={(event) => {
                                        setCategoryName(event.target.value);
                                    }} />
                            </Box>

                            {/* Slug */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField value={categorySlug} fullWidth autoComplete="off" {...register("categorySlug")} required label="Đường dẫn" placeholder="Nhập đường dẫn"
                                    onChange={(event) => {
                                        setCategorySlug(event.target.value);
                                    }} />
                                <p className="text-red-700 text-base mb-4">{errors.categorySlug?.message?.toString()}</p>
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

export default EditCategoryModal;