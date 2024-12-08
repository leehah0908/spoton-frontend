import { Button, Box, Typography, Container, Grid, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { sportsData } from '../../assets/sportsData';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DateList from '../DateList';
import axios from 'axios';
import { format } from 'prettier';

const Game = () => {
    const today = new Date();

    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(today.getDate());

    const [selectedSport, setSelectedSport] = useState('MYTEAM');
    const [selectedLeague, setSelectedLeague] = useState('ALL');
    const [selectedTeam, setSelectedTeam] = useState('ALL');

    const [gameList, setGameList] = useState({});

    const myTeamData = {
        KBO: '키움',
        MLB: '샌프란시스코',
        LCK: 'KT 롤스터',
        EPL: '토트넘',
    };

    // 년, 월이 바뀔 때마다 데이터 요청
    useEffect(() => {
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
                console.log(gameList);
            } catch (e) {
                console.log('게임 데이터 로드 실패');
            }
        };

        loadData();
    }, [selectedYear, selectedMonth, selectedLeague]);

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
                        onClick={() => {
                            setSelectedSport('MYTEAM');
                            setSelectedLeague('ALL');
                            setSelectedTeam('ALL');
                        }}
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
                            onClick={() => {
                                setSelectedSport(sport);
                                setSelectedLeague('ALL');
                                setSelectedTeam('ALL');
                            }}
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
                                variant={team === setSelectedTeam ? 'contained' : 'outlined'}
                                onClick={() => {
                                    setSelectedTeam(team);
                                    setSelectedLeague(league);
                                }}
                                sx={{
                                    ml: 1,
                                    bgcolor: team === setSelectedTeam ? '#0d41e1' : 'transparent',
                                    color: team === setSelectedTeam ? 'white' : '#0d41e1',
                                    borderColor: '#0d41e1',
                                }}
                            >
                                {team}
                            </Button>
                        ))}
                    </Box>
                )}
                {selectedSport && selectedSport !== 'MYTEAM' && (
                    <Box display='flex' justifyContent='center' sx={{ mb: 5 }}>
                        {sportsData[selectedSport].leagues.map((league) => (
                            <Button
                                key={league}
                                variant={league === selectedLeague ? 'contained' : 'outlined'}
                                onClick={() => {
                                    setSelectedLeague(league);
                                    setSelectedTeam('ALL');
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
                {/* 팀 선택 */}
                {selectedLeague && selectedLeague !== 'ALL' && selectedSport !== 'MYTEAM' && (
                    <Box display='flex' justifyContent='center' sx={{ mb: 5 }}>
                        {sportsData[selectedSport].teams[selectedLeague].map((team) => (
                            <Button
                                key={team}
                                variant={team === selectedTeam ? 'contained' : 'outlined'}
                                onClick={() => setSelectedTeam(team)}
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
                {selectedSport} : {selectedLeague} : {selectedTeam}
                <br />
                {selectedYear} : {selectedMonth} : {selectedDay}
                {typeof gameList}
                {/* 날짜 선택 버튼 */}
                <Box>
                    <DateList
                        selectedYear={selectedYear}
                        selectedMonth={selectedMonth}
                        setSelectedYear={setSelectedYear}
                        setSelectedMonth={setSelectedMonth}
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                    />
                </Box>
                {/* 일정 표시 */}
                <Box>
                    {Object.values(gameList).map((value, i) => (
                        <Box>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls='panel1-content'
                                    id='panel1-header'
                                >
                                    Accordion 1
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit
                                    amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Container>
    );
};

export default Game;
