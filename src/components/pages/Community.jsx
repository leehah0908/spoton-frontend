import {
    Box,
    Button,
    Container,
    Divider,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
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
        <Container maxWidth='md'>
            <Typography variant='h4' sx={{ color: '#0d41e1', mb: 5, mt: 5 }}>
                커뮤니티
            </Typography>

            {/* 검색창 */}
            <Box
                sx={{
                    width: '80%',
                    m: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    border: 'solid 3px #0d41e1',
                    p: 0.5,
                    mb: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
                    variant={selectedSports === 'ALL' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedSports('ALL')}
                    sx={{
                        backgroundColor: selectedSports === 'ALL' ? '#0d41e1' : 'white',
                        color: selectedSports === 'ALL' ? '#fff' : '#0d41e1',
                        borderColor: '#0d41e1',
                    }}
                >
                    전체
                </Button>
                <Button
                    variant={selectedSports === 'baseball' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedSports('baseball')}
                    sx={{
                        backgroundColor: selectedSports === 'baseball' ? '#0d41e1' : 'white',
                        color: selectedSports === 'baseball' ? '#fff' : '#0d41e1',
                        borderColor: '#0d41e1',
                    }}
                >
                    야구
                </Button>
                <Button
                    variant={selectedSports === 'soccer' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedSports('soccer')}
                    sx={{
                        backgroundColor: selectedSports === 'soccer' ? '#0d41e1' : 'white',
                        color: selectedSports === 'soccer' ? '#fff' : '#0d41e1',
                        borderColor: '#0d41e1',
                    }}
                >
                    축구
                </Button>
                <Button
                    variant={selectedSports === 'basketball' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedSports('basketball')}
                    sx={{
                        backgroundColor: selectedSports === 'basketball' ? '#0d41e1' : 'white',
                        color: selectedSports === 'basketball' ? '#fff' : '#0d41e1',
                        borderColor: '#0d41e1',
                    }}
                >
                    농구
                </Button>
                <Button
                    variant={selectedSports === 'volleyball' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedSports('volleyball')}
                    sx={{
                        backgroundColor: selectedSports === 'volleyball' ? '#0d41e1' : 'white',
                        color: selectedSports === 'volleyball' ? '#fff' : '#0d41e1',
                        borderColor: '#0d41e1',
                    }}
                >
                    배구
                </Button>
                <Button
                    variant={selectedSports === 'esports' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedSports('esports')}
                    sx={{
                        backgroundColor: selectedSports === 'esports' ? '#0d41e1' : 'white',
                        color: selectedSports === 'esports' ? '#fff' : '#0d41e1',
                        borderColor: '#0d41e1',
                    }}
                >
                    E-스포츠
                </Button>
            </Box>

            {/* 글쓰기 버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
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
            <List>
                {filteredBoards &&
                    filteredBoards.map((board) => (
                        <Box
                            key={board.boardId}
                            onClick={() => handleOpenDetailModal(board.boardId)}
                            display='flex'
                            flexDirection='row'
                            sx={{
                                mb: 1,
                                cursor: 'pointer',
                                backgroundColor: '#f9f9f9',
                                borderRadius: 2,
                                justifyContent: 'space-between',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                            }}
                        >
                            <Box>
                                {/* 제목 및 내용 */}
                                <ListItem sx={{ py: 0 }}>
                                    <ListItemText
                                        primary={<Typography sx={{ color: 'black' }}>{board.subject}</Typography>}
                                        secondary={
                                            <Typography variant='body2' sx={{ color: '#666' }}>
                                                {board.content}
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                {/* 게시물 정보 */}
                                <Box
                                    gap={2}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        ml: 2,
                                        mb: 1,
                                        color: '#999',
                                    }}
                                >
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

                                <Divider />
                            </Box>
                        </Box>
                    ))}

                {filteredBoards.length === 0 && <Typography>게시물이 없습니다.</Typography>}
            </List>
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
