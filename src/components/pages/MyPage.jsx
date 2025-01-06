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
        <Container maxWidth='lg' disableGutters sx={{ borderRadius: 2 }}>
            <Box display='flex' flexDirection='row'>
                {/* 메뉴 섹션 */}
                <Box display='flex' flexDirection='column' sx={{ width: '20%' }}>
                    <Box>
                        <Typography sx={{ pl: 1, textAlign: 'left', fontSize: 30, color: 'black', pt: 5, mb: 2 }}>
                            마이 페이지
                        </Typography>
                    </Box>

                    <Box onClick={() => setSelectedMenu('dashBoard')} sx={{ cursor: 'pointer' }}>
                        <Typography
                            sx={{
                                pl: 1,
                                mb: 0.5,
                                textAlign: 'left',
                                fontSize: 18,
                                color: selectedMenu === 'dashBoard' ? '#0d41e1' : 'black',
                            }}
                        >
                            대시보드
                        </Typography>
                    </Box>

                    <Box onClick={() => setSelectedMenu('changeInfo')} sx={{ cursor: 'pointer' }}>
                        <Typography
                            sx={{
                                pl: 1,
                                mb: 0.5,
                                textAlign: 'left',
                                fontSize: 18,
                                color: selectedMenu === 'changeInfo' ? '#0d41e1' : 'black',
                            }}
                        >
                            내 정보 수정
                        </Typography>
                    </Box>

                    <Box onClick={() => setSelectedMenu('accountManage')} sx={{ cursor: 'pointer' }}>
                        <Typography
                            sx={{
                                pl: 1,
                                mb: 0.5,
                                textAlign: 'left',
                                fontSize: 18,
                                color: selectedMenu === 'accountManage' ? '#0d41e1' : 'black',
                            }}
                        >
                            계정 관리
                        </Typography>
                    </Box>
                </Box>

                {/* 콘텐츠 섹션 */}
                <Box display='flex' flexDirection='column' sx={{ mt: 5, width: '80%', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontSize: 25, mb: 0.5 }}>
                        {
                            {
                                dashBoard: '대시보드',
                                changeInfo: '내 정보 수정',
                                accountManage: '계정 관리',
                            }[selectedMenu]
                        }
                    </Typography>

                    <Box sx={{ width: '100%', borderTop: '3px solid black', pt: 3 }}>
                        {
                            {
                                dashBoard: <DashBoard setSelectedMenu={setSelectedMenu} />,
                                changeInfo: <ChangeInfo />,
                                accountManage: <AccountManage />,
                            }[selectedMenu]
                        }
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default MyPage;
