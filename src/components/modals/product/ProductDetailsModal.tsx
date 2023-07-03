/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, IconButton, Modal, Tooltip, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { Product } from "./AddOrEditProductModal"
import { XMarkIcon } from "@heroicons/react/24/outline"

const ProductDetailsModal = ({ productId, isModalOpen, setIsModalOpen }: any) => {
    let tempArray: any[] = [];
    let tempArrayForColor: any[] = [];

    const [currentProduct, setCurrentProduct] = useState<Product>({
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
    const [currentQuantity, setCurrentQuantity] = useState(0);
    const [currentSold, setCurrentSold] = useState(0);
    const [currentCategory, setCurrentCategory] = useState<any>(null);
    const [currentSubcategory, setCurrentSubcategory] = useState<any>(null);
    const [currentSupplier, setCurrentSupplier] = useState<any>(null);
    const [selectedColor, setSelectedColor] = useState<any>({ key: 0 });
    const [colorsList, setColorsList] = useState<any[]>([]);
    const [imageURLsList, setImageURLsList] = useState<any[]>([]);
    const [viewImage, setViewImage] = useState(false);
    const [viewImageURL, setViewImageURL] = useState("");
	const [done, setDone] = useState(false);

    const getProductDetails = async (id: string) => {
        try {
            const product = await mainApi.get(
                apiEndpoints.GET_PRODUCT(id),
                apiEndpoints.getProductId(id)
            );

            setCurrentQuantity(product.data.data.productQuantity);
            setCurrentSold(product.data.data.productSold);

            const dimension = await mainApi.get(
				apiEndpoints.GET_DIMENSION(id)
			);

            const category = await mainApi.get(
                apiEndpoints.GET_CATEGORY(product.data.data.productCategoryId),
                apiEndpoints.getCategoryId(product.data.data.productCategoryId)
            );
            setCurrentCategory(category.data.data);
            
            const subcategory = await mainApi.get(
                apiEndpoints.GET_SUBCATEGORY(product.data.data.productSubcategoryId),
                apiEndpoints.getSubcategoryId(product.data.data.productSubcategoryId)
            );
            setCurrentSubcategory(subcategory.data.data);

            const supplier = await mainApi.get(
                apiEndpoints.GET_SUPPLIER(product.data.data.productSupplierId),
                apiEndpoints.getSupplierId(product.data.data.productSupplierId)
            );
            setCurrentSupplier(supplier.data.data);

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

                const col = await mainApi.get(
                    apiEndpoints.GET_COLOR(color.colorId),
                    apiEndpoints.getColorId(color.colorId)
                )

                tempArrayForColor = [
                    ...tempArrayForColor,
                    { key: index, productColorId: color._id, colorDetails: col.data.data }
                ];
            })
			await Promise.all(prodImages);

			await allColors.data.data.map((_color: any, index: any) => {
				tempArray.map(async (item: any) => {
					if (item.key === index) {

                        const imgURLsList: any[] = [];
              
                        for (let indexImage = 0; indexImage < item.images.length; indexImage++) {
                            const image = item.images[indexImage];
                            const img = await mainApi.get(
                                apiEndpoints.PREVIEW_ATTACHMENT(image.productImage)
                            );
                        
                            const imageURLObj = {
                                key: indexImage,
                                productImageId: image._id,
                                productColorId: item.productColorId,
                                imageURL: img.data.attachmentURL
                            };
                        
                            imgURLsList.push(imageURLObj);
                        }

                        setImageURLsList(prevImageURLsList => [
                            ...prevImageURLsList,
                            { key: index, imagesURLs: imgURLsList }
                        ]);
					}
				})

                tempArrayForColor.map((item: any) => {
					if (item.key === index) {
						setColorsList((prevColorsList) => {
							const updatedColorsList = [
								...prevColorsList,
								item
							];
							return updatedColorsList;
						});
					}
				})
            })

            const currProduct: Product = {
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

            setCurrentProduct(currProduct);
            setDone(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
		setIsModalOpen(false);
	};

    const zoomImage = (url: string) => {
        setViewImageURL(url);
        setViewImage(true);
    }

    const cancelZoomImage = () => {
        setViewImageURL("");
        setViewImage(false);
    }

    useEffect(() => {
        if (isModalOpen) {
            if (!done) {
                getProductDetails(productId);
            }
        } else {
            setCurrentProduct({
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
            setCurrentCategory(null);
            setCurrentSubcategory(null);
            setCurrentSupplier(null);
            setSelectedColor({ key: 0 });
            setColorsList([]);
            setImageURLsList([]);
            setDone(false);
        }
    }, [isModalOpen, productId, done]);
    
    // useEffect(() => {
    //     if (imageURLsList) console.log(imageURLsList);
    // }, [imageURLsList]);

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
                    padding: "2rem",
                    width: "60%",
                    height: "90%",
                    overflowY: "auto" }}>
                    <Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                color: "black"
                            }}>
                                Chi tiết sản phẩm
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
                                        Mã sản phẩm:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        fontStyle: "italic",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {productId}
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
                                        Tên sản phẩm:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentProduct?.productName}
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
                                        Mô tả sản phẩm:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        overflowWrap: "break-word"
                                    }}>
                                        {currentProduct?.productDescription || "Không có mô tả"}
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
                                        Loại sản phẩm:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentCategory?.categoryName || ""}
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
                                        Loại phòng:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentSubcategory?.subcategoryName || ""}
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
                                        Nhà cung cấp:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentSupplier?.supplierName || ""}
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
                                        Giá sản phẩm:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {parseInt(currentProduct?.productPrice).toLocaleString("vi-VN", {style : "currency", currency : "VND"})}
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
                                        Kích thước:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentProduct?.productLength + " m x " + currentProduct?.productWidth + " m x " + currentProduct?.productHeight + " m ( Dài x Rộng x Cao )"}
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
                                        Trọng lượng:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentProduct?.productWeight + " kg"}
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
                                        Số lượng:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentQuantity}
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
                                        Đã bán:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentSold}
                                </Typography>
                            </Box>
                        </Box>
                        <Box width="100%" sx={{ borderBottom: "1px solid gray", mb: 2 }}></Box>
                        <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
                            <Box width="10%" sx={{ mr: 7 }}>
                                <Typography sx={{
                                        fontWeight: "medium",
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        Màu:
                                </Typography>
                            </Box>
                            <Box width="90%">
                                {colorsList?.map((color: any, index: any) => (
                                    <Tooltip key={index} title={color.colorDetails.colorName} onClick={() => setSelectedColor({ key: index })}>
                                        <IconButton size="large" sx={{ border: "1px solid gray", backgroundColor: color.colorDetails.colorHex, mr: 2 }} />
                                    </Tooltip>
                                ))}
                            </Box>
                        </Box>
                        <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
                            <Box width="10%" sx={{ mr: 6 }}>
                                <Typography sx={{
                                        fontWeight: "medium",
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        Ảnh sản phẩm:
                                </Typography>
                            </Box>
                            <Box width="90%" display="flex">
                                {done && imageURLsList.map((color: any) => (
                                    (color.key === selectedColor.key) && color.imagesURLs.map((img: any, i: any) => (
                                        <Box key={i} sx={{ border: "1px solid #B8ACA5", borderRadius: "5px", ml: 0.5, p: 0.5 }}>
                                            <img src={img.imageURL} className="cursor-pointer" style={{ width: "7rem" }} onClick={() => zoomImage(img.imageURL)}/>
                                        </Box>
                                    ))
                                ))}
                            </Box>
                            <Modal open={viewImage} onClose={cancelZoomImage}>
                                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    backgroundColor: "white",
                                    width: "auto",
                                    height: "auto" }}>
                                        <img src={viewImageURL} />
                                </Box>
                            </Modal>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default ProductDetailsModal;