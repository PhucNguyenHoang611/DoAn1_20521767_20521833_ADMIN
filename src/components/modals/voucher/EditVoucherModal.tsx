import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Voucher } from "./AddVoucherModal";
import { useForm } from "react-hook-form";
import { mainApi } from "@/api/main_api";
import * as apiEndpoints from "@/api/api_endpoints";
import { Box, IconButton, InputAdornment, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getAllVouchers } from "@/redux/reducers/voucher_reducer";

const EditVoucherModal = ({ token, voucherId, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
    const [currentVoucher, setCurrentVoucher] = useState<Voucher>({
        voucherType: "PERCENT",
        voucherValue: 0,
        minOrderPrice: 0,
        maxDiscountPrice: 0,
        voucherEndDate: new Date(),
    });

    const { register, formState: { errors }, setError, setValue, handleSubmit } = useForm<Voucher>();

    const getVoucher = async () => {
        try {
            const voucher = await mainApi.get(
                apiEndpoints.GET_VOUCHER(voucherId),
                apiEndpoints.getAccessToken(token)
            );

            setCurrentVoucher(voucher.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleEditVoucher = async () => {
        const now = new Date();

        if (currentVoucher.voucherEndDate <= now) {
            setError("voucherEndDate", { message: "Ngày hết hạn không phù hợp" });
            return;
        }

        setOpenSnackbar(true);

        try {
            await mainApi.put(
                apiEndpoints.UPDATE_VOUCHER(voucherId),
                apiEndpoints.getUpdateVoucherBody(
                    currentVoucher.voucherType,
                    currentVoucher.voucherValue,
                    currentVoucher.minOrderPrice,
                    currentVoucher.voucherType === "PERCENT" ? currentVoucher.maxDiscountPrice : 0,
                    currentVoucher.voucherEndDate
                ),
                apiEndpoints.getAccessToken(token)
            );

            const listVouchers = await mainApi.get(
                apiEndpoints.GET_ALL_VOUCHERS,
                apiEndpoints.getAccessToken(token)
            );

            dispatch(getAllVouchers(listVouchers.data.data));
        } catch (error: any) {
            console.log(error);
        }

        handleClose();
    }

    const handleClose = () => {
        setIsModalOpen(false);

        setValue("voucherType", "PERCENT");
        setValue("voucherValue", 0);
        setValue("minOrderPrice", 0);
        setValue("maxDiscountPrice", 0);

        setError("voucherEndDate", { message: "" });
    };

    useEffect(() => {
        if (isModalOpen) {
            getVoucher();
        } else {
            setCurrentVoucher({
                voucherType: "PERCENT",
                voucherValue: 0,
                minOrderPrice: 0,
                maxDiscountPrice: 0,
                voucherEndDate: new Date(),
            });
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
                            Chỉnh sửa voucher
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleEditVoucher)} className="w-full flex flex-col">
                            {/* Loại voucher */}
                            <Box width="100%" display="flex" sx={{ mb: 2 }}>
                                <TextField
                                    select
                                    fullWidth
                                    autoComplete="off"
                                    {...register("voucherType")}
                                    required
                                    label="Loại voucher"
                                    value={currentVoucher ? currentVoucher.voucherType : "PERCENT"}
                                    onChange={(event) => {
                                        setCurrentVoucher((voucher: any) => {
                                            const updatedVoucher = {
                                                ...voucher,
                                                voucherType: event.target.value,
                                            };

                                            return updatedVoucher;
                                        });
                                    }}>
                                    <MenuItem key={0} value="PERCENT">
                                        Giảm theo phần trăm
                                    </MenuItem>
                                    <MenuItem key={1} value="MONEY">
                                        Giảm trực tiếp
                                    </MenuItem>
                                </TextField>
							</Box>

                            {/* Giá trị voucher */}
                            <Box width="100%" sx={{ mb: 2 }}>
                                <TextField
                                    type="number"
                                    fullWidth
                                    autoComplete="off"
                                    {...register("voucherValue")}
                                    required
                                    label="Giá trị voucher"
                                    placeholder="Nhập giá trị voucher"
                                    value={currentVoucher ? currentVoucher.voucherValue : 0}
                                    InputProps={{
                                        inputProps: {
                                            min: 1,
                                            max: currentVoucher.voucherType === "PERCENT" ? 100 : 100000000000
                                        },
										endAdornment:
                                        <InputAdornment position="end">
                                            {currentVoucher.voucherType === "PERCENT" ? "%" : "VNĐ"}
                                        </InputAdornment>
                                    }}
                                    onChange={(event) => {
                                        setCurrentVoucher((voucher: any) => {
                                            const updatedVoucher = {
                                                ...voucher,
                                                voucherValue: event.target.value,
                                            };

                                            return updatedVoucher;
                                        });
                                    }} />
                            </Box>

                            {/* Giá trị đơn hàng tối thiểu */}
                            <Box width="100%" sx={{ mb: 2 }}>
								<TextField
                                    fullWidth
                                    type="number"
                                    autoComplete="off"
                                    {...register("minOrderPrice")}
                                    required
                                    label="Giá trị đơn hàng tối thiểu"
                                    placeholder="Nhập giá trị đơn hàng tối thiểu"
                                    value={currentVoucher ? currentVoucher.minOrderPrice : 0}
									InputProps={{
										inputProps: {
											min: 1,
											max: 100000000000,
											step: 1
										},
                                        endAdornment:
                                        <InputAdornment position="end">VNĐ</InputAdornment>
									}}
                                    onChange={(event) => {
                                        setCurrentVoucher((voucher: any) => {
                                            const updatedVoucher = {
                                                ...voucher,
                                                minOrderPrice: event.target.value,
                                            };

                                            return updatedVoucher;
                                        });
                                    }} />
							</Box>

                            {/* Giá trị giảm tối đa */}
                            <Box width="100%" sx={{ mb: 2 }}>
								<TextField
                                    fullWidth
                                    type="number"
                                    autoComplete="off"
                                    {...register("maxDiscountPrice")}
                                    disabled={currentVoucher.voucherType === "MONEY"}
                                    required
                                    label="Giá trị giảm tối đa"
                                    placeholder="Nhập giá trị giảm tối đa"
                                    value={currentVoucher ? currentVoucher.maxDiscountPrice : 0}
									InputProps={{
										inputProps: {
											min: 1,
											max: 100000000000,
											step: 1
										},
                                        endAdornment:
                                        <InputAdornment position="end">VNĐ</InputAdornment>
									}}
                                    onChange={(event) => {
                                        setCurrentVoucher((voucher: any) => {
                                            const updatedVoucher = {
                                                ...voucher,
                                                maxDiscountPrice: event.target.value,
                                            };

                                            return updatedVoucher;
                                        });
                                    }} />
							</Box>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box width="100%" sx={{ mb: 2 }}>
                                    {/* Ngày hết hạn */}
                                    <DateTimePicker
                                        {...register("voucherEndDate")}
                                        sx={{ width: "100%" }}
                                        label="Ngày hết hạn"
                                        value={currentVoucher ? dayjs(currentVoucher.voucherEndDate) : ""}
                                        onChange={(endDate: any) => {
                                            setCurrentVoucher((voucher: Voucher) => {
                                                const date = new Date(endDate);
                                                const updatedVoucher = {
                                                    ...voucher,
                                                    voucherEndDate: date,
                                                };

                                                return updatedVoucher;
                                            })
                                        }} />
                                    <p className="text-red-700 text-base mb-4">{errors.voucherEndDate?.message?.toString()}</p>
                                </Box>
                            </LocalizationProvider>

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

export default EditVoucherModal;