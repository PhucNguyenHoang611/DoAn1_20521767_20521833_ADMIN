/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ImportTab from "@/components/tabs/import/ImportTab";
import ImportsListTab from "@/components/tabs/import/ImportsListTab";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getImports } from "@/redux/reducers/import_reducer";

const Import = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [allImports, setAllImports] = useState([]);
    const [tempArray, setTempArray] = useState([]);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [filter, setFilter] = useState("Tất cả");
    const [isLoading, setIsLoading] = useState(false);
    const currentToken = useSelector((state: RootState) => state.auth.currentUser.token);
    const dispatch = useDispatch();

    const getAllImports = async () => {
        setIsLoading(true);
        try {
            const importsList = await mainApi.get(
                apiEndpoints.GET_ALL_IMPORTS,
                apiEndpoints.getAccessToken(currentToken)
            );

            setAllImports(importsList.data.data);
            setTempArray(importsList.data.data);
            getTableRows(importsList.data.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const getTableRows = async (result: any) => {
        const rows = await Promise.all(
            result.map(async (imp: any) => {
                const staff = await getStaff(imp.staffId);
                const date = new Date(imp.importDate);

                return {
                    id: imp._id,
                    name: staff,
                    date: date.toLocaleDateString(),
                    status: imp.importStatus
                };
            })
        );
        setTableRows(rows);
        setIsLoading(false);
        dispatch(getImports(false));
    }

    const getStaff = async (id: string) => {
        try {
            const staff = await mainApi.get(
                apiEndpoints.GET_STAFF(id),
                apiEndpoints.getAccessToken(currentToken)
            );
            
            return staff.data.data.staffLastName + " " + staff.data.data.staffFirstName;
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    }

    useEffect(() => {
        if (allImports.length > 0 && tempArray.length > 0) {
            if (filter !== "Tất cả") {
                getTableRows(tempArray.filter((item: any) => item.importStatus === filter));
            } else {
                getTableRows(allImports);
            }
        }
    }, [filter]);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" className="overflow-auto">
            <Box display="flex" flexDirection="row" width="100%" height="10%" className="px-7 md:px-10 justify-between items-center">
                <Typography className="text-primary-0" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    Nhập kho
                </Typography>
            </Box>
            <Box width="100%" height="90%" className="px-7 md:px-10">
                <Box width="100%" height="10%" display="flex" justifyContent="start" alignItems="center">
                    <Tabs value={currentTab} onChange={handleChangeTab} aria-label="basic tabs example">
                        <Tab id="imports-list-tab" label="Danh sách" aria-controls="imports-list-tabpanel" />
                        <Tab id="import-tab" label="Nhập kho" aria-controls="import-tabpanel" />
                    </Tabs>
                </Box>

                <div
                    id="imports-list-tabpanel"
                    role="tabpanel"
                    aria-labelledby="imports-list-tab"
                    hidden={currentTab !== 0}
                    className="w-full h-[85%]">
                        <ImportsListTab
                            isLoading={isLoading}
                            filter={filter}
                            setFilter={setFilter}
                            tableRows={tableRows}
                            getAllImports={getAllImports} />
                </div>

                <div
                    id="import-tab"
                    role="tabpanel"
                    aria-labelledby="import-tabpanel"
                    hidden={currentTab !== 1}
                    className="w-full h-[85%]">
                        <ImportTab
                            getAllImports={getAllImports} />
                </div>
            </Box>
        </Box>
    )
}

export default Import;