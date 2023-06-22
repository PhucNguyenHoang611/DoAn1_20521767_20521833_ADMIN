import { Typography } from "@mui/material";
import { Box } from "@mui/system"
import BgImage from "../../../public/404_not_found_bg.jpg"

const NotFound = () => {
    return(
            <Box width="100%" height="100%">
                <img src={BgImage} className="w-full h-full absolute object-cover" />
                <Box
                    sx={{
                        position: "absolute",
                        top: "15%",
                        left: "12%"
                    }}>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="start">
                        <Box
                            sx={{
                                zIndex: 10
                            }}>
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: 50,
                                        color: "#273449"
                                    }}>
                                        KHÔNG TÌM THẤY TRANG
                                </Typography>
                        </Box>
                        <Box
                            sx={{
                                mt: 4,
                                zIndex: 10
                            }}>
                                <Typography
                                    sx={{
                                        fontWeight: "medium",
                                        fontSize: 40,
                                        color: "#886059"
                                    }}>
                                        Đã có lỗi xảy ra
                                </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        top: "30.5%",
                        left: "71.5%"
                    }}>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <Box
                            sx={{
                                zIndex: 10
                            }}>
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: 40
                                    }}>
                                        404
                                </Typography>
                        </Box>
                        <Box
                            sx={{
                                mt: 1,
                                zIndex: 10
                            }}>
                                <Typography
                                    sx={{
                                        fontWeight: "medium",
                                        fontSize: 30
                                    }}>
                                        NOT
                                </Typography>
                        </Box>
                        <Box
                            sx={{
                                mt: 1,
                                zIndex: 10
                            }}>
                                <Typography
                                    sx={{
                                        fontWeight: "medium",
                                        fontSize: 30
                                    }}>
                                        FOUND
                                </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
    )
}

export default NotFound;