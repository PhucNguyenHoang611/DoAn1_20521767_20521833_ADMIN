import { useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import React, { useState } from "react";
import { Box, IconButton, InputAdornment, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getAllVouchers } from "@/redux/reducers/voucher_reducer";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface Voucher {
  voucherType: string;
  voucherValue: number;
  minOrderPrice: number;
  maxDiscountPrice: number;
  voucherEndDate: Date;
}

const AddVoucherModal = ({ token, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
    const { register, formState: { errors }, setError, setValue, handleSubmit } = useForm<Voucher>();

    const [endDate, setEndDate] = useState<any>(null);
    const [currentVoucherType, setCurrentVoucherType] = useState<string>("PERCENT");

    const handleAddVoucher: SubmitHandler<Voucher> = async (data) => {
        const now = new Date();

        if (endDate <= now) {
            setError("voucherEndDate", { message: "Ngày hết hạn không phù hợp" });
            return;
        }

        setOpenSnackbar(true);

        try {
            await mainApi.post(
                apiEndpoints.CREATE_VOUCHER,
                apiEndpoints.getCreateVoucherBody(
                    data.voucherType,
                    data.voucherValue,
                    data.minOrderPrice,
                    data.voucherType === "PERCENT" ? data.maxDiscountPrice : 0,
                    endDate
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
        setCurrentVoucherType("PERCENT");
        setEndDate(null);

        setValue("voucherType", "PERCENT");
        setValue("voucherValue", 0);
        setValue("minOrderPrice", 0);
        setValue("maxDiscountPrice", 0);

        setError("voucherEndDate", { message: "" });
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
                            Thêm voucher mới
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleAddVoucher)} className="w-full flex flex-col">
                            {/* Loại voucher */}
                            <Box width="100%" display="flex" sx={{ mb: 2 }}>
                                <TextField
                                    select
                                    fullWidth
                                    autoComplete="off"
                                    {...register("voucherType")}
                                    required
                                    label="Loại voucher"
                                    defaultValue="PERCENT"
                                    onChange={(event) => {
                                        setCurrentVoucherType((voucher: string) => {
                                            voucher = event.target.value;
                                            return voucher;
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
                                    InputProps={{
                                        inputProps: {
                                            min: 1,
                                            max: currentVoucherType === "PERCENT" ? 100 : 100000000000
                                        },
										endAdornment:
                                        <InputAdornment position="end">
                                            {currentVoucherType === "PERCENT" ? "%" : "VNĐ"}
                                        </InputAdornment>
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
									InputProps={{
										inputProps: {
											min: 1,
											max: 100000000000,
											step: 1
										},
                                        endAdornment:
                                        <InputAdornment position="end">VNĐ</InputAdornment>
									}} />
							</Box>

                            {/* Giá trị giảm tối đa */}
                            <Box width="100%" sx={{ mb: 2 }}>
								<TextField
                                    fullWidth
                                    type="number"
                                    autoComplete="off"
                                    {...register("maxDiscountPrice")}
                                    disabled={currentVoucherType === "MONEY"}
                                    required
                                    label="Giá trị giảm tối đa"
                                    placeholder="Nhập giá trị giảm tối đa"
									InputProps={{
										inputProps: {
											min: 1,
											max: 100000000000,
											step: 1
										},
                                        endAdornment:
                                        <InputAdornment position="end">VNĐ</InputAdornment>
									}} />
							</Box>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box width="100%" sx={{ mb: 2 }}>
                                    {/* Ngày hết hạn */}
                                    <DateTimePicker
                                        {...register("voucherEndDate")}
                                        sx={{ width: "100%" }}
                                        label="Ngày hết hạn"
                                        onChange={(endDate: any) => {
                                            const date = new Date(endDate);
                                            setEndDate((prevEndDate: any) => {
                                                prevEndDate = date;
                                                return prevEndDate;
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

export default AddVoucherModal;