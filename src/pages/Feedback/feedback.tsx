/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useEffect, useState } from "react";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { Alert, Box, Button, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getFeedbacks } from "@/redux/reducers/feedback_reducer";
import { RootState } from "@/redux/store";
import { DataGrid, GridCellParams, GridColDef, GridRowId } from "@mui/x-data-grid";
import { EyeIcon } from "@heroicons/react/24/outline";
import FeedbackDetailsModal from "@/components/modals/feedback/FeedbackDetailsModal";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 250
    },
    {
        field: "title",
        headerName: "Tiêu đề",
        width: 250
    },
    {
        field: "product",
        headerName:"Sản phẩm",
        width: 250
    },
    {
        field: "rating",
        headerName:"Đánh giá",
        width: 130
    },
    {
        field: "status",
        headerName:"Trạng thái",
        width: 150
    },
    {
        field: "action",
        headerName: "",
        width: 100,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell feedbackId={params.id} />
    }
];

interface RenderCellProps {
    feedbackId: GridRowId;
}
const RenderCell = ({ feedbackId }: RenderCellProps) => {
    const [openFeedbackDetailsModal, setOpenFeedbackDetailsModal] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const currentToken = useSelector((state: RootState) => state.auth.currentUser.token);

    const handleGetFeedbackDetails = () => {
        setOpenFeedbackDetailsModal(true);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Chi tiết">
                <IconButton size="small" sx={{ backgroundColor: "#32435F" }} onClick={handleGetFeedbackDetails}>
                    <EyeIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
                
            <FeedbackDetailsModal token={currentToken} feedbackId={feedbackId} isModalOpen={openFeedbackDetailsModal} setIsModalOpen={setOpenFeedbackDetailsModal} setOpenSnackbar={setOpenSnackbar} />
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Phản hồi đánh giá thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const Feedback = () => {
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("Tất cả");
    const [tempArray, setTempArray] = useState([]);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const feedbacksList = useSelector((state: RootState) => state.feedback.allFeedbacks);
    const dispatch = useDispatch();

    const getAllFeedbacks = async () => {
        setIsLoading(true);
        try {
            const feedbacksList = await mainApi.get(
                apiEndpoints.GET_ALL_FEEDBACKS
            );

            setAllFeedbacks(feedbacksList.data.data);
            setTempArray(feedbacksList.data.data);
            dispatch(getFeedbacks(feedbacksList.data.data));
            getTableRows(feedbacksList.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (feedback: any) => {
                const product = await getProduct(feedback.productId)
                return {
                    id: feedback._id,
                    title: feedback.feedbackTitle,
                    product: product,
                    rating: feedback.feedbackRating + " sao",
                    status: feedback.feedbackResponse ? "Đã phản hồi" : "Chưa phản hồi"
                };
            })
        );
        setTableRows(rows);
        setIsLoading(false);
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

    useEffect(() => {
        if (currentUser) {
            if (feedbacksList) {
                setAllFeedbacks(feedbacksList);
                setTempArray(feedbacksList);
                getTableRows(feedbacksList);
            } else {
                getAllFeedbacks();
            }
        }
    }, [currentUser, feedbacksList]);

    useEffect(() => {

    }, [allFeedbacks]);

    useEffect(() => {
        if (allFeedbacks.length > 0 && tempArray.length > 0) {
            if (filter === "Đã phản hồi") {
                getTableRows(tempArray.filter((item: any) => item.feedbackResponse));
            } else if (filter === "Chưa phản hồi") {
                getTableRows(tempArray.filter((item: any) => !item.feedbackResponse));
            } else {
                getTableRows(allFeedbacks);
            }
        }
    }, [filter]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="10%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Đánh giá sản phẩm
                </Typography>
            </Box>

            <Box width="100%" height="90%" className="px-7 md:px-10">
                <Box width="100%" height="10%" display="flex" justifyContent="end" alignItems="center">
                    <Tooltip title="Tất cả">
                        <Button size="small" sx={{ width: "7.5rem", backgroundColor: (filter === "Tất cả") ? "#A67F78" : "white", border: "2px solid #A67F78", mr: 1 }} onClick={() => setFilter("Tất cả")}>
                            <Typography
                                sx={{
                                    color: !(filter === "Tất cả") ? "#A67F78" : "white",
                                    fontSize: "0.8rem",
                                    fontWeight: "medium"
                                }}>
                                Tất cả
                            </Typography>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Đã phản hồi">
                        <Button size="small" sx={{ width: "7.5rem", backgroundColor: (filter === "Đã phản hồi") ? "#A67F78" : "white", border: "2px solid #A67F78", mr: 1 }} onClick={() => setFilter("Đã phản hồi")}>
                            <Typography
                                sx={{
                                    color: !(filter === "Đã phản hồi") ? "#A67F78" : "white",
                                    fontSize: "0.8rem",
                                    fontWeight: "medium"
                                }}>
                                Đã phản hồi
                            </Typography>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Chưa phản hồi">
                        <Button size="small" sx={{ width: "7.5rem", backgroundColor: (filter === "Chưa phản hồi") ? "#A67F78" : "white", border: "2px solid #A67F78" }} onClick={() => setFilter("Chưa phản hồi")}>
                            <Typography
                                sx={{
                                    color: !(filter === "Chưa phản hồi") ? "#A67F78" : "white",
                                    fontSize: "0.8rem",
                                    fontWeight: "medium"
                                }}>
                                Chưa phản hồi
                            </Typography>
                        </Button>
                    </Tooltip>
                </Box>
                
                <Box width="100%" height="80%">
                    <DataGrid
                        loading={isLoading}
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
                        disableRowSelectionOnClick
                        sx={{ fontSize: "1rem" }}
                        slots={{
                            noRowsOverlay: NoRowsOverlay
                        }} />
                </Box>
            </Box>
        </Box>
    )
}

export default Feedback;