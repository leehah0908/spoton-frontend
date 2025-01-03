import axios from 'axios';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { Stomp } from '@stomp/stompjs';
import AuthContext from '../contexts/UserContext';
import { Box, Button, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';

const GameChat = ({ gameId }) => {
    const { isLoggedIn, userEmail } = useContext(AuthContext);

    // 경기 정보 렌더링을 막기 위해 Ref 사용
    const stompClient = useRef(null);

    // 메세지 최신화
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // 소켓 초기화
        const socket = new WebSocket('ws://localhost:8181/chat');
        stompClient.current = Stomp.over(socket);

        stompClient.current.connect({}, () => {
            setIsConnected(true);

            // 현재 경기 채팅 채널 구독
            stompClient.current.subscribe(`/sub/chat/game_chat/${gameId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        });

        // 이전 채팅 기록 가져오기
        const dataLoad = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/chat/game_chat/history/${gameId}`);
                setMessages(res.data.result);
            } catch (e) {
                console.log('채팅 데이터 로드 실패');
            }
        };

        dataLoad();

        // 컴포넌트 언마운트 시 웹소켓 연결 해제
        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
                setIsConnected(false);
            }
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 메세지 전송
    const sendMessage = async () => {
        if (!isLoggedIn) {
            await Swal.fire({
                width: '20rem',
                text: '채팅 참여는 로그인 후 가능힙니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    const popup = document.querySelector('.swal2-container');
                    if (popup) {
                        popup.style.fontFamily = '"Do Hyeon", sans-serif';
                        document.body.appendChild(popup);
                        popup.style.zIndex = '2001';
                    }
                },
            });
            return;
        }

        if (isConnected && inputValue) {
            const body = {
                senderEmail: userEmail,
                content: inputValue,
            };

            // 구독자들에게 보내기
            stompClient.current.send(`/pub/chat/game_chat/${gameId}`, {}, JSON.stringify(body));
            setInputValue('');
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

    return (
        <Box
            sx={{
                width: '30%',
                height: 700,
                // bgcolor: '#EDEFF5',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: '3%',
                boxShadow: 3,
                borderRadius: 3,
                ml: 3,
                mt: 8,
            }}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid gray' }}>
                <Typography sx={{ fontSize: 25, textAlign: 'center' }}>실시간 채팅</Typography>
            </Box>

            {/* 메시지 리스트 출력 */}
            <Box
                ref={messagesEndRef}
                gap={1}
                sx={{ flex: 1, m: 1.5, mr: 0, pr: 1.5, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
            >
                {messages.map((item, index) =>
                    item.email === userEmail ? (
                        <Box
                            key={index}
                            sx={{
                                maxWidth: '70%',
                                bgcolor: '#D8ECFF',
                                borderRadius: 2,
                                alignSelf: 'flex-end',
                                p: 1,
                                px: 1.5,
                            }}
                        >
                            <Box display='flex' flexDirection='row' justifyContent='space-between' sx={{ px: 0.5 }}>
                                <Box>
                                    <Typography sx={{ fontSize: 15 }}>{item.nickname}</Typography>
                                </Box>

                                <Box>
                                    <Typography sx={{ fontSize: 12, ml: 2, color: 'gray' }}>
                                        {item.createTime.substr(0, 10).replace(/-/g, '/')} {item.createTime.substr(11, 5)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography sx={{ fontSize: 14, textAlign: 'right', mt: 1, letterSpacing: 0.5 }}>
                                {item.content}
                            </Typography>
                        </Box>
                    ) : (
                        <Box
                            key={index}
                            sx={{
                                bgcolor: '#F0F1F4',
                                borderRadius: 2,
                                alignSelf: 'flex-start',
                                p: 1,
                                px: 1.5,
                            }}
                        >
                            <Box display='flex' flexDirection='row' justifyContent='space-between' sx={{ px: 0.5 }}>
                                <Box>
                                    <Typography sx={{ fontSize: 15 }}>{item.nickname}</Typography>
                                </Box>

                                <Box>
                                    <Typography sx={{ fontSize: 12, ml: 2, color: 'gray' }}>
                                        {item.createTime.substr(0, 10).replace(/-/g, '/')} {item.createTime.substr(11, 5)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography sx={{ fontSize: 14, textAlign: 'left', mt: 1, letterSpacing: 0.5 }}>
                                {item.content}
                            </Typography>
                        </Box>
                    ),
                )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderTop: '1px solid gray' }}>
                {/* 입력 필드 */}
                <TextField
                    fullWidth
                    variant='outlined'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder='메시지를 입력하세요'
                    sx={{
                        fontSize: 1,
                        '& .MuiOutlinedInput-input': {
                            padding: 1,
                        },
                    }}
                    // 도배 방지 -> 비활성화
                    // onKeyDown={(e) => {
                    //     if (e.key === 'Enter') {
                    //         e.preventDefault();
                    //         sendMessage();
                    //     }
                    // }}
                />

                {/* 메시지 전송, 메시지 리스트에 추가 */}
                <Button variant='contained' onClick={sendMessage} sx={{ ml: 1, bgcolor: '#0d41e1' }}>
                    등록
                </Button>
            </Box>
        </Box>
    );
};

export default GameChat;
