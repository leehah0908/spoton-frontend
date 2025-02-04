import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const EsportsComponent = ({}) => {
    return (
        <Container maxWidth='lg' sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ width: '70%' }}>
                <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    sx={{ width: '83%', textAlign: 'center', backgroundColor: '#f5f5f5', py: 2, mt: 5, mx: 'auto' }}
                >
                    <Typography sx={{ fontSize: 25 }}>E-Sports의 경기 상세 정보는 서비스 준비중입니다!</Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default EsportsComponent;
