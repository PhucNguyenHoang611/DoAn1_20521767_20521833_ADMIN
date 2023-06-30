/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/redux/store";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Alert, Box, Button, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStaffs } from '@/redux/reducers/auth_reducer'

import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import AddStaffModal from "@/components/modals/staff/AddStaffModal";
import EditStaffModal from "@/components/modals/staff/EditStaffModal";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "Mã nhân viên",
        width: 210
    },
    {
        field: "name",
        headerName: "Tên nhân viên",
        width: 180
    },
    {
        field: "email",
        headerName:"Email",
        width: 150
    },
    {
        field: "phone",
        headerName: "Số điện thoại",
        width: 120
    },
    {
        field: "privilege",
        headerName: "Chức vụ",
        width: 170
    },
    {
        field: "start",
        headerName: "Ngày vào làm",
        width: 110
    },
    {
        field: "status",
        headerName: "Trạng thái",
        width: 120
    },
    {
        field: "action",
        headerName: "",
        width: 80,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell staffId={params.id} />
    }
];

interface RenderCellProps {
    staffId: GridRowId;
}
const RenderCell = ({ staffId }: RenderCellProps) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openEditStaffModal, setOpenEditStaffModal] = useState(false);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    const handleEditStaff = () => {
        setOpenEditStaffModal(true);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Chỉnh sửa">
                <IconButton size="small" sx={{ backgroundColor: "#A67F78", mx: 3 }} onClick={handleEditStaff}>
                    <PencilSquareIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <EditStaffModal token={currentUser.token} staffId={staffId} isModalOpen={openEditStaffModal} setIsModalOpen={setOpenEditStaffModal} setOpenSnackbar={setOpenSnackbar} />
            
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Chỉnh sửa nhân viên thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const Staff = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [allStaffs, setAllStaffs] = useState();
    const [openAddStaffModal, setOpenAddStaffModal] = useState(false);
    const [openAddSnackbar, setOpenAddSnackbar] = useState(false);

    const staffs = useSelector((state: RootState) => state.auth.allStaffs);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    const getStaffs = async () => {
        setIsLoading(true);

        try {
            const listStaffs = await mainApi.get(
                apiEndpoints.GET_ALL_STAFFS,
                apiEndpoints.getAccessToken(currentUser.token)
            );

            setAllStaffs(listStaffs.data.data);
            dispatch(getAllStaffs(listStaffs.data.data));
            getTableRows(listStaffs.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (staff: any) => {
                let priv = "";

                switch (staff.privilege) {
                    case 0:
                        priv = "QUẢN TRỊ VIÊN";
                        break;
                    case 1:
                        priv = "NHÂN VIÊN SALES";
                        break;
                    case 2:
                        priv = "NHÂN VIÊN KHO";
                        break;
                    default:
                        break;
                }

                return {
                    id: staff._id,
                    name: staff.staffLastName + " " + staff.staffFirstName,
                    email: staff.staffEmail,
                    phone: staff.staffPhone,
                    privilege: priv,
                    start: new Date(staff.staffStartWork).toLocaleDateString(),
                    status: staff.staffStatus === 0 ? "Đang làm việc" : "Đã nghỉ việc"
                };
            })
        );
        setTableRows(rows);
        setIsLoading(false);
    }

    const handleCloseAddSnackbar = () => {
        setOpenAddSnackbar(false);
    }

    useEffect(() => {
        if (currentUser) {
            if (staffs) {
                setAllStaffs(staffs);
                getTableRows(staffs);
            } else {
                getStaffs();
            }
        }
    }, [currentUser, staffs]);

    useEffect(() => {

    }, [allStaffs]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="15%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Nhân viên
                </Typography>
                <Button sx={{ backgroundColor: "#716864" }} onClick={() => setOpenAddStaffModal(true)}>
                    <PlusCircleIcon className="w-6 h-6 text-white" />
                    <Typography className="text-white hidden md:block pl-2" sx={{ fontSize: "0.9rem", fontWeight: "medium" }}>
                        THÊM NHÂN VIÊN
                    </Typography>
                </Button>
            </Box>
            <Box width="100%" height="80%" className="px-7 md:px-10">
                <DataGrid
                    loading={isLoading}
                    rows={tableRows}
                    columns={tableColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        }
                    }}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                    sx={{ fontSize: "1rem" }}
                    slots={{
                        noRowsOverlay: NoRowsOverlay
                    }} />
            </Box>
            <AddStaffModal token={currentUser.token} isModalOpen={openAddStaffModal} setIsModalOpen={setOpenAddStaffModal} setOpenSnackbar={setOpenAddSnackbar} />

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openAddSnackbar} autoHideDuration={2000} onClose={handleCloseAddSnackbar}>
                <Alert onClose={handleCloseAddSnackbar} severity="success" sx={{ width: "100%" }}>
                    Thêm nhân viên thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Staff;