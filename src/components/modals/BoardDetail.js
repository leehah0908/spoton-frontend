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
import BoardReportModal from './BoardReportModal';
import ReplyReportModal from './ReplyReportModal';

const BoardDetail = ({ open, onClose, setDetatilModalOpen, setSelecedBoardData, selecedBoardData, setBoardList }) => {
    const { isLoggedIn, userEmail } = useContext(AuthContext);
    const commentInputRef = useRef(null);

    const [replyList, setReplyList] = useState([]);
    const [reply, setReply] = useState('');
    const [clickReplyId, setClickReplyId] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editedSubject, setEditedSubject] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedSports, setEditedSports] = useState('');

    const [boardReportOpen, setBoardReportOpen] = useState(false);
    const [replyReportOpen, setReplyReportOpen] = useState(false);

    useEffect(() => {
        if (open === true) {
            setIsEditing(false);
            setEditedSubject('');
            setEditedContent('');
            setEditedSports('');

            const loadReply = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/reply/list`, {
                        params: {
                            boardId: selecedBoardData.boardId,
                        },
                    });

                    setReplyList(res.data.result.content);
                } catch (e) {
                    console.log(e);
                }
            };
            loadReply();
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
    const handleLike = async () => {
        if (!isLoggedIn) {
            await Swal.fire({
                width: '20rem',
                text: '좋아요는 로그인 후 이용가능힙니다.',
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

    // 댓글 생성
    const saveReply = async () => {
        if (!isLoggedIn) {
            await Swal.fire({
                width: '20rem',
                text: '댓글 작성은 로그인 후 이용가능힙니다.',
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

        if (!reply.trim()) {
            await Swal.fire({
                width: '20rem',
                text: '내용을 작성해주세요.',
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

        // 생성 요청
        try {
            await axiosInstance.post('/reply/create', {
                boardId: selecedBoardData.boardId,
                content: reply,
            });

            setReply('');

            // 최신 댓글 반영
            const loadReply = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/reply/list`, {
                        params: {
                            boardId: selecedBoardData.boardId,
                        },
                    });

                    setReplyList(res.data.result.content);
                } catch (e) {
                    console.log(e);
                }
            };

            // 댓글수 반영
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

            loadReply();
            loadData();
        } catch (e) {
            console.log(e);
        }
    };

    // 댓글 삭제
    const handleReplyDelete = async (id) => {
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
                '/reply/delete',
                {},
                {
                    params: {
                        replyId: id,
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

            // 최신 댓글 반영
            const loadReply = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/reply/list`, {
                        params: {
                            boardId: selecedBoardData.boardId,
                        },
                    });

                    setReplyList(res.data.result.content);
                } catch (e) {
                    console.log(e);
                }
            };

            // 댓글수 반영
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

            loadReply();
            loadData();
        } catch (e) {
            console.log(e);
        }
    };

    // 댓글 좋아요
    const handleReplyLike = async (id) => {
        if (!isLoggedIn) {
            await Swal.fire({
                width: '20rem',
                text: '좋아요는 로그인 후 이용가능힙니다.',
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

        try {
            // 좋아요 누르기 및 취소
            await axiosInstance.post(
                '/reply/like',
                {},
                {
                    params: {
                        replyId: id,
                    },
                },
            );

            // 좋아요 반영
            const loadReply = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/reply/list`, {
                        params: {
                            boardId: selecedBoardData.boardId,
                        },
                    });

                    setReplyList(res.data.result.content);
                } catch (e) {
                    console.log(e);
                }
            };
            loadReply();
        } catch (e) {
            console.log(e);
        }
    };

    // 댓글 신고
    const clickReplyReport = async () => {
        if (!isLoggedIn) {
            await Swal.fire({
                width: '20rem',
                text: '신고는 로그인 후 이용가능힙니다.',
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

        setClickReplyId(reply.replyId);
        setReplyReportOpen(true);
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
                                    src={selecedBoardData.profile || 'default_profile.png'}
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
                                                onClick={() => setBoardReportOpen(true)}
                                                style={{ height: 30, padding: '0', marginRight: 10, marginTop: 3 }}
                                                sx={{
                                                    '&:hover': { backgroundColor: 'transparent' },
                                                    '&:active': { transform: 'none' },
                                                }}
                                            >
                                                <PiSirenFill size={20} color='red' style={{ marginRight: 3 }} />
                                                <Typography sx={{ color: 'red' }}>신고하기</Typography>
                                            </IconButton>

                                            <BoardReportModal
                                                open={boardReportOpen}
                                                onClose={() => setBoardReportOpen(false)}
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                startIcon={<FaThumbsUp color='red' />}
                                variant='text'
                                onClick={handleLike}
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

                        {/* 댓글 입력 */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: 2,
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder='댓글을 입력하세요.'
                                value={reply}
                                variant='outlined'
                                inputRef={commentInputRef}
                                size='small'
                                onChange={(e) => setReply(e.target.value)}
                                sx={{
                                    mb: 1,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />
                            <IconButton sx={{ color: 'red', ml: 1 }} onClick={saveReply}>
                                ✈️
                            </IconButton>
                        </Box>

                        {/* 댓글 리스트 */}
                        {replyList.map((reply) => (
                            <Box
                                key={reply.replyId}
                                display='flex'
                                flexDirection='column'
                                sx={{
                                    mb: 1,
                                    pl: 1,
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: 1,
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Box display='flex' flexDirection='row' alignItems='center' sx={{ pt: 1 }}>
                                    {/* 프로필 사진 */}
                                    <img
                                        src={reply.profile || 'default_profile.png'}
                                        alt='프로필 사진'
                                        style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 5 }}
                                    />

                                    {/* 닉네임 */}
                                    <Typography sx={{ color: 'black', ml: 1, fontSize: 15 }}>{reply.nickname}</Typography>

                                    <Box
                                        gap={2}
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            marginLeft: 'auto',
                                            bgcolor: '#d4d5d6',
                                            borderRadius: 1,
                                            p: 1,
                                        }}
                                    >
                                        {/* 좋아요 */}
                                        <FaThumbsUp
                                            size={15}
                                            color='gray'
                                            onClick={() => handleReplyLike(reply.replyId)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        {userEmail !== reply.email ? (
                                            <>
                                                {/* 신고하기 */}
                                                <PiSirenFill
                                                    color='gray'
                                                    onClick={clickReplyReport}
                                                    style={{ cursor: 'pointer' }}
                                                />

                                                <ReplyReportModal
                                                    open={replyReportOpen}
                                                    onClose={() => setReplyReportOpen(false)}
                                                    replyId={clickReplyId}
                                                />
                                            </>
                                        ) : (
                                            // 삭제
                                            <MdDeleteForever
                                                size={18}
                                                color='gray'
                                                onClick={() => handleReplyDelete(reply.replyId)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        )}
                                    </Box>
                                </Box>

                                <Box>
                                    {/* 내용 */}
                                    <Typography sx={{ my: 0.5, color: '#737272' }}>{reply.content}</Typography>

                                    <Box display='flex' flexDirection='row' sx={{ alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        {/* 작성 날짜 */}
                                        <Typography sx={{ color: '#666', fontSize: 12 }}>
                                            {reply.createTime.substr(0, 10).replace(/-/g, '/')} {reply.createTime.substr(11, 5)}
                                        </Typography>

                                        {reply.likeCount !== 0 && (
                                            <>
                                                <FaThumbsUp size={12} color='red' />

                                                <Typography sx={{ color: '#666', fontSize: 12 }}>{reply.likeCount}</Typography>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    );
};

export default BoardDetail;
