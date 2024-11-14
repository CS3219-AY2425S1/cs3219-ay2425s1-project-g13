import * as React from 'react';
import { CssBaseline, Box } from "@mui/material";
import { Helmet } from 'react-helmet-async';

const ForgotPassword = () => {


    return (
        <>
            <Helmet>
                <title>Forgot Password</title>
            </Helmet>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
            </Box>
        </>
    );
}

export default ForgotPassword;