import { Box, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardDetail from './modals/BoardDetail';
import { IoChatbubbleOutline, IoEyeSharp, IoPersonSharp } from 'react-icons/io5';
import { MdDateRange } from 'react-icons/md';
import { FaThumbsUp } from 'react-icons/fa';
import axios from 'axios';

const BoardDashboard = ({ writeBoards, likeBoards, loadData }) => {
    const navigate = useNavigate();

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleOpenDetailModal = async (id) => {
        // 조회수 증가
        try {
            await axios.post(
                `${process.env.REACT_APP_BASE_URL}/board/view`,
                {},
                {
                    params: {
                        boardId: id,
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
        <Box sx={{ width: '95%' }}>
            <Typography variant='h6' sx={{ textAlign: 'left', mb: 2 }}>
                내가 작성한 글
            </Typography>

            {/* 게시물 내역 */}
            <Box sx={{ mt: 2, borderBottom: '1px solid #e0e0e0' }}>
                {writeBoards.map((board, index) => (
                    <Box
                        key={index}
                        onClick={() => handleOpenDetailModal(board.boardId)}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            borderTop: '1px solid #e0e0e0',
                            py: 1,
                            pr: 1,
                            cursor: 'pointer',
                        }}
                    >
                        <Box flex={1} sx={{ ml: 2 }}>
                            <Typography sx={{ textAlign: 'left', fontSize: 16, mb: 0.5 }}>
                                <span style={{ color: '#0d41e1' }}>[{board.sports}]</span> {board.subject}
                            </Typography>

                            <Typography sx={{ textAlign: 'left', fontSize: 14, color: '#737373', mb: 1 }}>
                                {board.content}
                            </Typography>

                            <Box display='flex' flexDirection='row'>
                                <Typography sx={{ textAlign: 'left', fontSize: 12, color: '#737373' }}>
                                    <IoPersonSharp size={13} style={{ marginRight: '4px' }} color='black' />
                                    {board.user.nickname}
                                </Typography>

                                <Typography sx={{ textAlign: 'left', fontSize: 12, color: '#737373', ml: 1 }}>
                                    <MdDateRange size={13} style={{ marginRight: '3px' }} color='black' />
                                    {board.createTime.substr(0, 10).replace(/-/g, '/')} {board.createTime.substr(11, 5)}
                                </Typography>
                            </Box>
                        </Box>

                        <Box display='flex' flexDirection='row'>
                            {board.likeCount !== 0 && (
                                <Typography sx={{ color: 'gray' }}>
                                    <FaThumbsUp size={13} style={{ marginRight: '5px' }} color='red' />
                                    {board.likeCount}
                                </Typography>
                            )}
                            {board.replyCount !== 0 && (
                                <Typography sx={{ color: 'gray', ml: 1.5 }}>
                                    <IoChatbubbleOutline size={13} style={{ marginRight: '5px' }} color='#0d41e1' />
                                    {board.replyCount}
                                </Typography>
                            )}
                            {board.viewCount !== 0 && (
                                <Typography sx={{ color: 'gray', ml: 1.5 }}>
                                    <IoEyeSharp size={13} style={{ marginRight: '4px' }} color='black' />
                                    {board.viewCount}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* 게시물 좋아요 */}
            <Box sx={{ mt: 8, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant='h6' sx={{ textAlign: 'left', mb: 2 }}>
                    나의 좋아요 글
                </Typography>

                {likeBoards.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant='body1' color='textSecondary' sx={{ mb: 2 }}>
                            게시물 좋아요 내역이 없습니다.
                        </Typography>

                        <Button
                            variant='outlined'
                            onClick={() => navigate('/community')}
                            sx={{
                                fontSize: 13,
                                px: 1.5,
                                color: '#0d41e1',
                                borderColor: '#0d41e1',
                                bgcolor: 'rgba(13, 66, 225, 0.1)',
                            }}
                        >
                            커뮤니티 바로가기
                        </Button>
                    </Box>
                ) : (
                    likeBoards.map((board, index) => (
                        <Box
                            key={index}
                            onClick={() => handleOpenDetailModal(board.boardId)}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                borderTop: '1px solid #e0e0e0',
                                py: 1,
                                pr: 1,
                                cursor: 'pointer',
                            }}
                        >
                            <Box flex={1} sx={{ ml: 2 }}>
                                <Typography sx={{ textAlign: 'left', fontSize: 16, mb: 0.5 }}>
                                    <span style={{ color: '#0d41e1' }}>[{board.sports}]</span> {board.subject}
                                </Typography>

                                <Typography sx={{ textAlign: 'left', fontSize: 14, color: '#737373', mb: 1 }}>
                                    {board.content}
                                </Typography>

                                <Box display='flex' flexDirection='row'>
                                    <Typography sx={{ textAlign: 'left', fontSize: 12, color: '#737373' }}>
                                        <IoPersonSharp size={13} style={{ marginRight: '4px' }} color='black' />
                                        {board.user.nickname}
                                    </Typography>

                                    <Typography sx={{ textAlign: 'left', fontSize: 12, color: '#737373', ml: 1 }}>
                                        <MdDateRange size={13} style={{ marginRight: '3px' }} color='black' />
                                        {board.createTime.substr(0, 10).replace(/-/g, '/')} {board.createTime.substr(11, 5)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box display='flex' flexDirection='row'>
                                {board.likeCount !== 0 && (
                                    <Typography sx={{ color: 'gray' }}>
                                        <FaThumbsUp size={13} style={{ marginRight: '5px' }} color='red' />
                                        {board.likeCount}
                                    </Typography>
                                )}
                                {board.replyCount !== 0 && (
                                    <Typography sx={{ color: 'gray', ml: 1.5 }}>
                                        <IoChatbubbleOutline size={13} style={{ marginRight: '5px' }} color='#0d41e1' />
                                        {board.replyCount}
                                    </Typography>
                                )}
                                {board.viewCount !== 0 && (
                                    <Typography sx={{ color: 'gray', ml: 1.5 }}>
                                        <IoEyeSharp size={13} style={{ marginRight: '4px' }} color='black' />
                                        {board.viewCount}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            <BoardDetail
                open={detailModalOpen}
                onClose={handleCloseDetailModal}
                setDetatilModalOpen={setDetailModalOpen}
                boardId={selectedId}
                loadBoardData={loadData}
            />
        </Box>
    );
};

export default BoardDashboard;
