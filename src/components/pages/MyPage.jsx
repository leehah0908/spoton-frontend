import React, { useEffect, useState } from 'react';
import DashBoard from '../DashBoard';
import ChangeInfo from '../ChangeInfo';
import { Box, Container, Typography } from '@mui/material';
import AccountManage from '../AccountManage';

const MyPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('dashBoard');

    useEffect(() => {
        sessionStorage.removeItem('gameState');
    }, []);

    return (
        <Container
            maxWidth='100%'
            disableGutters
            sx={{ bgcolor: '#f5f5f5', borderRadius: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
        >
            <Box display='flex' flexDirection='row'>
                {/* 메뉴 섹션 */}
                <Box
                    display='flex'
                    flexDirection='column'
                    gap={2}
                    sx={{ width: '20%', height: 850, borderRight: '1px solid #ddd' }}
                >
                    <Box onClick={() => setSelectedMenu('dashBoard')} sx={{ cursor: 'pointer' }}>
                        <Typography sx={{ fontSize: 20, color: selectedMenu === 'dashBoard' ? '#0d41e1' : 'black', pt: 5 }}>
                            대시보드
                        </Typography>
                    </Box>

                    <Box onClick={() => setSelectedMenu('changeInfo')} sx={{ cursor: 'pointer' }}>
                        <Typography sx={{ fontSize: 20, color: selectedMenu === 'changeInfo' ? '#0d41e1' : 'black' }}>
                            내 정보 수정
                        </Typography>
                    </Box>

                    <Box onClick={() => setSelectedMenu('accountManage')} sx={{ cursor: 'pointer' }}>
                        <Typography sx={{ fontSize: 20, color: selectedMenu === 'accountManage' ? '#0d41e1' : 'black' }}>
                            계정 관리
                        </Typography>
                    </Box>
                </Box>

                {/* 콘텐츠 섹션 */}
                <Box
                    sx={{
                        width: '80%',
                        height: 850,
                        padding: 3,
                        bgcolor: '#fff',
                        borderRadius: '0 8px 8px 0',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
                    }}
                >
                    {
                        {
                            dashBoard: <DashBoard />,
                            changeInfo: <ChangeInfo />,
                            accountManage: <AccountManage />,
                        }[selectedMenu]
                    }
                </Box>
            </Box>
        </Container>
    );
};

export default MyPage;
