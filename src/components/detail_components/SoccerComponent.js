import { Box, Container, Divider, Typography } from '@mui/material';
import React from 'react';
import { IoHomeSharp } from 'react-icons/io5';
import SoccerGraphComponent from './graph_components/SoccerGraphComponent';
import SoccerTableComponent from './table_components/SoccerTableComponent';
import GameChat from '../GameChat';

const SoccerComponent = ({ gameDetail }) => {
    const now = new Date();
    const gameDate = new Date(gameDetail.gameDate);

    if (!gameDetail || !gameDetail.gameBoard) {
        return (
            <Container maxWidth='md' sx={{ bgcolor: '#f5f5f5' }}>
                <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center' sx={{ mx: 10 }}>
                    <Typography sx={{ fontSize: 30 }}>해당 날짜의 경기 기록이 없습니다.</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth='lg' sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ width: '70%' }}>
                {/* 경기보드 */}
                <Box display='flex' flexDirection='row' alignItems='center' sx={{ mt: 5 }}>
                    {/* 원정팀 */}
                    <Box display='flex' flexDirection='row' justifyContent='right' sx={{ width: '40%', pr: 5 }}>
                        <Box alignContent='center' sx={{ mr: 2 }}>
                            <Typography sx={{ fontSize: 30 }}>{gameDetail.awayTeam}</Typography>
                        </Box>

                        <img
                            src={`${process.env.REACT_APP_STATIC_IMAGE_URL}/leagueLogo/${gameDetail.league}/${encodeURIComponent(gameDetail.awayTeam.normalize('NFD'))}.png`}
                            alt={gameDetail.awayTeam}
                            width='80'
                            height='80'
                        />
                    </Box>

                    <Typography sx={{ fontSize: 30 }}>{gameDetail.gameBoard.awayTeamScore}</Typography>

                    {/* 경기 정보 */}
                    <Box sx={{ width: '20%' }}>
                        <Typography>
                            {gameDetail.cancel
                                ? '취소'
                                : gameDetail.gameBoard.statusCode === 'RESULT'
                                  ? '경기종료'
                                  : gameDetail.gameBoard.statusCode === 'BEFORE'
                                    ? '경기 전'
                                    : gameDetail.gameBoard.statusInfo}
                        </Typography>

                        <Typography>
                            {gameDetail.gameDate.substr(5, 5).replace('-', '.')}{' '}
                            {gameDetail.gameDate.substr(11, 5).replace('-', '.')}
                        </Typography>

                        <Typography>{gameDetail.gameBoard.stadium}</Typography>
                    </Box>

                    {/* 홈팀 */}
                    <Typography sx={{ fontSize: 30 }}>{gameDetail.gameBoard.homeTeamScore}</Typography>

                    <Box display='flex' flexDirection='row' justifyContent='left' sx={{ width: '40%', pl: 5 }}>
                        <img
                            src={`${process.env.REACT_APP_STATIC_IMAGE_URL}/leagueLogo/${gameDetail.league}/${encodeURIComponent(gameDetail.homeTeam.normalize('NFD'))}.png`}
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
                        {gameDetail.gameBoard.scorers.away.map((value) => (
                            <Typography sx={{ fontSize: 15, pr: 2, textAlign: 'right' }}>
                                {value.playerName} {value.time}&apos; ⚽
                            </Typography>
                        ))}
                    </Box>

                    <Box display='flex' flexDirection='column' sx={{ width: '50%' }}>
                        {gameDetail.gameBoard.scorers.home.map((value) => (
                            <Typography sx={{ fontSize: 15, pl: 2, textAlign: 'left' }}>
                                ⚽ {value.time}&apos; {value.playerName}
                            </Typography>
                        ))}
                    </Box>
                </Box>

                {gameDate < now ? (
                    gameDetail.gameDetail ? (
                        <>
                            <Divider sx={{ mt: 5, mb: 2 }} />
                            <Typography sx={{ fontSize: 30 }}>경기 기록</Typography>
                            <SoccerGraphComponent gameDetail={gameDetail} league={gameDetail.league} />

                            <Divider sx={{ mt: 5, mb: 2 }} />
                            <Typography sx={{ fontSize: 30 }}>선수 기록</Typography>
                            <SoccerTableComponent gameDetail={gameDetail} league={gameDetail.league} />
                        </>
                    ) : (
                        <Box
                            display='flex'
                            flexDirection='column'
                            alignItems='center'
                            justifyContent='center'
                            sx={{ width: '83%', textAlign: 'center', backgroundColor: '#f5f5f5', py: 2, mt: 5, mx: 'auto' }}
                        >
                            <Typography sx={{ fontSize: 25 }}>
                                상세 기록을 불러오는데 오류가 발생했습니다. 다시 시도해주세요.
                            </Typography>
                        </Box>
                    )
                ) : (
                    <Box
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        sx={{ width: '83%', textAlign: 'center', backgroundColor: '#f5f5f5', py: 2, mt: 5, mx: 'auto' }}
                    >
                        <Typography sx={{ fontSize: 25 }}>상세 기록은 경기 시작 후에 확인이 가능합니다.</Typography>
                    </Box>
                )}
            </Box>

            <GameChat gameId={gameDetail.gameId} />
        </Container>
    );
};

export default SoccerComponent;
