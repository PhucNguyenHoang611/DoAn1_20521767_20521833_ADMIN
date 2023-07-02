/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"

import { baseURL, mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "Mã sản phẩm",
        width: 220
    },
    {
        field: "name",
        headerName: "Tên sản phẩm",
        width: 250
    },
    {
        field: "price",
        headerName: "Đơn giá",
        width: 150
    }
];

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const ApplyDiscountModal = ({ token, discountId, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);

    const [rowSelectionModel, setRowSelectionModel] = useState<any[]>([]);

    const allProds = useSelector((state: RootState) => state.product.allProds);

    const getProductsList = async () => {
        setIsLoading(true);

        try {
            const prodsList = await mainApi.get(
                apiEndpoints.GET_ALL_PRODUCTS
            );

            setAllProducts(prodsList.data.data);
            getTableRows(prodsList.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map((product: any) => {
                return {
                    id: product._id,
                    name: product.productName,
                    price: product.productPrice.toLocaleString("vi-VN", {style : "currency", currency : "VND"})
                };
            })
        );
        setTableRows(rows);
        setIsLoading(false);
    }
    
    const getAllProductsForDiscount = async () => {
        try {
            const prodsList = await mainApi.get(
                apiEndpoints.GET_ALL_PRODUCTS_FOR_DISCOUNT(discountId),
                apiEndpoints.getAccessToken(token)
            );

            if (prodsList.data.data.length > 0) {
                await Promise.all(prodsList.data.data.map((prod: any) => {
                    setRowSelectionModel((prevList: any[]) => {
                        const updatedList: any[] = [
                            ...prevList,
                            prod._id
                        ];

                        return updatedList;
                    });
                }))
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleApplyDiscount = async () => {
        try {
            await axios({
                method: "PUT",
                url: `${baseURL}/discounts/resetDiscount/${discountId}`,
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            await Promise.all(rowSelectionModel.map(async (id: any) => {
                await axios({
                    method: "PUT",
                    url: `${baseURL}/discounts/applyDiscountForProduct/${id}/${discountId}`,
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
            }));
        } catch (error: any) {
            console.log(error);
        }

        setIsModalOpen(false);
        setOpenSnackbar(true);
    }
    
    const handleClose = () => {
        setIsModalOpen(false);
    }
    
    useEffect(() => {
        if (isModalOpen) {
            if (allProds) {
                setAllProducts(allProds);
                getTableRows(allProds);
            } else {
                getProductsList();
            }

            getAllProductsForDiscount();
        } else {
            setRowSelectionModel([]);
        }
    }, [isModalOpen, allProds]);

    useEffect(() => {

    }, [allProducts]);

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
					width: "50%",
					height: "max-content",
					overflowY: "auto" }}>
					<Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "black"
                        }}>
                            Danh sách sản phẩm
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <DataGrid
                            loading={isLoading}
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
                            checkboxSelection
                            disableRowSelectionOnClick
                            rowSelectionModel={rowSelectionModel}
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                setRowSelectionModel(newRowSelectionModel);
                            }}
                            sx={{ fontSize: "1rem" }}
                            slots={{
                                noRowsOverlay: NoRowsOverlay
                            }} />
                        
                        <Box width="100%" display="flex" justifyContent="end" alignItems="center" sx={{ mt: 2 }}>
                            <button type="button" onClick={handleClose} className="bg-white text-lg text-primary-0 border-2 border-primary-0 rounded-sm p-2">Hủy bỏ</button>
                            <button type="button" onClick={handleApplyDiscount} className="bg-primary-0 text-lg text-white border-2 border-primary-0 ml-2 rounded-sm p-2">Xác nhận</button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default ApplyDiscountModal;