/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/redux/store";
import { ClipboardDocumentListIcon, PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { baseURL, mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import AddDiscountModal from "@/components/modals/discount/AddDiscountModal";
import { getAllDiscounts } from "@/redux/reducers/auth_reducer";
import EditDiscountModal from "@/components/modals/discount/EditDiscountModal";
import ApplyDiscountModal from "@/components/modals/discount/ApplyDiscountModal";
import axios from "axios";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 220
    },
    {
        field: "name",
        headerName: "Tên",
        width: 250
    },
    {
        field: "percent",
        headerName:"% Giảm",
        width: 120
    },
    {
        field: "start",
        headerName: "Bắt đầu",
        width: 180
    },
    {
        field: "end",
        headerName: "Kết thúc",
        width: 180
    },
    {
        field: "action",
        headerName: "",
        width: 180,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell discountId={params.id} />
    }
];

interface RenderCellProps {
    discountId: GridRowId;
}
const RenderCell = ({ discountId }: RenderCellProps) => {
    const dispatch = useDispatch();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openApplySnackbar, setOpenApplySnackbar] = useState(false);
    const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
    const [openProductsListModal, setOpenProductsListModal] = useState(false);
    const [openEditDiscountModal, setOpenEditDiscountModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    const handleDeleteDiscount = async () => {
        setOpenDeleteSnackbar(true);

        try {
            await axios({
                method: "PUT",
                url: `${baseURL}/discounts/resetDiscount/${discountId.toString()}`,
                headers: {
                    Authorization: "Bearer " + currentUser.token
                }
            });

            await mainApi.delete(
                apiEndpoints.DELETE_DISCOUNT(discountId.toString()),
                apiEndpoints.getAccessToken(currentUser.token)
            );

            const listDiscounts = await mainApi.get(
                apiEndpoints.GET_ALL_DISCOUNTS
            );

            dispatch(getAllDiscounts(listDiscounts.data.data));
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleCloseApplySnackbar = () => {
        setOpenApplySnackbar(false);
    }

    const handleCloseDeleteSnackbar = () => {
        setOpenDeleteSnackbar(false);
    }

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Danh sách sản phẩm">
                <IconButton size="small" sx={{ backgroundColor: "#32435F" }} onClick={() => setOpenProductsListModal(true)}>
                    <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <ApplyDiscountModal token={currentUser.token} discountId={discountId} isModalOpen={openProductsListModal} setIsModalOpen={setOpenProductsListModal} setOpenSnackbar={setOpenApplySnackbar} />
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openApplySnackbar} autoHideDuration={2000} onClose={handleCloseApplySnackbar}>
                <Alert onClose={handleCloseApplySnackbar} severity="success" sx={{ width: "100%" }}>
                    Áp dụng giảm giá thành công
                </Alert>
            </Snackbar>
            
            <Tooltip title="Chỉnh sửa">
                <IconButton size="small" sx={{ backgroundColor: "#A67F78", mx: 3 }} onClick={() => setOpenEditDiscountModal(true)}>
                    <PencilSquareIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <EditDiscountModal token={currentUser.token} discountId={discountId} isModalOpen={openEditDiscountModal} setIsModalOpen={setOpenEditDiscountModal} setOpenSnackbar={setOpenSnackbar} />
            <Tooltip title="Xóa">
                <IconButton size="small" sx={{ backgroundColor: "#DE5656" }} onClick={() => setOpenDeleteDialog(true)}>
                    <TrashIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Chỉnh sửa đợt giảm giá thành công
                </Alert>
            </Snackbar>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Hủy đợt giảm giá
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn hủy đợt giảm giá này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog}>Hủy bỏ</Button>
                        <Button onClick={handleDeleteDiscount}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openDeleteSnackbar} autoHideDuration={2000} onClose={handleCloseDeleteSnackbar}>
                <Alert onClose={handleCloseDeleteSnackbar} severity="success" sx={{ width: "100%" }}>
                    Hủy đợt giảm giá thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const Discount = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [allDiscounts, setAllDiscounts] = useState();
    const [openAddDiscountModal, setOpenAddDiscountModal] = useState(false);
    const [openAddSnackbar, setOpenAddSnackbar] = useState(false);
    const discounts = useSelector((state: RootState) => state.auth.allDiscounts);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    const getDiscounts = async () => {
        setIsLoading(true);

        try {
            const listDiscounts = await mainApi.get(
                apiEndpoints.GET_ALL_DISCOUNTS
            );

            setAllDiscounts(listDiscounts.data.data);
            getTableRows(listDiscounts.data.data);
            dispatch(getAllDiscounts(listDiscounts.data.data));
        } catch (error: any) {
            console.log(error);
        }
    }
    
    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (discount: any) => {
                return {
                    id: discount._id,
                    name: discount.discountName,
                    percent: discount.discountPercent,
                    start: new Date(discount.discountStartDate).toLocaleString(),
                    end: new Date(discount.discountEndDate).toLocaleString()
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
            if (discounts) {
                setAllDiscounts(discounts);
                getTableRows(discounts);
            } else {
                getDiscounts();
            }
        }
    }, [currentUser, discounts]);

    useEffect(() => {

    }, [allDiscounts]);
    
    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="15%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Giảm giá sản phẩm 
                </Typography>
                <Button sx={{ backgroundColor: "#716864" }} onClick={() => setOpenAddDiscountModal(true)}>
                    <PlusCircleIcon className="w-6 h-6 text-white" />
                    <Typography className="text-white hidden md:block pl-2" sx={{ fontSize: "0.9rem", fontWeight: "medium" }}>
                        THÊM ĐỢT GIẢM GIÁ
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
            <AddDiscountModal token={currentUser.token} isModalOpen={openAddDiscountModal} setIsModalOpen={setOpenAddDiscountModal} setOpenSnackbar={setOpenAddSnackbar} />

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openAddSnackbar} autoHideDuration={2000} onClose={handleCloseAddSnackbar}>
                <Alert onClose={handleCloseAddSnackbar} severity="success" sx={{ width: "100%" }}>
                    Thêm đợt giảm giá thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Discount;