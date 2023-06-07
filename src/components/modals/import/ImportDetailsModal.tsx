/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainApi } from "@/api/main_api";
import * as apiEndpoints from '@/api/api_endpoints'
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
	token: string;
	importId: GridRowId;
	isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "STT",
        width: 70
    },
    {
        field: "productId",
        headerName: "Mã sản phẩm",
        width: 190
    },
    {
        field: "name",
        headerName: "Tên sản phẩm",
        width: 180
    },
    {
        field: "supplier",
        headerName: "Nhà cung cấp",
        width: 160
    },
    {
        field: "color",
        headerName:"Màu",
        width: 120
    },
    {
        field: "unitPrice",
        headerName: "Đơn giá",
        width: 160
    },
    {
        field: "quantity",
        headerName: "Số lượng",
        width: 100
    },
    {
        field: "total",
        headerName: "Tổng",
        width: 160
    },
];

const ImportDetailsModal = ({ token, importId, isModalOpen, setIsModalOpen }: ModalProps) => {
    const [currentImport, setCurrentImport] = useState<any>(null);
    const [currentStaff, setCurrentStaff] = useState<any>(null);
    const [done, setDone] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);

    const getImportDetails = async () => {
        try {
            const imp = await mainApi.get(
                apiEndpoints.GET_IMPORT(importId.toString()),
                apiEndpoints.getAccessToken(token)
            );

            const staff = await mainApi.get(
                apiEndpoints.GET_STAFF(imp.data.data.staffId),
                apiEndpoints.getAccessToken(token)
            );

            const details = await mainApi.get(
                apiEndpoints.GET_DETAILS_FOR_IMPORT(importId.toString()),
                apiEndpoints.getAccessToken(token)
            );

            setCurrentImport(imp.data.data);
            setCurrentStaff(staff.data.data);
            getTableRows(details.data.data);
            setDone(true);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows: any[] = [];

        for (let i = 0; i < result.length; i++) {
            const impDetails = result[i];
            const product = await getProduct(impDetails.productId);
            const supplier = await getSupplier(impDetails.supplierId);
            const color = await getColor(impDetails.productId, impDetails.productColorId);

            const row = {
                id: i + 1,
                productId: impDetails.productId,
                name: product.productName,
                supplier: supplier.supplierName,
                color: color,
                unitPrice: product.productPrice.toLocaleString("vi-VN", {style : "currency", currency : "VND"}),
                quantity: impDetails.productQuantity,
                total: (product.productPrice * impDetails.productQuantity).toLocaleString("vi-VN", {style : "currency", currency : "VND"})
            }

            rows.push(row);
        }

        setTableRows(rows);
    }

    const getProduct = async (id: string) => {
        try {
            const prod = await mainApi.get(
                apiEndpoints.GET_PRODUCT(id)
            );

            return prod.data.data;
        } catch (error: any) {
            console.log(error);
        }
    }

    const getSupplier = async (id: string) => {
        try {
            const supp = await mainApi.get(
                apiEndpoints.GET_SUPPLIER(id)
            );

            return supp.data.data;
        } catch (error: any) {
            console.log(error);
        }
    }

    const getColor = async (id: string, colId: string) => {
        try {
            let temp = "";
            const colors = await mainApi.get(
                apiEndpoints.GET_ALL_PRODUCT_COLORS(id)
            );

            await Promise.all(colors.data.data.map(async (color: any) => {
                if (color._id === colId) {
                    const col = await mainApi.get(
                        apiEndpoints.GET_COLOR(color.colorId)
                    );
                    
                    temp = col.data.data.colorName;
                }
            }));

            return temp;
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleClose = () => {
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (isModalOpen) {
            if (!done) {
                getImportDetails();
            }
        } else {
            setCurrentImport(null);
            setCurrentStaff(null);
            setTableRows([]);
            setDone(false);
        }
    }, [isModalOpen, importId, done]);

    const NoRowsOverlay = () => {
        return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
    };

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
					width: "80%",
					height: "90%",
					overflowY: "auto" }}>
                        <Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                            <Typography sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.5rem",
                                    color: "black"
                                }}>
                                    Chi tiết nhập kho
                            </Typography>
                            <IconButton size="small" onClick={handleClose}>
                                <XMarkIcon className="w-5 h-5 text-black" />
                            </IconButton>
                        </Box>

                        <Box width="100%" height="90%" display="flex" flexDirection="column" sx={{ mt: 4 }}>
                            <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                <Box width="20%" sx={{ mr: 4 }}>
                                    <Typography sx={{
                                            fontWeight: "medium",
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right"
                                        }}>
                                            Mã nhập kho:
                                    </Typography>
                                </Box>
                                <Box width="80%">
                                    <Typography sx={{
                                            fontSize: "1.1rem",
                                            fontStyle: "italic",
                                            color: "black",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {importId}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                <Box width="20%" sx={{ mr: 4 }}>
                                    <Typography sx={{
                                            fontWeight: "medium",
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right"
                                        }}>
                                            Nhân viên yêu cầu:
                                    </Typography>
                                </Box>
                                <Box width="80%">
                                    <Typography sx={{
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {currentStaff?.staffLastName + " " + currentStaff?.staffFirstName}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                <Box width="20%" sx={{ mr: 4 }}>
                                    <Typography sx={{
                                            fontWeight: "medium",
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right"
                                        }}>
                                            Ngày tạo:
                                    </Typography>
                                </Box>
                                <Box width="80%">
                                    <Typography sx={{
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {new Date(currentImport?.importDate).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                                <Box width="20%" sx={{ mr: 4 }}>
                                    <Typography sx={{
                                            fontWeight: "medium",
                                            fontSize: "1.1rem",
                                            color: "black",
                                            whiteSpace: "nowrap",
                                            textAlign: "right"
                                        }}>
                                            Trạng thái:
                                    </Typography>
                                </Box>
                                <Box width="80%">
                                    {currentImport?.importStatus === "Chờ xác nhận" && (
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "#273449",
                                                whiteSpace: "nowrap"
                                            }}>
                                                Chờ xác nhận
                                        </Typography>
                                    )}
                                    {currentImport?.importStatus === "Đã xác nhận" && (
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "#A67F78",
                                                whiteSpace: "nowrap"
                                            }}>
                                                Đã xác nhận
                                        </Typography>
                                    )}
                                    {currentImport?.importStatus === "Đã hủy" && (
                                        <Typography sx={{
                                                fontWeight: "medium",
                                                fontSize: "1.1rem",
                                                color: "#DE5656",
                                                whiteSpace: "nowrap"
                                            }}>
                                                Đã hủy
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
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
                                    sx={{ fontSize: "0.9rem" }}
                                    slots={{
                                        noRowsOverlay: NoRowsOverlay
                                    }} />
                            </Box>
                        </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default ImportDetailsModal;