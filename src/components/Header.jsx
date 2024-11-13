import { AppBar, Button, Container, Grid, Toolbar, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/UserContext';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { NotificationAdd } from '@mui/icons-material';

const Header = () => {
    const { isLoggedIn, userRole, onLogout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handelLogout = () => {
        onLogout();
        alert('로그아웃되었습니다.');
        navigate('/');
    };

    return (
        <AppBar position='static ' sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Toolbar sx={{ height: '80px', paddingTop: '15px', paddingBottom: '15px' }}>
                <Container>
                    <Grid container alignItems='center'>
                        <Grid
                            item
                            xs={6}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Button component={Link} to='/' disableRipple>
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
                                to='/member/list'
                                disableRipple
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
                                to='/member/list'
                                disableRipple
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
                                to='/member/list'
                                disableRipple
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
                                disableRipple
                            >
                                상품관리
                            </Button>
                        </Grid>

                        <Grid
                            item
                            xs={6}
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
                                        disableRipple
                                    >
                                        마이페이지
                                    </Button>
                                    <Button
                                        sx={{ color: '#0d41e1', fontSize: '1.2rem', fontWeight: '500', top: '3px' }}
                                        onClick={handelLogout}
                                        disableRipple
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
                                        disableRipple
                                    >
                                        회원가입
                                    </Button>
                                    <Button
                                        sx={{ color: '#0d41e1', fontSize: '1.2rem', fontWeight: '500', top: '2.5px', ml: 2 }}
                                        component={Link}
                                        to='/login'
                                        disableRipple
                                    >
                                        로그인
                                    </Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
