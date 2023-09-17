/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from '@/redux/store';
import { ArrowLongDownIcon, ArrowLongUpIcon, BanknotesIcon, ClipboardDocumentListIcon, MinusCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import ReactApexChart from 'react-apexcharts';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const Dashboard = () => {
    const [newCustomers, setNewCustomers] = useState(0);
    const [newOrders, setNewOrders] = useState(0);
    const [percentGrowth, setPercentGrowth] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [revenuePercentGrowth, setRevenuePercentGrowth] = useState(0);
    const [expenditureThisMonth, setExpenditureThisMonth] = useState(0);
    const [orderPerMonth, setOrderPerMonth] = useState<any[]>([]);
    const [revenuePerMonth, setRevenuePerMonth] = useState<any[]>([]);


    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const currentToken = useSelector((state: RootState) => state.auth.currentUser.token);

    const getNewCustomers = async () => {
        try {
            const result = await mainApi.get(
                apiEndpoints.COUNT_NEW_CUSTOMERS,
                apiEndpoints.getAccessToken(currentToken)
            );

            setNewCustomers(result.data.count);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getNewOrders = async () => {
        try {
            const result = await mainApi.get(
                apiEndpoints.COUNT_NEW_ORDERS_OF_MONTH,
                apiEndpoints.getAccessToken(currentToken)
            );

            setNewOrders(result.data.count);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getPercentGrowth = async () => {
        try {
            const result = await mainApi.get(
                apiEndpoints.GET_PERCENT_GROWTH,
                apiEndpoints.getAccessToken(currentToken)
            );

            setPercentGrowth(result.data.percent);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getRevenue = async () => {
        try {
            const result = await mainApi.get(
                apiEndpoints.GET_REVENUE_OF_MONTH,
                apiEndpoints.getAccessToken(currentToken)
            );

            setRevenue(result.data.revenue);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getRevenuePercentGrowth = async () => {
        try {
            const revenueThisMonth = await mainApi.get(
                apiEndpoints.GET_REVENUE_OF_MONTH,
                apiEndpoints.getAccessToken(currentToken)
            );

            const revenueLastMonth = await mainApi.get(
                apiEndpoints.GET_REVENUE_OF_LAST_MONTH,
                apiEndpoints.getAccessToken(currentToken)
            );

            const result = (revenueThisMonth.data.revenue / revenueLastMonth.data.revenue - 1) * 100; 

            setRevenuePercentGrowth(parseFloat((Math.round(result * 100) / 100).toFixed(2)));
        } catch (error: any) {
            console.log(error);
        }
    }

    const getExpenditureOfMonth = async () => {
        try {
            const revenueThisMonth = await mainApi.get(
                apiEndpoints.GET_REVENUE_OF_MONTH,
                apiEndpoints.getAccessToken(currentToken)
            );

            const importTotalPriceThisMonth = await mainApi.get(
                apiEndpoints.GET_TOTAL_IMPORT_PRICE_OF_MONTH,
                apiEndpoints.getAccessToken(currentToken)
            );

            const result = (revenueThisMonth.data.revenue / (revenueThisMonth.data.revenue + importTotalPriceThisMonth.data.total)) * 100; 
            
            if (result)
                setExpenditureThisMonth(parseFloat((Math.round(result * 100) / 100).toFixed(2)));
            else
                setExpenditureThisMonth(100);
            
        } catch (error: any) {
            console.log(error);
        }
    }

    const getOrderPerMonth = async (year: number) => {
        try {
            const result = await mainApi.get(
                apiEndpoints.GET_ORDER_PER_MONTH(year),
                apiEndpoints.getAccessToken(currentToken)
            );

            setOrderPerMonth(result.data.result);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getRevenuePerMonth = async (year: number) => {
        try {
            const result = await mainApi.get(
                apiEndpoints.GET_REVENUE_PER_MONTH(year),
                apiEndpoints.getAccessToken(currentToken)
            );

            setRevenuePerMonth(result.data.result);
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currentUser) {
            getNewCustomers();
            getNewOrders();
            getPercentGrowth();
            getRevenue();
            getRevenuePercentGrowth();
            getExpenditureOfMonth();
            getOrderPerMonth(new Date().getFullYear());
            getRevenuePerMonth(new Date().getFullYear());
        }
    }, [currentUser]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="auto" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Trang chủ
                </Typography>
            </Box>

            <Box width="100%" height="auto" display="flex" justifyContent="space-between" alignItems="center" className="px-7 md:px-10 mt-6">
                <Box width="32%" height="100%" display="flex" sx={{ border: "1px solid #716864", p: 2, borderRadius: "10px" }}>
                    <Box width="80%" height="100%" display="flex" flexDirection="column" justifyContent="center">
                        <Box display="flex" alignItems="end">
                            <Typography className="text-black" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                                {newOrders}
                            </Typography>
                            {revenuePercentGrowth >= 0 && (
                                <Typography display="flex" className="text-black" sx={{ fontSize: "1.3rem", fontWeight: "bold", color: "green", ml: 2 }}>
                                    +{revenuePercentGrowth}%
                                    <ArrowLongUpIcon className="h-7 w-6" style={{ color: "green" }} />
                                </Typography>
                            )}

                            {revenuePercentGrowth < 0 && (
                                <Typography display="flex" className="text-black" sx={{ fontSize: "1.3rem", fontWeight: "bold", color: "#DE5656", ml: 2 }}>
                                    -{revenuePercentGrowth}%
                                    <ArrowLongDownIcon className="h-7 w-6" style={{ color: "#DE5656" }} />
                                </Typography>
                            )}
                        </Box>
                        <Typography className="text-primary-0" sx={{ fontSize: "1.1rem", fontWeight: "medium" }}>
                            Đơn hàng mới
                        </Typography>
                    </Box>

                    <Box width="20%" height="100%" display="flex" justifyContent="center" alignItems="center">
                        <ClipboardDocumentListIcon className="h-8 w-8 text-dark-1 stroke-2" />
                    </Box>
                </Box>

                <Box width="32%" height="100%" display="flex" sx={{ border: "1px solid #716864", p: 2, borderRadius: "10px" }}>
                    <Box width="80%" height="100%" display="flex" flexDirection="column" justifyContent="center">
                        <Box display="flex" alignItems="end">
                            <Typography className="text-black" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                                {revenue.toLocaleString("vi-VN", {style : "currency", currency : "VND"})}
                            </Typography>
                            {percentGrowth >= 0 && (
                                <Typography display="flex" className="text-black" sx={{ fontSize: "1.3rem", fontWeight: "bold", color: "green", ml: 2 }}>
                                    +{percentGrowth}%
                                    <ArrowLongUpIcon className="h-7 w-6" style={{ color: "green" }} />
                                </Typography>
                            )}

                            {percentGrowth < 0 && (
                                <Typography display="flex" className="text-black" sx={{ fontSize: "1.3rem", fontWeight: "bold", color: "#DE5656", ml: 2 }}>
                                    -{percentGrowth}%
                                    <ArrowLongDownIcon className="h-7 w-6" style={{ color: "#DE5656" }} />
                                </Typography>
                            )}
                        </Box>
                        <Typography className="text-primary-0" sx={{ fontSize: "1.1rem", fontWeight: "medium" }}>
                            Doanh thu tháng
                        </Typography>
                    </Box>

                    <Box width="20%" height="100%" display="flex" justifyContent="center" alignItems="center">
                        <BanknotesIcon className="h-8 w-8 text-dark-1 stroke-2" />
                    </Box>
                </Box>
                
                <Box width="32%" height="100%" display="flex" sx={{ border: "1px solid #716864", p: 2, borderRadius: "10px" }}>
                    <Box width="80%" height="100%" display="flex" flexDirection="column" justifyContent="center">
                        <Typography className="text-black" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                            {newCustomers}
                        </Typography>
                        <Typography className="text-primary-0" sx={{ fontSize: "1.1rem", fontWeight: "medium" }}>
                            Khách hàng mới
                        </Typography>
                    </Box>

                    <Box width="20%" height="100%" display="flex" justifyContent="center" alignItems="center">
                        <UserPlusIcon className="h-8 w-8 text-dark-1 stroke-2" />
                    </Box>
                </Box>
            </Box>

            <Box width="100%" height="auto" display="flex" justifyContent="space-between" alignItems="center" className="px-7 md:px-10 mt-6">
                <Box width="40%" height="100%" display="flex" flexDirection="column" sx={{ border: "1px solid #716864", p: 4, borderRadius: "10px" }}>
                    <Typography className="text-primary-0" sx={{ fontSize: "1.3rem", fontWeight: "bold", mb: 8 }}>
                        Tỷ lệ chi phí trên doanh thu
                    </Typography>
                    <Box width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center" >
                        <ReactApexChart
                            height={250}
                            options={{
                                chart: {
                                    type: "donut",
                                    width: "100%",
                                },
                                colors: ["#B8ACA5", "#32435F"],
                                labels: ["Doanh thu", "Chi phí"],
                                dataLabels: {
                                enabled: false,
                                },
                                stroke: {
                                width: 0,
                                },
                                legend: {
                                show: false,
                                },
                                tooltip: {
                                y: {
                                    formatter: function (val) {
                                    return val + "%";
                                    },
                                },
                                },
                            }}
                            series={[100 - expenditureThisMonth, expenditureThisMonth]}
                            type="donut" />

                        
                        <Box display="flex" alignItems="center" >
                            <Typography className="text-gray-500" sx={{ fontSize: "1.1rem", fontWeight: "medium" }}>
                                Chi phí:
                            </Typography>

                            <Typography display="flex" className="text-black" sx={{ fontSize: "1.3rem", fontWeight: "bold", color: "#32435F", ml: 2 }}>
                                {expenditureThisMonth}%
                                <MinusCircleIcon className="h-6 w-6 ml-2" style={{ color: "#32435F", backgroundColor: "#32435F" }} />
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" >
                            <Typography className="text-gray-500" sx={{ fontSize: "1.1rem", fontWeight: "medium" }}>
                                Doanh thu:
                            </Typography>

                            <Typography display="flex" className="text-black" sx={{ fontSize: "1.3rem", fontWeight: "bold", color: "#B8ACA5", ml: 2 }}>
                                {100 - expenditureThisMonth}%
                                <MinusCircleIcon className="h-6 w-6 ml-2" style={{ color: "#B8ACA5", backgroundColor: "#B8ACA5" }} />
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box width="58%" height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="start" sx={{ border: "1px solid #716864", p: 4, borderRadius: "10px" }}>
                    <Typography className="text-primary-0" sx={{ fontSize: "1.3rem", fontWeight: "bold", mb: 2 }}>
                        Số lượng đơn hàng
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box width="100%" display="flex" justifyContent="end">
                            <DateTimePicker
                                views={["year"]}
                                label="Năm"
                                defaultValue={dayjs(new Date())}
                                onChange={(value: any) => {
                                    getOrderPerMonth(new Date(value).getFullYear());
                                }} />
                        </Box>
                    </LocalizationProvider>


                    <ReactApexChart
                        className="w-full"
                        options={{
                            chart: {
                                width: "100%",
                                type: "bar",
                                height: 350,
                                toolbar: {
                                    show: false,
                                },
                            },
                            colors: ["#32435F"],
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    columnWidth: "50%",
                                },
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            xaxis: {
                                labels: {
                                    style: {
                                    fontSize: "15px",
                                    fontWeight: 300,
                                    colors: "#000000",
                                    },
                                },
                                categories: [
                                    "Tháng 1",
                                    "Tháng 2",
                                    "Tháng 3",
                                    "Tháng 4",
                                    "Tháng 5",
                                    "Tháng 6",
                                    "Tháng 7",
                                    "Tháng 8",
                                    "Tháng 9",
                                    "Tháng 10",
                                    "Tháng 11",
                                    "Tháng 12",
                                ],
                            },
                            yaxis: {
                                labels: {
                                    style: {
                                    fontSize: "13px",
                                    fontWeight: 400,
                                    colors: "#32435F",
                                    },
                                    formatter: function (value) {
                                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                    },
                                },
                            },
                            fill: {
                                opacity: 1,
                            }
                        }}
                        series={[{
                            name: "Số lượng đơn hàng",
                            data: orderPerMonth
                        }]}
                        type="bar"
                        height={350} />
                </Box>
            </Box>

            <Box width="100%" height="auto" className="px-7 md:px-10 my-6">
                <Box width="100%" height="100%" display="flex" flexDirection="column" sx={{ border: "1px solid #716864", p: 4, borderRadius: "10px" }}>
                    <Typography className="text-primary-0" sx={{ fontSize: "1.3rem", fontWeight: "bold", mb: 2 }}>
                        Doanh thu theo tháng
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box width="100%" display="flex" justifyContent="end">
                            <DateTimePicker
                                views={["year"]}
                                label="Năm"
                                defaultValue={dayjs(new Date())}
                                onChange={(value: any) => {
                                    getRevenuePerMonth(new Date(value).getFullYear());
                                }} />
                        </Box>
                    </LocalizationProvider>


                    <ReactApexChart
                        options={{
                            chart: {
                                width: "100%",
                                height: "auto",
                                type: "area",
                                toolbar: {
                                    show: false,
                                },
                            },
                            colors: ["#32435F"],
                            dataLabels: {
                                enabled: false,
                            },
                            stroke: {
                                curve: "smooth",
                            },
                            yaxis: {
                                labels: {
                                    style: {
                                        fontSize: "13px",
                                        fontWeight: 400,
                                        colors: "#3E4259",
                                    },
                                    formatter: function (value) {
                                        return value.toLocaleString("vi-VN", {style : "currency", currency : "VND"});
                                    },
                                },
                            },
                        xaxis: {
                                labels: {
                                    style: {
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        colors: "#000000",
                                    },
                                },
                                categories: [
                                    "Tháng 1",
                                    "Tháng 2",
                                    "Tháng 3",
                                    "Tháng 4",
                                    "Tháng 5",
                                    "Tháng 6",
                                    "Tháng 7",
                                    "Tháng 8",
                                    "Tháng 9",
                                    "Tháng 10",
                                    "Tháng 11",
                                    "Tháng 12"
                                ],
                            },
                            tooltip: {
                                y: {
                                    formatter: function (val) {
                                        return val.toLocaleString("vi-VN", {style : "currency", currency : "VND"})
                                    },
                                },
                            }
                        }}
                        series={[{
                            name: "Doanh thu tháng",
                            data: revenuePerMonth
                        }]}
                        type="area"
                        height={350} />
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard;