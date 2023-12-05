/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, IconButton, InputAdornment, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useDispatch } from "react-redux";
import { getAllDiscounts } from "@/redux/reducers/auth_reducer";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PostThumbnailUploader from "@/components/blogpost/PostThumbnailUploader";

const AddDiscountModal = ({ token, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
	const { register, formState: { errors }, setError, setValue, handleSubmit } = useForm<any>();

    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);

    const [filesList, setFilesList] = useState<any[]>([]);
    const [thumbnailError, setThumbnailError] = useState(false);

    const handleAddDiscount: SubmitHandler<any> = async (data) => {
        const now = new Date();

        if (startDate >= endDate) {
            setError("discountStartDate", { message: "Ngày bắt đầu không được lớn hơn ngày kết thúc" });
            return;
        }

        if (endDate <= now) {
            setError("discountEndDate", { message: "Ngày kết thúc không phù hợp" });
            return;
        }

        if (filesList.length == 0) {
            setThumbnailError(true);
            return;
        } else
            setThumbnailError(false);

        setOpenSnackbar(true);
        
        try {
            const discount = await mainApi.post(
                apiEndpoints.CREATE_DISCOUNT,
                apiEndpoints.getDiscountBody(data.discountName, data.discountDescription, data.discountPercent, startDate, endDate),
                apiEndpoints.getAccessToken(token)
            );

            filesList.map(async (file: any) => {
                const formData = new FormData();
                formData.append("Files[]", file.originFileObj);

                await mainApi.post(
                    apiEndpoints.SAVE_DISCOUNT_THUMBNAIL(discount.data.data._id),
                    formData,
                    apiEndpoints.getAccessToken(token)
                );
            })

            const listDiscounts = await mainApi.get(
                apiEndpoints.GET_ALL_DISCOUNTS
            );

            dispatch(getAllDiscounts(listDiscounts.data.data));
        } catch (error: any) {
            console.log(error);
        }

        handleClose();
    }

    const handleClose = () => {
		setIsModalOpen(false);
        setStartDate(null);
        setEndDate(null);

        setValue("discountName", "");
        setValue("discountDescription", "");
        setValue("discountPercent", "");

        setError("discountStartDate", { message: "" });
        setError("discountEndDate", { message: "" });

        setThumbnailError(false);
        setFilesList([]);
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
                            Thêm đợt giảm giá
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleAddDiscount)} className="w-full flex flex-col">
							{/* Tên đợt giảm giá */}
							<Box width="100%" display="flex" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" {...register("discountName")} required label="Tên" placeholder="Nhập tên đợt giảm giá" />
							</Box>

                            {/* Mô tả */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" {...register("discountDescription")} label="Mô tả" placeholder="Nhập mô tả" />
                            </Box>

                            {/* Phần trăm giảm giá */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField type="number" fullWidth autoComplete="off" {...register("discountPercent")} required label="% Giảm" placeholder="Nhập % giảm"
                                    InputProps={{
                                        inputProps: {
                                            min: 1,
                                            max: 100
                                        },
										endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }} />
                            </Box>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box width="100%" display="flex" sx={{ mb: 2 }}>
                                    {/* Ngày bắt đầu */}
                                    <Box width="50%" sx={{ mr: 1 }}>
                                        <DateTimePicker
                                            {...register("discountStartDate")}
                                            sx={{ width: "100%" }}
                                            label="Ngày bắt đầu"
                                            onChange={(startDate: any) => {
                                                const date = new Date(startDate);
                                                setStartDate((prevStartDate: any) => {
                                                    prevStartDate = date;
                                                    return prevStartDate;
                                                })
                                            }} />
                                        <p className="text-red-700 text-base mb-4">{errors.discountStartDate?.message?.toString()}</p>
                                    </Box>

                                    {/* Ngày kết thúc */}
                                    <Box width="50%" sx={{ ml: 1 }}>
                                        <DateTimePicker
                                            {...register("discountEndDate")}
                                            sx={{ width: "100%" }}
                                            label="Ngày kết thúc"
                                            onChange={(endDate: any) => {
                                                const date = new Date(endDate);
                                                setEndDate((prevEndDate: any) => {
                                                    prevEndDate = date;
                                                    return prevEndDate;
                                                })
                                            }} />
                                        <p className="text-red-700 text-base mb-4">{errors.discountEndDate?.message?.toString()}</p>
                                    </Box>
                                </Box>
                            </LocalizationProvider>

                            <Box width="100%" height="100%" display="flex" justifyContent="start" alignItems="center">
                                <Typography className="whitespace-nowrap" sx={{ fontSize: "0.8rem", fontWeight: "medium" }}>
                                    THUMBNAIL:
                                </Typography>

                                <Box display="flex" flexDirection="column">
                                    <PostThumbnailUploader setFilesList={setFilesList} />
                                    {thumbnailError ? (
                                        <p className="text-red-700 text-base mb-4 ml-4">Hãy chọn thumbnail cho bài viết</p>
                                    ) : null}
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

export default AddDiscountModal;