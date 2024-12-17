import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Footer = () => {
    return (
        <Box
            component='footer'
            sx={{
                backgroundColor: 'white',
                color: '#fff',
                py: 4,
            }}
        >
            <Container maxWidth='lg'>
                {/* 푸터 하단 섹션 */}
                <Box textAlign='center'>
                    <Typography variant='body2' color='gray'>
                        © 2024 SpotOn. All Rights Reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
