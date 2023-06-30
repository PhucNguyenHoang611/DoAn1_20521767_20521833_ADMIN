/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import React from "react";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useForm, SubmitHandler } from "react-hook-form";

const ChangeStaffPasswordModal = ({ currentUser, isModalOpen, setIsModalOpen }: any) => {
    const { register, formState: { errors }, setError, setValue, handleSubmit } = useForm();

    const handleChangePassword: SubmitHandler<any> = async (data) => {
        try {
            await mainApi.post(
                apiEndpoints.CHANGE_STAFF_PASSWORD(currentUser.id),
                apiEndpoints.getStaffPasswordBody(data.staffOldPassword, data.staffNewPassword),
                apiEndpoints.getAccessToken(currentUser.token)
            );
        } catch (error: any) {
            const errorMessage = error.response.data.error;

            if (errorMessage === "Incorrect old password") {
                setError("staffOldPassword", { message: "Mật khẩu cũ không đúng" });
            }

            return;
        }

		setIsModalOpen(false);
    }
    
    const handleClose = () => {
		setIsModalOpen(false);
        setValue("staffOldPassword", "");
        setValue("staffNewPassword", "");

        setError("staffOldPassword", { message: "" });
        setError("staffNewPassword", { message: "" });
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
					width: "40%",
					height: "max-content",
					overflowY: "auto" }}>
					<Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "black"
                        }}>
                            Đổi mật khẩu
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleChangePassword)} className="w-full flex flex-col">
                            <Box width="100%" sx={{ mb: 1 }}>
                                <TextField fullWidth autoComplete="off" {...register("staffOldPassword", { minLength: { value: 8, message: "Password phải có ít nhất 8 ký tự" }, pattern: { value: /^\S*$/ , message: "Mật khẩu không hợp lệ" } })} required label="Mật khẩu cũ" placeholder="Nhập mật khẩu cũ" />
                                <p className="text-red-700 text-base mb-4">{errors.staffOldPassword?.message?.toString()}</p>
                            </Box>

                            <Box width="100%" sx={{ mb: 1 }}>
                                <TextField fullWidth autoComplete="off" {...register("staffNewPassword", { minLength: { value: 8, message: "Password phải có ít nhất 8 ký tự" }, pattern: { value: /^\S*$/ , message: "Mật khẩu không hợp lệ" } })} required label="Mật khẩu mới" placeholder="Nhập mật khẩu mới" />
                                <p className="text-red-700 text-base mb-4">{errors.staffNewPassword?.message?.toString()}</p>
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

export default ChangeStaffPasswordModal;