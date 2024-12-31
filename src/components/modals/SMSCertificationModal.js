import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import axiosInstance from '../../configs/axios-config';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const SMSCertificationModal = ({ open, onClose }) => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [checkSend, setCheckSend] = useState(false);
    const [certificationNumber, setCertificationNumber] = useState('');

    useEffect(() => {
        if (open === true) {
            setPhoneNumber('');
            setCheckSend(false);
            setCertificationNumber('');
        }
    }, [open]);

    // 인증번호 보내기
    const sendSMS = async () => {
        if (phoneNumber.length !== 11) {
            await Swal.fire({
                width: '30rem',
                text: '휴대폰 번호를 정확하게 입력해주세요.',
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
            return;
        }

        if (phoneNumber.includes('-')) {
            await Swal.fire({
                width: '30rem',
                text: '숫자만 입력해주세요.',
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
            return;
        }

        try {
            await axiosInstance.post('/user/number_send', {}, { params: { number: phoneNumber } });

            await Swal.fire({
                width: '30rem',
                text: '인증번호를 보냈습니다. 아래 입력해주세요.',
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

            setCheckSend(true);
        } catch (e) {
            await Swal.fire({
                width: '30rem',
                text: e.response.data.statusMessage,
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
        }
    };

    // 인증번호 확인하기
    const checkNumber = async () => {
        if (certificationNumber.length !== 6) {
            await Swal.fire({
                width: '30rem',
                text: '인증번호를 정확하게 6자리 입력해주세요.',
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
            return;
        }

        try {
            const res = await axiosInstance.get(`${process.env.REACT_APP_BASE_URL}/user/number_certi`, {
                params: { number: phoneNumber, reqNumber: certificationNumber },
            });

            await Swal.fire({
                width: '30rem',
                text: res.data.statusMessage,
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
            navigate(0);
            onClose();
        } catch (e) {
            await Swal.fire({
                width: '30rem',
                text: e.response.data.statusMessage,
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
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <Box sx={{ p: 3, width: 500 }}>
                <Typography sx={{ fontSize: 23 }}>번호 인증하기</Typography>

                <Box display='flex' flexDirection='row' sx={{ pl: 0.5 }}>
                    <TextField
                        label='번호를 입력해주세요. (-없이 입력해주세요.)'
                        variant='standard'
                        margin='normal'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        sx={{ width: '70%', p: 0 }}
                    />
                    <Button onClick={sendSMS} sx={{ height: 35, ml: 3, mt: 3, color: 'white', bgcolor: '#0d41e1' }}>
                        인증번호 보내기
                    </Button>
                </Box>

                {checkSend && (
                    <Box>
                        <Typography sx={{ ml: 1, mt: 2 }}>
                            휴대폰으로 전송된 <span style={{ color: '#0d41e1' }}> 6자리 인증번호</span>를 입력해주세요.
                        </Typography>

                        <Box display='flex' flexDirection='row' sx={{ pl: 0.5 }}>
                            <TextField
                                label='인증번호 6자리를 입력해주세요.'
                                variant='standard'
                                margin='normal'
                                value={certificationNumber}
                                onChange={(e) => setCertificationNumber(e.target.value)}
                                sx={{ width: '70%', p: 0 }}
                            />
                            <Button onClick={checkNumber} sx={{ height: 35, ml: 2, mt: 3, color: 'white', bgcolor: '#0d41e1' }}>
                                인증번호 확인하기
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Dialog>
    );
};

export default SMSCertificationModal;
