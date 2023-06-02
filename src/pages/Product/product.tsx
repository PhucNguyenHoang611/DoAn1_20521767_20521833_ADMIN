/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Box, Typography, Button, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Snackbar, 
    Alert} from '@mui/material'
import { DataGrid, GridColDef, GridRowSelectionModel, GridCellParams, GridRowId } from '@mui/x-data-grid'
import {
    PlusCircleIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon } from '@heroicons/react/24/outline'
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getAllProds } from '@/redux/reducers/product_reducer'
import AddOrEditProductModal from '@/components/modals/product/AddOrEditProductModal'

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 220
    },
    {
        field: "name",
        headerName: "Tên sản phẩm",
        width: 220
    },
    {
        field: "category",
        headerName:"Loại sản phẩm",
        width: 140
    },
    {
        field: "subcategory",
        headerName: "Loại phòng",
        width: 140
    },
    {
        field: "price",
        headerName: "Đơn giá",
        width: 140
    },
    {
        field: "action",
        headerName: "",
        width: 220,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell productId={params.id} />
    }
];

interface RenderCellProps {
    productId: GridRowId;
}
const RenderCell = ({ productId }: RenderCellProps) => {
    const dispatch = useDispatch();
    const [openEditProductModal, setOpenEditProductModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const currentToken = useSelector((state: RootState) => state.auth.currentUser.token);

    const handleEditProduct = () => {
        setOpenEditProductModal(true);
    }

    const handleDeleteProduct = async () => {
        setOpenSnackbar(true);
        try {
            await mainApi.put(
                apiEndpoints.ACTIVE_INACTIVE_PRODUCT(productId.toString()),
                apiEndpoints.getProductId(productId.toString()),
                apiEndpoints.getAccessToken(currentToken)
            );

            const productsList = await mainApi.get(
                apiEndpoints.GET_ALL_PRODUCTS
            );

            const filteredProducts = productsList.data.data.filter((product: any) => product.productStatus === true);

            const result = await filteredProducts.map((product: any, index: any) => {
                return {
                    index: index,
                    ...product
                }
            });

            dispatch(getAllProds(result));
        } catch (error) {
            console.log(error);
        }
        setOpenDialog(false);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Chi tiết">
                <IconButton size="small" sx={{ backgroundColor: "#32435F" }}>
                    <EyeIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
                <IconButton size="small" sx={{ backgroundColor: "#A67F78", mx: 3 }} onClick={handleEditProduct}>
                    <PencilSquareIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
                <IconButton size="small" sx={{ backgroundColor: "#DE5656" }} onClick={() => setOpenDialog(true)}>
                    <TrashIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            <AddOrEditProductModal token={currentToken} productId={productId} isModalOpen={openEditProductModal} setIsModalOpen={setOpenEditProductModal} />
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Xóa sản phẩm
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn xóa sản phẩm này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                        <Button onClick={handleDeleteProduct}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Xóa sản phẩm thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const Product = () => {
    const [tableRows, setTableRows] = useState<any[]>([]);
    const dispatch = useDispatch();
    const [allProducts, setAllProducts] = useState();
    const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const allProds = useSelector((state: RootState) => state.product.allProds);

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const getAllProducts = async () => {
        try {
            const productsList = await mainApi.get(
                apiEndpoints.GET_ALL_PRODUCTS
            );

            const filteredProducts = productsList.data.data.filter((product: any) => product.productStatus === true);

            const result = await filteredProducts.map((product: any, index: any) => {
                return {
                    index: index,
                    ...product
                }
            });

            setAllProducts(result);
            dispatch(getAllProds(result));
            getTableRows(result);
        } catch (error) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (product: any) => {
                const category = await getCategory(product.productCategoryId);
                const subcategory = await getSubcategory(product.productSubcategoryId);

                return {
                    id: product._id,
                    name: product.productName,
                    category: category,
                    subcategory: subcategory,
                    price: product.productPrice.toLocaleString("vi-VN", {style : "currency", currency : "VND"})
                };
            })
        );
        setTableRows(rows);
    }

    const getCategory = async (id: string) => {
        try {
            const category = await mainApi.get(
                apiEndpoints.GET_CATEGORY(id),
                apiEndpoints.getCategoryId(id)
            );
            
            return category.data.data.categoryName;
        } catch (error) {
            console.log(error);
        }
    }

    const getSubcategory = async (id: string) => {
        try {
            const subcategory = await mainApi.get(
                apiEndpoints.GET_SUBCATEGORY(id),
                apiEndpoints.getSubcategoryId(id)
            );

            return subcategory.data.data.subcategoryName;
        } catch (error) {
            console.log(error);
        }
    }

    const handleCreateProduct = () => {
        setOpenCreateProductModal(true);
    }

    useEffect(() => {
        if (currentUser) {
            if (allProds) {
                setAllProducts(allProds);
                getTableRows(allProds);
            } else {
                getAllProducts();
            }
        }
    }, [currentUser, allProds]);

    useEffect(() => {
        
    }, [allProducts]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="15%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Sản phẩm
                </Typography>
                <Button sx={{ backgroundColor: "#716864" }} onClick={handleCreateProduct}>
                    <PlusCircleIcon className="w-6 h-6 text-white" />
                    <Typography className="text-white hidden md:block pl-2" sx={{ fontSize: "0.9rem", fontWeight: "medium" }}>
                        THÊM SẢN PHẨM
                    </Typography>
                </Button>
            </Box>
            <Box width="100%" height="80%" className="px-7 md:px-10">
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
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{ fontSize: "1rem" }}
                    slots={{
                        noRowsOverlay: NoRowsOverlay
                    }}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel} />
            </Box>
            <AddOrEditProductModal token={currentUser.token} productId={""} isModalOpen={openCreateProductModal} setIsModalOpen={setOpenCreateProductModal} />
        </Box>
    )
}

export default Product;