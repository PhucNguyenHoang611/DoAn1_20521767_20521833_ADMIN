/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, IconButton, MenuItem, Modal, TextField, Typography } from "@mui/material";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useDispatch } from "react-redux";
import { getAllStaffs } from "@/redux/reducers/auth_reducer";

const AddStaffModal = ({ token, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
	const { register, formState: { errors }, setError, setValue, handleSubmit } = useForm<any>();

    const handleAddStaff: SubmitHandler<any> = async (data) => {
        setOpenSnackbar(true);
        
        try {
            await mainApi.post(
                apiEndpoints.CREATE_STAFF,
                apiEndpoints.getStaffBodyForCreate("12345678", data.staffFirstName, data.staffLastName, data.staffEmail, data.staffPhone, data.staffGender, data.privilege),
                apiEndpoints.getAccessToken(token)
            );

            const listStaffs = await mainApi.get(
                apiEndpoints.GET_ALL_STAFFS,
                apiEndpoints.getAccessToken(token)
            );

            dispatch(getAllStaffs(listStaffs.data.data));
        } catch (error: any) {
            const errorMessage = error.response.data.error;

            if (errorMessage === "staffEmail already exists") {
                setError("staffEmail", { message: "Email này đã được sử dụng" });
            } else if (errorMessage === "staffPhone already exists") {
                setError("staffPhone", { message: "Số điện thoại này đã được sử dụng" });
            }

            return;
        }

        handleClose();
    }

    const handleClose = () => {
		setIsModalOpen(false);

        setValue("staffLastName", "");
        setValue("staffFirstName", "");
        setValue("staffEmail", "");
        setValue("staffPhone", "");

        setError("staffLastName", { message: "" });
        setError("staffFirstName", { message: "" });
        setError("staffEmail", { message: "" });
        setError("staffPhone", { message: "" });
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
					width: "55%",
					height: "max-content",
					overflowY: "auto" }}>
					<Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "black"
                        }}>
                            Thêm nhân viên
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleAddStaff)} className="w-full flex flex-col">
							{/* Họ tên nhân viên */}
							<Box width="100%" display="flex" sx={{ mb: 1 }}>
                                <Box width="50%" sx={{ mr: 1 }}>
                                    <TextField fullWidth autoComplete="off" {...register("staffLastName", { pattern: { value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/, message: "Họ không được chứa ký tự số" } })} required label="Họ" placeholder="Nhập họ nhân viên" />
                                    <p className="text-red-700 text-base mb-4">{errors.staffLastName?.message?.toString()}</p>
                                </Box>
                                <Box width="50%" sx={{ ml: 1 }}>
                                    <TextField fullWidth autoComplete="off" {...register("staffFirstName", { pattern: { value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/ , message: "Tên không được chứa ký tự số" } })} required label="Tên" placeholder="Nhập tên nhân viên" />
                                    <p className="text-red-700 text-base mb-4">{errors.staffFirstName?.message?.toString()}</p>
                                </Box>
							</Box>

                            {/* Email nhân viên */}
							<Box width="100%" sx={{ mb: 1 }}>
                                <TextField fullWidth autoComplete="off" {...register("staffEmail", { pattern: { value: /^[a-z0-9_\.]{1,32}@[a-z0-9]{2,10}(\.[a-z0-9]{2,10}){1,}$/ , message: "Định dạng email không hợp lệ" } })} required label="Email" placeholder="Nhập email nhân viên" />
                                <p className="text-red-700 text-base mb-4">{errors.staffEmail?.message?.toString()}</p>
                            </Box>

                            {/* SĐT nhân viên */}
							<Box width="100%" sx={{ mb: 1 }}>
                                <TextField fullWidth autoComplete="off" {...register("staffPhone", { pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/ , message: "Định dạng số điện thoại không hợp lệ" } })} required label="Số điện thoại" placeholder="Nhập số điện thoại nhân viên" />
                                <p className="text-red-700 text-base mb-4">{errors.staffPhone?.message?.toString()}</p>
                            </Box>

                            {/* Giới tính & Chức vụ */}
							<Box width="100%" display="flex" sx={{ mb: 2 }}>
                                <Box width="40%" sx={{ mr: 1 }}>
                                    <TextField select fullWidth autoComplete="off" {...register("staffGender")} required label="Giới tính" defaultValue="Nam">
                                        <MenuItem key={0} value="Nam">
											Nam
										</MenuItem>
                                        <MenuItem key={1} value="Nữ">
											Nữ
										</MenuItem>
                                    </TextField>
                                </Box>
                                <Box width="60%" sx={{ ml: 1 }}>
                                    <TextField select fullWidth autoComplete="off" {...register("privilege")} required label="Chức vụ"  defaultValue={0}>
                                        <MenuItem key={0} value={0}>
											QUẢN TRỊ VIÊN
										</MenuItem>
                                        <MenuItem key={1} value={1}>
											NHÂN VIÊN SALES
										</MenuItem>
                                        <MenuItem key={2} value={2}>
											NHÂN VIÊN KHO
										</MenuItem>
                                    </TextField>
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

export default AddStaffModal;