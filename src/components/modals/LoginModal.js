import React, { useContext, useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import AuthContext from '../../contexts/UserContext';

const LoginModal = ({ open, onClose }) => {
    const { onLogin } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // 로그인
    const handleLogin = async () => {
        try {
            await axios.post(
                `${process.env.REACT_APP_BASE_URL}/user/login`,
                { email, password },
                {
                    withCredentials: true, // 쿠키를 전달받기 위한 설정
                },
            );

            onLogin();
            setEmail('');
            setPassword('');
            setErrorMessage('');

            onClose();
        } catch (e) {
            setErrorMessage(e.response.data.statusMessage);
        }
    };

    // 카카오 로그인
    const handleKakaoLogin = async () => {
        const result = await Swal.fire({
            width: '40rem',
            html: '<div style="color: #333; text-align: center; line-height: 2;">동일한 이메일로 저장된 회원정보가 있다면 자동으로 계정 연동이 진행됩니다.<br />그래도 진행하시겠습니까?</div>',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            confirmButtonColor: '#0d41e1',
            didOpen: () => {
                const popup = document.querySelector('.swal2-container');
                if (popup) {
                    popup.style.fontFamily = '"Do Hyeon", sans-serif';
                    document.body.appendChild(popup);
                    popup.style.zIndex = '2001';
                }
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        window.location.href = `${process.env.REACT_APP_BASE_URL}/social_login/kakao`;
        onLogin();
        onClose();
    };

    // 네이버 로그인
    const handleNaverLogin = async () => {
        const result = await Swal.fire({
            width: '40rem',
            html: '<div style="color: #333; text-align: center; line-height: 2;">동일한 이메일로 저장된 회원정보가 있다면 자동으로 계정 연동이 진행됩니다.<br />그래도 진행하시겠습니까?</div>',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            confirmButtonColor: '#0d41e1',
            didOpen: () => {
                const popup = document.querySelector('.swal2-container');
                if (popup) {
                    popup.style.fontFamily = '"Do Hyeon", sans-serif';
                    document.body.appendChild(popup);
                    popup.style.zIndex = '2001';
                }
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        window.location.href = `${process.env.REACT_APP_BASE_URL}/social_login/naver`;
        onLogin();
        onClose();
    };

    // 구글 로그인
    const handleGoogleLogin = async () => {
        const result = await Swal.fire({
            width: '40rem',
            html: '<div style="color: #333; text-align: center; line-height: 2;">동일한 이메일로 저장된 회원정보가 있다면 자동으로 계정 연동이 진행됩니다.<br />그래도 진행하시겠습니까?</div>',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            confirmButtonColor: '#0d41e1',
            didOpen: () => {
                const popup = document.querySelector('.swal2-container');
                if (popup) {
                    popup.style.fontFamily = '"Do Hyeon", sans-serif';
                    document.body.appendChild(popup);
                    popup.style.zIndex = '2001';
                }
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        window.location.href = `${process.env.REACT_APP_BASE_URL}/social_login/google`;
        onLogin();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ color: '#0d41e1', paddingBottom: '0', textAlign: 'center', fontSize: '1.8rem' }}>
                로그인
            </DialogTitle>

            <DialogContent>
                {/* 이메일 입력 */}
                <TextField fullWidth label='이메일' margin='normal' value={email} onChange={(e) => setEmail(e.target.value)} />

                {/* 비밀번호 입력 */}
                <TextField
                    fullWidth
                    label='비밀번호'
                    type='password'
                    margin='normal'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* 에러 메시지 */}
                <Box sx={{ color: 'red', mt: 1, minHeight: '1.5em', textAlign: 'center', fontWeight: '600' }}>
                    {errorMessage || ' '}
                </Box>

                {/* 로그인 버튼 */}
                <Button
                    fullWidth
                    variant='contained'
                    sx={{
                        fontSize: '1rem',
                        mt: 2,
                        bgcolor: '#0d41e1',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                    }}
                    onClick={handleLogin}
                >
                    SpotOn 로그인
                </Button>

                {/* 세로로 정렬된 소셜 로그인 버튼 */}
                <Box display='flex' flexDirection='column' gap={2} mt={2}>
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={handleKakaoLogin}
                        startIcon={
                            <img src='logos/kakao_logo.png' alt='Kakao Logo' style={{ width: 25, height: 25, marginRight: 3 }} />
                        }
                        sx={{
                            backgroundColor: '#FEE500',
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            border: 'none',
                            borderRadius: '12px',
                        }}
                    >
                        카카오 로그인
                    </Button>

                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={handleNaverLogin}
                        startIcon={
                            <img src='logos/naver_logo.png' alt='Naver Logo' style={{ width: 25, height: 25, marginRight: 3 }} />
                        }
                        sx={{
                            backgroundColor: '#03C75A',
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            border: 'none',
                            borderRadius: '12px',
                        }}
                    >
                        네이버 로그인
                    </Button>
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={handleGoogleLogin}
                        startIcon={
                            <img
                                src='logos/google_logo.png'
                                alt='Google Logo'
                                style={{ width: 25, height: 25, marginRight: 15 }}
                            />
                        }
                        sx={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            border: '1px solid #D1D1D1',
                            borderRadius: '12px',
                        }}
                    >
                        구글 로그인
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default LoginModal;
