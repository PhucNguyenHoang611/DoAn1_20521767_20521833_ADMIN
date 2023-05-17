import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, IconButton } from '@mui/material'
import { Sidebar, Menu, SubMenu, MenuItem, useProSidebar } from 'react-pro-sidebar'
import { User } from '@/redux/reducers/auth_reducer'
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
    selected: string;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const Item = ({ title, to, icon, selected, setSelected }: MenuItemProps) => {
    return (
        <MenuItem
            active={selected === title}
            component={<Link to={to} />}
            icon={icon}
            style={{ textAlign: "center" }}
            onClick={() => setSelected(title)}>
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
    const { collapseSidebar } = useProSidebar();
    const [sidebarCollapse, setSidebarCollapse] = useState(true);
    const [selected, setSelected] = useState("Bảng điều khiển");
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
                            to: "/",
                            icon: <UserCircleIcon className="h-7 w-7 text-secondary-0" />,
                            selected: selected,
                            setSelected: setSelected
                        },
                        {
                            key: "2",
                            title: "Nhân viên",
                            to: "/",
                            icon: <UserGroupIcon className="h-7 w-7 text-secondary-0" />,
                            selected: selected,
                            setSelected: setSelected
                        },
                        {
                            key: "3",
                            title: "Mã giảm giá",
                            to: "/",
                            icon: <ReceiptPercentIcon className="h-7 w-7 text-secondary-0" />,
                            selected: selected,
                            setSelected: setSelected
                        }
                    ]);
                    break;
                default:
                    break;
            }
        }
    }, [currentUser, selected]);

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
                        <img src="src/assets/nguyenshome_logo.png" alt="logo" className="h-20 w-15"/>
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
                        <MenuItem
                            active={selected === "Bảng điều khiển"}
                            component={<Link to="/" />}
                            icon={<HomeIcon className="h-7 w-7 text-secondary-0" />}
                            style={{ textAlign: "center" }}
                            onClick={() => setSelected("Bảng điều khiển")}>
                            <Typography variant="h6" sx={{
                                color: "#716864",
                                fontWeight: "normal"
                            }}>
                                Bảng điều khiển
                            </Typography>
                        </MenuItem>
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
                                active={selected === "Sản phẩm"}
                                component={<Link to="/product" />}
                                icon={<CubeIcon  className="h-7 w-7 text-secondary-0" />}
                                style={{ textAlign: "center", backgroundColor: "#F5F3F2" }}
                                onClick={() => setSelected("Sản phẩm")}>
                                <Typography variant="h6" sx={{
                                    color: "#716864",
                                    fontWeight: "normal"
                                }}>
                                    Sản phẩm
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                active={selected === "Nhập kho"}
                                component={<Link to="/" />}
                                icon={<InboxArrowDownIcon  className="h-7 w-7 text-secondary-0" />}
                                style={{ textAlign: "center", backgroundColor: "#F5F3F2" }}
                                onClick={() => setSelected("Nhập kho")}>
                                <Typography variant="h6" sx={{
                                    color: "#716864",
                                    fontWeight: "normal"
                                }}>
                                    Nhập kho
                                </Typography>
                            </MenuItem>
                        </SubMenu>
                        <MenuItem
                            active={selected === "Đơn hàng"}
                            component={<Link to="/" />}
                            icon={<ShoppingCartIcon className="h-7 w-7 text-secondary-0" />}
                            style={{ textAlign: "center" }}
                            onClick={() => setSelected("Đơn hàng")}>
                            <Typography variant="h6" sx={{
                                color: "#716864",
                                fontWeight: "normal"
                            }}>
                                Đơn hàng
                            </Typography>
                        </MenuItem>
                        {menuList.map((data) => (
                            <Item
                                key={data.key}
                                title={data.title}
                                to={data.to}
                                icon={data.icon}
                                selected={data.selected}
                                setSelected={data.setSelected} />
                        ))}
                    </Menu>
                    <Menu style={{ position: "absolute", bottom: 0, width: "100%", height: "auto" }}>
                        <MenuItem
                            icon={<ArrowRightOnRectangleIcon  className="h-7 w-7 text-secondary-0" />}
                            style={{ textAlign: "center" }}>
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
        </Box>
    )
}

export default SideBar;