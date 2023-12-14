/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import React from "react";
import { Box, IconButton, InputAdornment, Modal, TextField, Typography } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getAllDiscounts } from "@/redux/reducers/auth_reducer";
import dayjs from "dayjs";
import PostThumbnailUploader from "@/components/blogpost/PostThumbnailUploader";

const EditDiscountModal = ({ token, discountId, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
	const { register, formState: { errors }, setError, setValue, handleSubmit } = useForm<any>();
    const [currentDiscount, setCurrentDiscount] = useState<any>(null);
    
    const [filesList, setFilesList] = useState<any[]>([]);
    const [viewImage, setViewImage] = useState(false);
    
    const getDiscount = async () => {
        try {
            const discount = await mainApi.get(
                apiEndpoints.GET_DISCOUNT(discountId.toString())
            );

            setCurrentDiscount(discount.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleEditDiscount = async () => {
        const now = new Date();

        if (new Date(currentDiscount.discountStartDate) >= new Date(currentDiscount.discountEndDate)) {
            setError("discountStartDate", { message: "Ngày bắt đầu không được lớn hơn ngày kết thúc" });
            return;
        }

        if (new Date(currentDiscount.discountEndDate) <= now) {
            setError("discountEndDate", { message: "Ngày kết thúc không phù hợp" });
            return;
        }

        setOpenSnackbar(true);

        try {
            await mainApi.put(
                apiEndpoints.UPDATE_DISCOUNT(discountId),
                apiEndpoints.getDiscountBody(currentDiscount.discountName, currentDiscount.discountDescription, currentDiscount.discountPercent, currentDiscount.discountStartDate, currentDiscount.discountEndDate),
                apiEndpoints.getAccessToken(token)
            );

            if (filesList.length > 0) {
                filesList.map(async (file: any) => {
                    const formData = new FormData();
                    formData.append("Files[]", file.originFileObj);
    
                    await mainApi.post(
                        apiEndpoints.SAVE_DISCOUNT_THUMBNAIL(discountId),
                        formData,
                        apiEndpoints.getAccessToken(token)
                    );
                })
            }

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

        setValue("discountName", "");
        setValue("discountDescription", "");
        setValue("discountPercent", "");

        setError("discountStartDate", { message: "" });
        setError("discountEndDate", { message: "" });
    }

    const zoomImage = () => setViewImage(true);
    const cancelZoomImage = () => setViewImage(false);
    
    useEffect(() => {
        if (isModalOpen) {
            getDiscount();
        } else {
            setCurrentDiscount(null);
            setFilesList([]);
            setViewImage(false);
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
                            Chỉnh sửa đợt giảm giá
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleEditDiscount)} className="w-full flex flex-col">
							{/* Tên đợt giảm giá */}
							<Box width="100%" display="flex" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" {...register("discountName")} required label="Tên" placeholder="Nhập tên đợt giảm giá"
                                    value={currentDiscount ? currentDiscount.discountName : ""}
                                    onChange={(event) => {
                                        setCurrentDiscount((discount: any) => {
                                            const updatedDiscount: any = {
                                                ...discount,
                                                discountName: event.target.value
                                            };

                                            return updatedDiscount;
                                        });
                                    }}  />
							</Box>

                            {/* Mô tả */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" {...register("discountDescription")} label="Mô tả" placeholder="Nhập mô tả"
                                    value={currentDiscount ? currentDiscount.discountDescription : ""}
                                    onChange={(event) => {
                                        setCurrentDiscount((discount: any) => {
                                            const updatedDiscount: any = {
                                                ...discount,
                                                discountDescription: event.target.value
                                            };

                                            return updatedDiscount;
                                        });
                                    }}  />
                            </Box>

                            {/* Phần trăm giảm giá */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField type="number" fullWidth autoComplete="off" {...register("discountPercent")} required label="% Giảm" placeholder="Nhập % giảm"
                                    value={currentDiscount ? currentDiscount.discountPercent : ""}
                                    InputProps={{
                                        inputProps: {
                                            min: 1,
                                            max: 100
                                        },
										endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    onChange={(event) => {
                                        setCurrentDiscount((discount: any) => {
                                            const updatedDiscount: any = {
                                                ...discount,
                                                discountPercent: event.target.value
                                            };

                                            return updatedDiscount;
                                        });
                                    }}  />
                            </Box>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box width="100%" display="flex" sx={{ mb: 2 }}>
                                    {/* Ngày bắt đầu */}
                                    <Box width="50%" sx={{ mr: 1 }}>
                                        <DateTimePicker
                                            {...register("discountStartDate")}
                                            sx={{ width: "100%" }}
                                            label="Ngày bắt đầu"
                                            value={currentDiscount ? dayjs(currentDiscount.discountStartDate) : ""}
                                            onChange={(startDate: any) => {
                                                setCurrentDiscount((discount: any) => {
                                                    const date = new Date(startDate);
                                                    const updatedDiscount: any = {
                                                        ...discount,
                                                        discountStartDate: date
                                                    };

                                                    return updatedDiscount;
                                                });
                                            }}  />
                                        <p className="text-red-700 text-base mb-4">{errors.discountStartDate?.message?.toString()}</p>
                                    </Box>

                                    {/* Ngày kết thúc */}
                                    <Box width="50%" sx={{ ml: 1 }}>
                                        <DateTimePicker
                                            {...register("discountEndDate")}
                                            sx={{ width: "100%" }}
                                            label="Ngày kết thúc"
                                            value={currentDiscount ? dayjs(currentDiscount.discountEndDate) : ""}
                                            onChange={(endDate: any) => {
                                                setCurrentDiscount((discount: any) => {
                                                    const date = new Date(endDate);
                                                    const updatedDiscount: any = {
                                                        ...discount,
                                                        discountEndDate: date
                                                    };

                                                    return updatedDiscount;
                                                });
                                            }}  />
                                        <p className="text-red-700 text-base mb-4">{errors.discountEndDate?.message?.toString()}</p>
                                    </Box>
                                </Box>
                            </LocalizationProvider>

                            <Box width="100%" height="100%" display="flex" justifyContent="start" alignItems="center">
                                <Typography className="whitespace-nowrap" sx={{ fontSize: "0.8rem", fontWeight: "medium" }}>
                                    THUMBNAIL:
                                </Typography>

                                {currentDiscount?.discountThumbnail !== "" ? (
                                    <>
                                        <Box sx={{ border: "1px solid #B8ACA5", borderRadius: "5px", ml: 2, p: 0.5 }}>
                                            <img src={currentDiscount?.discountThumbnail} className="cursor-pointer" style={{ width: "10rem" }} onClick={zoomImage}/>
                                        </Box>
                                        
                                        <Modal open={viewImage} onClose={cancelZoomImage}>
                                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                backgroundColor: "white",
                                                width: "auto",
                                                height: "auto" }}>
                                                <img src={currentDiscount?.discountThumbnail} />
                                            </Box>
                                        </Modal>
                                    </>
                                ) : null}

                                <Box display="flex" flexDirection="column">
                                    <PostThumbnailUploader setFilesList={setFilesList} />
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

export default EditDiscountModal;