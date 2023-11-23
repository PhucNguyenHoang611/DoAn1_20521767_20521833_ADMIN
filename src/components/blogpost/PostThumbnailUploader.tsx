/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import type { RcFile, UploadProps } from 'antd/es/upload';
import { Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { Box, Modal } from '@mui/material';
import { PlusSmallIcon } from '@heroicons/react/24/outline';

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    }
);

const PostThumbnailUploader = ({ setFilesList }: any) => {
    const [fileList, setFileList] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const uploadButton = (
        <div className="font-eb-garamond flex flex-col justify-center items-center">
            <PlusSmallIcon className="h-6 w-6 text-black" />
            <div style={{ marginTop: 8 }}>
                Upload
            </div>
        </div>
    );

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
    
    const handleCancel = () => setPreviewOpen(false);

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
        
        setFilesList((prevFilesList: any) => {
            prevFilesList = newFileList;
            return prevFilesList;
        });
    }

    return (
        <Box width="100%" sx={{ ml: 2 }}>
            <Upload
                customRequest={handleUpload}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                accept="image/*">
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} onClose={handleCancel}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "auto",
                    height: "auto" }}>
                        <img src={previewImage} />
                </Box>
            </Modal>
        </Box>
    )
}

export default PostThumbnailUploader;