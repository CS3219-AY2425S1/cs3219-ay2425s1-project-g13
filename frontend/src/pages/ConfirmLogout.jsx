import * as React from 'react';
import { CssBaseline, Box } from "@mui/material";
import { Helmet } from 'react-helmet-async';

const ConfirmLogout = () => {


    return (
        <>
            <Helmet>
                <title>Confirm Logout</title>
            </Helmet>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
            </Box>
        </>
    );
}

export default ConfirmLogout;