import { Container, Typography } from '@mui/material';
import React, { useEffect } from 'react';

const Home = () => {
    useEffect(() => {
        sessionStorage.removeItem('gameState');
    }, []);

    return (
        <Container>
            <Typography variant='h1' align='center' gutterBottom>
                Welcome to the Home Page
            </Typography>
            <Typography variant='body1' align='center'>
                This is the homepage of the application.
            </Typography>
        </Container>
    );
};

export default Home;
