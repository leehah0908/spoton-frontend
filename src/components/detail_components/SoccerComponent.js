import { Box, Container, Divider, Typography } from '@mui/material';
import React from 'react';
import { IoHomeSharp } from 'react-icons/io5';
import SoccerGraphComponent from './graph_components/SoccerGraphComponent';
import SoccerTableComponent from './table_components/SoccerTableComponent';

const SoccerComponent = ({ gameDetail }) => {
    if (!gameDetail || !gameDetail.boardToJson) {
        return (
            <Container maxWidth='md' sx={{ bgcolor: 'pink' }}>
                <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' sx={{ mx: 10 }}>
                    <Typography sx={{ fontSize: 30 }}>해당 날짜의 경기 기록이 없습니다.</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth='lg'>
            <Box sx={{ mx: 3 }}>
                {/* 경기보드 */}
                <Box display='flex' flexDirection='row' alignItems='center' sx={{ mt: 5 }}>
                    {/* 원정팀 */}
                    <Box display='flex' flexDirection='row' justifyContent='right' sx={{ width: '40%', pr: 5 }}>
                        <Box alignContent='center' sx={{ mr: 2 }}>
                            <Typography sx={{ fontSize: 30 }}>{gameDetail.awayTeam}</Typography>
                        </Box>

                        <img
                            src={`/leagueLogo/${gameDetail.league}/${gameDetail.awayTeam}.png`}
                            alt={gameDetail.awayTeam}
                            width='80'
                            height='80'
                        />
                    </Box>

                    <Typography sx={{ fontSize: 30 }}>{gameDetail.boardToJson.awayTeamScore}</Typography>

                    {/* 경기 정보 */}
                    <Box sx={{ width: '20%' }}>
                        <Typography>
                            {gameDetail.cancel
                                ? '취소'
                                : gameDetail.boardToJson.statusCode === 'RESULT'
                                  ? '경기종료'
                                  : gameDetail.boardToJson.statusCode === 'BEFORE'
                                    ? '경기 전'
                                    : gameDetail.boardToJson.statusInfo}
                        </Typography>

                        <Typography>
                            {gameDetail.gameDate.substr(5, 5).replace('-', '.')}{' '}
                            {gameDetail.gameDate.substr(11, 5).replace('-', '.')}
                        </Typography>

                        <Typography>{gameDetail.boardToJson.stadium}</Typography>
                    </Box>

                    {/* 홈팀 */}
                    <Typography sx={{ fontSize: 30 }}>{gameDetail.boardToJson.homeTeamScore}</Typography>

                    <Box display='flex' flexDirection='row' justifyContent='left' sx={{ width: '40%', pl: 5 }}>
                        <img
                            src={`/leagueLogo/${gameDetail.league}/${gameDetail.homeTeam}.png`}
                            alt={gameDetail.homeTeam}
                            width='80'
                            height='80'
                        />

                        <Box alignContent='center' sx={{ ml: 2 }}>
                            <Typography sx={{ fontSize: 30 }}>
                                <IoHomeSharp size={18} /> {gameDetail.homeTeam}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* 스코어보드 */}
                <Box display='flex' flexDirection='row' sx={{ mt: 1 }}>
                    <Box display='flex' flexDirection='column' sx={{ width: '50%' }}>
                        {gameDetail.boardToJson.scorers.away.map((value) => (
                            <Typography sx={{ fontSize: 15, pr: 2, textAlign: 'right' }}>
                                {value.playerName} {value.time}&apos; ⚽
                            </Typography>
                        ))}
                    </Box>

                    <Box display='flex' flexDirection='column' sx={{ width: '50%' }}>
                        {gameDetail.boardToJson.scorers.home.map((value) => (
                            <Typography sx={{ fontSize: 15, pl: 2, textAlign: 'left' }}>
                                ⚽ {value.time}&apos; {value.playerName}
                            </Typography>
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ mt: 5, mb: 2 }} />
                <Typography sx={{ fontSize: 30 }}>경기 기록</Typography>
                <SoccerGraphComponent gameDetail={gameDetail} league={gameDetail.league} />

                <Divider sx={{ mt: 5, mb: 2 }} />
                <Typography sx={{ fontSize: 30 }}>선수 기록</Typography>
                <SoccerTableComponent gameDetail={gameDetail} league={gameDetail.league} />
            </Box>
        </Container>
    );
};

export default SoccerComponent;
