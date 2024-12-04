import { AppBar, Button, Container, Grid, Toolbar, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/UserContext';
import LoginModal from './modals/LoginModal';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { NotificationAdd } from '@mui/icons-material';

const Header = () => {
    const { isLoggedIn, userAuth, onLogout } = useContext(AuthContext);
    const navigate = useNavigate();

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
        <AppBar position='static ' sx={{ backgroundColor: 'transparent' }}>
            <Toolbar sx={{ height: '80px' }}>
                <Container>
                    <Grid container alignItems='center'>
                        <Grid
                            item
                            xs={9}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Button component={Link} to='/'>
                                <Typography
                                    sx={{
                                        color: '#0d41e1',
                                        fontSize: '2.5rem',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        '&:hover': {
                                            color: '#002f60',
                                            backgroundColor: 'transparent',
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    SpotOn
                                </Typography>
                            </Button>

                            <Button
                                sx={{
                                    color: '#0c0f0a',
                                    fontSize: '1.2rem',
                                    fontWeight: '500',
                                    ml: 3,
                                    mr: 1,
                                    top: '3px',
                                    '&:hover': {
                                        color: '#0d41e1',
                                    },
                                }}
                                component={Link}
                                to='/game'
                            >
                                경기 일정
                            </Button>

                            <Button
                                sx={{
                                    color: '#0c0f0a',
                                    fontSize: '1.2rem',
                                    fontWeight: '500',
                                    top: '3px',
                                    '&:hover': {
                                        color: '#0d41e1',
                                    },
                                }}
                                component={Link}
                                to='/community'
                            >
                                커뮤니티
                            </Button>

                            <Button
                                sx={{
                                    color: '#0c0f0a',
                                    fontSize: '1.2rem',
                                    fontWeight: '500',
                                    top: '3px',
                                    '&:hover': {
                                        color: '#0d41e1',
                                    },
                                }}
                                component={Link}
                                to='/share'
                            >
                                나눔
                            </Button>
                            <Button
                                sx={{
                                    color: '#0c0f0a',
                                    fontSize: '1.2rem',
                                    fontWeight: '500',
                                    top: '3px',
                                    '&:hover': {
                                        color: '#0d41e1',
                                    },
                                }}
                                component={Link}
                                to='/product/manage'
                            >
                                상품관리
                            </Button>
                        </Grid>

                        <Grid
                            item
                            xs={3}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            {isLoggedIn ? (
                                <>
                                    <Button
                                        sx={{ color: '#0d41e1', fontSize: '1.2rem', fontWeight: '500', top: '3px' }}
                                        component={Link}
                                        to='/mypage'
                                    >
                                        마이페이지
                                    </Button>
                                    <Button
                                        sx={{ color: '#0d41e1', fontSize: '1.2rem', fontWeight: '500', top: '3px' }}
                                        onClick={handelLogout}
                                    >
                                        로그아웃
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        sx={{ color: '#0d41e1', fontSize: '1.2rem', fontWeight: '500', top: '2.5px' }}
                                        component={Link}
                                        to='/signup'
                                    >
                                        회원가입
                                    </Button>
                                    <Button
                                        sx={{ color: '#0d41e1', fontSize: '1.2rem', fontWeight: '500', top: '2.5px', ml: 2 }}
                                        onClick={handleLoginClick}
                                    >
                                        로그인
                                    </Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Toolbar>
            <LoginModal open={loginOpen} onClose={handleLoginClose} />
        </AppBar>
    );
};

export default Header;
