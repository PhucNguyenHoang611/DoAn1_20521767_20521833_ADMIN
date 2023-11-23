/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

import { mainApi } from '@/api/main_api';
import * as apiEndpoints from '@/api/api_endpoints';

import { useDispatch } from "react-redux";
import { getAllBlogPosts } from '@/redux/reducers/blog_post_reducer';
import { Box, IconButton, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm, SubmitHandler } from 'react-hook-form';
import PostThumbnailUploader from '@/components/blogpost/PostThumbnailUploader';
import PostContentEditor from '@/components/blogpost/PostContentEditor';

export interface BlogPost {
    blogPostTitle: string;
    blogPostAuthor: string;
    blogPostTag: string;
    blogPostDescription: string;
    blogPostThumbnail: string;
    blogPostContent: string;
}

const AddOrEditBlogPostModal = ({ currentUser, blogPostId, isModalOpen, setIsModalOpen, setOpenSnackbar }: any) => {
    const dispatch = useDispatch();
    const [currentBlogPost, setCurrentBlogPost] = useState<BlogPost>({
        blogPostTitle: "",
        blogPostAuthor: "",
        blogPostTag: "",
        blogPostDescription: "",
        blogPostThumbnail: "",
        blogPostContent: ""
    });
    const [thumbnailError, setThumbnailError] = useState(false);
    const [contentError, setContentError] = useState(false);
    const [filesList, setFilesList] = useState<any[]>([]);
    const [viewImage, setViewImage] = useState(false);

    const { register, handleSubmit } = useForm<BlogPost>();

    const getBlogPost = async () => {
        try {
            const result = await mainApi.get(
                apiEndpoints.GET_BLOG_POST(blogPostId)
            );

            const blogPost = result.data.data;

            const currBlogPost: BlogPost = {
                blogPostTitle: blogPost.blogPostTitle,
                blogPostAuthor: blogPost.blogPostAuthor,
                blogPostTag: blogPost.blogPostTag,
                blogPostDescription: blogPost.blogPostDescription,
                blogPostThumbnail: blogPost.blogPostThumbnail,
                blogPostContent: blogPost.blogPostContent
            };

            setCurrentBlogPost(currBlogPost);
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddBlogPost: SubmitHandler<BlogPost> = async (data) => {
        try {
            if (filesList.length == 0) {
                setThumbnailError(true);
                return;
            } else
                setThumbnailError(false);

            if (currentBlogPost.blogPostContent === "") {
                setContentError(true);
                return;
            } else
                setContentError(false);

            setOpenSnackbar(true);

            const blogPost = await mainApi.post(
				apiEndpoints.CREATE_BLOG_POST,
				apiEndpoints.getCreateBlogPostBody(
					data.blogPostTitle,
					currentUser.lastName + " " + currentUser.firstName,
					data.blogPostTag,
					data.blogPostDescription,
					currentBlogPost.blogPostContent
				),
                apiEndpoints.getAccessToken(currentUser.token)
			);

            filesList.map(async (file: any) => {
                const formData = new FormData();
                formData.append("Files[]", file.originFileObj);

                await mainApi.post(
                    apiEndpoints.SAVE_BLOG_POST_THUMBNAIL(blogPost.data.data._id),
                    formData,
                    apiEndpoints.getAccessToken(currentUser.token)
                );
            })

            const listBlogPosts = await mainApi.get(
                apiEndpoints.GET_ALL_BLOG_POSTS
            );

            dispatch(getAllBlogPosts(listBlogPosts.data.data));
        } catch (error) {
            console.log(error);
        }

        setIsModalOpen(false);
    }

    const handleEditBlogPost: SubmitHandler<BlogPost> = async () => {
        try {
            if (currentBlogPost.blogPostContent === "") {
                setContentError(true);
                return;
            } else
                setContentError(false);

            setOpenSnackbar(true);

            await mainApi.put(
				apiEndpoints.UPDATE_BLOG_POST(blogPostId),
				apiEndpoints.getUpdateBlogPostBody(
					currentBlogPost.blogPostTitle,
					currentBlogPost.blogPostTag,
					currentBlogPost.blogPostDescription,
					currentBlogPost.blogPostContent
				),
                apiEndpoints.getAccessToken(currentUser.token)
			);

            if (filesList.length > 0) {
                filesList.map(async (file: any) => {
                    const formData = new FormData();
                    formData.append("Files[]", file.originFileObj);
    
                    await mainApi.post(
                        apiEndpoints.SAVE_BLOG_POST_THUMBNAIL(blogPostId),
                        formData,
                        apiEndpoints.getAccessToken(currentUser.token)
                    );
                })
            }

            const listBlogPosts = await mainApi.get(
                apiEndpoints.GET_ALL_BLOG_POSTS
            );

            dispatch(getAllBlogPosts(listBlogPosts.data.data));
        } catch(error) {
            console.log(error)
        }

        setIsModalOpen(false);
    }

    const handleClose = () => {
        setIsModalOpen(false);
    }

    const zoomImage = () => setViewImage(true);
    const cancelZoomImage = () => setViewImage(false);

    useEffect(() => {
        if (isModalOpen) {
            if (blogPostId !== "") getBlogPost();
        } else {
            setCurrentBlogPost({
                blogPostTitle: "",
                blogPostAuthor: "",
                blogPostTag: "",
                blogPostDescription: "",
                blogPostThumbnail: "",
                blogPostContent: ""
            });
            setThumbnailError(false);
            setContentError(false);
            setFilesList([]);
            setViewImage(false);
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
					padding: "1.5rem",
					width: "85%",
					height: "90%",
					overflowY: "auto" }}>
					<Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
						{blogPostId !== "" ?
							<Typography sx={{
								fontWeight: "bold",
								fontSize: "1.5rem",
								color: "black"
							}}>
								Chỉnh sửa bài viết
							</Typography>
							:
							<Typography sx={{
								fontWeight: "bold",
								fontSize: "1.5rem",
								color: "black"
							}}>
								Thêm bài viết
							</Typography>
						}
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%" sx={{ mt: 4 }}>
                        <form onSubmit={handleSubmit(blogPostId ? handleEditBlogPost : handleAddBlogPost)} className="w-full flex flex-col">
                            {/* Tiêu đề bài viết */}
							<Box width="100%" sx={{mb: 2}}>
								<TextField fullWidth autoComplete="off" {...register("blogPostTitle")} required label="Tiêu đề bài viết" placeholder="Nhập tiêu đề bài viết" value={currentBlogPost.blogPostTitle}
									onChange={(event) => {
										setCurrentBlogPost((blogPost: BlogPost) => {
											const updatedBlogPost: BlogPost = {
												...blogPost,
												blogPostTitle: event.target.value
											};

											return updatedBlogPost;
										});
									}} />
							</Box>

                            {/* Mô tả bài viết */}
							<Box width="100%" sx={{mb: 2}}>
								<TextField fullWidth autoComplete="off" {...register("blogPostDescription")} label="Mô tả" placeholder="Nhập mô tả bài viết" value={currentBlogPost.blogPostDescription}
									onChange={(event) => {
										setCurrentBlogPost((blogPost: BlogPost) => {
											const updatedBlogPost: BlogPost = {
												...blogPost,
												blogPostDescription: event.target.value
											};

											return updatedBlogPost;
										});
									}} />
							</Box>

                            {/* Thẻ & Thumbnail */}
                            <Box width="100%" display="flex" alignItems="center" sx={{ mb: 2 }}>
                                <Box width="50%" height="100%">
                                    <TextField fullWidth select {...register("blogPostTag")} required label="Thẻ" value={currentBlogPost.blogPostTag}
                                        onChange={(event) => {
                                            setCurrentBlogPost((blogPost: BlogPost) => {
                                                const updatedBlogPost: BlogPost = {
                                                    ...blogPost,
                                                    blogPostTag: event.target.value
                                                };

                                                return updatedBlogPost;
                                            });
                                        }}>
                                        <MenuItem key="0" value="News">
                                            Tin tức
                                        </MenuItem>
                                        <MenuItem key="1" value="Tips">
                                            Mẹo hay
                                        </MenuItem>
                                        <MenuItem key="2" value="Inspiration">
                                            Góc cảm hứng
                                        </MenuItem>
                                    </TextField>
                                </Box>
                                <Box width="50%" height="100%" display="flex" justifyContent="start" alignItems="center" sx={{ ml: 4 }}>
                                    <Typography className="whitespace-nowrap" sx={{ fontSize: "0.8rem", fontWeight: "medium" }}>
                                        THUMBNAIL:
                                    </Typography>

                                    {currentBlogPost?.blogPostThumbnail !== "" ? (
                                        <>
                                            <Box sx={{ border: "1px solid #B8ACA5", borderRadius: "5px", ml: 2, p: 0.5 }}>
                                                <img src={currentBlogPost?.blogPostThumbnail} className="cursor-pointer" style={{ width: "10rem" }} onClick={zoomImage}/>
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
                                                    <img src={currentBlogPost?.blogPostThumbnail} />
                                                </Box>
                                            </Modal>
                                        </>
                                    ) : null}

                                    <Box display="flex" flexDirection="column">
                                        <PostThumbnailUploader setFilesList={setFilesList} />
                                        {thumbnailError ? (
                                            <p className="text-red-700 text-base mb-4 ml-4">Hãy chọn thumbnail cho bài viết</p>
                                        ) : null}
                                    </Box>
                                </Box>
                            </Box>

                            <Box width="100%" sx={{mb: 2}}>
                                <PostContentEditor token={currentUser.token} currentBlogPost={currentBlogPost} setCurrentBlogPost={setCurrentBlogPost} />
                                {contentError ? (
                                    <p className="text-red-700 text-base mb-4">Nội dung bài viết không được để trống</p>
                                ) : null}
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

export default AddOrEditBlogPostModal;