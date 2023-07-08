/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { getAllColors } from "@/redux/reducers/auth_reducer";
import { DataGrid, GridCellParams, GridColDef, GridRowId } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddColorModal from "@/components/modals/color/AddColorModal";
import EditColorModal from "@/components/modals/color/EditColorModal";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 300
    },
    {
        field: "name",
        headerName: "Tên màu",
        width: 250
    },
    {
        field: "hex",
        headerName:"Mã màu",
        width: 250
    },
    {
        field: "action",
        headerName: "",
        width: 250,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell colorId={params.id} />
    }
];

interface RenderCellProps {
    colorId: GridRowId;
}
const RenderCell = ({ colorId }: RenderCellProps) => {
    const dispatch = useDispatch();
    const [openEditColorModal, setOpenEditColorModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [openEditSnackbar, setOpenEditSnackbar] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openFailedSnackbar, setOpenFailedSnackbar] = useState(false);

    const currentToken = useSelector((state: RootState) => state.auth.currentUser.token);

    const handleEditColor = () => {
        setOpenEditColorModal(true);
    }

    const handleDeleteColor = async () => {
        try {
            await mainApi.delete(
                apiEndpoints.DELETE_COLOR(colorId.toString()),
                apiEndpoints.getAccessToken(currentToken)
            );

            const colors = await mainApi.get(
                apiEndpoints.GET_ALL_COLORS
            );

            dispatch(getAllColors(colors.data.data));
        } catch (error: any) {
            const errorMessage = error.response.data.error;

            if (errorMessage === "This color can't be deleted") {
                setOpenDialog(false);
                setOpenFailedSnackbar(true);
            }

            return;
        }

        setOpenSnackbar(true);
        setOpenDialog(false);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleCloseFailedSnackbar = () => {
        setOpenFailedSnackbar(false);
    }

    const handleCloseEditSnackbar = () => {
        setOpenEditSnackbar(false);
    }

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Chỉnh sửa">
                <IconButton size="small" sx={{ backgroundColor: "#A67F78", mr: 3 }} onClick={handleEditColor}>
                    <PencilSquareIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
                <IconButton size="small" sx={{ backgroundColor: "#DE5656" }} onClick={() => setOpenDialog(true)}>
                    <TrashIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
                
            <EditColorModal token={currentToken} colorId={colorId} isModalOpen={openEditColorModal} setIsModalOpen={setOpenEditColorModal} setOpenSnackbar={setOpenEditSnackbar} />
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Xóa màu
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn xóa màu này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                        <Button onClick={handleDeleteColor}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Xóa màu thành công
                </Alert>
            </Snackbar>

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openFailedSnackbar} autoHideDuration={2000} onClose={handleCloseFailedSnackbar}>
                <Alert onClose={handleCloseFailedSnackbar} severity="error" sx={{ width: "100%" }}>
                    Không thể xóa do đang có sản phẩm có loại màu này
                </Alert>
            </Snackbar>

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openEditSnackbar} autoHideDuration={2000} onClose={handleCloseEditSnackbar}>
                <Alert onClose={handleCloseEditSnackbar} severity="success" sx={{ width: "100%" }}>
                    Chỉnh sửa màu thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const Color = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const dispatch = useDispatch();
    const [allColors, setAllColors] = useState();
    const [openCreateColorModal, setOpenCreateColorModal] = useState(false);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const colorsList = useSelector((state: RootState) => state.auth.allColors);
    const [openAddSnackbar, setOpenAddSnackbar] = useState(false);

    const getColors = async () => {
        setIsLoading(true);
        try {
            const colors = await mainApi.get(
                apiEndpoints.GET_ALL_COLORS
            );

            setAllColors(colors.data.data);
            dispatch(getAllColors(colors.data.data));
            getTableRows(colors.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (color: any) => {
                return {
                    id: color._id,
                    name: color.colorName,
                    hex: color.colorHex.toUpperCase()
                };
            })
        );
        setTableRows(rows);
        setIsLoading(false);
    }

    const handleCreateColor = () => {
        setOpenCreateColorModal(true);
    }

    const handleCloseAddSnackbar = () => {
        setOpenAddSnackbar(false);
    }

    useEffect(() => {
        if (currentUser) {
            if (colorsList) {
                setAllColors(colorsList);
                getTableRows(colorsList);
            } else {
                getColors();
            }
        }
    }, [currentUser, colorsList]);

    useEffect(() => {

    }, [allColors]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="15%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Màu
                </Typography>
                {(currentUser.privilege === 0) && (
                    <Button sx={{ backgroundColor: "#716864" }} onClick={handleCreateColor}>
                        <PlusCircleIcon className="w-6 h-6 text-white" />
                        <Typography className="text-white hidden md:block pl-2" sx={{ fontSize: "0.9rem", fontWeight: "medium" }}>
                            THÊM MÀU
                        </Typography>
                    </Button>
                )}
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
            <AddColorModal token={currentUser.token} isModalOpen={openCreateColorModal} setIsModalOpen={setOpenCreateColorModal} setOpenSnackbar={setOpenAddSnackbar} />

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openAddSnackbar} autoHideDuration={2000} onClose={handleCloseAddSnackbar}>
                <Alert onClose={handleCloseAddSnackbar} severity="success" sx={{ width: "100%" }}>
                    Thêm màu thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Color;