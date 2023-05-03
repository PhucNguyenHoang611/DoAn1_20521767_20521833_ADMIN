import { Outlet } from 'react-router-dom'

import SideBar from '@/components/SideBar'

const MainPage = () => {
    return(
        <div className="flex">
            <SideBar />
            <Outlet></Outlet>
        </div>
    )
}

export default MainPage;