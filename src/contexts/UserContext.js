import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = React.createContext({
    isLoggedIn: false,
    onLogin: () => {},
    onLogout: () => {},
    userRole: '',
    isInit: false,
});

// provider
export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userAuth, setUserAuth] = useState('');
    const [userProfile, setUserProfile] = useState('');
    const [isInit, setIsInit] = useState(false);

    // 첫 렌더링시 쿠키를 백으로 보내서 로그인이 유효한지 확인
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/login/check`, { withCredentials: true });

                setUserAuth(res.data.result.auth);
                setUserProfile(res.data.result.profile);
                setIsLoggedIn(true);
                setIsInit(true);
            } catch (e) {
                console.log('로그인 안되어있음.', e);
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
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/logout`, {}, { withCredentials: true });
            console.log(res);

            setUserAuth('');
            setUserProfile('');
            setIsLoggedIn(false);
        } catch (e) {
            console.log('로그아웃 실패', e);
        }
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
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
