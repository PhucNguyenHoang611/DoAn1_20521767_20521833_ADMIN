import { useState } from 'react'
import { Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm, SubmitHandler } from 'react-hook-form'

import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { User, login } from '@/redux/reducers/auth_reducer'

interface ILoginInput {
    email: string;
    password: string;
}

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, formState: { errors }, setError, handleSubmit } = useForm<ILoginInput>();

    const onSubmit: SubmitHandler<ILoginInput> = async (data) => {
        setLoading(true);

        try {
            const userToken = await mainApi.post(
                apiEndpoints.LOGIN,
                apiEndpoints.getLoginBody(data.email, data.password)
            );

            handleLogin(userToken.data.token);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setLoading(false);
            const errorMessage = error.response.data.error;

            if (errorMessage === "Invalid credentials") {
                setError("email", { message: "Người dùng không tồn tại" });
            } else if (errorMessage === "Incorrect password") {
                setError("password", { message: "Sai mật khẩu" });
            }
        }
    }

    const handleLogin = async (token: string) => {
        try {
            const user = await mainApi.get(
                apiEndpoints.CURRENT_USER,
                apiEndpoints.getAccessToken(token)
            );
            const expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() + 3);
            
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
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            navigate("/");
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    }

    return (
        <Spin spinning={loading}>
            <div className="h-screen md:flex font-eb-garamond">
                {/* Left Side */}
                <div className="relative overflow-hidden md:flex hidden w-1/2 bg-gradient-to-tr from-primary-0 to-light-0 i justify-around items-center">
                    {/* Logo */}
                    <div className="flex flex-row items-center">
                        <img src="src/assets/nguyenshome_logo_white.png" alt="logo" className="h-25 w-20"/>

                        <div className="mt-6 ml-2">
                            <div className="text-white text-3xl whitespace-nowrap">NGUYEN'S HOME</div>
                            <div className="text-white text-center text-xl">FURNITURE</div>    
                        </div>
                    </div>
                    
                    {/* 4 Circles */}
                    <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                </div>

                {/* Right Side */}
                <div className="flex md:w-1/2 justify-center items-center py-10 bg-white">
                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
                        <h1 className="text-dark-0 font-bold text-3xl mb-2">Hello Again!</h1>
                        <p className="text-primary-0 font-medium text-lg mb-7">WELCOME BACK</p>
                        
                        <div className="flex items-center border-2 border-secondary-1 py-2 px-3 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="#8F8681" className="w-5 h-5">
                                <path strokeLinecap="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                            </svg>

                            <input {...register("email", { required: "Email không được để trống" })} className="pl-2 outline-none border-none text-lg" type="email" placeholder="Your email" />
                        </div>
                        <p className="text-red-700 text-base mb-4">{errors.email?.message}</p>

                        <div className="flex items-center border-2 border-secondary-1 py-2 px-3 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="#8F8681" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>

                            <input {...register("password", { required: "Password không được để trống", minLength: { value: 8, message: "Password phải có ít nhất 8 ký tự" } })} className="pl-2 outline-none border-none text-lg" type={showPassword ? "text" : "password"} placeholder="Password" />

                            {/* Show Password */}
                            {showPassword ? 
                                <svg onClick={() => setShowPassword(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="#8F8681" className="w-5 h-5 hover:cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                                :
                                <svg onClick={() => setShowPassword(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="#8F8681" className="w-5 h-5 hover:cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                        </div>
                        <p className="text-red-700 text-base">{errors.password?.message}</p>

                        <button type="submit" className="block w-full bg-dark-1 mt-4 py-2 rounded-md text-white font-semibold mb-4">LOGIN</button>
                    </form>
                </div>
            </div>
        </Spin>
    )
}

export default Login;