import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';

const PasswordModifyModal = ({ open, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');

    const savePassword = () => {};

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
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
                <Button onClick={onClose}>취소</Button>

                <Button variant='contained' color='primary' onClick={savePassword}>
                    변경하기
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PasswordModifyModal;
