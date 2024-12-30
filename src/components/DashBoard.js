import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, Typography, Avatar, Button, TextField, Card, CardContent, Container } from '@mui/material';
import AuthContext from '../contexts/UserContext';
import axiosInstance from '../configs/axios-config';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
    useEffect(() => {
        const loadData = async () => {
            // try {
            //     const res = await axiosInstance.get('/user/my_info');
            //     // mtId 빼고, 팀이 지정되어있지 않은 리그는 제외
            //     const fitedMyTeam = Object.fromEntries(
            //         Object.entries(res.data.result.myTeam)
            //             .filter(([key, value]) => key !== 'mtId' && value)
            //             .map(([key, value]) => {
            //                 const leagueName = Object.keys(fieldMapping).find((league) => fieldMapping[league] === key) || key;
            //                 return [leagueName, value];
            //             }),
            //     );
            //     setEmail(res.data.result.email);
            //     setNickname(res.data.result.nickname);
            //     setMyTeam(fitedMyTeam);
            //     setProfilePicture(res.data.result.profile);
            // } catch (error) {
            //     console.error('유저 데이터 로드 실패', error);
            // }
        };

        loadData();
    }, []);

    return <Container maxWidth='sm'>sadas</Container>;
};

export default DashBoard;
