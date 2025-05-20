import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/UserContext';
import LoginModal from './modals/LoginModal';

const Header = () => {
    const { isLoggedIn, onLogout } = useContext(AuthContext);
    const location = useLocation();

    const [loginOpen, setLoginOpen] = useState(false);

    const handleLoginClick = () => {
        setLoginOpen(true);
    };

    const handleLoginClose = () => {
        setLoginOpen(false);
    };

    const handelLogout = () => {
        onLogout();
    };

    return (
        <AppBar position='static' sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Container maxWidth='lg'>
                <Toolbar disableGutters sx={{ mt: 2, mb: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Box>
                            <Button
                                component={Link}
                                to='/'
                                disableRipple
                                sx={{
                                    py: 0,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#0d41e1',
                                        fontSize: 40,
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                    }}
                                >
                                    SpotOn
                                </Typography>
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Box>
                                {isLoggedIn ? (
                                    <Box sx={{ mb: 1 }}>
                                        <Button
                                            disableRipple
                                            sx={{
                                                p: 0,
                                                color: 'gray',
                                                fontSize: 13,
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                            component={Link}
                                            to='/mypage'
                                        >
                                            마이페이지
                                        </Button>
                                        <Button
                                            disableRipple
                                            sx={{
                                                p: 0,
                                                color: 'gray',
                                                fontSize: 13,
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                            onClick={handelLogout}
                                        >
                                            로그아웃
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box sx={{ mb: 1 }}>
                                        <Button
                                            disableRipple
                                            sx={{
                                                p: 0,
                                                color: 'gray',
                                                fontSize: 13,
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                            component={Link}
                                            to='/signup'
                                        >
                                            회원가입
                                        </Button>
                                        <Button
                                            disableRipple
                                            sx={{
                                                p: 0,
                                                color: 'gray',
                                                fontSize: 13,
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                            onClick={handleLoginClick}
                                        >
                                            로그인
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            <Box>
                                <Button
                                    disableRipple
                                    sx={{
                                        color: location.pathname === '/' ? '#0d41e1' : 'black',
                                        fontSize: 20,
                                        mr: 2,
                                        p: 0,
                                        '&:hover': {
                                            color: '#0d41e1',
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                    component={Link}
                                    to='/'
                                >
                                    홈
                                </Button>

                                <Button
                                    disableRipple
                                    sx={{
                                        color: location.pathname === '/game' ? '#0d41e1' : 'black',
                                        fontSize: 20,
                                        mr: 2,
                                        p: 0,
                                        '&:hover': {
                                            color: '#0d41e1',
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                    component={Link}
                                    to='/game'
                                >
                                    경기 일정
                                </Button>

                                <Button
                                    disableRipple
                                    sx={{
                                        color: location.pathname === '/community' ? '#0d41e1' : 'black',
                                        fontSize: 20,
                                        p: 0,
                                        '&:hover': {
                                            color: '#0d41e1',
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                    component={Link}
                                    to='/community'
                                >
                                    커뮤니티
                                </Button>

                                <Button
                                    disableRipple
                                    sx={{
                                        color: location.pathname === '/nanum' ? '#0d41e1' : 'black',
                                        fontSize: 20,
                                        p: 0,
                                        '&:hover': {
                                            color: '#0d41e1',
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                    component={Link}
                                    to='/nanum'
                                >
                                    나눔
                                </Button>

                                <Button
                                    disableRipple
                                    sx={{
                                        color: location.pathname === '/chat' ? '#0d41e1' : 'black',
                                        fontSize: 20,
                                        p: 0,
                                        '&:hover': {
                                            color: '#0d41e1',
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                    component={Link}
                                    to='/chat'
                                >
                                    채팅 목록
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
            <LoginModal open={loginOpen} onClose={handleLoginClose} />
        </AppBar>
    );
};

export default Header;
