import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axiosInstance from '../../configs/axios-config';
import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import AuthContext from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const PasswordModifyModal = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { onLogout } = useContext(AuthContext);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');

    // 비밀번호 변경
    const savePassword = async () => {
        if (newPassword.length < 8) {
            await Swal.fire({
                width: '30rem',
                text: '비밀번호는 최소 8자 이상으로 설정해주세요.',
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

        if (newPassword !== checkPassword) {
            await Swal.fire({
                width: '30rem',
                text: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.',
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
            await axiosInstance.post('/user/change_pw', {
                oldPassword: currentPassword,
                newPassword,
            });

            await Swal.fire({
                width: '30rem',
                text: '비밀번호가 변경되었습니다. 다시 로그인해주세요.',
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

            navigate('/');
            onLogout();
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
        <Dialog open={open} onClose={onClose} maxWidth='xs'>
            <DialogTitle>비밀번호 변경</DialogTitle>

            <DialogContent>
                <TextField
                    fullWidth
                    label='현재 비밀번호'
                    type='password'
                    variant='outlined'
                    margin='normal'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    label='새 비밀번호'
                    type='password'
                    variant='outlined'
                    margin='normal'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    label='새 비밀번호 확인'
                    type='password'
                    variant='outlined'
                    margin='normal'
                    value={checkPassword}
                    onChange={(e) => setCheckPassword(e.target.value)}
                />
            </DialogContent>

            <DialogActions>
                <Button variant='contained' sx={{ bgcolor: '#0d41e1' }} onClick={savePassword}>
                    변경하기
                </Button>

                <Button onClick={onClose} sx={{ color: 'white', bgcolor: '#AAAAAA' }}>
                    취소
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PasswordModifyModal;
