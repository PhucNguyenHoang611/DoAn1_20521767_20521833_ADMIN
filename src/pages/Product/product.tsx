import { useState, useEffect } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getAllProds } from '@/redux/reducers/product_reducer'


const tableColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
        editable: true,
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
        editable: true,
    },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 110,
        editable: true,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
];
  
const tableRows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const Product = () => {
    const dispatch = useDispatch();
    const [allProducts, setAllProducts] = useState();
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const allProds = useSelector((state: RootState) => state.product.allProds);

    const getAllProducts = async () => {
        try {
            const productsList = await mainApi.get(
                apiEndpoints.GET_ALL_PRODUCTS
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = productsList.data.data.map((product: any, index: any) => {
                return {
                    index: index,
                    ...product
                }
            });
            
            setAllProducts(result);
            dispatch(getAllProds(result));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currentUser) {
            if (allProds) {
                setAllProducts(allProds);
            } else {
                getAllProducts();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%">
            <Box display="flex" flexDirection="row" width="100%" height="10%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Sản phẩm
                </Typography>
                <Button sx={{ backgroundColor: "#716864" }}>
                    <PlusCircleIcon className="w-6 h-6 text-white" />
                    <Typography className="text-white hidden md:block pl-2" sx={{ fontSize: "0.9rem", fontWeight: "medium" }}>
                        THÊM SẢN PHẨM
                    </Typography>
                </Button>
            </Box>
            <Box width="100%" height="auto" className="px-7 md:px-10">
                <DataGrid
                    rows={tableRows}
                    columns={tableColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{ fontSize: "1rem" }} />
            </Box>
        </Box>
    )
}

export default Product;