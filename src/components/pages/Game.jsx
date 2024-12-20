import { Button, Box, Typography, Container, Avatar, Divider } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { sportsData } from '../../assets/sportsData';
import DateList from '../DateList';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import AuthContext from '../../contexts/UserContext';
import Swal from 'sweetalert2';
import axiosInstance from '../../configs/axios-config';

const Game = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const today = new Date();

    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(today.getDate());

    const [selectedSport, setSelectedSport] = useState('');
    const [selectedLeague, setSelectedLeague] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');

    const [myTeamData, setMyTeamData] = useState({});
    const [gameList, setGameList] = useState([]);
    const selectedFullDate = new Date(selectedYear, selectedMonth, selectedDay);

    const [todayGames, setTodayGames] = useState([]);

    // 상태 복원: 페이지가 로드될 때 실행
    useEffect(() => {
        const savedState = sessionStorage.getItem('gameState');

        if (savedState) {
            const state = JSON.parse(savedState);
            setSelectedYear(state.selectedYear);
            setSelectedMonth(state.selectedMonth);
            setSelectedDay(state.selectedDay);
            setSelectedSport(state.selectedSport);
            setSelectedLeague(state.selectedLeague);
        }

        // 오늘 경기 요청
        const todayDataLoad = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/game/today`);
                setTodayGames(res.data.result);
            } catch (e) {
                console.log('게임 데이터 로드 실패');
            }
        };
        todayDataLoad();
    }, []);

    // 상태 저장: 상태가 변경될 때마다 실행
    useEffect(() => {
        const currentState = {
            selectedYear,
            selectedMonth,
            selectedDay,
            selectedSport,
            selectedLeague,
        };
        sessionStorage.setItem('gameState', JSON.stringify(currentState));
    }, [selectedYear, selectedMonth, selectedDay, selectedSport, selectedLeague]);

    // 년, 월이 바뀔 때마다 데이터 요청
    useEffect(() => {
        if (!selectedLeague || !selectedSport) {
            setGameList([]);
        } else if (selectedSport === 'MYTEAM') {
            const params = {
                sports: selectedSport,
                league: selectedLeague,
                year: selectedYear,
                month: selectedMonth + 1,
                team: selectedTeam,
            };
            const loadData = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/game/list`, { params });
                    setGameList(res.data.result);
                } catch (e) {
                    console.log('게임 데이터 로드 실패');
                }
            };
            loadData();
        } else {
            const params = {
                sports: selectedSport,
                league: selectedLeague,
                year: selectedYear,
                month: selectedMonth + 1,
            };

            const loadData = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/game/list`, { params });
                    setGameList(res.data.result);
                } catch (e) {
                    console.log('게임 데이터 로드 실패');
                }
            };
            loadData();
        }
    }, [selectedYear, selectedMonth, selectedLeague, selectedSport]);

    // 스포츠 변경시 변수값 조정
    const handleSportClick = (sport) => {
        setSelectedSport(sport);
        setSelectedLeague('ALL');
        setSelectedYear(today.getFullYear());
        setSelectedMonth(today.getMonth());
        setSelectedDay(today.getDate());
    };

    // 선택된 날짜의 경기 데이터 필터링
    const selectGameData = Object.values(gameList).filter((game) => new Date(game.gameStartTime).getDate() === selectedDay);

    const myTeamClick = async () => {
        // 마이팀 불러오기
        if (isLoggedIn) {
            try {
                const res = await axiosInstance.get(`${process.env.REACT_APP_BASE_URL}/game/myteam`);

                const filteredData = Object.entries(res.data.result)
                    .filter(([key, value]) => key !== 'mtId' && value !== null)
                    .reduce((acc, [key, value]) => {
                        acc[key] = value;
                        return acc;
                    }, {});

                setMyTeamData(filteredData);

                const league = Object.keys(filteredData)[0];
                const team = Object.values(filteredData)[0];

                setSelectedSport('MYTEAM');
                setSelectedLeague(league);
                setSelectedTeam(team);

                setSelectedYear(today.getFullYear());
                setSelectedMonth(today.getMonth());
                setSelectedDay(today.getDate());
            } catch (e) {
                console.log('마이팀 로드 실패');
            }
        } else {
            await Swal.fire({
                width: '20rem',
                html: '마이팀 기능은<br>로그인 후 이용할 수 있습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                },
            });
        }
    };

    return (
        <Container maxWidth='lg'>
            <Box>
                <Typography variant='h6' sx={{ fontWeight: '500', display: 'flex', mt: 3, pl: 2, mb: 0.5 }}>
                    📢 오늘의 경기
                </Typography>
            </Box>
            <Box
                gap={2}
                sx={{ display: 'flex', overflowX: 'auto', flexWrap: 'nowrap', bgcolor: '#EFF1F8', p: 2, borderRadius: 2 }}
            >
                {todayGames.length > 0 ? (
                    todayGames.map((value) => (
                        <Box
                            onClick={() => navigate(`/gameDetail/${value.gameId}/${value.leagueName}`)}
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
                                {value.leagueName.toUpperCase()}
                            </Typography>

                            <Box display='flex' flexDirection='row' sx={{ p: 1, height: '100px' }}>
                                <Box sx={{ minWidth: '40%', pt: 1 }}>
                                    <img
                                        src={`leagueLogo/${value.leagueName}/${value.awayTeamName}.png`}
                                        alt={value.awayTeamName}
                                        width='50'
                                        height='50'
                                    />
                                    <Typography sx={{ fontSize: 15 }}>{value.awayTeamName}</Typography>
                                </Box>

                                <Box display='flex' flexDirection='column' sx={{ minWidth: '20%', alignSelf: 'center' }}>
                                    <Typography sx={{ fontSize: 20 }}>vs</Typography>
                                    <Typography sx={{ fontSize: 12, color: '#0d41e1' }}>
                                        {format(new Date(value.gameStartTime), 'HH:mm')}
                                    </Typography>
                                </Box>

                                <Box sx={{ minWidth: '40%', pt: 1 }}>
                                    <img
                                        src={`leagueLogo/${value.leagueName}/${value.homeTeamName}.png`}
                                        alt={value.homeTeamName}
                                        width='50'
                                        height='50'
                                    />
                                    <Typography sx={{ fontSize: 15 }}>{value.homeTeamName}</Typography>
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

            <Typography sx={{ fontSize: 23, mt: 5 }}>
                <span style={{ color: '#0d41e1' }}>종목</span>과 <span style={{ color: '#0d41e1' }}>리그</span>를 선택해서{' '}
                <span style={{ color: '#0d41e1' }}>경기 일정</span>을 확인하세요!
            </Typography>

            <Box sx={{ p: 2, mb: 5 }}>
                {/* 종목 선택 버튼 */}
                <Box display='flex' justifyContent='center' gap={2}>
                    <Button
                        key='MYTEAM'
                        variant='outlined'
                        onClick={myTeamClick}
                        sx={{
                            bgcolor: selectedSport === 'MYTEAM' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                            color: selectedSport === 'MYTEAM' ? '#0d41e1' : '#7D7D7D',
                            borderColor: selectedSport === 'MYTEAM' ? '#0d41e1' : '#D4D4D8',
                        }}
                    >
                        {'MYTEAM'}
                    </Button>

                    {Object.keys(sportsData).map((sport) => (
                        <Button
                            key={sport}
                            variant='outlined'
                            onClick={() => handleSportClick(sport)}
                            sx={{
                                bgcolor: sport === selectedSport ? 'rgba(13, 66, 225, 0.1)' : 'white',
                                color: sport === selectedSport ? '#0d41e1' : '#7D7D7D',
                                borderColor: sport === selectedSport ? '#0d41e1' : '#D4D4D8',
                            }}
                        >
                            {sport}
                        </Button>
                    ))}
                </Box>

                {/* 팀 선택(MYTEAM) */}
                {selectedSport && selectedSport === 'MYTEAM' && (
                    <Box display='flex' justifyContent='center' gap={2} sx={{ mt: 2 }}>
                        {Object.entries(myTeamData).map(([league, team]) => (
                            <Button
                                key={team}
                                variant='outlined'
                                onClick={() => {
                                    setSelectedTeam(team);
                                    setSelectedLeague(league);
                                }}
                                sx={{
                                    bgcolor: team === selectedTeam ? 'rgba(13, 66, 225, 0.1)' : 'white',
                                    color: team === selectedTeam ? '#0d41e1' : '#7D7D7D',
                                    borderColor: team === selectedTeam ? '#0d41e1' : '#D4D4D8',
                                }}
                            >
                                {team}
                            </Button>
                        ))}
                    </Box>
                )}

                {/* 리그 선택 버튼 */}
                {selectedSport && selectedSport !== 'MYTEAM' && (
                    <Box display='flex' justifyContent='center' gap={2} sx={{ mt: 2 }}>
                        {sportsData[selectedSport].leagues.map((league) => (
                            <Button
                                key={league}
                                variant='outlined'
                                onClick={() => {
                                    setSelectedLeague(league);
                                }}
                                sx={{
                                    bgcolor: league === selectedLeague ? 'rgba(13, 66, 225, 0.1)' : 'white',
                                    color: league === selectedLeague ? '#0d41e1' : '#7D7D7D',
                                    borderColor: league === selectedLeague ? '#0d41e1' : '#D4D4D8',
                                }}
                            >
                                {league}
                            </Button>
                        ))}
                    </Box>
                )}
            </Box>

            {/* 날짜 선택 버튼 */}
            <Box>
                <DateList
                    gameList={gameList}
                    selectedYear={selectedYear}
                    selectedMonth={selectedMonth}
                    setSelectedYear={setSelectedYear}
                    setSelectedMonth={setSelectedMonth}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                />
            </Box>

            {/* 일정 표시 */}
            {selectGameData.length !== 0 && (
                <Box maxWidth='md' sx={{ margin: 'auto' }}>
                    <Box sx={{ mt: 3, py: 1, bgcolor: '#0d41e1', borderRadius: 1 }}>
                        <Typography
                            variant='h5'
                            sx={{ fontSize: 20, fontWeight: '500', color: 'white', letterSpacing: '0.05em' }}
                        >
                            {`${selectedFullDate.getMonth() + 1}월 ${selectedFullDate.getDate()}일 (${new Intl.DateTimeFormat('ko-KR', { weekday: 'long' }).format(selectedFullDate)})`}
                        </Typography>
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                        {selectGameData.map((value) => (
                            <Box
                                key={value.gameId}
                                onClick={() => navigate(`/gameDetail/${value.gameId}/${value.leagueName}`)}
                                display='flex'
                                alignItems='center'
                                sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, cursor: 'pointer' }}
                            >
                                {/* 경기 시간 및 경기장 */}
                                <Box display='flex' flexDirection='row' alignItems='center'>
                                    <Typography variant='h6' sx={{ fontWeight: '500', fontSize: 15 }}>
                                        {format(new Date(value.gameStartTime), 'HH:mm')}
                                    </Typography>
                                    <Typography variant='body2' sx={{ color: 'gray', textAlign: 'left', ml: 1, fontSize: 13 }}>
                                        {value.stadium}
                                    </Typography>
                                </Box>

                                {/* 팀 정보 */}
                                <Box
                                    role='button'
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    {/* Away Team */}
                                    <Box display='flex' alignItems='center' sx={{ mr: 2 }}>
                                        <Typography variant='body1' sx={{ mr: 1 }}>
                                            {value.awayTeamName}
                                        </Typography>
                                        <Avatar
                                            src={`leagueLogo/${value.leagueName}/${value.awayTeamName}.png`}
                                            alt={value.awayTeamName}
                                            sx={{ width: 30, height: 30 }}
                                        />
                                    </Box>

                                    {/* 점수 */}
                                    <Typography
                                        display='flex'
                                        variant='h6'
                                        alignItems='center'
                                        sx={{ fontWeight: '500', fontSize: 15 }}
                                    >
                                        {value.awayTeamScore}
                                        <Typography
                                            variant='h6'
                                            sx={{
                                                fontSize: 13,
                                                mx: 2,
                                            }}
                                        >
                                            {value.cancel
                                                ? '취소'
                                                : value.statusCode === 'RESULT'
                                                  ? '경기종료'
                                                  : value.statusCode === 'BEFORE'
                                                    ? '경기 전'
                                                    : value.statusInfo}
                                        </Typography>
                                        {value.homeTeamScore}
                                    </Typography>

                                    {/* Home Team */}
                                    <Box display='flex' alignItems='center' sx={{ ml: 2 }}>
                                        <Avatar
                                            src={`leagueLogo/${value.leagueName}/${value.homeTeamName}.png`}
                                            alt={value.homeTeamName}
                                            sx={{ width: 30, height: 30, mr: 1 }}
                                        />
                                        <Typography variant='body1'>{value.homeTeamName}</Typography>

                                        {selectedSport !== 'esports' && (
                                            <Typography
                                                variant='caption'
                                                sx={{
                                                    ml: 1,
                                                    px: 0.5,
                                                    color: 'white',
                                                    backgroundColor: '#0d41e1',
                                                    borderRadius: 1,
                                                }}
                                            >
                                                홈
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                {/* 리그 */}
                                <Box display='flex' flexDirection='row' alignItems='center' sx={{ ml: 'auto' }}>
                                    <Avatar
                                        src={`leagueLogo/${value.leagueName}/${value.leagueName}.png`}
                                        alt={value.awayTeamName}
                                        sx={{ width: 30, height: 30 }}
                                    />
                                    <Typography variant='body2' sx={{ color: 'black', textAlign: 'left', ml: 1, fontSize: 15 }}>
                                        {value.leagueName}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {selectGameData.length === 0 && (
                <Box maxWidth='md' sx={{ margin: 'auto', mt: 3, py: 1, bgcolor: '#0d41e1', borderRadius: 1 }}>
                    <Typography variant='h5' sx={{ fontSize: 20, fontWeight: '500', color: 'white', letterSpacing: '0.05em' }}>
                        해당 날짜에 경기가 없습니다.
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default Game;
