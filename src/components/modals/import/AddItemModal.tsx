/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MinusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Box, IconButton, MenuItem, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useDispatch } from "react-redux";
import { getAllImportItems } from "@/redux/reducers/import_reducer";

interface Item {
    productId: string;
    productSupplierId: string;
    supplierName: string;
    productColorId: string;
    productPrice: number;
    productQuantity: number;
}

const AddItemModal = ({ tableRows, isModalOpen, setIsModalOpen }: any) => {
    const [currentItem, setCurrentItem] = useState<Item>({
        productId: "",
        productSupplierId: "",
        supplierName: "",
        productColorId: "",
        productPrice: 0,
        productQuantity: 0
    });
    const [name, setName] = useState<any>({ productName: "", colorName: "", colorHex: "" });
    const [productsList, setProductsList] = useState<any[]>([]);
    const [colorsList, setColorsList] = useState<any[]>([]);
	const { register, handleSubmit } = useForm<Item>();

    const dispatch = useDispatch();

    const getProductsList = async () => {
        try {
            const products = await mainApi.get(
                apiEndpoints.GET_ALL_PRODUCTS
            );

            setProductsList(products.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getProductDetails = async (id: string) => {
        try {
            const product = await mainApi.get(
                apiEndpoints.GET_PRODUCT(id)
            );

            const colors = await mainApi.get(
                apiEndpoints.GET_ALL_PRODUCT_COLORS(id)
            );

            await Promise.all(colors.data.data.map(async (color: any, index: number) => {
                const col = await mainApi.get(
                    apiEndpoints.GET_COLOR(color.colorId)
                );

                setColorsList((prevColorsList: any) => {
                    const updatedColorsList = [
                        ...prevColorsList,
                        { key: index, productColorId: color._id, colorName: col.data.data.colorName, colorHex: col.data.data.colorHex }
                    ];

                    return updatedColorsList;
                });  
            }));

            const supplier = await mainApi.get(
                apiEndpoints.GET_SUPPLIER(product.data.data.productSupplierId)
            );

            setCurrentItem((prevItem: Item) => {
                const updatedItem: Item = {
                    ...prevItem,
                    productSupplierId: supplier.data.data._id,
                    supplierName: supplier.data.data.supplierName,
                    productPrice: product.data.data.productPrice
                };

                return updatedItem;
            });
        } catch (error: any) {
            console.log(error);
        }
    }

    const getName = async (prodId: string, colId: string) => {
        let prodName = "";
        let colName = "";
        let colHex = ""
        
        const product = await mainApi.get(
            apiEndpoints.GET_PRODUCT(prodId)
        );
        prodName = product.data.data.productName;

        const colors = await mainApi.get(
            apiEndpoints.GET_ALL_PRODUCT_COLORS(prodId)
        );
        await Promise.all(colors.data.data.map(async (color: any) => {

            if (color._id === colId) {
                const col = await mainApi.get(
                    apiEndpoints.GET_COLOR(color.colorId)
                );

                colName = col.data.data.colorName;
                colHex = col.data.data.colorHex;
            }
        }));

        setName({ productName: prodName, colorName: colName, colorHex: colHex });
    }

    const handleAddItem: SubmitHandler<Item> = (data) => {
        const updatedList = [
            ...tableRows,
            {
                id: tableRows.length + 1,
                productId: data.productId,
                name: name.productName,
                supplierId: currentItem.productSupplierId,
                supplier: currentItem.supplierName,
                productColorId: data.productColorId,
                color: name.colorName,
                colorHex: name.colorHex,
                uPrice: currentItem.productPrice,
                unitPrice: currentItem.productPrice.toLocaleString("vi-VN", {style : "currency", currency : "VND"}),
                quantity: data.productQuantity,
                totalPrice: (currentItem.productPrice * data.productQuantity),
                total: (currentItem.productPrice * data.productQuantity).toLocaleString("vi-VN", {style : "currency", currency : "VND"})
            }
        ];
        dispatch(getAllImportItems(updatedList));

        setIsModalOpen(false);
    }

    const handleClose = () => {
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (isModalOpen) {
            getProductsList();
        } else {
            setCurrentItem({
                productId: "",
                productSupplierId: "",
                supplierName: "",
                productColorId: "",
                productPrice: 0,
                productQuantity: 0
            });
            setProductsList([]);
            setColorsList([]);
            setName({ productName: "", colorName: "", colorHex: "" });
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (currentItem.productId !== "") {
            setColorsList([]);
            setCurrentItem((prevItem: Item) => {
                const updatedItem: Item = {
                    ...prevItem,
                    productSupplierId: "",
                    supplierName: "",
                    productColorId: "",
                    productPrice: 0,
                    productQuantity: 0
                };

                return updatedItem;
            });
            getProductDetails(currentItem.productId);
        }
    }, [currentItem.productId]);

    useEffect(() => {
        if (currentItem.productId !== "" && currentItem.productColorId !== "") {
            getName(currentItem.productId, currentItem.productColorId);
        }
    }, [currentItem.productColorId]);
    
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
					width: "45%",
					height: "75%",
					overflowY: "auto" }}>
                        <Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                            <Typography sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.5rem",
                                    color: "black"
                                }}>
                                    Thêm sản phẩm
                            </Typography>
                            <IconButton size="small" onClick={handleClose}>
                                <XMarkIcon className="w-5 h-5 text-black" />
                            </IconButton>
                        </Box>

                        <Box width="100%" height="90%" display="flex" flexDirection="column" sx={{ mt: 4 }}>
                            <form onSubmit={handleSubmit(handleAddItem)} className="w-full flex flex-col">
                                <Box width="100%" sx={{ mb: 2 }}>
									<TextField fullWidth select {...register("productId")} required label="Sản phẩm" value={(productsList.length > 0) ? currentItem.productId : ""}
										onChange={(event) => {
											setCurrentItem((item: Item) => {
												const updatedItem: Item = {
													...item,
													productId: event.target.value
												};

												return updatedItem;
											});
										}}>
										{productsList.map((option) => (
											<MenuItem key={option._id} value={option._id}>
												{option.productName}
											</MenuItem>
										))}
									</TextField>
								</Box>
                                
                                <Box width="100%" sx={{ mb: 2 }}>
                                    <TextField fullWidth autoComplete="off" required label="Nhà cung cấp" value={currentItem?.supplierName}
                                        inputProps={{
                                            readOnly: true
                                        }} />
                                </Box>

                                <Box width="100%" sx={{ mb: 2 }}>
                                    <TextField fullWidth autoComplete="off" required label="Đơn giá" value={currentItem?.productPrice}
                                        inputProps={{
                                            readOnly: true
                                        }} />
                                </Box>

                                <Box width="100%" sx={{ mb: 2 }}>
									<TextField fullWidth select {...register("productColorId")} required label="Màu" value={(colorsList.length > 0) ? currentItem.productColorId : ""}
										onChange={(event) => {
											setCurrentItem((item: Item) => {
												const updatedItem: Item = {
													...item,
													productColorId: event.target.value
												};

												return updatedItem;
											});
										}}>
										{colorsList.map((option) => (
											<MenuItem key={option.productColorId} value={option.productColorId}>
                                                <Box width="100%" height="100%" display="flex">
                                                    <MinusCircleIcon className="h-6 w-6 mr-4" style={{ fill: option.colorHex, color: option.colorHex }} />
                                                    {option.colorName}
                                                </Box>
											</MenuItem>
										))}
									</TextField>
								</Box>

                                <Box width="100%" sx={{ mb: 2 }}>
                                    <TextField fullWidth type="number" autoComplete="off" {...register("productQuantity")} required label="Số lượng" placeholder="Nhập số lượng sản phẩm" value={currentItem?.productQuantity.toString()}
                                        InputProps={{
                                            inputProps: {
                                                min: 1
                                            }
                                        }}
                                        onChange={(event) => {
                                            setCurrentItem((item: Item) => {
												const updatedItem: Item = {
													...item,
													productQuantity: event.target.value ? parseInt(event.target.value) : 0
												};

												return updatedItem;
											});
                                        }} />
                                </Box>

                                <Box width="100%" display="flex" justifyContent="end" alignItems="center" sx={{ my: 2 }}>
                                    <button type="button" onClick={handleClose} className="bg-white text-lg text-primary-0 border-2 border-primary-0 rounded-sm p-2">Hủy bỏ</button>
                                    <button type="submit" className="bg-primary-0 text-lg text-white border-2 border-primary-0 ml-2 rounded-sm p-2">Xác nhận</button>
                                </Box>

                            </form>
                        </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default AddItemModal;