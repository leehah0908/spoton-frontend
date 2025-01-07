import { Box, Button, Container, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { FaGift } from 'react-icons/fa6';
import AuthContext from '../../contexts/UserContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import WriteNanumModal from '../modals/WriteNanumModal';
import NanumDetail from '../modals/NanumDetail';

const Nanum = () => {
    const { isLoggedIn, isNumber } = useContext(AuthContext);

    const [nanumList, setNanumList] = useState([]);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [WriteModalOpen, setWriteModalOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [searchType, setSearchType] = useState('subject');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedSports, setSelectedSports] = useState('ALL');

    const [lastestNanum, setLastestNanum] = useState([]);

    useEffect(() => {
        sessionStorage.removeItem('gameState');

        reRequestNanumData();
    }, []);

    // 나눔글 최신화 함수
    const reRequestNanumData = async () => {
        try {
            const [nanumListRes, lastestNanumRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BASE_URL}/nanum/list`, {
                    params: {
                        searchType: '',
                        searchKeyword: '',
                    },
                }),
                axios.get(`${process.env.REACT_APP_BASE_URL}/nanum/lastest_nanum`),
            ]);

            setNanumList(nanumListRes.data.result.content);
            setLastestNanum(lastestNanumRes.data.result);
        } catch (e) {
            console.log('데이터 로드 실패', e);
        }
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

    // 검색 로직
    const handleSearch = () => {
        const loadData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/nanum/list`, {
                    params: {
                        searchType,
                        searchKeyword,
                    },
                });

                setNanumList(res.data.result.content);
                setSearchType('subject');
                setSearchKeyword('');
            } catch (e) {
                console.log('게시물 데이터 로드 실패');
            }
        };
        loadData();
    };

    const filteredNanums = selectedSports === 'ALL' ? nanumList : nanumList.filter((nanum) => nanum.sports === selectedSports);

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

    const requireIsNumber = () => {
        Swal.fire({
            width: '20rem',
            html: '나눔글을 작성하기 위해서는<br>번호 인증을 해야 합니다.<br>(마이페이지 → 계정관리 → 번호 인증)',
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
                    🎁 최신 나눔글
                </Typography>
            </Box>

            <Box
                gap={2}
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    flexWrap: 'nowrap',
                    bgcolor: '#F4F4F4',
                    p: 2,
                    borderRadius: 2,
                }}
            >
                {lastestNanum.length > 0 &&
                    lastestNanum.map((value) => (
                        <Box
                            key={value.nanumId}
                            onClick={() => handleOpenDetailModal(value.nanumId)}
                            textAlign='center'
                            display='flex'
                            flexDirection='column'
                            sx={{
                                cursor: 'pointer',
                                minWidth: '15%',
                                maxWidth: '15%',
                                borderRadius: 2,
                                bgcolor: 'white',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                                p: 2,
                            }}
                        >
                            <Box
                                alignContent='center'
                                sx={{
                                    mb: 1,
                                    width: '100%',
                                    position: 'relative',
                                    paddingBottom: '100%',
                                }}
                            >
                                <img
                                    src={`/nanum_img/${value.imagePath[0]}`}
                                    width='100%'
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: 10,
                                    }}
                                />
                            </Box>

                            <Box justifyItems='left' sx={{ width: '100%' }}>
                                <Typography
                                    sx={{
                                        textAlign: 'left',
                                        width: '95%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {value.subject}
                                </Typography>

                                <Box sx={{ mt: 1 }}>
                                    {/* 제공 수량 */}
                                    <Typography sx={{ fontSize: 13 }}>
                                        <FaGift size={12} style={{ marginRight: '4px' }} color='red' />
                                        {value.quantity}개 나눔 ({value.giveMethod === 'direct' ? '직접 수령' : '택배 수령'})
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
            </Box>

            <Typography sx={{ fontSize: 23, mt: 5 }}>
                스포츠 팬들이 함께 만드는 <span style={{ color: '#0d41e1' }}>굿즈 나눔</span>의 장소!
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
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', my: 1 }}>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={isLoggedIn ? (isNumber ? handleOpenWriteModal : requireIsNumber) : requireLogin}
                    sx={{
                        borderRadius: 1,
                        bgcolor: '#0d41e1',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        textTransform: 'none',
                        mr: 1,
                    }}
                >
                    나눔하기
                </Button>
            </Box>

            {/* 나눔글 리스트 */}
            <Box gap={2} display='flex' flexDirection='row' sx={{ flexWrap: 'wrap', width: '100%', m: 'auto' }}>
                {filteredNanums &&
                    filteredNanums.map((nanum) => (
                        <Box
                            key={nanum.nanumId}
                            onClick={() => handleOpenDetailModal(nanum.nanumId)}
                            display='flex'
                            flexDirection='column'
                            sx={{
                                width: '18.8%',
                                cursor: 'pointer',
                                borderRadius: 3,
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                            }}
                        >
                            <Box
                                alignContent='center'
                                sx={{
                                    width: '100%',
                                    position: 'relative',
                                    paddingBottom: '100%',
                                }}
                            >
                                <img
                                    src={`/nanum_img/${nanum.imagePath[0]}`}
                                    width='100%'
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: 13,
                                    }}
                                />
                            </Box>

                            <Box sx={{ py: 1, px: 1 }}>
                                {/* 제목 및 내용 */}
                                <Typography
                                    sx={{
                                        textAlign: 'left',
                                        color: 'black',
                                        width: '100%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {nanum.subject}
                                </Typography>

                                {/* 수량 및 수령 방법 */}
                                <Box sx={{ textAlign: 'left', mt: 1, mb: 3 }}>
                                    <Typography sx={{ fontSize: 15, color: '#666' }}>
                                        <FaGift size={12} style={{ marginRight: '5px' }} color='red' />
                                        {nanum.quantity}개 나눔 ({nanum.giveMethod === 'direct' ? '직접 수령' : '택배 수령'})
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}

                <Box sx={{ m: 'auto' }}>{filteredNanums.length === 0 && <Typography>게시물이 없습니다.</Typography>}</Box>
            </Box>

            <NanumDetail
                open={detailModalOpen}
                onClose={handleCloseDetailModal}
                setDetailModalOpen={setDetailModalOpen}
                reRequestNanumData={reRequestNanumData}
                nanumId={selectedId}
                setNanumId={setSelectedId}
            />

            <WriteNanumModal
                open={WriteModalOpen}
                onClose={handleCloseWriteModal}
                setWriteModalOpen={setWriteModalOpen}
                reRequestNanumData={reRequestNanumData}
            />
        </Container>
    );
};

export default Nanum;
