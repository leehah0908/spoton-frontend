import React, { useContext } from 'react';
import AuthContext from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function PrivateRouter({ element, requiredRole }) {
    const { isLoggedIn, userRole, isInit } = useContext(AuthContext);

    if (!isInit) return <div>Loading...</div>;

    if (!isLoggedIn) {
        Swal.fire({
            width: '20rem',
            text: '로그인을 해주세요.',
            confirmButtonText: '확인',
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
        return <Navigate to='/' replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        alert('접근 권한이 없습니다.');
        return <Navigate to='/' replace />;
    }

    return element;
}

export default PrivateRouter;
