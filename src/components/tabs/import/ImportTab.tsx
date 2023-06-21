/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainApi } from "@/api/main_api";
import * as apiEndpoints from '@/api/api_endpoints'
import AddItemModal from "@/components/modals/import/AddItemModal";
import EditItemModal from "@/components/modals/import/EditItemModal";
import { getAllImportItems } from "@/redux/reducers/import_reducer";
import { RootState } from "@/redux/store";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "STT",
        width: 60
    },
    {
        field: "productId",
        headerName: "Mã sản phẩm",
        width: 160
    },
    {
        field: "name",
        headerName: "Tên sản phẩm",
        width: 160
    },
    {
        field: "supplier",
        headerName: "Nhà cung cấp",
        width: 140
    },
    {
        field: "color",
        headerName:"Màu",
        width: 120
    },
    {
        field: "unitPrice",
        headerName: "Đơn giá",
        width: 140
    },
    {
        field: "quantity",
        headerName: "Số lượng",
        width: 90
    },
    {
        field: "total",
        headerName: "Tổng",
        width: 140
    },
    {
        field: "action",
        headerName: "",
        width: 140,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell index={params.id} />
    }
];

interface RenderCellProps {
    index: GridRowId;
}
const RenderCell = ({ index }: RenderCellProps) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
    const [openItemDetailsModal, setOpenItemDetailsModal] = useState(false);
    const importItems = useSelector((state: RootState) => state.import.importItems);
    const dispatch = useDispatch();

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    const handleCloseDeleteSnackbar = () => {
        setOpenDeleteSnackbar(false)
    }

    const handleDelete = () => {
        setOpenDeleteSnackbar(true);
        const temp1 = importItems.filter((item: any) => item.id !== index);

        const temp2 = temp1.map((item: any, i: number) => {
            return {
                id: i + 1,
                productId: item.productId,
                name: item.name,
                supplierId: item.supplierId,
                supplier: item.supplier,
                productColorId: item.productColorId,
                color: item.color,
                colorHex: item.colorHex,
                uPrice: item.uPrice,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                total: item.total
            }
        })

        dispatch(getAllImportItems(temp2));
        setOpenDeleteDialog(false);
    }

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Chỉnh sửa">
                <IconButton onClick={() => setOpenItemDetailsModal(true)} size="small" sx={{ backgroundColor: "#A67F78", mr: 3 }}>
                    <PencilSquareIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <EditItemModal itemIndex={index} isModalOpen={openItemDetailsModal} setIsModalOpen={setOpenItemDetailsModal} />

            <Tooltip title="Xóa">
                <IconButton onClick={() => setOpenDeleteDialog(true)} size="small" sx={{ backgroundColor: "#DE5656" }}>
                    <TrashIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Xóa sản phẩm
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn muốn xóa sản phẩm này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog}>Hủy bỏ</Button>
                        <Button onClick={handleDelete}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openDeleteSnackbar} autoHideDuration={2000} onClose={handleCloseDeleteSnackbar}>
                <Alert onClose={handleCloseDeleteSnackbar} severity="success" sx={{ width: "100%" }}>
                    Xóa sản phẩm thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const ImportTab = ({ getAllImports }: any) => {
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmSnackbar, setOpenConfirmSnackbar] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [impDetailsList, setImpDetailsList] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const importItems = useSelector((state: RootState) => state.import.importItems);
    const dispatch = useDispatch();

    const handleDeleteAll = () => {
        setImpDetailsList([]);
        dispatch(getAllImportItems([]));
        setOpenDeleteAllDialog(false);
    }

    const handleConfirm = async () => {
        setOpenConfirmSnackbar(true);

        if (impDetailsList.length > 0) {
            const createImp = await mainApi.post(
                apiEndpoints.CREATE_IMPORT,
                apiEndpoints.getImportBody(currentUser.id, new Date()),
                apiEndpoints.getAccessToken(currentUser.token)
            );

            await Promise.all(impDetailsList.map(async (imp : any) => {
                await mainApi.post(
                    apiEndpoints.CREATE_IMPORT_DETAILS,
                    apiEndpoints.getImportDetailsBody(
                        createImp.data.data._id,
                        imp.productId,
                        imp.supplierId,
                        imp.productColorId,
                        imp.productQuantity    
                    ),
                    apiEndpoints.getAccessToken(currentUser.token)
                );
            }));
        }

        setImpDetailsList([]);
        dispatch(getAllImportItems([]));
        getAllImports();
        setOpenConfirmDialog(false);
    }

    const handleCloseDeleteAllDialog = () => {
        setOpenDeleteAllDialog(false);
    }

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    }

    const handleCloseConfirmSnackbar = () => {
        setOpenConfirmSnackbar(false);
    }

    useEffect(() => {
        if (impDetailsList.length > 0) {
            let sum = 0;

            impDetailsList.forEach((imp: any) => {
                sum += imp.totalPrice
            });

            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }

        setTableRows(importItems);
    }, [impDetailsList, importItems]);

    useEffect(() => {
        if (importItems.length > 0) {
            setImpDetailsList([]);
            importItems.forEach((item: any) => {
                setImpDetailsList((prev: any) => {
                    const updatedList = [
                        ...prev,
                        {
                            productId: item.productId,
                            productColorId: item.productColorId,
                            supplierId: item.supplierId,
                            productQuantity: item.quantity,
                            totalPrice: item.totalPrice
                        }
                    ];
        
                    return updatedList;
                })
            });
        } else {
            setImpDetailsList([]);
        }
    }, [importItems]);

    return (
        <Box width="100%" height="100%">

            <Box width="100%" height="10%" display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 4, mb: 2 }}>
                <Box height="100%" display="flex" alignItems="center">
                    <Box sx={{ mr: 4 }}>
                        <Typography sx={{
                                fontWeight: "medium",
                                fontSize: "1.1rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                Mã nhân viên:
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{
                                fontStyle: "italic",
                                fontSize: "1.1rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                {currentUser.id}
                        </Typography>
                    </Box>
                </Box>
                <Box height="100%" display="flex" alignItems="center">
                    <Box sx={{ mr: 4 }}>
                        <Typography sx={{
                                fontWeight: "medium",
                                fontSize: "1.1rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                Tên nhân viên:
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{
                                fontSize: "1.1rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                {currentUser.lastName + " " + currentUser.firstName}
                        </Typography>
                    </Box>
                </Box>
                <Box height="100%" display="flex" alignItems="center">
                    <Box sx={{ mr: 4 }}>
                        <Typography sx={{
                                fontWeight: "medium",
                                fontSize: "1.1rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                Tổng giá trị:
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{
                                fontSize: "1.5rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                {totalPrice.toLocaleString("vi-VN", {style : "currency", currency : "VND"})}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box width="100%" height="90%">
                <Box width="100%" height="10%" display="flex" justifyContent="end" alignItems="center" sx={{ mb: 1 }}>
                    <Button
                        onClick={() => setOpenAddModal(true)}
                        sx={{
                            border: "2px solid #886059",
                            backgroundColor: "#886059",
                            color: "white",
                            mr: 2,
                            width: "9rem"
                        }}>
                            Thêm sản phẩm
                    </Button>
                    <AddItemModal
                        tableRows={tableRows}
                        isModalOpen={openAddModal}
                        setIsModalOpen={setOpenAddModal} />
                    <Button
                        onClick={() => setOpenDeleteAllDialog(true)}
                        sx={{
                            border: "2px solid #886059",
                            backgroundColor: "white",
                            color: "#886059",
                            mr: 2,
                            width: "9rem"
                        }}>
                            Xóa tất cả
                    </Button>
                    <Dialog
                        open={openDeleteAllDialog}
                        onClose={handleCloseDeleteAllDialog}
                        aria-labelledby="dialog-title">
                            <DialogTitle id="dialog-title">
                                Xoá tất cả
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                                    Bạn có chắc muốn xóa tất cả sản phẩm ?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDeleteAllDialog}>Hủy bỏ</Button>
                                <Button onClick={handleDeleteAll}>Xác nhận</Button>
                            </DialogActions>
                    </Dialog>
                </Box>
                <Box width="100%" height="70%" display="flex" justifyContent="center" alignItems="center">
                    <DataGrid 
                        rows={tableRows}
                        columns={tableColumns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5
                                }
                            }
                        }}
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                        sx={{ fontSize: "1rem" }}
                        slots={{
                            noRowsOverlay: NoRowsOverlay
                        }} />
                </Box>
                <Box width="100%" height="10%" display="flex" justifyContent="end" alignItems="center" sx={{ mt: 1 }}>
                    <Button
                        onClick={() => setOpenConfirmDialog(true)}
                        sx={{
                            border: "2px solid #32435F",
                            backgroundColor: "#32435F",
                            color: "white",
                            mr: 2,
                            width: "10rem"
                        }}>
                            Yêu cầu nhập kho
                    </Button>
                    <Dialog
                        open={openConfirmDialog}
                        onClose={handleCloseConfirmDialog}
                        aria-labelledby="dialog-title">
                            <DialogTitle id="dialog-title">
                                Xác nhận
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                                    Gửi yêu cầu nhập kho ?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseConfirmDialog}>Hủy bỏ</Button>
                                <Button onClick={handleConfirm}>Xác nhận</Button>
                            </DialogActions>
                    </Dialog>
                    <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openConfirmSnackbar} autoHideDuration={2000} onClose={handleCloseConfirmSnackbar}>
                        <Alert onClose={handleCloseConfirmSnackbar} severity="success" sx={{ width: "100%" }}>
                            Gửi yêu cầu thành công
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>

        </Box>
    )
}

export default ImportTab;