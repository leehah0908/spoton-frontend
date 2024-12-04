import { Button, Box, Typography, Container } from '@mui/material';
import React, { useState } from 'react';
import { sportsData } from '../../assets/sportsData';
import DateList from '../DateList';

const Game = () => {
    const [selectedSport, setSelectedSport] = useState('');
    const [selectedLeague, setSelectedLeague] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const mockData = [
        {
            date: '10월 1일 (화)',
            games: [
                { time: '17:00', teamA: '롯데', teamB: 'NC', scoreA: 5, scoreB: 1, isFinished: true },
                { time: '17:00', teamA: 'SSG', teamB: 'KT', scoreA: 3, scoreB: 4, isFinished: true },
            ],
        },
        {
            date: '10월 2일 (수)',
            games: [{ time: '18:30', teamA: 'KT', teamB: '두산', scoreA: 4, scoreB: 0, isFinished: true }],
        },
    ];

    // 일정 데이터 (예시)
    // const schedules = {
    //     KBO리그: [
    //         {
    //             date: '10월 1일 (화)',
    //             games: [
    //                 { time: '17:00', teamA: '롯데', teamB: 'NC', scoreA: 5, scoreB: 1, isFinished: true },
    //                 { time: '17:00', teamA: 'SSG', teamB: 'KT', scoreA: 3, scoreB: 4, isFinished: true },
    //             ],
    //         },
    //         {
    //             date: '10월 2일 (수)',
    //             games: [{ time: '18:30', teamA: 'KT', teamB: '두산', scoreA: 4, scoreB: 0, isFinished: true }],
    //         },
    //     ],
    //     EPL: [
    //         {
    //             date: '10월 1일 (화)',
    //             games: [{ time: '21:00', teamA: '맨유', teamB: '첼시', scoreA: 2, scoreB: 1, isFinished: true }],
    //         },
    //     ],
    // };

    // 선택된 리그에 따라 일정을 가져오기
    // const leagueSchedules = schedules[selectedLeague] || [];

    return (
        <Container maxWidth='lg'>
            <Box sx={{ mt: 3 }}>
                <Typography variant='h4' sx={{ color: '#0d41e1', mb: 5, mt: 5 }}>
                    경기 일정
                </Typography>

                {/* 종목 선택 버튼 */}
                <Box display='flex' justifyContent='center' sx={{ mb: 5 }}>
                    {Object.keys(sportsData).map((sport) => (
                        <Button
                            key={sport}
                            variant={sport === selectedSport ? 'contained' : 'outlined'}
                            onClick={() => {
                                setSelectedSport(sport);
                                setSelectedLeague('');
                            }}
                            style={{ margin: '0 4px', minWidth: 80 }}
                        >
                            {sport}
                        </Button>
                    ))}
                </Box>

                {/* 리그 선택 버튼 */}
                {selectedSport && (
                    <Box display='flex' justifyContent='center' sx={{ mb: 5 }}>
                        {sportsData[selectedSport].leagues.map((league) => (
                            <Button
                                key={league}
                                variant={league === selectedLeague ? 'contained' : 'outlined'}
                                onClick={() => setSelectedLeague(league)}
                                style={{ margin: '0 4px', minWidth: 80 }}
                            >
                                {league}
                            </Button>
                        ))}
                    </Box>
                )}

                <Box>
                    <DateList selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </Box>

                {/* 일정 표시 */}
                {/* {selectedLeague && (
                    <Box>
                        <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                            {leagueSchedules.map((schedule) => (
                                <Button
                                    key={schedule.date}
                                    variant={schedule.date === selectedDate ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedDate(schedule.date)}
                                    style={{ margin: '0 4px', minWidth: 100 }}
                                >
                                    {schedule.date}
                                </Button>
                            ))}
                        </Box>
                        {leagueSchedules
                            .filter((schedule) => schedule.date === selectedDate)
                            .map((schedule) => (
                                <Box key={schedule.date} style={{ marginBottom: 16 }}>
                                    <Typography variant='h6' style={{ marginBottom: 8 }}>
                                        {schedule.date}
                                    </Typography>
                                    {schedule.games.map((game, index) => (
                                        <Box
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '8px 16px',
                                                border: '1px solid #ccc',
                                                borderRadius: 4,
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Typography variant='body2' color='textSecondary'>
                                                {game.time}
                                            </Typography>
                                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant='body1' style={{ marginRight: 8 }}>
                                                    {game.teamA}
                                                </Typography>
                                                {game.isFinished ? (
                                                    <Typography variant='h6' style={{ margin: '0 8px' }}>
                                                        {game.scoreA} - {game.scoreB}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant='body2' style={{ margin: '0 8px' }}>
                                                        VS
                                                    </Typography>
                                                )}
                                                <Typography variant='body1'>{game.teamB}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            ))}
                    </Box>
                )} */}
            </Box>
        </Container>
    );
};

export default Game;
