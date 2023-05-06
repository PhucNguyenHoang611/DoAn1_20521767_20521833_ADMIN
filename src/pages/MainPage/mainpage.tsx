import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, useMediaQuery } from '@mui/material'

import SideBar from '@/components/SideBar'
import Header from '@/components/Header'

const MainPage = () => {
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return(
        <Box display="flex" width="100%" height="100%">
            <SideBar currentUser="ADMIN" isNonMobile={isNonMobile} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Box display="flex" flexDirection="column" width="100%" height="100%">
                <Header isNonMobile={isNonMobile} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <Outlet></Outlet>
            </Box>
        </Box>
    )
}

export default MainPage;