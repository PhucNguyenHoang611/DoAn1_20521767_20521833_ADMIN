import { ThemeOptions } from '@mui/material/styles';

export const themeSettings: ThemeOptions = {
    palette: {
        mode: "light",
        primary: {
            light: "#b99a94",
            main: "#a67f78",
            dark: "#886059"
        },
        secondary: {
            light: "#a69f9b",
            main: "#8f8681",
            dark: "#716864"
        },
        background: {
            default: "#ffffff",
            paper: "#ffffff"
        }
    },
    typography: {
        fontFamily: "EB Garamond"
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    ...(ownerState.color === "primary" && {
                        backgroundColor: "white",
                        color: "black"
                    })
                })
            }
        }
    }
};