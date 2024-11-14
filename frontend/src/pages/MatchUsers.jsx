import * as React from 'react';
import { CssBaseline, Box } from "@mui/material";
import { Helmet } from 'react-helmet-async';
import MatchComponent from '../components/Matchmaking';

const MatchUsers = () => {
    return (
        <>  
            <Helmet>
                <title>Match User</title>
            </Helmet>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <MatchComponent/>
            </Box>
        </>
    );
}

export default MatchUsers;