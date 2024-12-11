import { Button, Box, Typography, Container, Avatar } from '@mui/material';
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
    const [gameList, setGameList] = useState({});
    const selectedFullDate = new Date(selectedYear, selectedMonth, selectedDay);

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
        // 마이팀일 때
        if (selectedSport === 'MYTEAM') {
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
            <Box sx={{ mt: 3 }}>
                <Typography variant='h4' sx={{ color: '#0d41e1', mb: 5, mt: 5 }}>
                    경기 일정
                </Typography>

                {/* 종목 선택 버튼 */}
                <Box display='flex' justifyContent='center' sx={{ mb: 5 }}>
                    <Button
                        key='MYTEAM'
                        variant={selectedSport === 'MYTEAM' ? 'contained' : 'outlined'}
                        onClick={myTeamClick}
                        sx={{
                            ml: 1,
                            bgcolor: selectedSport === 'MYTEAM' ? '#0d41e1' : 'transparent',
                            color: selectedSport === 'MYTEAM' ? 'white' : '#0d41e1',
                            borderColor: '#0d41e1',
                        }}
                    >
                        {'MYTEAM'}
                    </Button>

                    {Object.keys(sportsData).map((sport) => (
                        <Button
                            key={sport}
                            variant={sport === selectedSport ? 'contained' : 'outlined'}
                            onClick={() => handleSportClick(sport)}
                            sx={{
                                ml: 1,
                                bgcolor: sport === selectedSport ? '#0d41e1' : 'transparent',
                                color: sport === selectedSport ? 'white' : '#0d41e1',
                                borderColor: '#0d41e1',
                            }}
                        >
                            {sport}
                        </Button>
                    ))}
                </Box>

                {/* 리그 선택 버튼 */}
                {selectedSport && selectedSport === 'MYTEAM' && (
                    <Box display='flex' justifyContent='center' sx={{ mb: 5 }}>
                        {Object.entries(myTeamData).map(([league, team]) => (
                            <Button
                                key={team}
                                variant={team === selectedTeam ? 'contained' : 'outlined'}
                                onClick={() => {
                                    setSelectedTeam(team);
                                    setSelectedLeague(league);
                                }}
                                sx={{
                                    ml: 1,
                                    bgcolor: team === selectedTeam ? '#0d41e1' : 'transparent',
                                    color: team === selectedTeam ? 'white' : '#0d41e1',
                                    borderColor: '#0d41e1',
                                }}
                            >
                                {team}
                            </Button>
                        ))}
                    </Box>
                )}

                {/* 팀 선택(MYTEAM) */}
                {selectedSport && selectedSport !== 'MYTEAM' && (
                    <Box display='flex' justifyContent='center' sx={{ mb: 5 }}>
                        {sportsData[selectedSport].leagues.map((league) => (
                            <Button
                                key={league}
                                variant={league === selectedLeague ? 'contained' : 'outlined'}
                                onClick={() => {
                                    setSelectedLeague(league);
                                }}
                                sx={{
                                    ml: 1,
                                    bgcolor: league === selectedLeague ? '#0d41e1' : 'transparent',
                                    color: league === selectedLeague ? 'white' : '#0d41e1',
                                    borderColor: '#0d41e1',
                                }}
                            >
                                {league}
                            </Button>
                        ))}
                    </Box>
                )}

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
                                    display='flex'
                                    alignItems='center'
                                    sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}
                                >
                                    {/* 경기 시간 및 경기장 */}
                                    <Box display='flex' flexDirection='row' alignItems='center'>
                                        <Typography variant='h6' sx={{ fontWeight: '500', fontSize: 15 }}>
                                            {format(new Date(value.gameStartTime), 'HH:mm')}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            sx={{ color: 'gray', textAlign: 'left', ml: 1, fontSize: 13 }}
                                        >
                                            {value.stadium}
                                        </Typography>
                                    </Box>

                                    {/* 팀 정보 */}
                                    <Box
                                        onClick={() => navigate(`/gameDetail/${value.gameId}`)}
                                        role='button'
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        sx={{
                                            cursor: 'pointer',

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
                                                src={(() => {
                                                    try {
                                                        return require(
                                                            `../../assets/leagueLogo/${selectedSport}/${value.awayTeamName}.png`,
                                                        );
                                                    } catch {
                                                        return value.awayTeamName;
                                                    }
                                                })()}
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
                                                src={(() => {
                                                    try {
                                                        return require(
                                                            `../../assets/leagueLogo/${selectedSport}/${value.homeTeamName}.png`,
                                                        );
                                                    } catch {
                                                        return value.homeTeamName;
                                                    }
                                                })()}
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
                                            src={(() => {
                                                try {
                                                    return require(
                                                        `../../assets/leagueLogo/${selectedSport}/${value.leagueName}.png`,
                                                    );
                                                } catch {
                                                    return value.awayTeamName;
                                                }
                                            })()}
                                            alt={value.awayTeamName}
                                            sx={{ width: 30, height: 30 }}
                                        />
                                        <Typography
                                            variant='body2'
                                            sx={{ color: 'black', textAlign: 'left', ml: 1, fontSize: 15 }}
                                        >
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
                        <Typography
                            variant='h5'
                            sx={{ fontSize: 20, fontWeight: '500', color: 'white', letterSpacing: '0.05em' }}
                        >
                            경기가 없습니다.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default Game;
