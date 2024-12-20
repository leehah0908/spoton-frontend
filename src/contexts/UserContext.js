import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../configs/axios-config';

const AuthContext = React.createContext({
    isLoggedIn: false,
    onLogin: () => {},
    onLogout: () => {},
    userRole: '',
    isInit: false,
    userEmail: '',
});

// provider
export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userAuth, setUserAuth] = useState('');
    const [userProfile, setUserProfile] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isInit, setIsInit] = useState(false);

    // 첫 렌더링시 쿠키를 백으로 보내서 로그인이 유효한지 확인
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await axiosInstance.get('/user/login/check');

                setUserAuth(res.data.result.auth);
                setUserProfile(res.data.result.profile);
                setUserEmail(res.data.result.email);
                setIsLoggedIn(true);
                setIsInit(true);
            } catch (e) {
                setIsInit(true);
            }
        };

        checkLoginStatus();
    }, []);

    // 로그인 핸들러
    const loginHandler = () => {
        setIsLoggedIn(true);
    };

    // 로그아웃 핸들러
    const logoutHandler = async () => {
        try {
            const res = await axiosInstance.post('/logout', {});

            if (res.data === 'NAVER API does not provide a logout API.') {
                await Swal.fire({
                    width: '40rem',
                    html: '<div style="color: #333; text-align: center; line-height: 2;">현재 이 서비스에서는 로그아웃되었습니다.<br />그러나, 다음에 네이버 로그인을 할 때 로그인 정보가 유지될 수 있습니다.<br />완전한 로그아웃을 원하시면 <a href="https://www.naver.com/" target="_blank" style="color: #03c75a;">네이버 홈페이지</a>에서 로그아웃해 주세요.</div>',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#0d41e1',
                    customClass: {
                        popup: 'custom-swal-popup',
                    },
                    didOpen: () => {
                        document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                    },
                });
            } else if (res.data === 'GOOGLE API does not provide a logout API.') {
                await Swal.fire({
                    width: '40rem',
                    html: '<div style="color: #333; text-align: center; line-height: 2;">현재 이 서비스에서는 로그아웃되었습니다.<br />그러나, 다음에 구글 로그인을 할 때 로그인 정보가 유지될 수 있습니다.<br />완전한 로그아웃을 원하시면 <a href="https://www.google.com/" target="_blank" style="color: #4285F4;">구글 홈페이지</a>에서 로그아웃해 주세요.</div>',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#0d41e1',
                    customClass: {
                        popup: 'custom-swal-popup',
                    },
                    didOpen: () => {
                        document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                    },
                });
            } else if (res.data === 'http://localhost:3000') {
                await Swal.fire({
                    width: '25rem',
                    html: '로그아웃되었습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#0d41e1',
                    customClass: {
                        popup: 'custom-swal-popup',
                    },
                    didOpen: () => {
                        document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                    },
                });
            } else {
                window.location.href = res.data;
            }
        } catch (e) {
            console.log('로그아웃 실패', e);
        }

        setUserAuth('');
        setUserProfile('');
        setUserEmail('');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                userAuth,
                userProfile,
                onLogin: loginHandler,
                onLogout: logoutHandler,
                isInit,
                userEmail,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
