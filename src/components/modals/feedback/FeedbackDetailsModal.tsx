/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import Rating from '@mui/material/Rating'
import TextArea from "antd/es/input/TextArea";
import { useDispatch } from "react-redux";
import { getFeedbacks } from "@/redux/reducers/feedback_reducer";

interface Feedback {
    feedbackTitle: string;
    feedbackContent: string;
    orderCode: string;
    customerEmail: string;
    productName: string;
    productColor: string;
    feedbackRating: number;
    feedbackDate: string;
    feedbackResponse: string;
}

const FeedbackDetailsModal = ({ token, feedbackId, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const [currentFeedback, setCurrentFeedback] = useState<Feedback>({
        feedbackTitle: "",
        feedbackContent: "",
        orderCode: "",
        customerEmail: "",
        productName: "",
        productColor: "",
        feedbackRating: 0,
        feedbackDate: "",
        feedbackResponse: ""
    });

    const [imageURLsList, setImageURLsList] = useState<string[]>([]);
    const [response, setResponse] = useState("");
    const [viewImage, setViewImage] = useState(false);
    const [viewImageURL, setViewImageURL] = useState("");
    const [check, setCheck] = useState(false);
	const dispatch = useDispatch();

    const getFeedbackDetails = async () => {
        try {
            const feedback = await mainApi.get(
                apiEndpoints.GET_FEEDBACK(feedbackId)
            );

            const orderCode = await getOrder(feedback.data.data.orderId);
            const customerEmail = await getCustomer(feedback.data.data.customerId);
            const productName = await getProduct(feedback.data.data.productId);
            const productColor = await getProductColor(feedback.data.data.productColorId);

            if (feedback.data.data.feedbackResponse)
                setResponse(feedback.data.data.feedbackResponse)

            const currFeedback: Feedback = {
                feedbackTitle: feedback.data.data.feedbackTitle,
                feedbackContent: feedback.data.data.feedbackContent,
                orderCode: orderCode,
                customerEmail: customerEmail,
                productName: productName,
                productColor: productColor,
                feedbackRating: feedback.data.data.feedbackRating,
                feedbackDate: new Date(feedback.data.data.createdAt).toLocaleDateString(),
                feedbackResponse: feedback.data.data.feedbackResponse ? feedback.data.data.feedbackResponse : ""
            };

            setCurrentFeedback(currFeedback);
            getFeedbackImages();
        } catch (error) {
            console.log(error);
        }
    }

    const getFeedbackImages = async () => {
        try {
            const result = await mainApi.get(
                apiEndpoints.GET_ALL_FEEDBACK_IMAGES(feedbackId)
            );

            setImageURLsList(result.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getOrder = async (id: string) => {
        try {
            const order = await mainApi.get(
                apiEndpoints.GET_ORDER(id)
            );
            
            return order.data.data.orderCode;
        } catch (error) {
            console.log(error);
        }
    }

    const getCustomer = async (id: string) => {
        try {
            const customer = await mainApi.get(
                apiEndpoints.GET_CUSTOMER(id)
            );
            
            return customer.data.data.customerEmail;
        } catch (error) {
            console.log(error);
        }
    }

    const getProduct = async (id: string) => {
        try {
            const product = await mainApi.get(
                apiEndpoints.GET_PRODUCT(id)
            );
            
            return product.data.data.productName;
        } catch (error) {
            console.log(error);
        }
    }

    const getProductColor = async (id: string) => {
        try {
            const product = await mainApi.get(
                apiEndpoints.GET_PRODUCT_COLOR(id)
            );
            
            return product.data.color.colorName;
        } catch (error) {
            console.log(error);
        }
    }

    const handleRespondToFeedback = async () => {
        if (response == "") {
            setCheck(true);
        } else {
            try {
                await mainApi.put(
                    apiEndpoints.RESPOND_TO_FEEDBACK(feedbackId),
                    apiEndpoints.getRespondToFeedbackBody(response),
                    apiEndpoints.getAccessToken(token)
                );

                const result = await mainApi.get(
                    apiEndpoints.GET_ALL_FEEDBACKS
                );

                dispatch(getFeedbacks(result.data.data));
            } catch (error) {
                console.log(error);
            }
    
            setOpenSnackbar(true);
            setIsModalOpen(false);
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

    const onChangeResponse = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setResponse(e.target.value.toString());
    };

    useEffect(() => {
        if (isModalOpen) {
            getFeedbackDetails();
        } else {
            setCurrentFeedback({
                feedbackTitle: "",
                feedbackContent: "",
                orderCode: "",
                customerEmail: "",
                productName: "",
                productColor: "",
                feedbackRating: 0,
                feedbackDate: "",
                feedbackResponse: ""
            });
            setResponse("");
            setCheck(false);
        }
    }, [isModalOpen]);
    
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
                    height: "max-content",
                    overflowY: "auto" }}>
                    <Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                color: "black"
                            }}>
                                Chi tiết đánh giá
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
                                        Đánh giá:
                                </Typography>
                            </Box>
                            <Box width="80%" display="flex" alignItems="center">
                                <Rating value={currentFeedback.feedbackRating} precision={0.5} readOnly />
                                <Typography sx={{
                                        ml: 1,
                                        fontWeight: "bold",
                                        fontSize: "1.5rem",
                                        color: "black"
                                    }}>
                                        {currentFeedback.feedbackRating} sao
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
                                        Tiêu đề:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        overflowWrap: "break-word"
                                    }}>
                                        {currentFeedback?.feedbackTitle || "Không có tiêu đề"}
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
                                        Nội dung:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        overflowWrap: "break-word"
                                    }}>
                                        {currentFeedback?.feedbackContent}
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
                                        Ngày viết:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentFeedback?.feedbackDate}
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
                                        Email khách hàng:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentFeedback?.customerEmail}
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
                                        Mã đơn hàng:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        #{currentFeedback?.orderCode}
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
                                        {currentFeedback?.productName}
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
                                        Màu sản phẩm:
                                </Typography>
                            </Box>
                            <Box width="80%">
                                <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {currentFeedback?.productColor}
                                </Typography>
                            </Box>
                        </Box>

                        <Box width="100%" sx={{ borderBottom: "1px solid gray", mb: 2 }}></Box>
                        
                        <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
                            <Box width="10%" sx={{ mr: 6 }}>
                                <Typography sx={{
                                        fontWeight: "medium",
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        Ảnh đính kèm:
                                </Typography>
                            </Box>
                            <Box width="90%" display="flex">
                                {(imageURLsList.length > 0) && imageURLsList.map((img: any, i: number) => (
                                    <Box key={i} sx={{ border: "1px solid #B8ACA5", borderRadius: "5px", ml: 0.5, p: 0.5 }}>
                                        <img src={img.imageURL} className="cursor-pointer" style={{ width: "7rem" }} onClick={() => zoomImage(img.imageURL)}/>
                                    </Box>
                                ))}
                                {(imageURLsList.length == 0) && (
                                    <Typography sx={{
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        Không có hình ảnh đính kèm
                                    </Typography>
                                )}
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

                        <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
                            <Box width="10%" sx={{ mr: 6 }}>
                                <Typography sx={{
                                        fontWeight: "medium",
                                        fontSize: "1.1rem",
                                        color: "black",
                                        whiteSpace: "nowrap"
                                    }}>
                                        Phản hồi:
                                </Typography>
                            </Box>
                            <Box width="90%" display="flex" flexDirection="column">
                                <TextArea showCount maxLength={200} value={response} onChange={onChangeResponse} disabled={currentFeedback.feedbackResponse != "" ? true : false} />
                                {check && (
                                    <Typography sx={{
                                            fontSize: "1.0rem",
                                            color: "#DE5656"
                                        }}>
                                            Không được để trống phần này
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        
                        <Box width="100%" display="flex" justifyContent="end" alignItems="center" sx={{ my: 2 }}>
                            <button type="button" onClick={handleClose} className="bg-white text-lg text-primary-0 border-2 border-primary-0 rounded-sm p-2">Hủy bỏ</button>
                            {currentFeedback.feedbackResponse == "" && (
                                <button type="button" onClick={handleRespondToFeedback} className="bg-primary-0 text-lg text-white border-2 border-primary-0 ml-2 rounded-sm p-2">Phản hồi</button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default FeedbackDetailsModal;