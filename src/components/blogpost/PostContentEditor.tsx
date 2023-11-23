/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { Box } from '@mui/material';

import { mainApi } from '@/api/main_api';
import * as apiEndpoints from '@/api/api_endpoints';
import { BlogPost } from '../modals/blogpost/AddOrEditBlogPostModal';

const PostContentEditor = ({ token, currentBlogPost, setCurrentBlogPost }: any) => {
    const mdParser = new MarkdownIt();

    const handleEditorChange = ({ text }: any) => {
        setCurrentBlogPost((blogPost: BlogPost) => {
            const updatedBlogPost: BlogPost = {
                ...blogPost,
                blogPostContent: text
            };

            return updatedBlogPost;
        });
    }

    const handleUploadPostImage = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("Files[]", file);

            const imageUrl = await mainApi.post(
                apiEndpoints.UPLOAD_BLOG_POST_IMAGE,
                formData,
                apiEndpoints.getAccessToken(token)
            );

            return imageUrl.data.imageURL;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box width="100%" height="100%">
            <MdEditor
                style={{ height: "500px" }}
                placeholder="Nhập nội dung bài viết ở đây..."
                value={currentBlogPost.blogPostContent}
                renderHTML={content => mdParser.render(content)}
                onChange={handleEditorChange}
                onImageUpload={handleUploadPostImage} />
        </Box>
    )
}

export default PostContentEditor;