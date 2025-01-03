import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../configs/axios-config';
import { useLocation } from 'react-router-dom';
import { Box, Button, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import AuthContext from '../../contexts/UserContext';

const NanumChat = () => {
    const { userEmail } = useContext(AuthContext);

    const location = useLocation();
    const fromDetailRoomId = location.state?.chatRoom;

    const [currentRoomId, setCurrentRoomId] = useState(fromDetailRoomId);
    const [currentType, setCurrentType] = useState('receiver');

    const [chatAllList, setChatAllList] = useState([]);
    const [currentList, setCurrentList] = useState([]);
    const [currentRoomMessage, setCurrentRoomMessage] = useState([]);

    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        sessionStorage.removeItem('gameState');
        chatListLoadData();
    }, []);

    useEffect(() => {
        chatMessageLoadData();
    }, [currentRoomId]);

    useEffect(() => {
        if (currentType === 'receiver') {
            const filterMessage = chatAllList.filter((room) => room.receiver.email === userEmail);
            setCurrentList(filterMessage);
        } else if (currentType === 'provider') {
            const filterMessage = chatAllList.filter((room) => room.provider.email === userEmail);
            setCurrentList(filterMessage);
        }
    }, [currentType]);

    const chatListLoadData = async () => {
        try {
            const res = await axiosInstance.get('/nanum_chat/list');
            setChatAllList(res.data.result);
        } catch (e) {
            console.log('데이터 로드 실패', e);
        }
    };

    const chatMessageLoadData = async () => {
        try {
            const res = await axiosInstance.post('/nanum_chat/message', {
                roomId: currentRoomId,
            });
            setCurrentRoomMessage(res.data.result);
        } catch (e) {
            console.log('데이터 로드 실패', e);
        }
    };

    // const sendMessage = () => {
    //     // 메시지 전송 로직
    //     console.log('전송 메시지:', inputMessage);
    //     setInputMessage('');
    // };

    const socket = new WebSocket('ws://localhost:8181/nanum_chat');

    // WebSocket 연결
    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    // 메시지 수신
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
    };

    // 메시지 전송
    const sendMessage = (receiverId, content) => {
        const message = {
            userId: 'user1',
            receiverId: receiverId,
            content: content,
            timestamp: new Date().toISOString(),
        };
        socket.send(JSON.stringify(message));
    };

    // WebSocket 연결 해제
    socket.onclose = () => {
        console.log('WebSocket disconnected');
    };

    return (
        <Box display='flex' sx={{ height: 750, overflow: 'hidden' }}>
            {/* 채팅 목록 */}
            <Box width='30%' borderRight='1px solid #ddd' sx={{ overflowY: 'auto' }}>
                <Button onClick={() => setCurrentType('receiver')}>receiver</Button>
                <Button onClick={() => setCurrentType('provider')}>provider</Button>

                <Typography variant='h6' sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
                    구매 채팅 목록
                </Typography>

                <Box>
                    {currentList.map((chat, index) => (
                        <Box
                            display='flex'
                            flexDirection='row'
                            key={index}
                            button
                            selected={currentRoomId === chat.nanumChatRoomId}
                            onClick={() => setCurrentRoomId(chat.nanumChatRoomId)}
                            sx={{ borderBottom: '1px solid #f5f5f5', p: 1.5, pl: 2 }}
                        >
                            <img
                                src={
                                    currentType === 'provider'
                                        ? chat.receiver.profile
                                        : chat.provider.profile || 'default_profile.png'
                                }
                                alt='프로필 사진'
                                style={{ width: 50, height: 50, borderRadius: 50, objectFit: 'cover' }}
                            />

                            <Box display='flex' flexDirection='column'>
                                <Box display='flex' flexDirection='row'>
                                    <Typography sx={{ ml: 2 }}>
                                        {currentType === 'provider' ? chat.receiver.nickname : chat.provider.nickname}
                                    </Typography>
                                    <Typography sx={{ ml: 2 }}>
                                        {chat.createTime.substr(0, 10).replace(/-/g, '/')} {chat.createTime.substr(11, 5)}
                                    </Typography>
                                </Box>

                                <Typography sx={{ ml: 2 }}>{chat.provider.nickname}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* 채팅 화면 */}
            <Box flex={1} display='flex' flexDirection='column'>
                {/* 채팅방 제목 */}
                <Box sx={{ p: 2, borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
                    <Typography variant='h6'>채팅방: {currentRoomId}</Typography>
                </Box>

                {/* 메시지 리스트 */}
                <Box flex={1} sx={{ overflowY: 'auto', p: 2, backgroundColor: '#f4f4f4' }}>
                    {currentRoomMessage.map((message, index) => (
                        <Box
                            key={index}
                            display='flex'
                            justifyContent={message.email === userEmail ? 'flex-end' : 'flex-start'}
                            mb={2}
                        >
                            <Box
                                sx={{
                                    maxWidth: '60%',
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: message.email === userEmail ? '#d1e7dd' : '#ffffff',
                                    boxShadow: 1,
                                }}
                            >
                                <Typography variant='body1'>{message.content}</Typography>
                                <Typography variant='caption' sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                                    {message.createTime}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* 메시지 입력 */}
                <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        variant='outlined'
                        placeholder='Message (엔터키 입력시 전송)'
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />
                    <Button variant='contained' sx={{ ml: 2 }} onClick={sendMessage}>
                        전송
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default NanumChat;
