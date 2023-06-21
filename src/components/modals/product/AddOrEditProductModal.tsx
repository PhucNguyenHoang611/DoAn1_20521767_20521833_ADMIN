/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Modal, Box, Typography, IconButton, TextField, MenuItem, InputAdornment } from '@mui/material'
import { GridRowId } from '@mui/x-data-grid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useForm, SubmitHandler } from 'react-hook-form'
import ColorsList from '@/components/ColorsList'
import { getAllProds } from '@/redux/reducers/product_reducer'
import { useDispatch } from 'react-redux'

interface ModalProps {
	token: string;
	productId: GridRowId;
	isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Product {
	productName: string;
	productDescription: string;
	productPrice: string;
	productCategoryId: string;
	productSubcategoryId: string;
	productSupplierId: string;
	productLength: string;
	productWidth: string;
	productHeight: string;
	productWeight: string;
}

const AddOrEditProductModal = ({ token, productId, isModalOpen, setIsModalOpen, setOpenSnackbar }: ModalProps) => {
	const dispatch = useDispatch();
	let tempArray: any[] = [];

	const [categories, setCategories] = useState<any[]>([]);
	const [subcategories, setSubcategories] = useState<any[]>([]);
	const [suppliers, setSuppliers] = useState<any[]>([]);
	const [colorsList, setColorsList] = useState<any[]>([{ productColorId: "", colorId: "" }]);
	const [imagesList, setImagesList] = useState<any[]>([]); // { productColorId: "", images: [] }
	const [filesList, setFilesList] = useState<any[]>([{ productColorId: "", files: [] }]); // { productColorId: "", files: [] }
	const [imageIDsToDelete, setImageIDsToDelete] = useState<any[]>([]);
	const [done, setDone] = useState(false);

	const [product, setProduct] = useState<Product>({
		productName: "",
		productDescription: "",
		productPrice: "0",
		productCategoryId: "",
		productSubcategoryId: "",
		productSupplierId: "",
		productLength: "0",
		productWidth: "0",
		productHeight: "0",
		productWeight: "0" });
			
	const { register, handleSubmit } = useForm<Product>();

	const getProduct = async (id: string) => {
		try {
			const product = await mainApi.get(
				apiEndpoints.GET_PRODUCT(id),
				apiEndpoints.getProductId(id)
			);

			const dimension = await mainApi.get(
				apiEndpoints.GET_DIMENSION(id)
			);

			const allColors = await mainApi.get(
				apiEndpoints.GET_ALL_PRODUCT_COLORS(id)
			);
			
			const prodImages = allColors.data.data.map(async (color: any, index: any) => {
                const images = await mainApi.get(
                    apiEndpoints.GET_ALL_PRODUCT_IMAGES_BY_COLOR(id, color._id)
                );

				tempArray = [
					...tempArray,
					{ key: index, productColorId: color._id, images: images.data.data }
				];
            })
			await Promise.all(prodImages);

			await allColors.data.data.map((_color: any, index: any) => {
				tempArray.map((item: any) => {
					if (item.key === index) {
						setImagesList((prevImagesList) => {
							const updatedImagesList = [
								...prevImagesList,
								item
							];
							return updatedImagesList;
						});
					}
				})
            })
			
			const currentProduct: Product = {
				productName: product.data.data.productName,
				productDescription: product.data.data.productDescription,
				productPrice: product.data.data.productPrice,
				productCategoryId: product.data.data.productCategoryId,
				productSubcategoryId: product.data.data.productSubcategoryId,
				productSupplierId: product.data.data.productSupplierId,
				productLength: dimension.data.data[0].productLength,
				productWidth: dimension.data.data[0].productWidth,
				productHeight: dimension.data.data[0].productHeight,
				productWeight: dimension.data.data[0].productWeight
			};
			
			setColorsList(allColors.data.data);
			setProduct(currentProduct);
			setDone(true);
		} catch (error) {
			console.error(error);
		}
	}

	const getCategories = async () => {
		try {
			const result = await mainApi.get(
				apiEndpoints.GET_ALL_CATEGORIES
			);

			setCategories(result.data.data);
		} catch (error) {
			console.log(error);
		}
	}

	const getSubcategories = async () => {
		try {
			const result = await mainApi.get(
				apiEndpoints.GET_ALL_SUBCATEGORIES
			);

			setSubcategories(result.data.data);
		} catch (error) {
			console.log(error);
		}
	}

	const getSuppliers = async () => {
		try {
			const result = await mainApi.get(
				apiEndpoints.GET_ALL_SUPPLIERS
			);

			setSuppliers(result.data.data);
		} catch (error) {
			console.log(error);
		}
	}
	
	const handleClose = () => {
		setIsModalOpen(false);
	};

	const handleAddProduct: SubmitHandler<Product> = async (data) => {
		// console.log(data);
		// console.log(colorsList);
		// console.log(imagesList);
		// console.log(filesList);

		setOpenSnackbar(true);

		try {
			const product = await mainApi.post(
				apiEndpoints.CREATE_PRODUCT,
				apiEndpoints.getProductBody(
					data.productName,
					data.productDescription,
					data.productPrice,
					data.productCategoryId,
					data.productSubcategoryId,
					data.productSupplierId
				),
                apiEndpoints.getAccessToken(token)
			);

			await mainApi.post(
				apiEndpoints.ADD_DIMENSION(product.data.data._id),
				apiEndpoints.getDimensionBody(
					data.productLength,
					data.productWidth,
					data.productHeight,
					data.productWeight
				),
				apiEndpoints.getAccessToken(token)
			);

			Promise.all(
				colorsList.map(async (color: any, index: any) => {
					const productColor = await mainApi.post(
						apiEndpoints.ADD_PRODUCT_COLOR(product.data.data._id),
						apiEndpoints.getProductColorBody(color.colorId),
						apiEndpoints.getAccessToken(token)
					);
					
					if (filesList[index].files.length > 0) {
						filesList[index].files.map(async (file: any) => {
							const formData = new FormData();
							formData.append("productColorId", productColor.data.data._id);
							formData.append("Files[]", file.originFileObj);
	
							await mainApi.post(
								apiEndpoints.SAVE_PRODUCT_IMAGE(product.data.data._id),
								formData,
								apiEndpoints.getAccessToken(token)
							);
						})
					}
				})
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

		setIsModalOpen(false);
	}

	const handleEditProduct: SubmitHandler<Product> = async () => {
		// console.log(product);
		// console.log(colorsList);
		// console.log(imagesList);
		// console.log(filesList);
		// console.log(imageIDsToDelete)
		// console.log(imageIDsToDelete);

		setOpenSnackbar(true);

		try {
			await mainApi.put(
				apiEndpoints.UPDATE_PRODUCT(productId.toString()),
				apiEndpoints.getProductBody(
					product.productName,
					product.productDescription,
					product.productPrice,
					product.productCategoryId,
					product.productSubcategoryId,
					product.productSupplierId
				),
				apiEndpoints.getAccessToken(token)
			);

			const productDimension = await mainApi.get(
				apiEndpoints.GET_DIMENSION(productId.toString())
			);

			await mainApi.put(
				apiEndpoints.UPDATE_DIMENSION(productDimension.data.data[0]._id),
				apiEndpoints.getDimensionBody(
					product.productLength,
					product.productWidth,
					product.productHeight,
					product.productWeight
				),
				apiEndpoints.getAccessToken(token)
			);

			Promise.all(
				colorsList.map(async (color: any, index: any) => {
					if (!color._id) { 
						const productColor = await mainApi.post(
							apiEndpoints.ADD_PRODUCT_COLOR(productId.toString()),
							apiEndpoints.getProductColorBody(color.colorId),
							apiEndpoints.getAccessToken(token)
						);

						if (filesList[index].files.length > 0) {
							filesList[index].files.map(async (file: any) => {
								const formData = new FormData();
								formData.append("productColorId", productColor.data.data._id);
								formData.append("Files[]", file.originFileObj);
		
								await mainApi.post(
									apiEndpoints.SAVE_PRODUCT_IMAGE(productId.toString()),
									formData,
									apiEndpoints.getAccessToken(token)
								);
							})
						}
					} else {
						if (filesList[index].files.length > 0) {
							filesList[index].files.map(async (file: any) => {
								const formData = new FormData();
								formData.append("productColorId", color._id);
								formData.append("Files[]", file.originFileObj);

								await mainApi.post(
									apiEndpoints.SAVE_PRODUCT_IMAGE(productId.toString()),
									formData,
									apiEndpoints.getAccessToken(token)
								);
							})
						}
					}
				})
			);

			if (imageIDsToDelete.length > 0) {
				Promise.all(
					imageIDsToDelete.map(async (image: any) => {
						await mainApi.delete(
							apiEndpoints.DELETE_PRODUCT_IMAGE(image.productImageId),
							apiEndpoints.getAccessToken(token)
						);
					})
				);
			}

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
		} catch (error: any) {
			console.log(error);
		}

		setIsModalOpen(false);
	}

	useEffect(() => {
		if (isModalOpen) {
			getCategories();
			getSubcategories();
			getSuppliers();
			if (productId) {
				if (!done) {
					getProduct(productId.toString());
				}
			}
		} else {
			setProduct({
				productName: "",
				productDescription: "",
				productPrice: "0",
				productCategoryId: "",
				productSubcategoryId: "",
				productSupplierId: "",
				productLength: "0",
				productWidth: "0",
				productHeight: "0",
				productWeight: "0"
			});
			setCategories([]);
			setSubcategories([]);
			setSuppliers([]);
			setColorsList([{ productColorId: "", colorId: "" }]);
			setImagesList([]);
			setFilesList([{ productColorId: "", files: [] }]);
			setImageIDsToDelete([]);
			setDone(false);
		}
	}, [isModalOpen, productId]);

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
					width: "60%",
					height: "90%",
					overflowY: "auto" }}>
					<Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
						{productId ?
							<Typography sx={{
								fontWeight: "bold",
								fontSize: "1.5rem",
								color: "black"
							}}>
								Chỉnh sửa sản phẩm
							</Typography>
							:
							<Typography sx={{
								fontWeight: "bold",
								fontSize: "1.5rem",
								color: "black"
							}}>
								Thêm sản phẩm
							</Typography>
						}
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
						<form onSubmit={handleSubmit(productId ? handleEditProduct : handleAddProduct)} className="w-full flex flex-col">
							{/* Tên sản phẩm */}
							<Box width="100%" sx={{mb: 2}}>
								<TextField fullWidth autoComplete="off" {...register("productName")} required label="Tên sản phẩm" placeholder="Nhập tên sản phẩm" value={product.productName}
									onChange={(event) => {
										setProduct((product: Product) => {
											const updatedProduct: Product = {
												...product,
												productName: event.target.value
											};

											return updatedProduct;
										});
									}} />
							</Box>

							{/* Mô tả sản phẩm */}
							<Box width="100%" sx={{mb: 2}}>
								<TextField fullWidth autoComplete="off" {...register("productDescription")} label="Mô tả" placeholder="Nhập mô tả sản phẩm" value={product.productDescription}
									onChange={(event) => {
										setProduct((product: Product) => {
											const updatedProduct: Product = {
												...product,
												productDescription: event.target.value
											};

											return updatedProduct;
										});
									}} />
							</Box>

							{/* Loại sản phẩm */}
							<Box width="100%" display="flex" sx={{mb: 2}}>
								<Box width="50%" height="100%">
									<TextField fullWidth select {...register("productCategoryId")} required label="Loại sản phẩm" value={(categories.length > 0) ? product.productCategoryId : ""}
										onChange={(event) => {
											setProduct((product: Product) => {
												const updatedProduct: Product = {
													...product,
													productCategoryId: event.target.value
												};

												return updatedProduct;
											});
										}}>
										{categories.map((option) => (
											<MenuItem key={option._id} value={option._id}>
												{option.categoryName}
											</MenuItem>
										))}
									</TextField>
								</Box>
								<Box width="50%" height="100%" sx={{ml: 2}}>
									<TextField fullWidth select {...register("productSubcategoryId")} required label="Loại phòng" value={(subcategories.length > 0) ? product.productSubcategoryId : ""}
										onChange={(event) => {
											setProduct((product: Product) => {
												const updatedProduct: Product = {
													...product,
													productSubcategoryId: event.target.value
												};

												return updatedProduct;
											});
										}}>
										{subcategories.map((option) => (
											<MenuItem key={option._id} value={option._id}>
												{option.subcategoryName}
											</MenuItem>
										))}
									</TextField>
								</Box>
							</Box>

							{/* Giá sản phẩm */}
							<Box width="100%" sx={{mb: 2}}>
								<TextField fullWidth type="number" autoComplete="off" {...register("productPrice")} required label="Giá" placeholder="Nhập giá sản phẩm" value={product.productPrice}
									InputProps={{
										inputProps: {
											min: 1,
											max: 100000000000,
											step: 1
										}
									}}
									onChange={(event) => {
										setProduct((product: Product) => {
											const updatedProduct: Product = {
												...product,
												productPrice: event.target.value
											};

											return updatedProduct;
										});
									}} />
							</Box>

							{/* Nhà cung cấp */}
							<Box width="100%" sx={{mb: 2}}>
								<TextField fullWidth select {...register("productSupplierId")} required label="Nhà cung cấp" value={(suppliers.length > 0) ? product.productSupplierId : ""}
									onChange={(event) => {
										setProduct((product: Product) => {
											const updatedProduct: Product = {
												...product,
												productSupplierId: event.target.value
											};

											return updatedProduct;
										});
									}}>
									{suppliers.map((option) => (
										<MenuItem key={option._id} value={option._id}>
											{option.supplierName}
										</MenuItem>
									))}
								</TextField>
							</Box>

							{/* Kích thước */}
							<Box width="100%" display="flex" sx={{mb: 2}}>
								<Box width="20%" height="100%">
									<TextField fullWidth type="number" {...register("productLength")} required label="Chiều dài" value={product.productLength}
										InputProps={{
											inputProps: {
												min: 0.01,
												max: 50,
												step: "any"
											},
											endAdornment: <InputAdornment position="end">m</InputAdornment>
										}}
										onChange={(event) => {
											setProduct((product: Product) => {
												const updatedProduct: Product = {
													...product,
													productLength: event.target.value
												};

												return updatedProduct;
											});
										}}>
									</TextField>
								</Box>
								<Box width="20%" height="100%" sx={{ml: 2}}>
									<TextField fullWidth type="number" {...register("productWidth")} required label="Chiều rộng" value={product.productWidth}
										InputProps={{
											inputProps: {
												min: 0.01,
												max: 50,
												step: "any"
											},
											endAdornment: <InputAdornment position="end">m</InputAdornment>
										}}
										onChange={(event) => {
											setProduct((product: Product) => {
												const updatedProduct: Product = {
													...product,
													productWidth: event.target.value
												};

												return updatedProduct;
											});
										}}>
									</TextField>
								</Box>
								<Box width="20%" height="100%" sx={{ml: 2}}>
									<TextField fullWidth type="number" {...register("productHeight")} required label="Chiều cao" value={product.productHeight}
										InputProps={{
											inputProps: {
												min: 0.01,
												max: 50,
												step: "any"
											},
											endAdornment: <InputAdornment position="end">m</InputAdornment>
										}}
										onChange={(event) => {
											setProduct((product: Product) => {
												const updatedProduct: Product = {
													...product,
													productHeight: event.target.value
												};

												return updatedProduct;
											});
										}}>
									</TextField>
								</Box>
								<Box width="40%" height="100%" sx={{ml: 2}}>
									<TextField fullWidth type="number" {...register("productWeight")} required label="Trọng lượng" value={product.productWeight}
										InputProps={{
											inputProps: {
												min: 0.01,
												max: 5000,
												step: "any"
											},
											endAdornment: <InputAdornment position="end">kg</InputAdornment>
										}}
										onChange={(event) => {
											setProduct((product: Product) => {
												const updatedProduct: Product = {
													...product,
													productWeight: event.target.value
												};

												return updatedProduct;
											});
										}}>
									</TextField>
								</Box>
							</Box>

							{/* Màu */}
							<Box width="100%" sx={{mb: 2}}>
								<ColorsList
									productId={productId}
									done={done}
									colorsList={colorsList}
									setColorsList={setColorsList}
									imagesList={imagesList}
									filesList={filesList}
									setFilesList={setFilesList}
									setImageIDsToDelete={setImageIDsToDelete} />
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

export default AddOrEditProductModal;