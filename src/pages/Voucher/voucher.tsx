import { mainApi, baseURL } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { DataGrid, GridCellParams, GridColDef, GridRowId } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Tooltip, Typography } from '@mui/material';
import { TrashIcon, LockClosedIcon, LockOpenIcon, PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { getAllVouchers } from '@/redux/reducers/voucher_reducer';
import EditVoucherModal from '@/components/modals/voucher/EditVoucherModal';
import AddVoucherModal from '@/components/modals/voucher/AddVoucherModal';

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 220
    },
    {
        field: "type",
        headerName: "Loại voucher",
        width: 250
    },
    {
        field: "value",
        headerName:"Giá trị",
        width: 120
    },
    {
        field: "min",
        headerName: "Đơn hàng tối thiểu",
        width: 180
    },
    {
        field: "end",
        headerName: "Ngày hết hạn",
        width: 180
    },
    {
        field: "action",
        headerName: "",
        width: 180,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell voucherId={params.id} />
    }
];

interface RenderCellProps {
    voucherId: GridRowId;
}
const RenderCell = ({ voucherId }: RenderCellProps) => {
    const dispatch = useDispatch();
    const [openEditVoucherModal, setOpenEditVoucherModal] = useState(false);
    const [openEditSnackbar, setOpenEditSnackbar] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    
    const [openActiveDialog, setOpenActiveDialog] = useState(false);
    const [openActiveSnackbar, setOpenActiveSnackbar] = useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
    
    const [currentVoucher, setCurrentVoucher] = useState<any>(null);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    const getVoucher = async () => {
        try {
            const voucher = await mainApi.get(
                apiEndpoints.GET_VOUCHER(voucherId.toString())
            );

            setCurrentVoucher(voucher.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleActiveInactiveVoucher = async (action: string) => {
        try {
            await axios({
                method: "PUT",
                url: `${baseURL}/vouchers/activeOrInactiveVoucher/${voucherId.toString()}`,
                headers: {
                    Authorization: "Bearer " + currentUser.token
                }
            });

            const listVouchers = await mainApi.get(
                apiEndpoints.GET_ALL_VOUCHERS,
                apiEndpoints.getAccessToken(currentUser.token)
            );

            dispatch(getAllVouchers(listVouchers.data.data));
            getVoucher();
        } catch (error: any) {
            console.log(error);
        }

        if (action === "Inactive") {
            setOpenSnackbar(true);
            setOpenDialog(false);
        } else if (action === "Active") {
            setOpenActiveSnackbar(true);
            setOpenActiveDialog(false);
        }
    }

    const handleDeleteVoucher = async () => {
        setOpenDeleteSnackbar(true);

        try {
            await mainApi.delete(
                apiEndpoints.DELETE_VOUCHER(voucherId.toString()),
                apiEndpoints.getAccessToken(currentUser.token)
            );

            const listVouchers = await mainApi.get(
                apiEndpoints.GET_ALL_VOUCHERS,
                apiEndpoints.getAccessToken(currentUser.token)
            );

            dispatch(getAllVouchers(listVouchers.data.data));
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleCloseEditSnackbar = () => {
        setOpenEditSnackbar(false);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleCloseActiveDialog = () => {
        setOpenActiveDialog(false);
    }

    const handleCloseActiveSnackbar = () => {
        setOpenActiveSnackbar(false);
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    const handleCloseDeleteSnackbar = () => {
        setOpenDeleteSnackbar(false);
    }

    useEffect(() => {
        if (!currentVoucher) getVoucher();
    }, [voucherId]);

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Chỉnh sửa">
                <IconButton size="small" sx={{ backgroundColor: "#A67F78", mx: 3 }} onClick={() => setOpenEditVoucherModal(true)}>
                    <PencilSquareIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>

            {currentVoucher?.isActive ? (
                <Tooltip title="Vô hiệu hóa">
                    <IconButton size="small" sx={{ backgroundColor: "#DE5656" }} onClick={() => setOpenDialog(true)}>
                        <LockClosedIcon className="w-5 h-5 text-white" />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Kích hoạt">
                    <IconButton size="small" sx={{ backgroundColor: "#A67F78" }} onClick={() => setOpenActiveDialog(true)}>
                        <LockOpenIcon className="w-5 h-5 text-white" />
                    </IconButton>
                </Tooltip>
            )}

            <Tooltip title="Xóa">
                <IconButton size="small" sx={{ backgroundColor: "#DE5656", mx: 3 }} onClick={() => setOpenDeleteDialog(true)}>
                    <TrashIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>

            <EditVoucherModal token={currentUser.token} voucherId={voucherId} isModalOpen={openEditVoucherModal} setIsModalOpen={setOpenEditVoucherModal} setOpenSnackbar={setOpenEditSnackbar} />
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openEditSnackbar} autoHideDuration={2000} onClose={handleCloseEditSnackbar}>
                <Alert onClose={handleCloseEditSnackbar} severity="success" sx={{ width: "100%" }}>
                    Chỉnh sửa sản phẩm thành công
                </Alert>
            </Snackbar>
            
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Vô hiệu hóa voucher
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn vô hiệu hóa voucher này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                        <Button onClick={() => handleActiveInactiveVoucher("Inactive")}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Vô hiệu hóa thành công
                </Alert>
            </Snackbar>

            <Dialog
                open={openActiveDialog}
                onClose={handleCloseActiveDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Kích hoạt voucher ?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn kích hoạt lại voucher này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseActiveDialog}>Hủy bỏ</Button>
                        <Button onClick={() => handleActiveInactiveVoucher("Active")}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openActiveSnackbar} autoHideDuration={2000} onClose={handleCloseActiveSnackbar}>
                <Alert onClose={handleCloseActiveSnackbar} severity="success" sx={{ width: "100%" }}>
                    Kích hoạt thành công
                </Alert>
            </Snackbar>

            {/* Delete voucher */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Xoá voucher
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn xóa voucher này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog}>Hủy bỏ</Button>
                        <Button onClick={handleDeleteVoucher}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openDeleteSnackbar} autoHideDuration={2000} onClose={handleCloseDeleteSnackbar}>
                <Alert onClose={handleCloseDeleteSnackbar} severity="success" sx={{ width: "100%" }}>
                    Xóa voucher thành công
                </Alert>
            </Snackbar>
        </Box>
    );
};

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const Voucher = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [allVouchers, setAllVouchers] = useState();
    const [openAddVoucherModal, setOpenAddVoucherModal] = useState(false);
    const [openAddSnackbar, setOpenAddSnackbar] = useState(false);

    const vouchers = useSelector((state: RootState) => state.voucher.allVouchers);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    const getVouchers = async () => {
        setIsLoading(true);

        try {
            const listVouchers = await mainApi.get(
                apiEndpoints.GET_ALL_VOUCHERS,
                apiEndpoints.getAccessToken(currentUser.token)
            );

            setAllVouchers(listVouchers.data.data);
            getTableRows(listVouchers.data.data);
            dispatch(getAllVouchers(listVouchers.data.data));
        } catch (error: any) {
            console.log(error);        
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (voucher: any) => {
                return {
                    id: voucher._id,
                    type: voucher.voucherType === "PERCENT" ? "Giảm theo phần trăm" : "Giảm trực tiếp",
                    value: voucher.voucherType === "PERCENT"
                        ? `${voucher.voucherValue}%`
                        : voucher.voucherValue.toLocaleString("vi-VN", {style : "currency", currency : "VND"}),
                    min: voucher.minOrderPrice.toLocaleString("vi-VN", {style : "currency", currency : "VND"}),
                    end: new Date(voucher.voucherEndDate).toLocaleString()
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
            if (vouchers) {
                setAllVouchers(vouchers);
                getTableRows(vouchers);
            } else {
                getVouchers();
            }
        }
    }, [currentUser, vouchers]);

    useEffect(() => {

    }, [allVouchers]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="15%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Voucher
                </Typography>
                <Button sx={{ backgroundColor: "#716864" }} onClick={() => setOpenAddVoucherModal(true)}>
                    <PlusCircleIcon className="w-6 h-6 text-white" />
                    <Typography className="text-white hidden md:block pl-2" sx={{ fontSize: "0.9rem", fontWeight: "medium" }}>
                        THÊM VOUCHER
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
            <AddVoucherModal token={currentUser.token} isModalOpen={openAddVoucherModal} setIsModalOpen={setOpenAddVoucherModal} setOpenSnackbar={setOpenAddSnackbar} />

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openAddSnackbar} autoHideDuration={2000} onClose={handleCloseAddSnackbar}>
                <Alert onClose={handleCloseAddSnackbar} severity="success" sx={{ width: "100%" }}>
                    Thêm voucher thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Voucher;