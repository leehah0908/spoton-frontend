import React, { useContext, useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import axios from 'axios';
import AuthContext from '../contexts/UserContext';

const LoginModal = ({ open, onClose }) => {
    const { onLogin } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/user/login`, { email, password }, { withCredentials: true });
            onLogin();
            setEmail('');
            setPassword('');
            setErrorMessage('');

            onClose();
        } catch (e) {
            setErrorMessage(e.response.data.statusMessage);
        }
    };

    const handleKakaoLogin = async () => {
        window.location.href = `${process.env.REACT_APP_BASE_URL}/social_login/kakao`;
        onLogin();
        onClose();
    };

    const handleNaverLogin = async () => {
        window.location.href = `${process.env.REACT_APP_BASE_URL}/social_login/naver`;
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
                {errorMessage && <Box sx={{ color: 'red', mt: 1 }}>{errorMessage}</Box>}

                {/* 로그인 버튼 */}
                <Button fullWidth variant='contained' sx={{ mt: 2, bgcolor: '#0d41e1' }} onClick={handleLogin}>
                    로그인
                </Button>

                {/* 세로로 정렬된 소셜 로그인 버튼 */}
                <Box display='flex' flexDirection='column' gap={2} mt={2}>
                    <Button variant='outlined' color='primary' onClick={handleKakaoLogin}>
                        카카오 로그인
                    </Button>
                    <Button variant='outlined' color='primary' onClick={handleNaverLogin}>
                        네이버 로그인
                    </Button>
                    <Button variant='outlined' color='primary'>
                        구글 로그인
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default LoginModal;
