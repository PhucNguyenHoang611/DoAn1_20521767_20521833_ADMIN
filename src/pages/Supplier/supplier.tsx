/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { getAllSuppliers } from "@/redux/reducers/auth_reducer";
import { DataGrid, GridCellParams, GridColDef, GridRowId } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddSupplierModal from "@/components/modals/supplier/AddSupplierModal";
import EditSupplierModal from "@/components/modals/supplier/EditSupplierModal";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 230
    },
    {
        field: "name",
        headerName: "Tên",
        width: 250
    },
    {
        field: "country",
        headerName:"Quốc gia",
        width: 150
    },
    {
        field: "address",
        headerName:"Địa chỉ",
        width: 300
    },
    {
        field: "action",
        headerName: "",
        width: 180,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell supplierId={params.id} />
    }
];

interface RenderCellProps {
    supplierId: GridRowId;
}
const RenderCell = ({ supplierId }: RenderCellProps) => {
    const dispatch = useDispatch();
    const [openEditSupplierModal, setOpenEditSupplierModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [openEditSnackbar, setOpenEditSnackbar] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openFailedSnackbar, setOpenFailedSnackbar] = useState(false);
    

    const currentToken = useSelector((state: RootState) => state.auth.currentUser.token);

    const handleEditSupplier = () => {
        setOpenEditSupplierModal(true);
    }

    const handleDeleteSupplier = async () => {
        try {
            await mainApi.delete(
                apiEndpoints.DELETE_SUPPLIER(supplierId.toString()),
                apiEndpoints.getAccessToken(currentToken)
            );

            const suppliers = await mainApi.get(
                apiEndpoints.GET_ALL_SUPPLIERS
            );

            dispatch(getAllSuppliers(suppliers.data.data));
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            
            if (errorMessage === "This supplier can't be deleted") {
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
                <IconButton size="small" sx={{ backgroundColor: "#A67F78", mr: 3 }} onClick={handleEditSupplier}>
                    <PencilSquareIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
                <IconButton size="small" sx={{ backgroundColor: "#DE5656" }} onClick={() => setOpenDialog(true)}>
                    <TrashIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
                
            <EditSupplierModal token={currentToken} supplierId={supplierId} isModalOpen={openEditSupplierModal} setIsModalOpen={setOpenEditSupplierModal} setOpenSnackbar={setOpenEditSnackbar} />
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Xóa nhà cung cấp
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn xóa nhà cung cấp này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                        <Button onClick={handleDeleteSupplier}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Xóa nhà cung cấp thành công
                </Alert>
            </Snackbar>

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openFailedSnackbar} autoHideDuration={2000} onClose={handleCloseFailedSnackbar}>
                <Alert onClose={handleCloseFailedSnackbar} severity="error" sx={{ width: "100%" }}>
                    Không thể xóa do đang có sản phẩm của nhà cung cấp này
                </Alert>
            </Snackbar>

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openEditSnackbar} autoHideDuration={2000} onClose={handleCloseEditSnackbar}>
                <Alert onClose={handleCloseEditSnackbar} severity="success" sx={{ width: "100%" }}>
                    Chỉnh sửa nhà cung cấp thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const Supplier = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const dispatch = useDispatch();
    const [allSuppliers, setAllSuppliers] = useState();
    const [openCreateSupplierModal, setOpenCreateSupplierModal] = useState(false);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const suppliersList = useSelector((state: RootState) => state.auth.allSuppliers);
    const [openAddSnackbar, setOpenAddSnackbar] = useState(false);

    const getSuppliers = async () => {
        setIsLoading(true);
        try {
            const suppliers = await mainApi.get(
                apiEndpoints.GET_ALL_SUPPLIERS
            );

            setAllSuppliers(suppliers.data.data);
            dispatch(getAllSuppliers(suppliers.data.data));
            getTableRows(suppliers.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (supplier: any) => {
                return {
                    id: supplier._id,
                    name: supplier.supplierName,
                    country: supplier.supplierCountry,
                    address: supplier.supplierAddress
                };
            })
        );
        setTableRows(rows);
        setIsLoading(false);
    }

    const handleCreateSupplier = () => {
        setOpenCreateSupplierModal(true);
    }

    const handleCloseAddSnackbar = () => {
        setOpenAddSnackbar(false);
    }

    useEffect(() => {
        if (currentUser) {
            if (suppliersList) {
                setAllSuppliers(suppliersList);
                getTableRows(suppliersList);
            } else {
                getSuppliers();
            }
        }
    }, [currentUser, suppliersList]);

    useEffect(() => {

    }, [allSuppliers]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="15%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Nhà cung cấp
                </Typography>
                {(currentUser.privilege === 0) && (
                    <Button sx={{ backgroundColor: "#716864" }} onClick={handleCreateSupplier}>
                        <PlusCircleIcon className="w-6 h-6 text-white" />
                        <Typography className="text-white hidden md:block pl-2" sx={{ fontSize: "0.9rem", fontWeight: "medium" }}>
                            THÊM NHÀ CUNG CẤP
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
            <AddSupplierModal token={currentUser.token} isModalOpen={openCreateSupplierModal} setIsModalOpen={setOpenCreateSupplierModal} setOpenSnackbar={setOpenAddSnackbar} />

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openAddSnackbar} autoHideDuration={2000} onClose={handleCloseAddSnackbar}>
                <Alert onClose={handleCloseAddSnackbar} severity="success" sx={{ width: "100%" }}>
                    Thêm nhà cung cấp thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Supplier;