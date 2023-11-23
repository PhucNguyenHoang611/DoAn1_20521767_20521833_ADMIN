/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeIcon, EyeSlashIcon, PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlogPosts } from '@/redux/reducers/blog_post_reducer';

import { mainApi, baseURL } from '@/api/main_api';
import * as apiEndpoints from '@/api/api_endpoints';
import { RootState } from '@/redux/store';
import AddOrEditBlogPostModal from '@/components/modals/blogpost/AddOrEditBlogPostModal';
import axios from 'axios';

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "Mã bài viết",
        width: 250
    },
    {
        field: "title",
        headerName: "Tiêu đề",
        width: 270
    },
    {
        field: "author",
        headerName:"Tác giả",
        width: 200
    },
    {
        field: "tag",
        headerName: "Thẻ",
        width: 200
    },
    {
        field: "action",
        headerName: "",
        width: 200,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell blogPostId={params.id} />
    }
];

interface RenderCellProps {
    blogPostId: GridRowId;
}
const RenderCell = ({ blogPostId }: RenderCellProps) => {
    const dispatch = useDispatch();

    const [openEditBlogPostModal, setOpenEditBlogPostModal] = useState(false);
    const [openEditSnackbar, setOpenEditSnackbar] = useState(false);

    const [openHideDialog, setOpenHideDialog] = useState(false);
    const [openHideSnackbar, setOpenHideSnackbar] = useState(false);

    const [currentBlogPost, setCurrentBlogPost] = useState<any>(null);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    const getBlogPost = async () => {
        try {
            const blogPost = await mainApi.get(
                apiEndpoints.GET_BLOG_POST(blogPostId.toString())
            );

            setCurrentBlogPost(blogPost.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleEditBlogPost = () => {
        setOpenEditBlogPostModal(true);
    }

    const handleCloseEditSnackbar = () => {
        setOpenEditSnackbar(false);
    }

    const handleHideOrUnHideBlogPost = async () => {
        setOpenHideSnackbar(true);

        try {
            await axios({
                method: "PUT",
                url: `${baseURL}/posts/hideOrUnhideBlogPost/${blogPostId.toString()}`,
                headers: {
                    Authorization: "Bearer " + currentUser.token
                }
            });

            const listBlogPosts = await mainApi.get(
                apiEndpoints.GET_ALL_BLOG_POSTS
            );

            dispatch(getAllBlogPosts(listBlogPosts.data.data));
            getBlogPost();
        } catch (error: any) {
            console.log(error);
        }

        setOpenHideDialog(false);
    }

    const handleCloseHideDialog = () => {
        setOpenHideDialog(false);
    }

    const handleCloseHideSnackbar = () => {
        setOpenHideSnackbar(false);
    }

    useEffect(() => {
        if (!currentBlogPost) getBlogPost();
    }, [blogPostId]);

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Chỉnh sửa">
                <IconButton size="small" sx={{ backgroundColor: "#32435F", mr: 3 }} onClick={handleEditBlogPost}>
                    <PencilSquareIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>

            {currentBlogPost?.isHidden ? (
                <Tooltip title="Hiển thị bài viết">
                    <IconButton size="small" sx={{ backgroundColor: "#A67F78" }} onClick={() => setOpenHideDialog(true)}>
                        <EyeIcon className="w-5 h-5 text-white" />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Ẩn bài viết">
                    <IconButton size="small" sx={{ backgroundColor: "#DE5656" }} onClick={() => setOpenHideDialog(true)}>
                        <EyeSlashIcon className="w-5 h-5 text-white" />
                    </IconButton>
                </Tooltip>
            )}

            <AddOrEditBlogPostModal currentUser={currentUser} blogPostId={blogPostId.toString()} isModalOpen={openEditBlogPostModal} setIsModalOpen={setOpenEditBlogPostModal} setOpenSnackbar={setOpenEditSnackbar} />
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openEditSnackbar} autoHideDuration={2000} onClose={handleCloseEditSnackbar}>
                <Alert onClose={handleCloseEditSnackbar} severity="success" sx={{ width: "100%" }}>
                    Chỉnh sửa bài viết thành công
                </Alert>
            </Snackbar>
            
            <Dialog
                open={openHideDialog}
                onClose={handleCloseHideDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        {currentBlogPost?.isHidden ? "Hiển thị" : "Ẩn"} bài viết
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn {currentBlogPost?.isHidden ? "hiển thị" : "ẩn"} bài viết này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseHideDialog}>Hủy bỏ</Button>
                        <Button onClick={handleHideOrUnHideBlogPost}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openHideSnackbar} autoHideDuration={2000} onClose={handleCloseHideSnackbar}>
                <Alert onClose={handleCloseHideSnackbar} severity="success" sx={{ width: "100%" }}>
                    {currentBlogPost?.isHidden ? "Ẩn" : "Hiển thị"} bài viết thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
}

const BlogPost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const dispatch = useDispatch();
    const [allBlogPosts, setAllBlogPosts] = useState([]);
    const [openCreateBlogPostModal, setOpenCreateBlogPostModal] = useState(false);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const allPosts = useSelector((state: RootState) => state.blogPost.allBlogPosts);
    const [openAddSnackbar, setOpenAddSnackbar] = useState(false);

    const [filter, setFilter] = useState("Tất cả");
    const [tempArray, setTempArray] = useState([]);

    const getAllPosts = async () => {
        setIsLoading(true);

        try {
            const blogPostsList = await mainApi.get(
                apiEndpoints.GET_ALL_BLOG_POSTS
            );

            setAllBlogPosts(blogPostsList.data.data);
            setTempArray(blogPostsList.data.data);
            dispatch(getAllBlogPosts(blogPostsList.data.data));
            getTableRows(blogPostsList.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (post: any) => {
                let postTag = "";

                if (post.blogPostTag === "News")
                    postTag = "Tin tức"
                else if (post.blogPostTag === "Tips")
                    postTag = "Mẹo hay"
                else
                    postTag = "Góc cảm hứng"

                return {
                    id: post._id,
                    title: post.blogPostTitle,
                    author: post.blogPostAuthor,
                    tag: postTag
                }
            })
        );

        setTableRows(rows);
        setIsLoading(false);
    }

    const handleCreateBlogPost = () => {
        setOpenCreateBlogPostModal(true);
    }

    const handleCloseAddSnackbar = () => {
        setOpenAddSnackbar(false);
    }

    useEffect(() => {
        if (currentUser) {
            if (allPosts) {
                setAllBlogPosts(allPosts);
                setTempArray(allPosts)
                getTableRows(allPosts);
            } else {
                getAllPosts();
            }
        }
    }, [currentUser, allPosts]);

    useEffect(() => {

    }, [allBlogPosts]);

    useEffect(() => {
        if (allBlogPosts.length > 0 && tempArray.length > 0) {
            if (filter === "Bài viết bị ẩn") {
                getTableRows(tempArray.filter((item: any) => item.isHidden));
            } else {
                getTableRows(allBlogPosts);
            }
        }
    }, [filter]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="15%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Bài viết
                </Typography>
                <Button sx={{ backgroundColor: "#716864" }} onClick={handleCreateBlogPost}>
                    <PlusCircleIcon className="w-6 h-6 text-white" />
                    <Typography className="text-white hidden md:block pl-2" sx={{ fontSize: "0.9rem", fontWeight: "medium" }}>
                        THÊM BÀI VIẾT
                    </Typography>
                </Button>
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
                    <Tooltip title="Bài viết bị ẩn">
                        <Button size="small" sx={{ width: "7.5rem", backgroundColor: (filter === "Bài viết bị ẩn") ? "#A67F78" : "white", border: "2px solid #A67F78" }} onClick={() => setFilter("Bài viết bị ẩn")}>
                            <Typography
                                sx={{
                                    color: !(filter === "Bài viết bị ẩn") ? "#A67F78" : "white",
                                    fontSize: "0.8rem",
                                    fontWeight: "medium"
                                }}>
                                Bài viết bị ẩn
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

            <AddOrEditBlogPostModal currentUser={currentUser} blogPostId={""} isModalOpen={openCreateBlogPostModal} setIsModalOpen={setOpenCreateBlogPostModal} setOpenSnackbar={setOpenAddSnackbar} />

            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openAddSnackbar} autoHideDuration={2000} onClose={handleCloseAddSnackbar}>
                <Alert onClose={handleCloseAddSnackbar} severity="success" sx={{ width: "100%" }}>
                    Thêm bài viết thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default BlogPost;