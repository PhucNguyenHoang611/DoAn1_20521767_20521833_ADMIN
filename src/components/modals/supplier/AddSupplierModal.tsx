/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getAllSuppliers } from "@/redux/reducers/auth_reducer";

const AddSupplierModal = ({ token, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
	const { register, setValue, handleSubmit } = useForm<any>();

    const handleAddSupplier: SubmitHandler<any> = async (data) => {
        try {
            await mainApi.post(
                apiEndpoints.CREATE_SUPPLIER,
                apiEndpoints.getSupplierBody(data.supplierName, data.supplierCountry, data.supplierAddress),
                apiEndpoints.getAccessToken(token)
            );

            const suppliers = await mainApi.get(
                apiEndpoints.GET_ALL_SUPPLIERS
            );

            dispatch(getAllSuppliers(suppliers.data.data));
        } catch (error: any) {
            console.log(error);
        }

        setOpenSnackbar(true);
        handleClose();
    }

    const handleClose = () => {
		setIsModalOpen(false);

        setValue("supplierName", "");
        setValue("supplierCountry", "");
        setValue("supplierAddress", "");
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
                            Thêm nhà cung cấp
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleAddSupplier)} className="w-full flex flex-col">
                            {/* Tên nhà cung cấp */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" {...register("supplierName")} required label="Tên nhà cung cấp" placeholder="Nhập tên nhà cung cấp" />
                            </Box>

                            {/* Quốc gia nhà cung cấp */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" {...register("supplierCountry")} required label="Quốc gia" placeholder="Nhập quốc gia nhà cung cấp" />
                            </Box>

                            {/* Địa chỉ nhà cung cấp */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" {...register("supplierAddress")} required label="Địa chỉ" placeholder="Nhập địa chỉ nhà cung cấp" />
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

export default AddSupplierModal;