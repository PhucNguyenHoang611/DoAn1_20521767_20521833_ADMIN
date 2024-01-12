/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ProSidebarProvider } from 'react-pro-sidebar'
import { ThemeProvider, createTheme } from '@mui/material'
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { User, login } from '@/redux/reducers/auth_reducer'
import { RootState } from '@/redux/store'
import { themeSettings } from '@/theme'

import MainPage from '@/pages/MainPage/mainpage'
import Login from '@/pages/Login/login'
import Dashboard from '@/pages/Dashboard/dashboard'
import Product from '@/pages/Product/product'
import NotFound from '@/pages/NotFound/notfound'
import Import from '@/pages/Import/import'
import Order from '@/pages/Order/order'
import Staff from '@/pages/Staff/staff'
import Customer from '@/pages/Customer/customer'
import Discount from '@/pages/Discount/discount'
import Color from '@/pages/Color/color'
import Supplier from '@/pages/Supplier/supplier'
import Category from '@/pages/Category/category'
import Subcategory from '@/pages/Subcategory/subcategory'
import Feedback from '@/pages/Feedback/feedback'
import BlogPost from '@/pages/BlogPost/blogpost'
import Chat from '@/pages/Chat/chat'
import Voucher from '@/pages/Voucher/voucher'

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = createTheme(themeSettings);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    const getUser = async (token: string, expiredDate: Date) => {
        try {
            const user = await mainApi.get(
                apiEndpoints.CURRENT_USER,
                apiEndpoints.getAccessToken(token)
            );
            
            const currentUser: User = {
                token: token,
                id: user.data.data._id,
                firstName: user.data.data.staffFirstName,
                lastName: user.data.data.staffLastName,
                email: user.data.data.staffEmail,
                phoneNumber: user.data.data.staffPhone,
                gender: user.data.data.staffGender,
                privilege: user.data.data.privilege,
                startWork: new Date(user.data.data.staffStartWork),
                status: user.data.data.staffStatus,
                expiredDate: expiredDate
            }

            dispatch(login(currentUser));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const user = localStorage.getItem("currentUser");

        if (user) {
            const loggedInUser = JSON.parse(user);

            const today = new Date();
            const expiredDate = new Date(loggedInUser.expiredDate);

            if (today < expiredDate) {
                getUser(loggedInUser.token, expiredDate);
            } else {
                localStorage.removeItem("currentUser");
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <ProSidebarProvider>
                <Routes>
                    <Route path="/" element={<MainPage />} >
                        {(currentUser.privilege !== -1) && (
                            <>
                                {(currentUser.privilege === 0) && (
                                    <>
                                        <Route index element={<Dashboard />} /> 
                                        <Route path="customer" element={<Customer />} />
                                        <Route path="staff" element={<Staff />} />
                                        <Route path="discount" element={<Discount />} />
                                        <Route path="voucher" element={<Voucher />} />
                                        <Route path="color" element={<Color />} />
                                        <Route path="supplier" element={<Supplier />} />
                                        <Route path="category" element={<Category />} />
                                        <Route path="subcategory" element={<Subcategory />} />
                                        <Route path="blog_post" element={<BlogPost />} />
                                    </>
                                )}
                                <Route path="product" element={<Product />} />
                                {(currentUser.privilege !== 1) && (
                                    <Route path="import" element={<Import />} />
                                )}
                                {(currentUser.privilege !== 2) && (
                                    <>
                                        <Route path="order" element={<Order />} />
                                        <Route path="feedback" element={<Feedback />} />
                                        <Route path="chat" element={<Chat />} />
                                    </>
                                )}
                            </>
                        )}
                    </Route>
                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ProSidebarProvider>
        </ThemeProvider>
    )
}

export default App;