import { AppBar, Button, Container, Grid, Toolbar, Typography } from '@mui/material';
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
        <AppBar position='static ' sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Toolbar sx={{ height: '100%' }}>
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
                            <Button
                                component={Link}
                                to='/'
                                disableRipple
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#0d41e1',
                                        fontSize: '2.5rem',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                    }}
                                >
                                    SpotOn
                                </Typography>
                            </Button>

                            <Button
                                disableRipple
                                sx={{
                                    color: location.pathname === '/game' ? '#0d41e1' : 'black',
                                    fontSize: '1.2rem',
                                    fontWeight: '500',
                                    ml: 3,
                                    mr: 1,
                                    top: '3px',
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
                                    fontSize: '1.2rem',
                                    fontWeight: '500',
                                    top: '3px',
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
                                    color: location.pathname === '/share' ? '#0d41e1' : 'black',
                                    fontSize: '1.2rem',
                                    fontWeight: '500',
                                    top: '3px',
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
                                        disableRipple
                                        sx={{
                                            color: '#0d41e1',
                                            fontSize: '1.2rem',
                                            fontWeight: '500',
                                            top: '3px',
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
                                            color: '#0d41e1',
                                            fontSize: '1.2rem',
                                            fontWeight: '500',
                                            top: '3px',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                        onClick={handelLogout}
                                    >
                                        로그아웃
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        disableRipple
                                        sx={{
                                            color: '#0d41e1',
                                            fontSize: '1.2rem',
                                            fontWeight: '500',
                                            top: '2.5px',
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
                                            color: '#0d41e1',
                                            fontSize: '1.2rem',
                                            fontWeight: '500',
                                            top: '2.5px',
                                            ml: 2,
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
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
