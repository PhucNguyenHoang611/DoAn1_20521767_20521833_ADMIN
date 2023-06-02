/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainApi } from "@/api/main_api"
import * as apiEndpoints from '@/api/api_endpoints'
import { useEffect, useState } from "react"
import { RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { getAllColors } from '@/redux/reducers/color_reducer'
import { Box, Button, IconButton, MenuItem, TextField, Tooltip, Typography } from "@mui/material"
import React from "react"
import { MinusCircleIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import ImagesUploader from "./ImagesUploader"

const ColorsList = ({ productId, done, colorsList, setColorsList, imagesList, filesList, setFilesList, setImageIDsToDelete }: any) => {
    const dispatch = useDispatch();
    const [allColors, setAllColors] = useState<any[]>([]);
    const [imageURLsList, setImageURLsList] = useState<any[]>([]);
    const [URLsList, setURLsList] = useState<any[]>([{ imagesURLs: [] }]);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const all_Colors = useSelector((state: RootState) => state.color.allColors);

    const getColors = async () => {
        try {
            const colors = await mainApi.get(
                apiEndpoints.GET_ALL_COLORS
            );

            setAllColors(colors.data.data);
            dispatch(getAllColors(colors.data.data));
        } catch (error: any) {
            console.log(error);
        }
    }

    const getAllImageURLs = async () => {
        try {
            setImageURLsList([]);
            setURLsList([]);
            setFilesList([]);
            
            for (let indexProdColor = 0; indexProdColor < imagesList.length; indexProdColor++) {
                const productColor = imagesList[indexProdColor];
                const imgURLsList: any[] = [];
              
                for (let indexImage = 0; indexImage < productColor.images.length; indexImage++) {
                    const image = productColor.images[indexImage];
                    const img = await mainApi.get(
                        apiEndpoints.PREVIEW_ATTACHMENT(image.productImage)
                    );
                
                    const imageURLObj = {
                        key: indexImage,
                        productImageId: image._id,
                        productColorId: productColor.productColorId,
                        imageURL: img.data.attachmentURL
                    };
                
                    imgURLsList.push(imageURLObj);
                }
              
                setImageURLsList(prevImageURLsList => [
                    ...prevImageURLsList,
                    { key: indexProdColor, imagesURLs: imgURLsList }
                ]);
              
                setURLsList(prevURLsList => [
                    ...prevURLsList,
                    { key: indexProdColor, imagesURLs: imgURLsList }
                ]);
              
                setFilesList((prevFilesList: any) => [
                    ...prevFilesList,
                    { key: indexProdColor, productColorId: productColor.productColorId, files: [] }
                ]);
            }
              
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleSelectColor = (productColorId: any, colorId: any, index: any) => {
        setColorsList(colorsList.map((color: any, i: any) => {
            return i === index ? { ...color, productColorId: productColorId, colorId: colorId } : { ...color }
        }));

        setFilesList(filesList.map((color: any, i: any) => {
            return i === index ? { ...color, productColorId: productColorId, files: color.files } : { ...color }
        }));
    }

    const handleAddColor = () => {
        setColorsList([...colorsList, { productColorId: "", colorId: "" }]);
        setURLsList([...URLsList, { imagesURLs: [] }]);
        setFilesList([...filesList, { productColorId: "", files: [] }]);
    }

    const handleDeleteColor = (index: any) => {
        setColorsList(colorsList.filter((_color: any, i: any) => i !== index));
        setURLsList(URLsList.filter((_color: any, i: any) => i !== index));
        setFilesList(filesList.filter((_color: any, i: any) => i !== index));
    }

    useEffect(() => {
        if (currentUser) {
            if (imagesList.length > 0) {
                if (done) {
                    getAllImageURLs();
                }
            }

            if (all_Colors) {
                setAllColors(all_Colors);
            } else {
                getColors();
            }
        }
    }, [currentUser, all_Colors, imagesList, done]);

    return (
        <Box width="100%">
            {colorsList.map((productColor: any, index: any) => (
                <React.Fragment key={index}>
                    <Box width="100%" display="flex" sx={{mb: 2}}>
                        <Box width={(!productColor._id && colorsList.length > 1) ? "95%" : "100%"} sx={(!productColor._id && colorsList.length > 1) ? {mr: 2} : {}}>
                            <TextField
                                fullWidth
                                select
                                required
                                disabled={(productId && productColor._id) ? true : false}
                                label="Màu"
                                value={(allColors.length > 0) ? productColor.colorId : ""}
                                onChange={(event) => {
                                    handleSelectColor(productColor._id, event.target.value, index);
                                }}>

                                {allColors.map((color: any) => (
                                    <MenuItem key={color._id} value={color._id}>
                                        <Box width="100%" height="100%" display="flex">
                                            <MinusCircleIcon className="h-6 w-6 mr-4" style={{ fill: color.colorHex, color: color.colorHex }} />
                                            {color.colorName}
                                        </Box>
                                    </MenuItem>
                                ))}

                            </TextField>
                        </Box>
                        {!productColor._id && colorsList.length > 1 && (
                            <Box width="5%" display="flex" justifyContent="center" alignItems="center">
                                <Tooltip title="Xóa màu">
                                    <IconButton size="small" sx={{ backgroundColor: "#DE5656" }} onClick={() => handleDeleteColor(index)}>
                                        <XMarkIcon className="w-5 h-5 text-white" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>
                    {productColor.colorId && (
                        <Box width="100%" display="flex" flexDirection="column" sx={{mb: 2}}>
                            <Typography className="hidden md:block pr-4 whitespace-nowrap" sx={{ fontSize: "1rem", fontWeight: "medium" }}>
                                ẢNH SẢN PHẨM:
                            </Typography>
                            <Box width="100%">
                                <ImagesUploader
                                    index={index}
                                    URLsList={URLsList}
                                    setURLsList={setURLsList}
                                    filesList={filesList}
                                    setFilesList={setFilesList}
                                    setImageIDsToDelete={setImageIDsToDelete} />
                            </Box>
                        </Box>
                    )}
                </React.Fragment>
            ))}
                <Button sx={{ backgroundColor: "#32435F" }} onClick={handleAddColor}>
                    <PlusCircleIcon className="w-6 h-6 text-white" />
                    <Typography className="text-white hidden md:block pl-2" sx={{ fontSize: "0.8rem", fontWeight: "medium" }}>
                        Thêm màu
                    </Typography>
                </Button>
        </Box>
    )
}

export default ColorsList;