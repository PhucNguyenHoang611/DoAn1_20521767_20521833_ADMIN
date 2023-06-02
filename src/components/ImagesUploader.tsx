/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton, Modal, Tooltip, Typography } from '@mui/material'
import { Upload } from 'antd'
import { useState } from 'react'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { PlusSmallIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    }
);

const ImagesUploader = ({
    index,
    URLsList,
    setURLsList,
    filesList,
    setFilesList,
    setImageIDsToDelete }: any) => {

    const [fileList, setFileList] = useState([]); // filesList.length > 0 ? filesList.filter((color: any) => color.productColorId === productColorId).files : []
    const [deleteAction, setDeleteAction] = useState(false);
    const [viewImage, setViewImage] = useState(false);
    const [viewImageURL, setViewImageURL] = useState("");

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const removeSavedImage = (pos: any, id: string) => {
        const tempArray = URLsList;

        tempArray.map((color: any) => {
            if (color.key === index) {
                color.imagesURLs = color.imagesURLs.filter((image: any) => image.key !== pos);
            }
        })
        
        setURLsList(tempArray);

        setImageIDsToDelete((prevImageIDsToDelete: any) => {
            const updatedImageIDsToDelete = [
                ...prevImageIDsToDelete,
                { productImageId: id }
            ];

            return updatedImageIDsToDelete;
        });
    }

    const zoomImage = (url: string) => {
        setViewImageURL(url);
        setViewImage(true);
    }

    const cancelZoomImage = () => {
        setViewImageURL("");
        setViewImage(false);
    }
    
    const uploadButton = (
        <div className="font-eb-garamond flex flex-col justify-center items-center">
            <PlusSmallIcon className="h-6 w-6 text-black" />
            <div style={{ marginTop: 8 }}>
                Upload
            </div>
        </div>
    );

    const handleCancel = () => setPreviewOpen(false);
    
    const handleUpload = ({ onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
      
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
        
        filesList.map((_color: any, i: any) => {
            if (i === index) {
                setFilesList((prevFilesList: any) => {
                    
                    prevFilesList[i].files = newFileList;
                    
                    return prevFilesList;
                });
            }
        });
    }

    return (
        <Box width="100%" sx={{ mt: 2 }}>
            <Box width="100%" display="flex" justifyContent="start" alignItems="center" sx={{ mb: 2 }}>
                {(URLsList[index] && (URLsList[index].imagesURLs.length > 0)) ? 
                    (
                        <>
                            <Box width="90%" display="flex">
                                {URLsList[index].imagesURLs?.map((image: any, i: any) => (
                                    <Box key={i} display="flex" flexDirection="column" sx={{ border: "1px solid #B8ACA5", borderRadius: "5px", ml: 0.5, p: 0.5 }}>
                                        <XMarkIcon className={`w-5 h-5 text-red-500 absolute cursor-pointer hover:text-red-700 ${deleteAction ? "" : "hidden"}`} onClick={() => removeSavedImage(image.key, image.productImageId)} />
                                        <img src={image.imageURL} className="cursor-pointer" style={{ width: "7rem" }} onClick={() => zoomImage(image.imageURL)}/>
                                    </Box>
                                ))}
                            </Box>
                            <Box width="10%" display="flex" justifyContent="center" alignItems="center">
                                <Tooltip title="Xóa">
                                    <IconButton size="small" sx={{ backgroundColor: "white" }} onClick={() => setDeleteAction(deleteAction ? false : true)}>
                                        <TrashIcon className="w-5 h-5 text-black" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Modal open={viewImage} onClose={cancelZoomImage}>
                                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    backgroundColor: "white",
                                    width: "max-content",
                                    height: "max-content" }}>
                                    <img src={viewImageURL} />
                                </Box>
                            </Modal>
                        </>
                    )
                    :
                    (
                        <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                            Chưa có hình ảnh
                        </Box>
                    )
                }
            </Box>
            {URLsList[index] && (URLsList[index].imagesURLs.length < 6) && (
                <Box width="100%" display="flex" justifyContent="start" alignItems="center">
                    <Typography className="text-black whitespace-nowrap" sx={{ mr: 2 }}>
                        Thêm ảnh:
                    </Typography>
                    <Upload
                        customRequest={handleUpload}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        accept="image/*">
                        {(URLsList[index].imagesURLs.length + fileList.length) >= 6 ? null : uploadButton}
                    </Upload>
                </Box>
            )}
            <Modal open={previewOpen} onClose={handleCancel}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white" }}>
                    <img className="object-cover" src={previewImage} />
                </Box>
            </Modal>
        </Box>
    )
}

export default ImagesUploader;