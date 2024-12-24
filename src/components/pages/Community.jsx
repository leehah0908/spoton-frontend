import { Box, Button, Container, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import BoardDetail from '../modals/BoardDetail';
import { IoChatbubbleOutline, IoPersonSharp, IoEyeSharp } from 'react-icons/io5';
import { FaThumbsUp } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';
import AuthContext from '../../contexts/UserContext';
import WriteBoardModal from '../modals/WriteBoardModal';
import Swal from 'sweetalert2';
import axios from 'axios';

const Community = () => {
    const { isLoggedIn } = useContext(AuthContext);

    const [boardList, setBoardList] = useState([]);
    const [detatilModalOpen, setDetatilModalOpen] = useState(false);
    const [WriteModalOpen, setWriteModalOpen] = useState(false);

    const [selecedBoardData, setSelecedBoardData] = useState(null);
    const [searchType, setSearchType] = useState('subject');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedSports, setSelectedSports] = useState('ALL');

    const [hotBoard, setHotBoard] = useState([]);

    useEffect(() => {
        // 추천 수 많은 게시물 요청
        const hotBoardDataLoad = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/board/hot_board`);
                setHotBoard(res.data.result);
            } catch (e) {
                console.log('추천 많은 게시물 데이터 로드 실패');
            }
        };
        hotBoardDataLoad();
    }, []);

    useEffect(() => {
        sessionStorage.removeItem('gameState');

        const loadData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/board/list`, {
                    params: {
                        searchType: '',
                        searchKeyword: '',
                    },
                });

                setBoardList(res.data.result.content);
            } catch (e) {
                console.log('게시물 데이터 로드 실패');
            }
        };
        loadData();
    }, [WriteModalOpen, detatilModalOpen]);

    const handleOpenDetailModal = async (id) => {
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

        const selecedData = boardList.find((board) => board.boardId === id);
        setSelecedBoardData(selecedData);

        setDetatilModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setDetatilModalOpen(false);
    };

    const handleOpenWriteModal = () => {
        setWriteModalOpen(true);
    };

    const handleCloseWriteModal = async () => {
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

        setWriteModalOpen(false);
    };

    const handleSearch = () => {
        const loadData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/board/list`, {
                    params: {
                        searchType,
                        searchKeyword,
                    },
                });

                setBoardList(res.data.result.content);
                setSearchType('subject');
                setSearchKeyword('');
            } catch (e) {
                console.log('게시물 데이터 로드 실패');
            }
        };
        loadData();
    };

    const filteredBoards = selectedSports === 'ALL' ? boardList : boardList.filter((board) => board.sports === selectedSports);

    const requireLogin = () => {
        Swal.fire({
            width: '20rem',
            text: '로그인이 필요합니다.',
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
    };

    return (
        <Container maxWidth='lg'>
            <Box>
                <Typography variant='h6' sx={{ fontWeight: '500', display: 'flex', mt: 3, pl: 2, mb: 0.5 }}>
                    🔥 실시간 인기글
                </Typography>
            </Box>

            <Box
                gap={2}
                sx={{ display: 'flex', overflowX: 'auto', flexWrap: 'nowrap', bgcolor: '#EFF1F8', p: 2, borderRadius: 2 }}
            >
                {hotBoard.length > 0 &&
                    hotBoard.map((value) => (
                        <Box
                            key={value.boardId}
                            onClick={() => handleOpenDetailModal(value.boardId)}
                            textAlign='center'
                            sx={{
                                cursor: 'pointer',
                                minWidth: '21%',
                                borderRadius: 2,
                                pt: 1,
                                bgcolor: 'white',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            <Typography sx={{ borderBottom: 'solid 2px #F2F2F2', pb: 1, color: '#676C74' }}>
                                {value.sports}
                            </Typography>

                            <Box sx={{ p: 1, height: '90px' }}>
                                <Box sx={{}}>
                                    <Typography sx={{ fontSize: 15 }}>
                                        {value.subject.length < 16 ? value.subject : value.subject.substr(0, 15) + '...'}
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 1 }}>
                                    <Typography sx={{ fontSize: 12, color: '#666' }}>
                                        {value.content.length < 21 ? value.content : value.content.substr(0, 20) + '...'}
                                    </Typography>
                                </Box>

                                <Box display='flex' flexDirection='row' justifyContent='space-between' sx={{ px: 2, pt: 2 }}>
                                    {/* 작성자 */}
                                    <Typography variant='caption' sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                        <IoPersonSharp size={13} style={{ marginRight: '4px' }} color='black' />
                                        {value.nickname}
                                    </Typography>

                                    {/* 작성 날짜 */}
                                    <Typography variant='caption' sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                        <MdDateRange size={13} style={{ marginRight: '3px' }} color='black' />
                                        {value.createTime.substr(5, 5).replace('-', '/')}
                                    </Typography>

                                    {/* 좋아요 수 */}
                                    <Typography variant='caption' sx={{ fontSize: 12, display: 'flex' }}>
                                        <FaThumbsUp size={13} style={{ marginRight: '4px' }} color='red' />
                                        {value.likeCount}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
            </Box>

            <Typography sx={{ fontSize: 23, mt: 5 }}>
                스포츠 팬들을 위한 <span style={{ color: '#0d41e1' }}>자유로운 이야기</span> 공간!
            </Typography>

            {/* 검색창 */}
            <Box
                sx={{
                    width: '60%',
                    m: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    border: 'solid 3px #0d41e1',
                    p: 0.5,
                    mb: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    mt: 2,
                }}
            >
                <Select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    sx={{
                        height: 38,
                        minWidth: 90,
                        mr: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    }}
                >
                    <MenuItem value='subject'>제목</MenuItem>
                    <MenuItem value='content'>내용</MenuItem>
                    <MenuItem value='writer'>작성자</MenuItem>
                </Select>

                <TextField
                    placeholder='검색어를 입력해주세요.'
                    fullWidth
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                    sx={{
                        height: 38,
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-root': {
                            height: '100%',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton onClick={handleSearch}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* 카테고리 선택 */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button
                    variant='outlined'
                    onClick={() => setSelectedSports('ALL')}
                    sx={{
                        backgroundColor: selectedSports === 'ALL' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedSports === 'ALL' ? '#0d41e1' : '#7D7D7D',
                        borderColor: selectedSports === 'ALL' ? '#0d41e1' : '#D4D4D8',
                    }}
                >
                    전체
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => setSelectedSports('baseball')}
                    sx={{
                        backgroundColor: selectedSports === 'baseball' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedSports === 'baseball' ? '#0d41e1' : '#7D7D7D',
                        borderColor: selectedSports === 'baseball' ? '#0d41e1' : '#D4D4D8',
                    }}
                >
                    야구
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => setSelectedSports('soccer')}
                    sx={{
                        backgroundColor: selectedSports === 'soccer' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedSports === 'soccer' ? '#0d41e1' : '#7D7D7D',
                        borderColor: selectedSports === 'soccer' ? '#0d41e1' : '#D4D4D8',
                    }}
                >
                    축구
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => setSelectedSports('basketball')}
                    sx={{
                        backgroundColor: selectedSports === 'basketball' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedSports === 'basketball' ? '#0d41e1' : '#7D7D7D',
                        borderColor: selectedSports === 'basketball' ? '#0d41e1' : '#D4D4D8',
                    }}
                >
                    농구
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => setSelectedSports('volleyball')}
                    sx={{
                        backgroundColor: selectedSports === 'volleyball' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedSports === 'volleyball' ? '#0d41e1' : '#7D7D7D',
                        borderColor: selectedSports === 'volleyball' ? '#0d41e1' : '#D4D4D8',
                    }}
                >
                    배구
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => setSelectedSports('esports')}
                    sx={{
                        backgroundColor: selectedSports === 'esports' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedSports === 'esports' ? '#0d41e1' : '#7D7D7D',
                        borderColor: selectedSports === 'esports' ? '#0d41e1' : '#D4D4D8',
                    }}
                >
                    E-스포츠
                </Button>
            </Box>

            {/* 글쓰기 버튼 */}
            <Box sx={{ width: '89%', display: 'flex', justifyContent: 'flex-end', my: 1 }}>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={isLoggedIn ? handleOpenWriteModal : requireLogin}
                    sx={{
                        borderRadius: 1,
                        bgcolor: '#0d41e1',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        textTransform: 'none',
                    }}
                >
                    글쓰기
                </Button>
            </Box>

            {/* 게시물 리스트 */}
            <Box gap={1} display='flex' flexDirection='row' sx={{ flexWrap: 'wrap', width: '80%', m: 'auto' }}>
                {filteredBoards &&
                    filteredBoards.map((board) => (
                        <Box
                            key={board.boardId}
                            onClick={() => handleOpenDetailModal(board.boardId)}
                            display='flex'
                            flexDirection='row'
                            sx={{
                                width: '49.3%',
                                height: '115px',
                                cursor: 'pointer',
                                borderRadius: 2,
                                border: 'solid 1px #E5E7EB',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                            }}
                        >
                            <Box sx={{ py: 1, px: 3, width: '100%' }}>
                                {/* 제목 및 내용 */}
                                <Box sx={{ textAlign: 'left' }}>
                                    <Typography sx={{ color: 'black' }}>
                                        {board.subject.length < 16 ? board.subject : board.subject.substr(0, 15) + '...'}
                                    </Typography>

                                    <Typography variant='body2' sx={{ height: '40px', color: '#666', mb: 1.5, mt: 0.3 }}>
                                        {board.content.length < 51 ? board.content : board.content.substr(0, 50) + '...'}
                                    </Typography>
                                </Box>

                                {/* 게시물 정보 */}
                                <Box gap={2} sx={{ display: 'flex', color: '#999' }}>
                                    {/* 좋아요 수 */}
                                    {board.likeCount !== 0 && (
                                        <Typography variant='caption' sx={{ fontSize: 12, display: 'flex' }}>
                                            <FaThumbsUp size={13} style={{ marginRight: '4px' }} color='red' />
                                            {board.likeCount}
                                        </Typography>
                                    )}

                                    {/* 댓글 수 */}
                                    {board.replyCount !== 0 && (
                                        <Typography
                                            variant='caption'
                                            sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}
                                        >
                                            <IoChatbubbleOutline size={13} style={{ marginRight: '3px' }} color='#0d41e1' />
                                            {board.replyCount}
                                        </Typography>
                                    )}

                                    {/* 작성 날짜 */}
                                    <Typography variant='caption' sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                        <MdDateRange size={13} style={{ marginRight: '3px' }} color='black' />
                                        {board.createTime.substr(5, 5).replace('-', '/')}
                                    </Typography>

                                    {/* 작성자 */}
                                    <Typography variant='caption' sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                        <IoPersonSharp size={13} style={{ marginRight: '4px' }} color='black' />
                                        {board.nickname}
                                    </Typography>

                                    {/* 조회수 */}
                                    <Typography variant='caption' sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                        <IoEyeSharp size={13} style={{ marginRight: '4px' }} color='black' />
                                        {board.viewCount}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}

                <Box sx={{ m: 'auto' }}>{filteredBoards.length === 0 && <Typography>게시물이 없습니다.</Typography>}</Box>
            </Box>
            <BoardDetail
                open={detatilModalOpen}
                onClose={handleCloseDetailModal}
                setDetatilModalOpen={setDetatilModalOpen}
                setSelecedBoardData={setSelecedBoardData}
                selecedBoardData={selecedBoardData}
                setBoardList={setBoardList}
            />
            <WriteBoardModal open={WriteModalOpen} onClose={handleCloseWriteModal} setWriteModalOpen={setWriteModalOpen} />
        </Container>
    );
};

export default Community;
