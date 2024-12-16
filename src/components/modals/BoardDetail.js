import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Typography,
    Box,
    Divider,
    IconButton,
    TextField,
    MenuItem,
    Select,
} from '@mui/material';
import { IoChatbubbleOutline, IoClose } from 'react-icons/io5';
import { PiSirenFill } from 'react-icons/pi';
import { FaThumbsUp, FaPen } from 'react-icons/fa';
import axiosInstance from '../../configs/axios-config';
import axios from 'axios';
import AuthContext from '../../contexts/UserContext';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';
import ReportModal from './ReportModal';

const BoardDetail = ({ open, onClose, setDetatilModalOpen, setSelecedBoardData, selecedBoardData, setBoardList }) => {
    const { isLoggedIn, userEmail } = useContext(AuthContext);
    const commentInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedSubject, setEditedSubject] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedSports, setEditedSports] = useState('');

    const [reportOpen, setReportOpen] = useState(false);

    useEffect(() => {
        if (open === true) {
            setIsEditing(false);
            setEditedSubject('');
            setEditedContent('');
            setEditedSports('');
        }
    }, [open]);

    // 수정 화면 세팅
    const handleEditToggle = () => {
        setIsEditing(true);
        setEditedSubject(selecedBoardData.subject);
        setEditedContent(selecedBoardData.content);
        setEditedSports(selecedBoardData.sports);
    };

    // 게시물 좋아요
    const handelLike = async () => {
        try {
            // 좋아요 누르기 및 취소
            await axiosInstance.post(
                '/board/like',
                {},
                {
                    params: {
                        boardId: selecedBoardData.boardId,
                    },
                },
            );

            // 좋아요 반영
            const loadData = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/board/list`, {
                        params: {
                            searchType: '',
                            searchKeyword: '',
                        },
                    });

                    const resData = res.data.result.content;
                    setBoardList(resData);

                    setSelecedBoardData(resData.find((board) => board.boardId === selecedBoardData.boardId));
                } catch (e) {
                    console.log('게시물 데이터 로드 실패');
                }
            };
            loadData();
        } catch (e) {
            console.log(e);
        }
    };

    // 게시물 삭제
    const handleRemove = async () => {
        const result = await Swal.fire({
            width: '20rem',
            html: '정말로 삭제하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            confirmButtonColor: '#AAAAAA',
            cancelButtonColor: '#0d41e1',
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

        if (!result.isConfirmed) {
            return;
        }

        try {
            const res = await axiosInstance.post(
                '/board/delete',
                {},
                {
                    params: {
                        boardId: selecedBoardData.boardId,
                    },
                },
            );

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

            setDetatilModalOpen(false);
        } catch (e) {
            console.log(e);
        }
    };

    // 게시물 수정
    const handleUpdate = async () => {
        const result = await Swal.fire({
            width: '20rem',
            html: '수정하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            confirmButtonColor: '#0d41e1',
            cancelButtonColor: '#AAAAAA',
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

        if (!result.isConfirmed) {
            return;
        }

        try {
            const res = await axiosInstance.patch('/board/modify', {
                boardId: selecedBoardData.boardId,
                subject: editedSubject,
                content: editedContent,
                sports: editedSports,
            });

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

            setIsEditing(false);
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    // 수정 취소
    const handleCloseUpdateModal = async () => {
        const result = await Swal.fire({
            width: '20rem',
            html: '작성된 내용이 사라집니다. <br> 그래도 취소하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            confirmButtonColor: '#AAAAAA',
            cancelButtonColor: '#0d41e1',
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

        if (!result.isConfirmed) {
            return;
        }

        setDetatilModalOpen(false);
    };

    return (
        <Box maxWidth='xs'>
            {selecedBoardData && (
                <Dialog open={open} onClose={!isEditing ? onClose : handleCloseUpdateModal} fullWidth maxWidth='sm'>
                    {/* 상단 제목 및 닫기 버튼 */}
                    <DialogTitle
                        sx={{
                            p: 0,
                            minHeight: 40,
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <IoClose
                            color='red'
                            onClick={!isEditing ? onClose : handleCloseUpdateModal}
                            style={{ marginRight: 20, marginTop: 20, cursor: 'pointer' }}
                        />
                    </DialogTitle>

                    {/* 게시물 내용 */}
                    <DialogContent>
                        {/* 작성자 및 날짜 */}
                        <Box display='flex' flexDirection='row'>
                            {/* 프로필 이미지 */}
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '20%',
                                    overflow: 'hidden',
                                    marginRight: 2,
                                }}
                            >
                                <img
                                    src={selecedBoardData.profile || 'https://via.placeholder.com/40'}
                                    alt='프로필 사진'
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>

                            {/* 프로필 정보 */}
                            <Box
                                display='flex'
                                flexDirection='column'
                                sx={{ justifyContent: 'space-between', mb: 2, flexGrow: 1 }}
                            >
                                {/* 닉네임 */}
                                <Typography variant='body2' sx={{ color: '#666' }}>
                                    {selecedBoardData.nickname}
                                </Typography>

                                {/* 작성 날짜 */}
                                <Typography variant='body2' sx={{ color: '#666', display: 'flex', alignItems: 'center' }}>
                                    {selecedBoardData.createTime.substr(0, 10).replace(/-/g, '/')}{' '}
                                    {selecedBoardData.createTime.substr(11, 5)}
                                </Typography>
                            </Box>

                            {isLoggedIn && !isEditing && (
                                <>
                                    {/* 수정하기 */}
                                    {userEmail === selecedBoardData.email && (
                                        <IconButton
                                            onClick={handleEditToggle}
                                            style={{ height: 30, marginTop: 3 }}
                                            sx={{
                                                '&:hover': { backgroundColor: 'transparent' },
                                                '&:active': { transform: 'none' },
                                            }}
                                        >
                                            <FaPen size={15} color='gray' style={{ marginRight: 5 }} />
                                            <Typography>수정</Typography>
                                        </IconButton>
                                    )}

                                    {/* 삭제하기 */}
                                    {userEmail === selecedBoardData.email && (
                                        <IconButton
                                            onClick={handleRemove}
                                            style={{ height: 30, padding: '0', marginRight: 10, marginTop: 3 }}
                                            sx={{
                                                '&:hover': { backgroundColor: 'transparent' },
                                                '&:active': { transform: 'none' },
                                            }}
                                        >
                                            <MdDeleteForever size={20} color='red' style={{ marginRight: 3 }} />
                                            <Typography sx={{ color: 'red' }}>삭제</Typography>
                                        </IconButton>
                                    )}

                                    {/* 신고하기 */}
                                    {userEmail !== selecedBoardData.email && (
                                        <>
                                            <IconButton
                                                onClick={() => setReportOpen(true)}
                                                style={{ height: 30, padding: '0', marginRight: 10, marginTop: 3 }}
                                                sx={{
                                                    '&:hover': { backgroundColor: 'transparent' },
                                                    '&:active': { transform: 'none' },
                                                }}
                                            >
                                                <PiSirenFill size={20} color='red' style={{ marginRight: 3 }} />
                                                <Typography sx={{ color: 'red' }}>신고하기</Typography>
                                            </IconButton>

                                            <ReportModal
                                                open={reportOpen}
                                                onClose={() => setReportOpen(false)}
                                                boardId={selecedBoardData.boardId}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {isEditing ? (
                                <>
                                    {/* 카테고리 선택 */}
                                    <Select
                                        value={editedSports}
                                        onChange={(e) => setEditedSports(e.target.value)}
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

                                    {/* 제목 */}
                                    <TextField
                                        value={editedSubject}
                                        onChange={(e) => setEditedSubject(e.target.value)}
                                        fullWidth
                                        variant='outlined'
                                        size='small'
                                        sx={{ mb: 2 }}
                                    />

                                    {/* 내용 */}
                                    <TextField
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant='outlined'
                                        size='small'
                                    />
                                </>
                            ) : (
                                <>
                                    {/* 제목 */}
                                    <Typography variant='h6'>{selecedBoardData.subject}</Typography>

                                    {/* 내용 */}
                                    <Typography sx={{ fontSize: 15, mb: 2, color: '#8F8F8F' }}>
                                        {selecedBoardData.content}
                                    </Typography>
                                </>
                            )}
                        </Box>

                        {/* 수정 모드 버튼 */}
                        <Box display='flex' justifyContent='flex-end' mt={2}>
                            {isEditing && (
                                <>
                                    <Button variant='contained' sx={{ bgcolor: '#0d41e1', mr: 1 }} onClick={handleUpdate}>
                                        저장
                                    </Button>
                                    <Button
                                        variant='contained'
                                        sx={{ color: 'white', bgcolor: 'red' }}
                                        onClick={!isEditing ? onClose : handleCloseUpdateModal}
                                    >
                                        취소
                                    </Button>
                                </>
                            )}
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* 좋아요, 댓글*/}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Button
                                startIcon={<FaThumbsUp color='red' />}
                                variant='text'
                                onClick={handelLike}
                                sx={{ textTransform: 'none', color: 'red' }}
                            >
                                {selecedBoardData.likeCount} 좋아요
                            </Button>

                            <Button
                                startIcon={<IoChatbubbleOutline />}
                                variant='text'
                                onClick={() => commentInputRef.current.focus()}
                                sx={{ textTransform: 'none', color: '#0d41e1' }}
                            >
                                {selecedBoardData.replyCount} 댓글
                            </Button>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* 댓글 입력 */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#f9f9f9',
                                borderRadius: 2,
                                p: 1,
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder='댓글을 입력하세요.'
                                variant='outlined'
                                inputRef={commentInputRef}
                                size='small'
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />
                            <IconButton sx={{ color: 'red', ml: 1 }}>✈️</IconButton>
                        </Box>
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    );
};

export default BoardDetail;
