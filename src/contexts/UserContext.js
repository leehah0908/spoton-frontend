import React, { useEffect, useState } from 'react';

// UserContext 생성
const AuthContext = React.createContext({
    isLoggedIn: false,
    onLogin: () => {},
    onLogout: () => {},
    userRole: '',
    isInit: false,
});

// provider 선언
export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token) {
            setIsLoggedIn(true);
            setUserRole(localStorage.getItem('USER_ROLE'));
        }
        setIsInit(true);
    }, []);

    // 로그인 핸들러
    const loginHandler = (token, userId, role) => {
        localStorage.setItem('ACCESS_TOKEN', token);
        localStorage.setItem('USER_ID', userId);
        localStorage.setItem('USER_ROLE', role);

        setIsLoggedIn(true);
        setUserRole(role);
    };

    // 로그아웃 핸들러
    const logoutHandler = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserRole('');
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                userRole,
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
