import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Typography, IconButton } from '@mui/material'
import { Sidebar, Menu, SubMenu, MenuItem, useProSidebar } from 'react-pro-sidebar'
import { User } from '@/redux/reducers/auth_reducer'
import {
    ArrowRightCircleIcon,
    Bars3BottomLeftIcon,
    HomeIcon,
    CircleStackIcon,
    CubeIcon,
    InboxArrowDownIcon,
    UserGroupIcon,
    UserCircleIcon,
    ShoppingCartIcon,
    ReceiptPercentIcon, 
    EllipsisHorizontalCircleIcon,
    SparklesIcon,
    TruckIcon, 
    ArchiveBoxIcon,
    HomeModernIcon,
    EyeDropperIcon} from '@heroicons/react/24/outline'

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
    const location = useLocation();
    const { collapseSidebar } = useProSidebar();
    const [sidebarCollapse, setSidebarCollapse] = useState(true);
    const [menuList, setMenuList] = useState<MenuItemProps[]>([]);
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
                            <Box width="100%" height="3%" textAlign="right">
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
                            <Box width="100%" height="3%" textAlign="right">
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
                    <Menu style={{ height: "auto" }}>
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
                        </SubMenu>
                        {(currentUser.privilege !== 2) && (
                            <>
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
                                <MenuItem
                                    active={location.pathname === "/feedback"}
                                    component={<Link to="/feedback" />}
                                    icon={<SparklesIcon className="h-7 w-7 text-secondary-0" />}
                                    style={{ textAlign: "center" }}>
                                    <Typography variant="h6" sx={{
                                        color: "#716864",
                                        fontWeight: "normal"
                                    }}>
                                        Đánh giá
                                    </Typography>
                                </MenuItem>
                            </>
                        )}
                        {menuList.map((data) => (
                            <Item
                                key={data.key}
                                title={data.title}
                                to={data.to}
                                icon={data.icon} />
                        ))}

                        {(currentUser.privilege === 0) && (
                            <SubMenu label={
                                    <Typography variant="h6" sx={{
                                        textAlign: "center",
                                        color: "#716864",
                                        fontWeight: "normal"
                                    }}>
                                        Khác
                                    </Typography>}
                                icon={<EllipsisHorizontalCircleIcon className="h-7 w-7 text-secondary-0" />}>
                                <MenuItem
                                    active={location.pathname === "/category"}
                                    component={<Link to="/category" />}
                                    icon={<ArchiveBoxIcon className="h-7 w-7 text-secondary-0" />}
                                    style={{ textAlign: "center", backgroundColor: "#F5F3F2" }}>
                                    <Typography variant="h6" sx={{
                                        color: "#716864",
                                        fontWeight: "normal"
                                    }}>
                                        Loại sản phẩm
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    active={location.pathname === "/subcategory"}
                                    component={<Link to="/subcategory" />}
                                    icon={<HomeModernIcon className="h-7 w-7 text-secondary-0" />}
                                    style={{ textAlign: "center", backgroundColor: "#F5F3F2" }}>
                                    <Typography variant="h6" sx={{
                                        color: "#716864",
                                        fontWeight: "normal"
                                    }}>
                                        Loại phòng
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    active={location.pathname === "/color"}
                                    component={<Link to="/color" />}
                                    icon={<EyeDropperIcon className="h-7 w-7 text-secondary-0" />}
                                    style={{ textAlign: "center", backgroundColor: "#F5F3F2" }}>
                                    <Typography variant="h6" sx={{
                                        color: "#716864",
                                        fontWeight: "normal"
                                    }}>
                                        Màu
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    active={location.pathname === "/supplier"}
                                    component={<Link to="/supplier" />}
                                    icon={<TruckIcon className="h-7 w-7 text-secondary-0" />}
                                    style={{ textAlign: "center", backgroundColor: "#F5F3F2" }}>
                                    <Typography variant="h6" sx={{
                                        color: "#716864",
                                        fontWeight: "normal"
                                    }}>
                                        Nhà cung cấp
                                    </Typography>
                                </MenuItem>
                            </SubMenu>
                        )}
                    </Menu>
                </Sidebar>
            )}
        </Box>
    )
}

export default SideBar;