import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, Typography, Avatar, Button, TextField, Card, CardContent, Container, Divider, Grid } from '@mui/material';
import axiosInstance from '../configs/axios-config';
import NanumDashboard from './NanumDashboard';
import BoardDashboard from './BoardDashboard';
import { useNavigate } from 'react-router-dom';

const DashBoard = ({ setSelectedMenu }) => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('nanum');
    const [userData, setUserData] = useState(null);
    const [writeNanums, setWriteNanums] = useState(null);
    const [likeNanums, setLikeNanums] = useState(null);

    const [writeBoards, setWriteBoards] = useState(null);
    const [likeBoards, setLikeBoards] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await axiosInstance.get('/user/dashboard');

            setWriteNanums(res.data.result.writeNanums);
            setLikeNanums(res.data.result.likeNanums);
            setWriteBoards(res.data.result.writeBoards);
            setLikeBoards(res.data.result.likeBoards);
            setUserData(res.data.result.user);
        } catch (error) {
            console.error('대시보드 데이터 로드 실패', error);
        }
    };

    return (
        userData && (
            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* 프로필 */}
                <Box
                    sx={{
                        width: '95%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        p: 2,
                    }}
                >
                    <Box display='flex' alignItems='center'>
                        <Avatar src={userData.profile || '/default-profile.png'} sx={{ width: 50, height: 50 }} />

                        <Box sx={{ ml: 2 }}>
                            <Typography sx={{ textAlign: 'left', fontSize: 20 }}>{userData.nickname}</Typography>

                            <Typography sx={{ fontSize: 13, color: '#737373' }}>{userData.email}</Typography>
                        </Box>
                    </Box>

                    <Box display='flex' gap={2}>
                        <Button
                            onClick={() => setSelectedMenu('changeInfo')}
                            variant='outlined'
                            sx={{ color: '#0d41e1', borderColor: '#0d41e1', bgcolor: 'rgba(13, 66, 225, 0.1)' }}
                        >
                            프로필 관리
                        </Button>

                        <Button
                            onClick={() => setSelectedMenu('accountManage')}
                            variant='outlined'
                            sx={{ color: '#0d41e1', borderColor: '#0d41e1', bgcolor: 'rgba(13, 66, 225, 0.1)' }}
                        >
                            계정 관리
                        </Button>
                    </Box>
                </Box>

                <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ mt: 5, mb: 2, width: '100%' }}>
                    <Box onClick={() => setActiveTab('nanum')} sx={{ width: '33%', textAlign: 'center', cursor: 'pointer' }}>
                        <Typography
                            sx={{
                                fontSize: 20,
                                color: activeTab === 'nanum' ? '#0d41e1' : '#666',
                                borderBottom: activeTab === 'nanum' ? '2px solid #0d41e1' : '1px solid #ddd',
                            }}
                        >
                            나눔
                        </Typography>
                    </Box>

                    <Box onClick={() => setActiveTab('board')} sx={{ width: '33%', textAlign: 'center', cursor: 'pointer' }}>
                        <Typography
                            sx={{
                                fontSize: 20,
                                color: activeTab === 'board' ? '#0d41e1' : '#666',
                                borderBottom: activeTab === 'board' ? '2px solid #0d41e1' : '1px solid #ddd',
                            }}
                        >
                            게시물
                        </Typography>
                    </Box>

                    <Box onClick={() => navigate('/chat')} sx={{ width: '33%', textAlign: 'center', cursor: 'pointer' }}>
                        <Typography
                            sx={{
                                fontSize: 20,
                                color: activeTab === 'chat' ? '#0d41e1' : '#666',
                                borderBottom: activeTab === 'chat' ? '2px solid #0d41e1' : '1px solid #ddd',
                            }}
                        >
                            채팅
                        </Typography>
                    </Box>
                </Box>

                {/* 대시보드 내용 */}
                <Box sx={{ width: '100%', pt: 1 }}>
                    {
                        {
                            nanum: (
                                <NanumDashboard
                                    writeNanums={writeNanums}
                                    likeNanums={likeNanums}
                                    loadData={loadData}
                                ></NanumDashboard>
                            ),
                            board: (
                                <BoardDashboard
                                    writeBoards={writeBoards}
                                    likeBoards={likeBoards}
                                    loadData={loadData}
                                ></BoardDashboard>
                            ),
                        }[activeTab]
                    }
                </Box>
            </Container>
        )
    );
};

export default DashBoard;
