import * as React from 'react';
import { CssBaseline, Box } from "@mui/material";
import { Helmet } from 'react-helmet-async';

const SignUp = () => {


    return (
        <>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
            </Box>
        </>
    );
}

export default SignUp;