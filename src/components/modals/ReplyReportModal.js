import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import Swal from 'sweetalert2';
import axiosInstance from '../../configs/axios-config';

const ReplyReportModal = ({ open, onClose, replyId }) => {
    const [reportContent, setReportContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReportSubmit = async () => {
        if (!reportContent.trim()) {
            await Swal.fire({
                width: '20rem',
                text: '신고 내용을 작성해주세요.',
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

        setLoading(true);

        try {
            await axiosInstance.post('/reply/report', {
                replyId,
                reportContent,
            });

            await Swal.fire({
                width: '20rem',
                text: '신고가 완료되었습니다.',
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

            setReportContent('');
            onClose();
        } catch (e) {
            await Swal.fire({
                width: '20rem',
                text: e.response.data.statusMessage,
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
            setReportContent('');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
            <DialogTitle textAlign='center'>신고 이유를 적어주세요.</DialogTitle>

            <DialogContent>
                <Box component='form' sx={{ mt: 2 }}>
                    {replyId}
                    <TextField
                        autoFocus
                        fullWidth
                        multiline
                        rows={4}
                        label='신고 내용'
                        variant='outlined'
                        value={reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                        disabled={loading}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ pt: 0, pr: 3, pb: 2 }}>
                <Button onClick={handleReportSubmit} disabled={loading} sx={{ color: 'white', bgcolor: 'red' }}>
                    {loading ? '처리 중...' : '신고'}
                </Button>

                <Button onClick={onClose} disabled={loading} sx={{ color: 'white', bgcolor: '#AAAAAA' }}>
                    취소
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReplyReportModal;
