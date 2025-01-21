import { Box, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { IoChatbubbleOutline, IoPersonSharp, IoEyeSharp } from 'react-icons/io5';
import { FaThumbsUp } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';
import { FaGift } from 'react-icons/fa6';
import AuthContext from '../../contexts/UserContext';
import axiosInstance from '../../configs/axios-config';
import NanumDetail from '../modals/NanumDetail';
import BoardDetail from '../modals/BoardDetail';

const Home = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    const [todayGames, setTodayGames] = useState(null);
    const [hotBoard, setHotBoard] = useState(null);
    const [lastestNanum, setLastestNanum] = useState(null);
    const [myTeamData, setMyTeamData] = useState([]);
    const [myTeamLength, setMyTeamLength] = useState(false);

    const [boardDetailModalOpen, setBoardDetailModalOpen] = useState(false);
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [nanumDetailModalOpen, setNanumDetailModalOpen] = useState(false);
    const [selectedNanumId, setSelectedNanumId] = useState(null);

    useEffect(() => {
        sessionStorage.removeItem('gameState');

        const loadData = async () => {
            try {
                const [todayGameRes, hotBoardRes, lastestNanumRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_BASE_URL}/game/today`),
                    axios.get(`${process.env.REACT_APP_BASE_URL}/board/hot_board`),
                    axios.get(`${process.env.REACT_APP_BASE_URL}/nanum/lastest_nanum`),
                ]);

                setTodayGames(todayGameRes.data.result);
                setHotBoard(hotBoardRes.data.result);
                setLastestNanum(lastestNanumRes.data.result);

                if (isLoggedIn) {
                    const res = await axiosInstance.get(`${process.env.REACT_APP_BASE_URL}/game/myteam`);
                    setMyTeamLength(Object.keys(res.data.result).length === 0);

                    // 오늘의 경기 중 마이팀 필터링
                    const myTeamGame = todayGameRes.data.result.filter((game) => {
                        const myTeam = res.data.result[game.league];
                        if (!myTeam) return false;

                        return game.homeTeam === myTeam || game.awayTeam === myTeam;
                    });

                    setMyTeamData(myTeamGame);
                }
            } catch (e) {
                console.log('데이터 로드 실패', e);
            }
        };

        loadData();
    }, []);

    // 나눔글 상세정보 요청
    const handleOpenNanumDetailModal = async (id) => {
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

        setSelectedNanumId(id);
        setNanumDetailModalOpen(true);
    };

    const handleCloseNanumDetailModal = () => {
        setNanumDetailModalOpen(false);
    };

    // 게시물 상세정보 요청
    const handleOpenBoardDetailModal = async (id) => {
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

        setSelectedBoardId(id);
        setBoardDetailModalOpen(true);
    };

    const handleCloseBoardDetailModal = () => {
        setBoardDetailModalOpen(false);
    };

    return (
        <Container>
            <Box>
                <Typography sx={{ fontSize: 30, mt: 3, pl: 2, mb: 5, textAlign: 'center' }}>
                    스포츠 팬들을 위한 맞춤형 <span style={{ color: '#0d41e1' }}>경기 일정</span> 및{' '}
                    <span style={{ color: '#0d41e1' }}>소통</span> 플랫폼
                </Typography>
            </Box>

            <Box>
                <Typography variant='h6' sx={{ fontWeight: '500', display: 'flex', mt: 3, pl: 2, mb: 0.5 }}>
                    📢 오늘의 경기
                </Typography>
            </Box>

            <Box
                gap={2}
                sx={{ display: 'flex', overflowX: 'auto', flexWrap: 'nowrap', bgcolor: '#F4F4F4', p: 2, borderRadius: 2 }}
            >
                {todayGames ? (
                    todayGames.map((value) => (
                        <Box
                            onClick={() => navigate(`/gameDetail/${value.league}/${value.gameId}`)}
                            textAlign='center'
                            sx={{
                                cursor: 'pointer',
                                minWidth: '23%',
                                borderRadius: 2,
                                pt: 1,
                                bgcolor: 'white',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                            }}
                        >
                            <Typography sx={{ borderBottom: 'solid 2px #F2F2F2', pb: 1, color: '#676C74' }}>
                                {value.league.toUpperCase()}
                            </Typography>

                            <Box display='flex' flexDirection='row' sx={{ p: 1, height: '100px' }}>
                                <Box sx={{ minWidth: '40%', pt: 1 }}>
                                    <img
                                        src={`${process.env.REACT_APP_STATIC_IMAGE_URL}/leagueLogo/${value.league}/${encodeURIComponent(value.awayTeam.normalize('NFD'))}.png`}
                                        alt={value.awayTeam}
                                        width='50'
                                        height='50'
                                    />
                                    <Typography sx={{ fontSize: 15 }}>{value.awayTeam}</Typography>
                                </Box>

                                <Box display='flex' flexDirection='column' sx={{ minWidth: '20%', alignSelf: 'center' }}>
                                    <Typography sx={{ fontSize: 20 }}>vs</Typography>
                                    <Typography sx={{ fontSize: 12, color: '#0d41e1' }}>
                                        {format(new Date(value.gameDate), 'HH:mm')}
                                    </Typography>
                                </Box>

                                <Box sx={{ minWidth: '40%', pt: 1 }}>
                                    <img
                                        src={`${process.env.REACT_APP_STATIC_IMAGE_URL}/leagueLogo/${value.league}/${encodeURIComponent(value.homeTeam.normalize('NFD'))}.png`}
                                        alt={value.homeTeam}
                                        width='50'
                                        height='50'
                                    />
                                    <Typography sx={{ fontSize: 15 }}>{value.homeTeam}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Box textAlign='center' sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant='h4'>오늘은 경기가 없습니다.</Typography>
                    </Box>
                )}
            </Box>

            <Box display='flex' flex='row' sx={{ mt: 5 }}>
                <Box sx={{ width: '70%' }}>
                    {/* 최신 나눔글 */}
                    <Box>
                        <Box display='flex' flex='row' justifyContent='space-between'>
                            <Typography variant='h6' sx={{ pl: 2, mb: 0.5 }}>
                                🎁 최신 나눔글
                            </Typography>

                            <Button onClick={() => navigate('/nanum')} sx={{ mr: 2, color: '#0d41e1' }}>
                                더보기 &gt;
                            </Button>
                        </Box>

                        <Box gap={2} display='flex' flexDirection='row' sx={{ flexWrap: 'wrap', width: '100%', m: 'auto', p: 2 }}>
                            {lastestNanum &&
                                lastestNanum.map((nanum) => (
                                    <Box
                                        key={nanum.nanumId}
                                        onClick={() => handleOpenNanumDetailModal(nanum.nanumId)}
                                        display='flex'
                                        flexDirection='row'
                                        sx={{
                                            width: '44%',
                                            cursor: 'pointer',
                                            borderRadius: 2,
                                            border: 'solid 1px #E5E7EB',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            p: 1,
                                            px: 1.5,
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                            },
                                        }}
                                    >
                                        <Box alignContent='center'>
                                            <img
                                                src={`${process.env.REACT_APP_NANUM_IMAGE_URL}/${encodeURIComponent(nanum.imagePath[0].normalize('NFD'))}`}
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: 'cover',
                                                    borderRadius: 5,
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ ml: 2 }}>
                                            {/* 제목 및 내용 */}
                                            <Typography
                                                sx={{
                                                    fontSize: 15,
                                                    textAlign: 'left',
                                                    color: 'black',
                                                    width: '100%',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {nanum.subject}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    textAlign: 'left',
                                                    color: '#666',
                                                    width: '100%',
                                                    height: '40px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {nanum.content}
                                            </Typography>

                                            {/* 수량 및 수령 방법 */}
                                            <Box sx={{ textAlign: 'left', mt: 0.5 }}>
                                                <Typography sx={{ fontSize: 13, color: '#666' }}>
                                                    <FaGift size={10} style={{ marginRight: '5px' }} color='red' />
                                                    {nanum.quantity}개 나눔 (
                                                    {nanum.giveMethod === 'direct' ? '직접 수령' : '택배 수령'})
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                        </Box>
                    </Box>

                    {/* 실시간 인기글 */}
                    <Box>
                        <Box display='flex' flex='row' justifyContent='space-between'>
                            <Typography variant='h6' sx={{ mt: 5, pl: 2, mb: 0.5 }}>
                                🔥 실시간 인기글
                            </Typography>

                            <Button onClick={() => navigate('/community')} sx={{ mt: 5, mr: 2, color: '#0d41e1' }}>
                                더보기 &gt;
                            </Button>
                        </Box>

                        <Box gap={2} display='flex' flexDirection='row' sx={{ flexWrap: 'wrap', width: '100%', m: 'auto', p: 2 }}>
                            {hotBoard &&
                                hotBoard.map((board) => (
                                    <Box
                                        key={board.boardId}
                                        onClick={() => handleOpenBoardDetailModal(board.boardId)}
                                        display='flex'
                                        flexDirection='row'
                                        sx={{
                                            width: '44%',
                                            cursor: 'pointer',
                                            borderRadius: 2,
                                            border: 'solid 1px #E5E7EB',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            p: 1,
                                            px: 1.5,
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                            },
                                        }}
                                    >
                                        <Box sx={{ px: 1, py: 0.3 }}>
                                            {/* 제목 및 내용 */}
                                            <Typography
                                                sx={{
                                                    fontSize: 15,
                                                    textAlign: 'left',
                                                    color: 'black',
                                                    width: '100%',
                                                    height: '25px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {board.subject}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    textAlign: 'left',
                                                    color: '#666',
                                                    width: '100%',
                                                    height: '40px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {board.content}
                                            </Typography>

                                            {/* 게시물 정보 */}
                                            <Box gap={2} sx={{ display: 'flex', color: '#999' }}>
                                                {/* 좋아요 수 */}
                                                {board.likeCount !== 0 && (
                                                    <Typography sx={{ fontSize: 12, display: 'flex' }}>
                                                        <FaThumbsUp size={13} style={{ marginRight: '4px' }} color='red' />
                                                        {board.likeCount}
                                                    </Typography>
                                                )}

                                                {/* 댓글 수 */}
                                                {board.replyCount !== 0 && (
                                                    <Typography sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                                        <IoChatbubbleOutline
                                                            size={13}
                                                            style={{ marginRight: '3px' }}
                                                            color='#0d41e1'
                                                        />
                                                        {board.replyCount}
                                                    </Typography>
                                                )}

                                                {/* 작성 날짜 */}
                                                <Typography sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                                    <MdDateRange size={13} style={{ marginRight: '3px' }} color='black' />
                                                    {board.createTime.substr(5, 5).replace('-', '/')}
                                                </Typography>

                                                {/* 작성자 */}
                                                <Typography sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                                    <IoPersonSharp size={13} style={{ marginRight: '4px' }} color='black' />
                                                    {board.nickname}
                                                </Typography>

                                                {/* 조회수 */}
                                                <Typography sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                                    <IoEyeSharp size={13} style={{ marginRight: '4px' }} color='black' />
                                                    {board.viewCount}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                        </Box>
                    </Box>
                </Box>

                {/* 마이팀 경기 */}
                <Box sx={{ width: '30%', borderLeft: '1px solid #EFEFEF' }}>
                    <Typography variant='h6' sx={{ display: 'flex', pl: 2, mb: 0.5 }}>
                        📌 오늘의 마이팀 경기
                    </Typography>

                    <Box display='flex' flexDirection='column' gap={2} sx={{ p: 2, pr: 0.5 }}>
                        {isLoggedIn ? (
                            !myTeamLength ? (
                                myTeamData.map((value) => (
                                    <Box
                                        onClick={() => navigate(`/gameDetail/${value.league}/${value.gameId}`)}
                                        textAlign='center'
                                        sx={{
                                            cursor: 'pointer',
                                            width: '100%',
                                            bgcolor: 'white',
                                            borderRadius: 2,
                                            border: 'solid 1px #E5E7EB',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                            },
                                        }}
                                    >
                                        <Typography sx={{ borderBottom: 'solid 2px #F2F2F2', color: '#676C74' }}>
                                            {value.league.toUpperCase()}
                                        </Typography>

                                        <Box display='flex' flexDirection='row' sx={{ height: '70px' }}>
                                            <Box sx={{ minWidth: '40%', alignSelf: 'center' }}>
                                                <img
                                                    src={`${process.env.REACT_APP_STATIC_IMAGE_URL}/leagueLogo/${value.league}/${encodeURIComponent(value.awayTeam.normalize('NFD'))}.png`}
                                                    alt={value.awayTeam}
                                                    width='35'
                                                    height='35'
                                                />
                                                <Typography sx={{ fontSize: 13 }}>{value.awayTeam}</Typography>
                                            </Box>

                                            <Box
                                                display='flex'
                                                flexDirection='column'
                                                sx={{ minWidth: '20%', alignSelf: 'center' }}
                                            >
                                                <Typography sx={{ fontSize: 20 }}>vs</Typography>
                                                <Typography sx={{ fontSize: 12, color: '#0d41e1' }}>
                                                    {format(new Date(value.gameDate), 'HH:mm')}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ minWidth: '40%', alignSelf: 'center' }}>
                                                <img
                                                    src={`${process.env.REACT_APP_STATIC_IMAGE_URL}/leagueLogo/${value.league}/${encodeURIComponent(value.homeTeam.normalize('NFD'))}.png`}
                                                    alt={value.homeTeam}
                                                    width='35'
                                                    height='35'
                                                />
                                                <Typography sx={{ fontSize: 13 }}>{value.homeTeam}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))
                            ) : (
                                <Box textAlign='center'>
                                    <Typography sx={{ fontSize: 25 }}>
                                        <span style={{ color: '#0d41e1' }}>마이팀</span>을 설정하고
                                    </Typography>
                                    <Typography sx={{ fontSize: 25 }}>맞춤형 경기 정보를 받아보세요!</Typography>

                                    <Button
                                        onClick={() => navigate('/mypage')}
                                        sx={{ fontSize: 15, textAlign: 'right', mt: 1, color: '#0d41e1' }}
                                    >
                                        마이팀 설정하러 가기 &gt;
                                    </Button>
                                </Box>
                            )
                        ) : (
                            <Box textAlign='center'>
                                <Typography sx={{ fontSize: 25 }}>
                                    <span style={{ color: '#0d41e1' }}>로그인</span>을 해서
                                </Typography>
                                <Typography sx={{ fontSize: 25 }}>맞춤형 경기 정보를 받아보세요!</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            <NanumDetail
                open={nanumDetailModalOpen}
                onClose={handleCloseNanumDetailModal}
                setDetailModalOpen={setNanumDetailModalOpen}
                nanumId={selectedNanumId}
                setNanumId={setSelectedNanumId}
            />

            <BoardDetail
                open={boardDetailModalOpen}
                onClose={handleCloseBoardDetailModal}
                setDetatilModalOpen={setBoardDetailModalOpen}
                boardId={selectedBoardId}
            />
        </Container>
    );
};

export default Home;
