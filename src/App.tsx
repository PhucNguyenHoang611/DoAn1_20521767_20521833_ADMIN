import { Route, Routes } from 'react-router-dom'
import { ProSidebarProvider } from 'react-pro-sidebar'
import { ThemeProvider, createTheme } from '@mui/material'

import { themeSettings } from '@/theme'
import MainPage from '@/pages/MainPage/mainpage'
import Login from '@/pages/Login/login'
import Dashboard from '@/pages/Dashboard/dashboard'
import Product from '@/pages/Product/product'
import NotFound from '@/pages/NotFound/notfound'

const App = () => {
    const theme = createTheme(themeSettings);

    return (
        <ThemeProvider theme={theme}>
            <ProSidebarProvider>
                <Routes>
                    <Route path="/" element={<MainPage />} >
                        <Route index element={<Dashboard />} />
                        <Route path="product" element={<Product />} />
                    </Route>
                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ProSidebarProvider>
        </ThemeProvider>
    )
}

export default App;