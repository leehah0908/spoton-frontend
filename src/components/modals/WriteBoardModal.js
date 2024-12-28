import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    Select,
    MenuItem,
} from '@mui/material';
import Swal from 'sweetalert2';
import axiosInstance from '../../configs/axios-config';

const WriteBoardModal = ({ open, onClose, setWriteModalOpen, loadBoardData }) => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sports, setSports] = useState('');

    useEffect(() => {
        setSubject('');
        setContent('');
        setSports('');
    }, [open]);

    const handleSubmit = async () => {
        // 제목 여부
        if (subject === '') {
            await Swal.fire({
                width: '20rem',
                text: '제목을 입력해주세요.',
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

        // 내용 여부
        if (content === '') {
            await Swal.fire({
                width: '20rem',
                text: '내용을 입력해주세요.',
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

        // 카테고리 여부
        if (sports === '') {
            await Swal.fire({
                width: '20rem',
                text: '스포츠 카테고리를 정해주세요.',
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

        const params = {
            subject: subject,
            content: content,
            sports: sports,
        };

        const res = await axiosInstance.post('/board/create', params);

        await Swal.fire({
            width: '20rem',
            text: res.data.statusMessage,
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

        setWriteModalOpen(false);
        loadBoardData();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
            <DialogTitle sx={{ textAlign: 'center' }}>글쓰기</DialogTitle>

            <DialogContent>
                <Box>
                    {/* 카테고리 선택 */}
                    <Select
                        value={sports}
                        onChange={(e) => setSports(e.target.value)}
                        displayEmpty
                        sx={{
                            height: 30,
                            color: '#0d41e1',
                            fontSize: '0.9rem',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '& .MuiSelect-select': {
                                paddingLeft: 0,
                            },
                        }}
                    >
                        <MenuItem value='' disabled>
                            스포츠 카테고리
                        </MenuItem>
                        <MenuItem value='baseball'>야구</MenuItem>
                        <MenuItem value='soccer'>축구</MenuItem>
                        <MenuItem value='basketball'>농구</MenuItem>
                        <MenuItem value='volleyball'>배구</MenuItem>
                        <MenuItem value='esports'>E-스포츠</MenuItem>
                    </Select>

                    {/* 제목 입력 */}
                    <TextField
                        fullWidth
                        placeholder='제목'
                        variant='standard'
                        sx={{ mb: 2, mt: 1 }}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    {/* 내용 입력 */}
                    <TextField
                        fullWidth
                        placeholder='내용을 입력하세요.'
                        multiline
                        rows={10}
                        variant='standard'
                        InputProps={{
                            disableUnderline: true,
                        }}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            color: '#aaa',
                            lineHeight: 1.5,
                        }}
                    >
                        본 서비스는 누구나 기분 좋게 참여할 수 있는 커뮤니티를 만들기 위해 아래 항목에 해당하는 게시물은 삭제되고
                        서비스 이용이 일정 기간 제한될 수 있습니다.
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            color: '#aaa',
                            lineHeight: 1.5,
                            mt: 1,
                        }}
                    >
                        - 특정 팀이나 선수에 대한 비방 게시물
                        <br />- 인신공격 및 팬덤 간의 싸움 / 경기 도중 발생한 사건에 대한 과도한 비난
                        <br />- 악의적인 루머 및 허위 정보 유포 / 폭력적이거나 혐오적인 언어 사용
                        <br />- 정치적, 사회적 논쟁으로 번질 수 있는 게시물
                        <br />- 홍보성 또는 상업적인 게시물 / 불법 및 규칙 위반 게시물
                        <br />- 특정 국가, 지역, 인종에 대한 차별적 발언
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant='contained' sx={{ color: 'white', bgcolor: 'red' }}>
                    취소
                </Button>

                <Button onClick={handleSubmit} variant='contained' sx={{ color: 'white', bgcolor: '#0d41e1' }}>
                    제출
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WriteBoardModal;
