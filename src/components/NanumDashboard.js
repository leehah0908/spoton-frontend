import { Box, Typography, Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../configs/axios-config';
import axios from 'axios';
import NanumDetail from './modals/NanumDetail';

const NanumDashboard = ({ writeNanums, likeNanums, loadData }) => {
    const navigate = useNavigate();

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [listStatus, setListStatus] = useState('all');

    const changeStatus = async (id) => {
        const result = await Swal.fire({
            width: '20rem',
            html: '종료된 나눔은 수정이 불가능합니다. <br> 그래도 나눔을 종료하시겠습니까?',
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
            await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/nanum/status`,
                {},
                {
                    params: {
                        nanumId: id,
                    },
                },
            );
        } catch (e) {
            console.log('상태 변경 실패');
        }

        loadData();
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
        <Box sx={{ width: '95%' }}>
            <Typography variant='h6' sx={{ textAlign: 'left', mb: 2 }}>
                나의 나눔 내역
            </Typography>

            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 1.5, bgcolor: '#FAFAFA' }}>
                <Grid container>
                    <Grid
                        item
                        xs={4}
                        onClick={() => {
                            setListStatus('all');
                        }}
                        textAlign='center'
                        style={{ cursor: 'pointer' }}
                    >
                        <Typography sx={{ fontSize: 18, color: '#727272' }}>전체</Typography>

                        <Typography sx={{ fontSize: 18, color: writeNanums.length === 0 ? '#727272' : 'red' }}>
                            {writeNanums.length}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={4}
                        textAlign='center'
                        onClick={() => {
                            setListStatus('나눔중');
                        }}
                        style={{
                            borderLeft: '1px solid #e0e0e0',
                            borderRight: '1px solid #e0e0e0',
                            cursor: 'pointer',
                        }}
                    >
                        <Typography sx={{ fontSize: 18, color: '#727272' }}>진행 중</Typography>

                        <Typography
                            sx={{
                                fontSize: 18,
                                color: writeNanums.filter((item) => item.status === '나눔중').length === 0 ? '#727272' : 'red',
                            }}
                        >
                            {writeNanums.filter((item) => item.status === '나눔중').length}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={4}
                        onClick={() => {
                            setListStatus('나눔 종료');
                        }}
                        textAlign='center'
                        style={{ cursor: 'pointer' }}
                    >
                        <Typography sx={{ fontSize: 18, color: '#727272' }}>종료</Typography>

                        <Typography sx={{ fontSize: 18, color: '#727272' }}>
                            {writeNanums.filter((item) => item.status === '나눔 종료').length}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* 나눔 내역 */}
            <Box sx={{ mt: 2, borderBottom: '1px solid #e0e0e0' }}>
                {(listStatus === 'all' ? writeNanums : writeNanums.filter((item) => item.status === listStatus)).map(
                    (nanum, index) => (
                        <Box
                            key={index}
                            onClick={() => handleOpenDetailModal(nanum.nanumId)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderTop: '1px solid #e0e0e0',
                                py: 2,
                                pr: 1,
                                cursor: 'pointer',
                            }}
                        >
                            <img
                                src={`/nanum_img/${nanum.thumbnail}` || 'default_profile.png'}
                                alt='프로필 사진'
                                style={{ width: 60, height: 60, borderRadius: 3, objectFit: 'cover' }}
                            />
                            <Box flex={1} sx={{ ml: 2 }}>
                                <Typography sx={{ textAlign: 'left', fontSize: 16, mb: 0.5 }}>
                                    {nanum.status !== '나눔중' && <span style={{ color: 'red' }}>[{nanum.status}]</span>}{' '}
                                    {nanum.subject}
                                </Typography>

                                <Typography sx={{ textAlign: 'left', fontSize: 13, color: '#737373' }}>
                                    {nanum.content}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ color: 'gray', textAlign: 'right' }}>{nanum.quantity} 개</Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ ml: 2, color: 'gray' }}>
                                    {nanum.giveMethod === 'direct' ? '직접 수령' : '택배 수령'}
                                </Typography>
                            </Box>

                            {nanum.status === '나눔중' && (
                                <Button
                                    variant='outlined'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        changeStatus(nanum.nanumId);
                                    }}
                                    sx={{
                                        ml: 2,
                                        fontSize: 13,
                                        px: 1.5,
                                        color: '#0d41e1',
                                        borderColor: '#0d41e1',
                                        bgcolor: 'rgba(13, 66, 225, 0.1)',
                                    }}
                                >
                                    나눔 종료
                                </Button>
                            )}
                        </Box>
                    ),
                )}
            </Box>

            {/* 관심 상품 */}
            <Box sx={{ mt: 8, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant='h6' sx={{ textAlign: 'left', mb: 2 }}>
                    내가 찜한 나눔
                </Typography>

                {likeNanums.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant='body1' color='textSecondary' sx={{ mb: 2 }}>
                            나눔글 찜 내역이 없습니다.
                        </Typography>

                        <Button
                            variant='outlined'
                            onClick={() => navigate('/nanum')}
                            sx={{
                                fontSize: 13,
                                px: 1.5,
                                color: '#0d41e1',
                                borderColor: '#0d41e1',
                                bgcolor: 'rgba(13, 66, 225, 0.1)',
                            }}
                        >
                            나눔 바로가기
                        </Button>
                    </Box>
                ) : (
                    likeNanums.map((nanum, index) => (
                        <Box
                            key={index}
                            onClick={() => handleOpenDetailModal(nanum.nanumId)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderTop: '1px solid #e0e0e0',
                                py: 2,
                                pr: 1,
                                cursor: 'pointer',
                            }}
                        >
                            <img
                                src={`/nanum_img/${nanum.thumbnail}` || 'default_profile.png'}
                                alt='프로필 사진'
                                style={{ width: 60, height: 60, borderRadius: 3, objectFit: 'cover' }}
                            />
                            <Box flex={1} sx={{ ml: 2 }}>
                                <Typography sx={{ textAlign: 'left', fontSize: 16, mb: 0.5 }}>
                                    {nanum.status !== '나눔중' && <span style={{ color: 'red' }}>[{nanum.status}]</span>}{' '}
                                    {nanum.subject}
                                </Typography>

                                <Typography sx={{ textAlign: 'left', fontSize: 13, color: '#737373' }}>
                                    {nanum.content}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ color: 'gray', textAlign: 'right' }}>{nanum.quantity} 개</Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ ml: 2, color: 'gray' }}>
                                    {nanum.giveMethod === 'direct' ? '직접 수령' : '택배 수령'}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
            <NanumDetail
                open={detailModalOpen}
                onClose={handleCloseDetailModal}
                setDetailModalOpen={setDetailModalOpen}
                nanumId={selectedId}
                setNanumId={setSelectedId}
                reRequestNanumData={loadData}
            />
        </Box>
    );
};

export default NanumDashboard;
