export const getAccessToken = (token: string) => ({
    headers: {
        Authorization: "Bearer " + token
    }
});

// Current logged in user
export const CURRENT_USER = "/staffs/getCurrentStaff";

// Login
export const LOGIN = "/staffs/loginStaff";
export const getLoginBody = (email: string, password: string) => ({
    staffEmail: email,
    staffPassword: password
});