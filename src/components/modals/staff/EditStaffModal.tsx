/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseURL, mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useEffect, useState } from 'react';
import React from 'react';
import { Box, IconButton, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { getAllStaffs } from '@/redux/reducers/auth_reducer';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const EditStaffModal = ({ token, staffId, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
	const { register, formState: { errors }, setError, setValue, handleSubmit } = useForm<any>();
    const [currentStaff, setCurrentStaff] = useState<any>(null);
    const [staffStatus, setStaffStatus] = useState(0);
    
    const getStaff = async () => {
        try {
            const staff = await mainApi.get(
                apiEndpoints.GET_STAFF(staffId.toString()),
                apiEndpoints.getAccessToken(token)
            );

            setCurrentStaff(staff.data.data);
            setStaffStatus(staff.data.data.staffStatus);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleEditStaff = async () => {
        setOpenSnackbar(true);

        try {
            await mainApi.put(
                apiEndpoints.UPDATE_STAFF(currentStaff._id),
                apiEndpoints.getStaffBodyForUpdate(currentStaff.staffFirstName, currentStaff.staffLastName, currentStaff.staffEmail, currentStaff.staffPhone, currentStaff.staffGender, currentStaff.privilege),
                apiEndpoints.getAccessToken(token)
            );

            if (currentStaff.staffStatus !== staffStatus) {
                await axios({
                    method: "PUT",
                    url: `${baseURL}/staffs/activeOrInactiveStaff/${currentStaff._id.toString()}`,
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
            }

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

    useEffect(() => {
        if (isModalOpen) {
            getStaff();
        } else {
            setCurrentStaff(null);
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
					width: "60%",
					height: "max-content",
					overflowY: "auto" }}>
					<Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "black"
                        }}>
                            Chỉnh sửa nhân viên
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(handleEditStaff)} className="w-full flex flex-col">
							{/* Họ tên nhân viên */}
							<Box width="100%" display="flex" sx={{ mb: 2 }}>
                                <Box width="50%" sx={{ mr: 1 }}>
                                    <TextField fullWidth autoComplete="off" required label="Họ" placeholder="Nhập họ nhân viên" value={currentStaff ? currentStaff.staffLastName : ""}
                                        {...register("staffLastName", { pattern: { value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/, message: "Họ không được chứa ký tự số" } })}
                                        onChange={(event) => {
                                            setCurrentStaff((staff: any) => {
                                                const updatedStaff: any = {
                                                    ...staff,
                                                    staffLastName: event.target.value
                                                };
    
                                                return updatedStaff;
                                            });
                                        }} />
                                    <p className="text-red-700 text-base mb-4">{errors.staffLastName?.message?.toString()}</p>
                                </Box>
                                <Box width="50%" sx={{ ml: 1 }}>
                                    <TextField fullWidth autoComplete="off" required label="Tên" placeholder="Nhập tên nhân viên" value={currentStaff ? currentStaff.staffFirstName : ""}
                                        {...register("staffFirstName", { pattern: { value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/ , message: "Tên không được chứa ký tự số" } })}
                                        onChange={(event) => {
                                            setCurrentStaff((staff: any) => {
                                                const updatedStaff: any = {
                                                    ...staff,
                                                    staffFirstName: event.target.value
                                                };
    
                                                return updatedStaff;
                                            });
                                        }}  />
                                    <p className="text-red-700 text-base mb-4">{errors.staffFirstName?.message?.toString()}</p>
                                </Box>
							</Box>

                            {/* Email nhân viên */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" required label="Email" placeholder="Nhập email nhân viên" value={currentStaff ? currentStaff.staffEmail : ""}
                                    {...register("staffEmail", { pattern: { value: /^[a-z0-9_\.]{1,32}@[a-z0-9]{2,10}(\.[a-z0-9]{2,10}){1,}$/ , message: "Định dạng email không hợp lệ" } })}
                                    onChange={(event) => {
                                        setCurrentStaff((staff: any) => {
                                            const updatedStaff: any = {
                                                ...staff,
                                                staffEmail: event.target.value
                                            };

                                            return updatedStaff;
                                        });
                                    }}  />
                                <p className="text-red-700 text-base mb-4">{errors.staffEmail?.message?.toString()}</p>
                            </Box>

                            {/* SĐT nhân viên */}
							<Box width="100%" sx={{ mb: 2 }}>
                                <TextField fullWidth autoComplete="off" required label="Số điện thoại" placeholder="Nhập số điện thoại nhân viên" value={currentStaff ? currentStaff.staffPhone : ""}
                                    {...register("staffPhone", { pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/ , message: "Định dạng số điện thoại không hợp lệ" } })}
                                    onChange={(event) => {
                                        setCurrentStaff((staff: any) => {
                                            const updatedStaff: any = {
                                                ...staff,
                                                staffPhone: event.target.value
                                            };

                                            return updatedStaff;
                                        });
                                    }}  />
                                <p className="text-red-700 text-base mb-4">{errors.staffPhone?.message?.toString()}</p>
                            </Box>

                            {/* Giới tính & Chức vụ */}
							<Box width="100%" display="flex" sx={{ mb: 2 }}>
                                <Box width="30%" sx={{ mr: 1 }}>
                                    <TextField select fullWidth autoComplete="off" required label="Giới tính" value={currentStaff ? currentStaff.staffGender : "Nam"}
                                        onChange={(event) => {
                                            setCurrentStaff((staff: any) => {
                                                const updatedStaff: any = {
                                                    ...staff,
                                                    staffGender: event.target.value
                                                };

                                                return updatedStaff;
                                            });
                                        }}>
                                            <MenuItem key={0} value="Nam">
                                                Nam
                                            </MenuItem>
                                            <MenuItem key={1} value="Nữ">
                                                Nữ
                                            </MenuItem>
                                    </TextField>
                                </Box>
                                <Box width="70%" sx={{ ml: 1 }}>
                                    <TextField select fullWidth autoComplete="off" required label="Chức vụ" value={currentStaff ? currentStaff.privilege : 0}
                                        onChange={(event) => {
                                            setCurrentStaff((staff: any) => {
                                                const updatedStaff: any = {
                                                    ...staff,
                                                    privilege: event.target.value
                                                };

                                                return updatedStaff;
                                            });
                                        }}>
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

                            {/* Trạng thái nhân viên */}
                            <Box width="100%" display="flex" justifyContent="end" sx={{ mb: 2 }}>
                                <TextField select fullWidth autoComplete="off" required label="Giới tính" value={currentStaff ? staffStatus : 0}
                                    onChange={(event) => {
                                        setStaffStatus(parseInt(event.target.value));
                                    }}>
                                        <MenuItem key={0} value={0}>
                                            Đang làm việc
                                        </MenuItem>
                                        <MenuItem key={1} value={-1}>
                                            Đã nghỉ việc
                                        </MenuItem>
                                </TextField>
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

export default EditStaffModal;