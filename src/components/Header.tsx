import React from 'react'
import { Box, AppBar, Toolbar, IconButton } from '@mui/material'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
    isNonMobile: boolean;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ isNonMobile, isSidebarOpen, setIsSidebarOpen }: HeaderProps) => {
    return (
        <AppBar position="static" sx={{ boxShadow: "none" }}>
            <Toolbar variant="dense" sx={{ width: "100%", height: "100%" }}>
                <Box display={isNonMobile ? "none": "flex"} height="100%">
                    <IconButton onClick={() => {setIsSidebarOpen(!isSidebarOpen)}}>
                        <Bars3BottomLeftIcon className="h-6 w-6 text-black" />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header;