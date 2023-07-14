/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseURL, mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { DataGrid, GridCellParams, GridColDef, GridRowId } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import { getAllCustomers } from "@/redux/reducers/auth_reducer";
import { EyeIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import CustomerDetailsModal from "@/components/modals/customer/CustomerDetailsModal";
import axios from "axios";

const tableColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "Mã khách hàng",
        width: 220
    },
    {
        field: "name",
        headerName: "Tên khách hàng",
        width: 200
    },
    {
        field: "email",
        headerName:"Email",
        width: 270
    },
    {
        field: "dob",
        headerName: "Sinh nhật",
        width: 120
    },
    {
        field: "city",
        headerName: "Tỉnh / Thành phố",
        width: 160
    },
    {
        field: "action",
        headerName: "",
        width: 150,
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => <RenderCell customerId={params.id} />
    }
];

interface RenderCellProps {
    customerId: GridRowId;
}
const RenderCell = ({ customerId }: RenderCellProps) => {
    const dispatch = useDispatch();
    const [openCustomerDetailsModal, setOpenCustomerDetailsModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [openActiveDialog, setOpenActiveDialog] = useState(false);
    const [openActiveSnackbar, setOpenActiveSnackbar] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<any>(null);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    const getCustomer = async () => {
        try {
            const customer = await mainApi.get(
                apiEndpoints.GET_CUSTOMER(customerId.toString())
            );

            setCurrentCustomer(customer.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleActiveInactiveCustomer = async (action: string) => {
        try {
            await axios({
                method: "PUT",
                url: `${baseURL}/customers/activeOrInactiveCustomer/${customerId.toString()}`,
                headers: {
                    Authorization: "Bearer " + currentUser.token
                }
            });

            const listCustomers = await mainApi.get(
                apiEndpoints.GET_ALL_CUSTOMERS,
                apiEndpoints.getAccessToken(currentUser.token)
            );

            dispatch(getAllCustomers(listCustomers.data.data));
            getCustomer();
        } catch (error: any) {
            console.log(error);
        }

        if (action === "Inactive") {
            setOpenSnackbar(true);
            setOpenDialog(false);
        } else if (action === "Active") {
            setOpenActiveSnackbar(true);
            setOpenActiveDialog(false);
        }
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleCloseActiveDialog = () => {
        setOpenActiveDialog(false);
    }

    const handleCloseActiveSnackbar = () => {
        setOpenActiveSnackbar(false);
    }

    useEffect(() => {
        if (!currentCustomer) getCustomer();
    }, [customerId]);

    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Chi tiết">
                <IconButton size="small" sx={{ backgroundColor: "#32435F", mr: 3 }} onClick={() => setOpenCustomerDetailsModal(true)}>
                    <EyeIcon className="w-5 h-5 text-white" />
                </IconButton>
            </Tooltip>
            {currentCustomer?.isActive ? (
                <Tooltip title="Vô hiệu hóa">
                    <IconButton size="small" sx={{ backgroundColor: "#DE5656" }} onClick={() => setOpenDialog(true)}>
                        <LockClosedIcon className="w-5 h-5 text-white" />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Kích hoạt">
                    <IconButton size="small" sx={{ backgroundColor: "#A67F78" }} onClick={() => setOpenActiveDialog(true)}>
                        <LockOpenIcon className="w-5 h-5 text-white" />
                    </IconButton>
                </Tooltip>
            )}
            
            <CustomerDetailsModal customerId={customerId} isModalOpen={openCustomerDetailsModal} setIsModalOpen={setOpenCustomerDetailsModal} />

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Vô hiệu hóa tài khoản
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn vô hiệu hóa tài khoản của khách hàng này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                        <Button onClick={() => handleActiveInactiveCustomer("Inactive")}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Vô hiệu hóa thành công
                </Alert>
            </Snackbar>

            <Dialog
                open={openActiveDialog}
                onClose={handleCloseActiveDialog}
                aria-labelledby="dialog-title">
                    <DialogTitle id="dialog-title">
                        Kích hoạt tài khoản ?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ whiteSpace: "nowrap" }}>
                            Bạn có chắc chắn muốn kích hoạt lại tài khoản của khách hàng này ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseActiveDialog}>Hủy bỏ</Button>
                        <Button onClick={() => handleActiveInactiveCustomer("Active")}>Xác nhận</Button>
                    </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "left" }} open={openActiveSnackbar} autoHideDuration={2000} onClose={handleCloseActiveSnackbar}>
                <Alert onClose={handleCloseActiveSnackbar} severity="success" sx={{ width: "100%" }}>
                    Kích hoạt thành công
                </Alert>
            </Snackbar>
        </Box>
    )
}

const NoRowsOverlay = () => {
    return <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">Không có dữ liệu</Box>;
};

const Customer = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [allCustomers, setAllCustomers] = useState();
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const customers = useSelector((state: RootState) => state.auth.allCustomers);

    const getCustomers = async () => {
        setIsLoading(true);

        try {
            const listCustomers = await mainApi.get(
                apiEndpoints.GET_ALL_CUSTOMERS,
                apiEndpoints.getAccessToken(currentUser.token)
            );

            setAllCustomers(listCustomers.data.data);
            getTableRows(listCustomers.data.data);
            dispatch(getAllCustomers(listCustomers.data.data));
        } catch (error: any) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (customer: any) => {
                const city = await getCustomerCity(customer._id);

                return {
                    id: customer._id,
                    name: customer.customerLastName + " " + customer.customerFirstName,
                    email: customer.customerEmail,
                    dob: new Date(customer.customerBirthday).toLocaleDateString(),
                    city: city ? city : ""
                };
            })
        );
        setTableRows(rows);
        setIsLoading(false);
    }

    const getCustomerCity = async (id: string) => {
        try {
            const city = await mainApi.get(
                apiEndpoints.GET_CUSTOMER_DEFAULT_ADDRESS(id)
            );

            return city.data.data ? city.data.data.receiverCity : "";
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currentUser) {
            if (customers) {
                setAllCustomers(customers);
                getTableRows(customers);
            }
            else {
                getCustomers();
            }
        }
    }, [currentUser, customers]);

    useEffect(() => {

    }, [allCustomers]);
    
    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="15%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Khách hàng
                </Typography>
            </Box>
            <Box width="100%" height="80%" className="px-7 md:px-10">
                <DataGrid
                    loading={isLoading}
                    rows={tableRows}
                    columns={tableColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        }
                    }}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                    sx={{ fontSize: "1rem" }}
                    slots={{
                        noRowsOverlay: NoRowsOverlay
                    }} />
            </Box>
        </Box>
    )
}

export default Customer;