import {
    Box,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Divider,
} from '@mui/material';
import { IoHomeSharp } from 'react-icons/io5';
import React from 'react';
import BaseballGraphComponent from './graph_components/BaseballGraphComponent';
import BaseballTableComponent from './table_components/BaseballTableComponent';
import GameChat from '../GameChat';

const BaseballComponent = ({ gameDetail }) => {
    const now = new Date();
    const gameDate = new Date(gameDetail.gameDate);

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
        <Container maxWidth='lg' sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ width: '70%' }}>
                {/* 경기보드 */}
                <Box display='flex' flexDirection='row' alignItems='center'>
                    {/* 원정팀 */}
                    <Box display='flex' flexDirection='row' justifyContent='right' sx={{ width: '40%', my: 5, pr: 5 }}>
                        <Box alignContent='center' sx={{ mr: 2 }}>
                            <Typography sx={{ fontSize: 30 }}>{gameDetail.awayTeam}</Typography>

                            <Typography>
                                {gameDetail.boardToJson.statusCode === 'RESULT'
                                    ? gameDetail.boardToJson.winner === 'HOME'
                                        ? `패-${gameDetail.boardToJson.losePitcherName}`
                                        : `승-${gameDetail.boardToJson.winPitcherName}`
                                    : gameDetail.boardToJson.statusCode === 'BEFORE'
                                      ? gameDetail.boardToJson.awayStarterName
                                      : gameDetail.boardToJson.awayCurrentPitcherName}
                            </Typography>
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
                    <Box sx={{ width: '20%', my: 5 }}>
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

                    <Box display='flex' flexDirection='row' justifyContent='left' sx={{ width: '40%', my: 5, pl: 5 }}>
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

                            <Typography>
                                {gameDetail.boardToJson.statusCode === 'RESULT'
                                    ? gameDetail.boardToJson.winner !== 'HOME'
                                        ? `패-${gameDetail.boardToJson.losePitcherName}`
                                        : `승-${gameDetail.boardToJson.winPitcherName}`
                                    : gameDetail.boardToJson.statusCode === 'BEFORE'
                                      ? gameDetail.boardToJson.homeStarterName
                                      : gameDetail.boardToJson.homeCurrentPitcherName}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* 스코어보드 */}
                <Box>
                    <TableContainer
                        sx={{
                            width: '80%',
                            bgcolor: '#EFF1F8',
                            border: 'solid 3px #0d41e1',
                            borderRadius: '10px',
                            p: 1,
                            mx: 'auto',
                        }}
                    >
                        <Table>
                            {/* 테이블 헤더 */}
                            <TableHead sx={{ '& th': { color: 'black', textAlign: 'center', border: 'none' } }}>
                                <TableRow>
                                    <TableCell sx={{ width: '15%', fontWeight: '600', letterSpacing: 3, p: 0 }}>팀명</TableCell>

                                    {Array.from({ length: gameDetail.boardToJson.awayTeamScoreByInning.length }, (_, i) => (
                                        <TableCell key={i} sx={{ width: '50px', fontWeight: 'bold', p: 0 }}>
                                            {i + 1}
                                        </TableCell>
                                    ))}

                                    <TableCell sx={{ width: '50px', fontWeight: 'bold', p: 0, pl: 2 }}>R</TableCell>
                                    <TableCell sx={{ width: '50px', fontWeight: 'bold', p: 0 }}>H</TableCell>
                                    <TableCell sx={{ width: '50px', fontWeight: 'bold', p: 0 }}>E</TableCell>
                                    <TableCell sx={{ width: '50px', fontWeight: 'bold', p: 0 }}>B</TableCell>
                                </TableRow>
                            </TableHead>

                            {/* 테이블 바디 */}
                            <TableBody sx={{ '& td': { color: 'black', textAlign: 'center', border: 'none' } }}>
                                {/* 원정팀 */}
                                <TableRow>
                                    <TableCell sx={{ letterSpacing: 3, p: 0, pt: 1 }}>{gameDetail.awayTeam}</TableCell>

                                    {gameDetail.boardToJson.awayTeamScoreByInning.map((score, i) => (
                                        <TableCell key={i} sx={{ p: 0, pt: 1 }}>
                                            {score}
                                        </TableCell>
                                    ))}

                                    {gameDetail.boardToJson.awayTeamRheb.map((value, i) => (
                                        <TableCell key={i} sx={{ p: 0, pt: 1, ...(i === 0 && { pl: 2 }) }}>
                                            {value}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                {/* 홈팀 */}
                                <TableRow>
                                    <TableCell sx={{ letterSpacing: 3, p: 0 }}>{gameDetail.homeTeam}</TableCell>

                                    {gameDetail.boardToJson.homeTeamScoreByInning.map((score, i) => (
                                        <TableCell key={i} sx={{ p: 0 }}>
                                            {score}
                                        </TableCell>
                                    ))}

                                    {gameDetail.boardToJson.homeTeamRheb.map((value, i) => (
                                        <TableCell key={i} sx={{ p: 0, ...(i === 0 && { pl: 2 }) }}>
                                            {value}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {gameDate < now ? (
                    <>
                        <Divider sx={{ mt: 5, mb: 2 }} />
                        <Typography sx={{ fontSize: 30 }}>경기 기록</Typography>
                        <BaseballGraphComponent gameDetail={gameDetail} league={gameDetail.league} />

                        <Divider sx={{ mt: 5, mb: 2 }} />
                        <Typography sx={{ fontSize: 30 }}>선수 기록</Typography>
                        <BaseballTableComponent gameDetail={gameDetail} league={gameDetail.league} />
                    </>
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

export default BaseballComponent;
