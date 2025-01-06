import React, { useContext, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../configs/axios-config';
import { useLocation } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import AuthContext from '../../contexts/UserContext';
import { Stomp } from '@stomp/stompjs';
import NanumDetail from '../modals/NanumDetail';
import axios from 'axios';

const NanumChat = () => {
    const { userEmail } = useContext(AuthContext);

    // 채팅 정보 렌더링을 막기 위해 Ref 사용
    const stompClient = useRef(null);

    // 메세지 최신화
    const messagesEndRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    // 나눔 Detail에서 받아온 Id 기본 세팅
    const location = useLocation();
    const fromDetailRoomId = location.state?.chatRoom;

    const [roomId, setRoomId] = useState(fromDetailRoomId);
    const [chatType, setChatType] = useState('receiver');

    const [chatList, setChatList] = useState([]);
    const [allMessageList, setAllMessageList] = useState([]);
    const [roomMessage, setRoomMessage] = useState([]);

    const [inputMessage, setInputMessage] = useState('');
    const [seletedRoomData, setSeletedRoomData] = useState(null);

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        sessionStorage.removeItem('gameState');

        // 소켓 초기화
        const socket = new WebSocket('ws://localhost:8181/chat');
        stompClient.current = Stomp.over(socket);

        stompClient.current.connect({}, () => {
            setIsConnected(true);

            // 전역 채널 구독
            stompClient.current.subscribe(`/sub/chat/nanum_chat/global`, (message) => {
                const newMessage = JSON.parse(message.body);
                setAllMessageList((prevMessages) => [...prevMessages, newMessage]);
            });
        });

        chatListLoadData();

        // 컴포넌트 언마운트 시 웹소켓 연결 해제
        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
                setIsConnected(false);
            }
        };
    }, []);

    useEffect(() => {
        chatMessageLoadData();
        setSeletedRoomData(chatList.find((item) => item.nanumChatRoomId === roomId));

        // RoomId에 따라 채널 구독
        if (stompClient.current && isConnected) {
            // 기존 RoomId 구독 해제
            const subscription = stompClient.current.subscribe(`/sub/chat/nanum_chat/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setRoomMessage((prevMessages) => [...prevMessages, newMessage]);
            });

            // Clean-up: 컴포넌트가 언마운트되거나 roomId가 변경될 때 구독 해제
            return () => {
                if (subscription) {
                    subscription.unsubscribe();
                }
            };
        }
    }, [roomId, isConnected]);

    // 스크롤 맨 밑으로 이동
    useEffect(() => {
        scrollToBottom();
    }, [roomMessage]);

    // 채팅 타입이 변할때마다 목록 리스트 다시 불러오기
    useEffect(() => {
        chatListLoadData();
    }, [chatType]);

    // 채팅 목록 리스트 불러오기
    const chatListLoadData = async () => {
        try {
            const res = await axiosInstance.get('/chat/nanum_chat/list', { params: { chatType } });
            setChatList(res.data.result);
            setRoomId('');
        } catch (e) {
            console.log('데이터 로드 실패', e);
        }
    };

    // 메세지 기록 불러오기
    const chatMessageLoadData = async () => {
        try {
            const res = await axiosInstance.post('/chat/nanum_chat/message', {
                roomId,
            });
            setRoomMessage(res.data.result);
        } catch (e) {
            console.log('데이터 로드 실패', e);
        }
    };

    // 전역 채팅 메세지로 보내기
    const sendMessage = () => {
        if (isConnected && inputMessage) {
            const body = {
                roomId,
                email: userEmail,
                content: inputMessage,
            };

            stompClient.current.send(`/pub/chat/nanum_chat/global`, {}, JSON.stringify(body));
            setInputMessage('');
        } else {
            console.error('메세지 보내기에 실패했습니다.');
        }
    };

    // 새로운 메시지가 생길 때 스크롤 맨 아래로 이동
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };

    // 나눔글 상세정보 요청
    const handleOpenDetailModal = async (id) => {
        try {
            await axios.post(
                `${process.env.REACT_APP_BASE_URL}/nanum/view`,
                {},
                {
                    params: {
                        nanumId: id,
                    },
                },
            );
        } catch (e) {
            console.log('조회수 증가 실패');
        }

        setSelectedId(id);
        setDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setDetailModalOpen(false);
    };

    return (
        <Container maxWidth='lg'>
            <Box>
                <Typography variant='h6' sx={{ fontWeight: '500', display: 'flex', mt: 3, pl: 2, mb: 0.5 }}>
                    🗨️ 채팅 목록
                </Typography>
            </Box>

            <Box display='flex' sx={{ height: '80vh', overflow: 'hidden', mt: 3 }}>
                {/* 채팅 목록 */}
                <Box width='30%' borderRight='1px solid #ddd' sx={{ overflowY: 'auto' }}>
                    <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='center'
                        alignItems='center'
                        gap={2}
                        sx={{ borderBottom: '1px solid #ddd', bgcolor: '#f9f9f9', p: 1.3 }}
                    >
                        <Button
                            variant='outlined'
                            sx={{
                                fontSize: 18,
                                bgcolor: chatType === 'receiver' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                                color: chatType === 'receiver' ? '#0d41e1' : '#7D7D7D',
                                borderColor: chatType === 'receiver' ? '#0d41e1' : '#D4D4D8',
                            }}
                            onClick={() => setChatType('receiver')}
                        >
                            구매 채팅
                        </Button>

                        <Button
                            variant='outlined'
                            sx={{
                                fontSize: 18,
                                bgcolor: chatType === 'provider' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                                color: chatType === 'provider' ? '#0d41e1' : '#7D7D7D',
                                borderColor: chatType === 'provider' ? '#0d41e1' : '#D4D4D8',
                            }}
                            onClick={() => setChatType('provider')}
                        >
                            판매 채팅
                        </Button>
                    </Box>

                    <Box>
                        {chatList.map((chat, index) => (
                            <Box
                                display='flex'
                                flexDirection='row'
                                key={index}
                                button
                                selected={roomId === chat.nanumChatRoomId}
                                onClick={() => setRoomId(chat.nanumChatRoomId)}
                                sx={{
                                    bgcolor: roomId === chat.nanumChatRoomId ? 'rgba(13, 66, 225, 0.1)' : 'white',
                                    borderBottom: '1px solid #f5f5f5',
                                    p: 1.5,
                                    pl: 2,
                                    cursor: 'pointer',
                                }}
                            >
                                <img
                                    src={
                                        chatType === 'provider'
                                            ? chat.receiver.profile
                                            : chat.provider.profile || 'default_profile.png'
                                    }
                                    alt='프로필 사진'
                                    style={{ width: 50, height: 50, borderRadius: 50, objectFit: 'cover' }}
                                />

                                <Box display='flex' flexDirection='column' sx={{ width: '100%' }}>
                                    <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
                                        <Typography sx={{ ml: 2 }}>
                                            {chatType === 'provider' ? chat.receiver.nickname : chat.provider.nickname}
                                        </Typography>

                                        <Typography sx={{ ml: 2, fontSize: 13, color: 'gray' }}>
                                            {allMessageList
                                                .filter((message) => message.nanumChatRoomId === chat.nanumChatRoomId)
                                                .slice(-1)[0]?.createTime
                                                ? `${allMessageList
                                                      .filter((message) => message.nanumChatRoomId === chat.nanumChatRoomId)
                                                      .slice(-1)[0]
                                                      ?.createTime.substr(0, 10)
                                                      .replace(/-/g, '/')} ${allMessageList
                                                      .filter((message) => message.nanumChatRoomId === chat.nanumChatRoomId)
                                                      .slice(-1)[0]
                                                      ?.createTime.substr(11, 5)}`
                                                : chat.lastMessageTime
                                                  ? `${chat.lastMessageTime.substr(0, 10).replace(/-/g, '/')} ${chat.lastMessageTime.substr(11, 5)}`
                                                  : ''}
                                        </Typography>
                                    </Box>

                                    <Typography sx={{ ml: 2, fontSize: 15, color: 'gray', alignSelf: 'flex-start' }}>
                                        {allMessageList
                                            .filter((message) => message.nanumChatRoomId === chat.nanumChatRoomId)
                                            .slice(-1)[0]?.content || chat.lastMessage}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* 채팅 화면 */}
                {seletedRoomData && roomId ? (
                    <Box flex={1} display='flex' flexDirection='column' width='70%'>
                        {/* 채팅방 제목 */}
                        <Box
                            display='flex'
                            flexDirection='row'
                            onClick={() => handleOpenDetailModal(seletedRoomData.nanum.nanumId)}
                            sx={{
                                p: 2,
                                borderBottom: '1px solid #ddd',
                                backgroundColor: '#f9f9f9',
                                cursor: 'pointer',
                                alignItems: 'flex-end',
                            }}
                        >
                            <img
                                src={`/nanum_img/${seletedRoomData.nanumImage}`}
                                alt='썸네일 사진'
                                style={{ width: 70, height: 70, borderRadius: 10, objectFit: 'cover' }}
                            />

                            <Box sx={{ ml: 2, mb: 0.5 }}>
                                <Typography sx={{ fontSize: 20 }}>{seletedRoomData.nanum.subject}</Typography>

                                <Box display='flex' flexDirection='row'>
                                    <Typography sx={{ color: 'gray' }}>{seletedRoomData.nanum.quantity}개</Typography>
                                    <Typography sx={{ ml: 1, color: 'gray' }}>{seletedRoomData.nanum.status}</Typography>
                                    <Typography sx={{ ml: 1, color: 'gray' }}>
                                        ({seletedRoomData.nanum.giveMethod === 'delivery' ? '택배 수령' : '직접 수령'})
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* 메시지 리스트 */}
                        <Box
                            ref={messagesEndRef}
                            gap={1}
                            sx={{ flex: 1, m: 1.5, mr: 0, pr: 1.5, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
                        >
                            {roomMessage.map((message, index) =>
                                message.email === userEmail ? (
                                    <Box
                                        key={index}
                                        display='flex'
                                        flexDirection='row'
                                        justifyContent='flex-end'
                                        sx={{
                                            maxWidth: '70%',
                                            alignSelf: 'flex-end',
                                            p: 1,
                                            px: 1.5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'flex-end',
                                            }}
                                        >
                                            <Typography sx={{ fontSize: 12, mr: 1, color: 'gray' }}>
                                                {message.createTime.substr(0, 10).replace(/-/g, '/')}{' '}
                                                {message.createTime.substr(11, 5)}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    py: 1,
                                                    px: 1.5,
                                                    bgcolor: '#D8ECFF',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 15 }}>{message.content}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box
                                        key={index}
                                        display='flex'
                                        flexDirection='row'
                                        justifyContent='flex-end'
                                        sx={{
                                            maxWidth: '70%',
                                            alignSelf: 'flex-start',
                                            p: 1,
                                            px: 1.5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'flex-end',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    py: 1,
                                                    px: 1.5,
                                                    bgcolor: '#F0F1F4',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 15 }}>{message.content}</Typography>
                                            </Box>

                                            <Typography sx={{ fontSize: 12, ml: 1, color: 'gray' }}>
                                                {message.createTime.substr(0, 10).replace(/-/g, '/')}{' '}
                                                {message.createTime.substr(11, 5)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ),
                            )}
                        </Box>

                        {/* 메시지 입력 */}
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderTop: '1px solid gray' }}>
                            <TextField
                                variant='outlined'
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder='메세지 보내기'
                                onKeyDown={(e) => {
                                    if (e.keyCode === 229) return;
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                sx={{ flex: 1 }}
                            />
                            <Button
                                variant='contained'
                                sx={{ ml: 2, fontSize: 18, p: 1.5, px: 3, bgcolor: '#0d41e1' }}
                                onClick={sendMessage}
                            >
                                보내기
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box width='70%'>
                        {/* 채팅방 제목 */}
                        <Box sx={{ p: 2, borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
                            <Typography variant='h6'>채팅방을 선택해주세요</Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            <NanumDetail
                open={detailModalOpen}
                onClose={handleCloseDetailModal}
                setDetailModalOpen={setDetailModalOpen}
                nanumId={selectedId}
                setNanumId={setSelectedId}
            />
        </Container>
    );
};

export default NanumChat;
