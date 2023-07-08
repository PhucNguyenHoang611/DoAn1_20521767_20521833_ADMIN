/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { getAllCategories } from "@/redux/reducers/category_reducer";
import { DataGrid, GridCellParams, GridColDef, GridRowId } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddCategoryModal from "@/components/modals/category/AddCategoryModal";
import EditCategoryModal from "@/components/modals/category/EditCategoryModal";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 300
    },
    {
        field: "name",
        headerName: "Loại sản phẩm",
        width: 300
    },
    {
        field: "slug",
        headerName:"Đường dẫn",
        width: 250
    },
    {
        field: "action",
        headerName: "",
        width: 250,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell categoryId={params.id} />
    }
];

interface RenderCellProps {
    categoryId: GridRowId;
}
const RenderCell = ({ categoryId }: RenderCellProps) => {
    const dispatch = useDispatch();
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [openEditSnackbar, setOpenEditSnackbar] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openFailedSnackbar, setOpenFailedSnackbar] = useState(false);
    

    const currentToken = useSelector((state: RootState) => state.auth.currentUser.token);

    const handleEditCategory = () => {
        setOpenEditCategoryModal(true);
    }

    const handleDeleteCategory = async () => {
        try {
            await mainApi.delete(
                apiEndpoints.DELETE_CATEGORY(categoryId.toString()),
                apiEndpoints.getAccessToken(currentToken)
            );

            const categories = await mainApi.get(
                apiEndpoints.GET_ALL_CATEGORIES
            );

            dispatch(getAllCategories(categories.data.data));
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            
            if (errorMessage === "This category can't be deleted") {
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
                <IconButton size="small" sx={{ backgroundColor: "#A67F78", mr: 3 }} onClick={handleEditCategory}>
                    <PencilSquareIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
                <IconButton size="small" sx={{ backgroundColor: "#DE5656" }} onClick={() => setOpenDialog(true)}>
                    <TrashIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
                
            <EditCategoryModal token={currentToken} categoryId={categoryId} isModalOpen={openEditCategoryModal} setIsModalOpen={setOpenEditCategoryModal} setOpenSnackbar={setOpenEditSnackbar} />
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Xóa loại sản phẩm
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn xóa loại sản phẩm này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                        <Button onClick={handleDeleteCategory}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Xóa loại sản phẩm thành công
                </Alert>
            </Snackbar>

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openFailedSnackbar} autoHideDuration={2000} onClose={handleCloseFailedSnackbar}>
                <Alert onClose={handleCloseFailedSnackbar} severity="error" sx={{ width: "100%" }}>
                    Không thể xóa do đang có sản phẩm thuộc loại này
                </Alert>
            </Snackbar>

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openEditSnackbar} autoHideDuration={2000} onClose={handleCloseEditSnackbar}>
                <Alert onClose={handleCloseEditSnackbar} severity="success" sx={{ width: "100%" }}>
                    Chỉnh sửa loại sản phẩm thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const Category = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const dispatch = useDispatch();
    const [allCategories, setAllCategories] = useState();
    const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState(false);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const categoriesList = useSelector((state: RootState) => state.category.allCategories);
    const [openAddSnackbar, setOpenAddSnackbar] = useState(false);

    const getCategories = async () => {
        setIsLoading(true);
        try {
            const categories = await mainApi.get(
                apiEndpoints.GET_ALL_CATEGORIES
            );

            setAllCategories(categories.data.data);
            dispatch(getAllCategories(categories.data.data));
            getTableRows(categories.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (category: any) => {
                return {
                    id: category._id,
                    name: category.categoryName,
                    slug: "/" + category.categorySlug,
                };
            })
        );
        setTableRows(rows);
        setIsLoading(false);
    }

    const handleCreateCategory = () => {
        setOpenCreateCategoryModal(true);
    }

    const handleCloseAddSnackbar = () => {
        setOpenAddSnackbar(false);
    }

    useEffect(() => {
        if (currentUser) {
            if (categoriesList) {
                setAllCategories(categoriesList);
                getTableRows(categoriesList);
            } else {
                getCategories();
            }
        }
    }, [currentUser, categoriesList]);

    useEffect(() => {

    }, [allCategories]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="15%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Loại sản phẩm
                </Typography>
                {(currentUser.privilege === 0) && (
                    <Button sx={{ backgroundColor: "#716864" }} onClick={handleCreateCategory}>
                        <PlusCircleIcon className="w-6 h-6 text-white" />
                        <Typography className="text-white hidden md:block pl-2" sx={{ fontSize: "0.9rem", fontWeight: "medium" }}>
                            THÊM LOẠI SẢN PHẨM
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
            <AddCategoryModal token={currentUser.token} isModalOpen={openCreateCategoryModal} setIsModalOpen={setOpenCreateCategoryModal} setOpenSnackbar={setOpenAddSnackbar} />

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openAddSnackbar} autoHideDuration={2000} onClose={handleCloseAddSnackbar}>
                <Alert onClose={handleCloseAddSnackbar} severity="success" sx={{ width: "100%" }}>
                    Thêm loại sản phẩm thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Category;