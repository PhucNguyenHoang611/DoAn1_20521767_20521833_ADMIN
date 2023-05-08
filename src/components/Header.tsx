import React, { useState } from 'react'
import {  Menu, MenuItem, Box, AppBar, Toolbar, IconButton, Tooltip, Avatar, Typography, Divider } from '@mui/material'
import { ArrowRightOnRectangleIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon } from "@heroicons/react/24/solid";

import { User } from '@/redux/reducers/auth_reducer'

interface HeaderProps {
    currentUser: User;
    isNonMobile: boolean;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ currentUser, isNonMobile, isSidebarOpen, setIsSidebarOpen }: HeaderProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpenMenu = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ boxShadow: "none" }}>
            <Toolbar variant="dense" sx={{ width: "100%", height: "100%" }}>
                <Box display={isNonMobile ? "none": "block"} width="max-content" height="100%">
                    <IconButton onClick={() => {setIsSidebarOpen(!isSidebarOpen)}}>
                        <Bars3BottomLeftIcon className="h-6 w-6 text-black" />
                    </IconButton>
                </Box>
                {/* Avatar */}
                <Tooltip title={currentUser.firstName + " " + currentUser.lastName} sx={{ position: "absolute", right: "1rem", width: "max-content", height: "100%" }}>
                    <Box display="flex" width="100%" height="100%" alignItems="center">
                        {isNonMobile && (
                            <Typography 
                                variant="h6"
                                sx={{
                                    color: "#716864",
                                    fontWeight: "normal",
                                    marginRight: ".5rem"
                                }}>
                                {currentUser.firstName + " " + currentUser.lastName}
                            </Typography>
                        )}
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            aria-controls={isOpenMenu ? "account-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={isOpenMenu ? "true" : undefined}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                                <UserCircleIcon className="bg-black" />
                            </Avatar>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={isOpenMenu}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                        },
                        "&:before": {
                        content: "''",
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                        },
                    },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                    <Typography
                        sx={{
                            textAlign: "center",
                            color: "#716864",
                            fontWeight: "bold",
                            px: 2
                        }}>
                        {currentUser.firstName + " " + currentUser.lastName}
                    </Typography>
                    {(currentUser.privilege === 0) && (
                        <Typography
                            sx={{
                                textAlign: "center",
                                px: 2
                            }}>
                            QUẢN TRỊ VIÊN
                        </Typography>
                    )}
                    {(currentUser.privilege === 1) && (
                        <Typography
                            sx={{
                                textAlign: "center",
                                px: 2
                            }}>
                            NHÂN VIÊN SALES
                        </Typography>
                    )}
                    {(currentUser.privilege === 2) && (
                        <Typography
                            sx={{
                                textAlign: "center",
                                px: 2
                            }}>
                            NHÂN VIÊN KHO
                        </Typography>
                    )}
                    <Divider sx={{ mx: 1, my: 1 }} />
                    <MenuItem onClick={handleClose}>
                        <ArrowRightOnRectangleIcon  className="h-7 w-7 mr-2 text-secondary-0" />
                        Đăng xuất
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}

export default Header;