import { RootState } from "@/redux/store";
import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const ImportTab = () => {
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    return (
        <Box width="100%" height="100%">

            <Box width="100%" height="10%" display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 4, mb: 2 }}>
                <Box height="100%" display="flex" alignItems="center">
                    <Box sx={{ mr: 4 }}>
                        <Typography sx={{
                                fontWeight: "medium",
                                fontSize: "1.1rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                Mã nhân viên:
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{
                                fontStyle: "italic",
                                fontSize: "1.1rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                {currentUser.id}
                        </Typography>
                    </Box>
                </Box>
                <Box height="100%" display="flex" alignItems="center">
                    <Box sx={{ mr: 4 }}>
                        <Typography sx={{
                                fontWeight: "medium",
                                fontSize: "1.1rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                Tên nhân viên:
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{
                                fontSize: "1.1rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                {currentUser.lastName + " " + currentUser.firstName}
                        </Typography>
                    </Box>
                </Box>
                <Box height="100%" display="flex" alignItems="center">
                    <Box sx={{ mr: 4 }}>
                        <Typography sx={{
                                fontWeight: "medium",
                                fontSize: "1.1rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                Tổng giá trị:
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{
                                fontSize: "1.5rem",
                                color: "black",
                                whiteSpace: "nowrap"
                            }}>
                                0 đ
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box width="100%" height="90%">
                <Box width="100%" height="10%" display="flex" justifyContent="end" alignItems="center">
                    <Button
                        sx={{
                            border: "2px solid #886059",
                            backgroundColor: "#886059",
                            color: "white",
                            mr: 2,
                            width: "9rem"
                        }}>
                            Thêm sản phẩm
                    </Button>
                    <Button
                        sx={{
                            border: "2px solid #886059",
                            backgroundColor: "white",
                            color: "#886059",
                            mr: 2,
                            width: "9rem"
                        }}>
                            Xóa tất cả
                    </Button>
                </Box>
                <Box width="100%" height="80%" display="flex" justifyContent="center" alignItems="center">
                    Bảng
                </Box>
                <Box width="100%" height="10%" display="flex" justifyContent="end" alignItems="center">
                    <Button
                        sx={{
                            border: "2px solid #32435F",
                            backgroundColor: "#32435F",
                            color: "white",
                            mr: 2,
                            width: "10rem"
                        }}>
                            Yêu cầu nhập kho
                    </Button>
                </Box>
            </Box>

        </Box>
    )
}

export default ImportTab;