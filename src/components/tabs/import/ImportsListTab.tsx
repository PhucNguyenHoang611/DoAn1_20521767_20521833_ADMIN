/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridCellParams, GridRowId } from '@mui/x-data-grid'
import { useEffect, useState } from "react";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CheckIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ImportDetailsModal from "@/components/modals/import/ImportDetailsModal";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "Mã nhập kho",
        width: 250
    },
    {
        field: "name",
        headerName: "Tên nhân viên",
        width: 250
    },
    {
        field: "date",
        headerName:"Ngày tạo",
        width: 200
    },
    {
        field: "status",
        headerName: "Trạng thái",
        width: 200
    },
    {
        field: "action",
        headerName: "",
        width: 250,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell importId={params.id} />
    }
];

interface RenderCellProps {
    importId: GridRowId;
}
const RenderCell = ({ importId }: RenderCellProps) => {
    const [openImportDetailsModal, setOpenImportDetailsModal] = useState(false);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmSnackbar, setOpenConfirmSnackbar] = useState(false);

    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [openCancelSnackbar, setOpenCancelSnackbar] = useState(false);

    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const [imp, setImp] = useState<any>();

    const getImport = async () => {
        try {
            const result = await mainApi.get(
                apiEndpoints.GET_IMPORT(importId.toString()),
                apiEndpoints.getAccessToken(currentUser.token)
            );

            setImp(result.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleConfirmImport = async () => {
        setOpenConfirmSnackbar(true);

        // try {
        //     await mainApi.put(
        //         apiEndpoints.CONFIRM_IMPORT(importId.toString()),
        //         apiEndpoints.getAccessToken(currentUser.token)
        //     );
        // } catch (error: any) {
        //     console.log(error);
        // }

        setOpenConfirmDialog(false);
    }

    const handleCancelImport = async () => {
        setOpenCancelSnackbar(true);

        // try {
        //     await mainApi.put(
        //         apiEndpoints.CANCEL_IMPORT(importId.toString()),
        //         apiEndpoints.getAccessToken(currentUser.token)
        //     );
        // } catch (error: any) {
        //     console.log(error);
        // }

        setOpenCancelDialog(false);
    }

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    }
    const handleCloseConfirmSnackbar = () => {
        setOpenConfirmSnackbar(false);
    }

    const handleCloseCancelDialog = () => {
        setOpenCancelDialog(false);
    }
    const handleCloseCancelSnackbar = () => {
        setOpenCancelSnackbar(false);
    }

    useEffect(() => {
        if (!imp) {
            getImport();
        }
    }, [importId]);

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="start" alignItems="center">
            <Tooltip title="Chi tiết">
                <IconButton onClick={() => setOpenImportDetailsModal(true)} size="small" sx={{ backgroundColor: "#32435F" }}>
                    <EyeIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <ImportDetailsModal token={currentUser.token} importId={importId} isModalOpen={openImportDetailsModal} setIsModalOpen={setOpenImportDetailsModal} />

            {currentUser.privilege === 0 && imp?.importStatus === "Chờ xác nhận" && (
                <>
                    <Tooltip title="Xác nhận">
                        {/* #32C232 */}
                        <IconButton onClick={() => setOpenConfirmDialog(true)} size="small" sx={{ backgroundColor: "#A67F78", mx: 3 }}>
                            <CheckIcon className="w-5 h-5 text-white" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Hủy">
                        <IconButton onClick={() => setOpenCancelDialog(true)} size="small" sx={{ backgroundColor: "#DE5656" }}>
                            <XMarkIcon className="w-5 h-5 text-white" />
                        </IconButton>
                    </Tooltip>
                </>
            )}

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Xác nhận yêu cầu nhập kho
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn muốn xác nhận yêu cầu nhập kho ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmDialog}>Hủy bỏ</Button>
                        <Button onClick={handleConfirmImport}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openConfirmSnackbar} autoHideDuration={2000} onClose={handleCloseConfirmSnackbar}>
                <Alert onClose={handleCloseConfirmSnackbar} severity="success" sx={{ width: "100%" }}>
                    Xác nhận yêu cầu thành công
                </Alert>
            </Snackbar>

            <Dialog
                open={openCancelDialog}
                onClose={handleCloseCancelDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Từ chối yêu cầu nhập kho
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn muốn từ chối yêu cầu nhập kho ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCancelDialog}>Hủy bỏ</Button>
                        <Button onClick={handleCancelImport}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openCancelSnackbar} autoHideDuration={2000} onClose={handleCloseCancelSnackbar}>
                <Alert onClose={handleCloseCancelSnackbar} severity="success" sx={{ width: "100%" }}>
                    Đã từ chối yêu cầu
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const ImportsListTab = ({ filter, setFilter, tableRows, getAllImports }: any) => {
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    useEffect(() => {
        if (currentUser) {
            getAllImports();
        }
    }, [currentUser]);

    return (
        <Box width="100%" height="100%">
            <Box width="100%" height="10%" display="flex" justifyContent="end" alignItems="center">
                <Tooltip title="Tất cả">
                    <Button size="small" sx={{ width: "7.5rem", backgroundColor: (filter === "Tất cả") ? "#A67F78" : "white", border: "2px solid #A67F78" }} onClick={() => setFilter("Tất cả")}>
                        <Typography
                            sx={{
                                color: !(filter === "Tất cả") ? "#A67F78" : "white",
                                fontSize: "0.8rem",
                                fontWeight: "medium"
                            }}>
                            Tất cả
                        </Typography>
                    </Button>
                </Tooltip>
                <Tooltip title="Chờ xác nhận">
                    <Button size="small" sx={{ width: "7.5rem", backgroundColor: (filter === "Chờ xác nhận") ? "#A67F78" : "white", border: "2px solid #A67F78", mx: 1 }} onClick={() => setFilter("Chờ xác nhận")}>
                        <Typography
                            sx={{
                                color: !(filter === "Chờ xác nhận") ? "#A67F78" : "white",
                                fontSize: "0.8rem",
                                fontWeight: "medium"
                            }}>
                            Chờ xác nhận
                        </Typography>
                    </Button>
                </Tooltip>
                <Tooltip title="Đã xác nhận">
                    <Button size="small" sx={{ width: "7.5rem", backgroundColor: (filter === "Đã xác nhận") ? "#A67F78" : "white", border: "2px solid #A67F78", mr: 1 }} onClick={() => setFilter("Đã xác nhận")}>
                        <Typography
                            sx={{
                                color: !(filter === "Đã xác nhận") ? "#A67F78" : "white",
                                fontSize: "0.8rem",
                                fontWeight: "medium"
                            }}>
                            Đã xác nhận
                        </Typography>
                    </Button>
                </Tooltip>
                <Tooltip title="Đã hủy">
                    <Button size="small" sx={{ width: "7.5rem", backgroundColor: (filter === "Đã hủy") ? "#A67F78" : "white", border: "2px solid #A67F78" }} onClick={() => setFilter("Đã hủy")}>
                        <Typography
                            sx={{
                                color: !(filter === "Đã hủy") ? "#A67F78" : "white",
                                fontSize: "0.8rem",
                                fontWeight: "medium"
                            }}>
                            Đã hủy
                        </Typography>
                    </Button>
                </Tooltip>
            </Box>
            <Box width="100%" height="90%" sx={{ mt: 2 }}>
                <DataGrid
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
        </Box>
    )
}

export default ImportsListTab;