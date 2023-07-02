import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { Sidebar, Menu, SubMenu, MenuItem, useProSidebar } from 'react-pro-sidebar'
import { User, logout } from '@/redux/reducers/auth_reducer'
import {
    ArrowRightCircleIcon,
    Bars3BottomLeftIcon,
    HomeIcon,
    CircleStackIcon,
    ArrowRightOnRectangleIcon,
    CubeIcon,
    InboxArrowDownIcon,
    UserGroupIcon,
    UserCircleIcon,
    ShoppingCartIcon,
    ReceiptPercentIcon } from '@heroicons/react/24/outline'
import { useDispatch } from 'react-redux'

interface SideBarProps {
    currentUser: User;
    isNonMobile: boolean;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MenuItemProps {
    key: string;
    title: string;
    to: string;
    icon: React.ReactNode;
}

const Item = ({ title, to, icon }: MenuItemProps) => {
    const location = useLocation();

    return (
        <MenuItem
            active={location.pathname === to}
            component={<Link to={to} />}
            icon={icon}
            style={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{
                color: "#716864",
                fontWeight: "normal"
            }}>
                {title}
            </Typography>
        </MenuItem>
    )
}

const SideBar = ({ currentUser, isNonMobile, isSidebarOpen, setIsSidebarOpen }: SideBarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { collapseSidebar } = useProSidebar();
    const [sidebarCollapse, setSidebarCollapse] = useState(true);
    const [menuList, setMenuList] = useState<MenuItemProps[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    isSidebarOpen = isNonMobile ? true : !isSidebarOpen;

    useEffect(() => {
        if (currentUser){
            switch(currentUser.privilege) {
                case 0:
                    setMenuList([
                        {
                            key: "1",
                            title: "Khách hàng",
                            to: "/customer",
                            icon: <UserCircleIcon className="h-7 w-7 text-secondary-0" />
                        },
                        {
                            key: "2",
                            title: "Nhân viên",
                            to: "/staff",
                            icon: <UserGroupIcon className="h-7 w-7 text-secondary-0" />
                        },
                        {
                            key: "3",
                            title: "Giảm giá",
                            to: "/discount",
                            icon: <ReceiptPercentIcon className="h-7 w-7 text-secondary-0" />
                        }
                    ]);
                    break;
                default:
                    break;
            }
        }
    }, [currentUser]);

    if (!isNonMobile && !sidebarCollapse) {
        setSidebarCollapse(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        navigate("/login");
    }

    return (
        <Box display="flex" height="100%" width={(!isNonMobile && isSidebarOpen) ? "100%" : "max-content"}
            sx={(!isNonMobile && isSidebarOpen) ? { 
                position: "absolute", 
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                zIndex: "1"} : {}}>
            {isSidebarOpen && (
                <Sidebar backgroundColor="#F5F3F2" style={{ border: 0 }}>
                    {isNonMobile ?
                        (
                            <Box width="100%" height="5%" textAlign="right">
                                <IconButton onClick={() => {
                                        collapseSidebar();
                                        setSidebarCollapse(!sidebarCollapse);
                                    }}>
                                    <ArrowRightCircleIcon className={`h-6 w-6 text-secondary-0 transition-all duration-700 ${sidebarCollapse ? "-rotate-180" : ""}`} />
                                </IconButton>
                            </Box>
                        )
                        :
                        (
                            <Box width="100%" height="5%" textAlign="right">
                                <IconButton onClick={() => {
                                        setIsSidebarOpen(true);
                                    }}>
                                    <Bars3BottomLeftIcon className="h-6 w-6 text-secondary-0" />
                                </IconButton>
                            </Box>
                        )
                    }
                    <Box display="flex" flexDirection="row" width="100%" height="15%" sx={{ minWidth: "max-content", paddingRight: ".9rem", marginBottom: "0rem" }}>
                        <img src="/nguyenshome_logo.png" alt="logo" className="h-20 w-15"/>
                        <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <Box width="100%" textAlign="center" sx={{ color: "#A67F78", fontSize: "1.2rem", lineHeight: "2rem", fontWeight: 500, whiteSpace: "nowrap"}}>
                                NGUYEN'S HOME
                            </Box>
                            <Box width="100%" display="flex" justifyContent="center">
                                <Box sx={{ color: "#32435F", fontSize: ".9rem", lineHeight: ".75rem", fontWeight: 500 }}>
                                    FURNITURE
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Menu style={{ height: "auto"}}>
                        {(currentUser.privilege === 0) && (
                            <MenuItem
                                active={location.pathname === "/"}
                                component={<Link to="/" />}
                                icon={<HomeIcon className="h-7 w-7 text-secondary-0" />}
                                style={{ textAlign: "center" }}>
                                <Typography variant="h6" sx={{
                                    color: "#716864",
                                    fontWeight: "normal"
                                }}>
                                    Trang chủ
                                </Typography>
                            </MenuItem>
                        )}
                        <SubMenu label={
                                <Typography variant="h6" sx={{
                                    textAlign: "center",
                                    color: "#716864",
                                    fontWeight: "normal"
                                }}>
                                    Danh mục
                                </Typography>}
                            icon={<CircleStackIcon className="h-7 w-7 text-secondary-0" />}>
                            <MenuItem
                                active={location.pathname === "/product"}
                                component={<Link to="/product" />}
                                icon={<CubeIcon  className="h-7 w-7 text-secondary-0" />}
                                style={{ textAlign: "center", backgroundColor: "#F5F3F2" }}>
                                <Typography variant="h6" sx={{
                                    color: "#716864",
                                    fontWeight: "normal"
                                }}>
                                    Sản phẩm
                                </Typography>
                            </MenuItem>
                            {(currentUser.privilege !== 1) && (
                                <MenuItem
                                    active={location.pathname === "/import"}
                                    component={<Link to="/import" />}
                                    icon={<InboxArrowDownIcon  className="h-7 w-7 text-secondary-0" />}
                                    style={{ textAlign: "center", backgroundColor: "#F5F3F2" }}>
                                    <Typography variant="h6" sx={{
                                        color: "#716864",
                                        fontWeight: "normal"
                                    }}>
                                        Nhập kho
                                    </Typography>
                                </MenuItem>
                            )}
                            {/* <MenuItem
                                active={location.pathname === "/other"}
                                component={<Link to="/other" />}
                                icon={<EllipsisHorizontalCircleIcon className="h-7 w-7 text-secondary-0" />}
                                style={{ textAlign: "center", backgroundColor: "#F5F3F2" }}>
                                <Typography variant="h6" sx={{
                                    color: "#716864",
                                    fontWeight: "normal"
                                }}>
                                    Khác
                                </Typography>
                            </MenuItem> */}
                        </SubMenu>
                        {(currentUser.privilege !== 2) && (
                            <MenuItem
                                active={location.pathname === "/order"}
                                component={<Link to="/order" />}
                                icon={<ShoppingCartIcon className="h-7 w-7 text-secondary-0" />}
                                style={{ textAlign: "center" }}>
                                <Typography variant="h6" sx={{
                                    color: "#716864",
                                    fontWeight: "normal"
                                }}>
                                    Đơn hàng
                                </Typography>
                            </MenuItem>
                        )}
                        {menuList.map((data) => (
                            <Item
                                key={data.key}
                                title={data.title}
                                to={data.to}
                                icon={data.icon} />
                        ))}
                    </Menu>
                    <Menu style={{ position: "absolute", bottom: 0, width: "100%", height: "auto" }}>
                        <MenuItem
                            icon={<ArrowRightOnRectangleIcon  className="h-7 w-7 text-secondary-0" />}
                            style={{ textAlign: "center" }} onClick={() => setOpenDialog(true)}>
                            <Typography variant="h6" sx={{
                                color: "#716864",
                                fontWeight: "normal"
                            }}>
                                Đăng xuất
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Sidebar>
            )}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Đăng xuất
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn đăng xuất ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                        <Button  onClick={handleLogout}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
        </Box>
    )
}

export default SideBar;