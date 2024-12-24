import { Box, LinearProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const BasketballGraphComponent = ({ gameDetail, league }) => {
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        if (league === 'kbl') {
            setGraphData([
                {
                    label: '리바운드',
                    home: gameDetail.detailToJson.home.rebound,
                    away: gameDetail.detailToJson.away.rebound,
                },
                {
                    label: '어시스트',
                    home: gameDetail.detailToJson.home.aS,
                    away: gameDetail.detailToJson.away.aS,
                },
                {
                    label: '스틸',
                    home: gameDetail.detailToJson.home.sT,
                    away: gameDetail.detailToJson.away.sT,
                },
                {
                    label: '블록슛',
                    home: gameDetail.detailToJson.home.bS,
                    away: gameDetail.detailToJson.away.bS,
                },
                {
                    label: '야투',
                    home: gameDetail.detailToJson.home.normalFg,
                    away: gameDetail.detailToJson.away.normalFg,
                },
                {
                    label: '3점슛',
                    home: gameDetail.detailToJson.home.threep,
                    away: gameDetail.detailToJson.away.threep,
                },
                {
                    label: '자유투',
                    home: gameDetail.detailToJson.home.ft,
                    away: gameDetail.detailToJson.away.ft,
                },
                {
                    label: '공격 리바운드',
                    home: gameDetail.detailToJson.home.oR,
                    away: gameDetail.detailToJson.away.oR,
                },
                {
                    label: '수비 리바운드',
                    home: gameDetail.detailToJson.home.dR,
                    away: gameDetail.detailToJson.away.dR,
                },
                {
                    label: '파울',
                    home: gameDetail.detailToJson.home.foulTot,
                    away: gameDetail.detailToJson.away.foulTot,
                },
                {
                    label: '턴오버',
                    home: gameDetail.detailToJson.home.to,
                    away: gameDetail.detailToJson.away.to,
                },
            ]);
        } else if (league === 'nba') {
            setGraphData([
                {
                    label: '리바운드',
                    home: gameDetail.detailToJson.home.tReb,
                    away: gameDetail.detailToJson.away.tReb,
                },
                {
                    label: '어시스트',
                    home: gameDetail.detailToJson.home.assist,
                    away: gameDetail.detailToJson.away.assist,
                },
                {
                    label: '스틸',
                    home: gameDetail.detailToJson.home.steal,
                    away: gameDetail.detailToJson.away.steal,
                },
                {
                    label: '블록슛',
                    home: gameDetail.detailToJson.home.block,
                    away: gameDetail.detailToJson.away.block,
                },
                {
                    label: '야투',
                    home: gameDetail.detailToJson.home.fg,
                    away: gameDetail.detailToJson.away.fg,
                },
                {
                    label: '3점슛',
                    home: gameDetail.detailToJson.home.threep,
                    away: gameDetail.detailToJson.away.threep,
                },
                {
                    label: '자유투',
                    home: gameDetail.detailToJson.home.ft,
                    away: gameDetail.detailToJson.away.ft,
                },
                {
                    label: '공격 리바운드',
                    home: gameDetail.detailToJson.home.oRebound,
                    away: gameDetail.detailToJson.away.oRebound,
                },
                {
                    label: '수비 리바운드',
                    home: gameDetail.detailToJson.home.dRebound,
                    away: gameDetail.detailToJson.away.dRebound,
                },
                {
                    label: '파울',
                    home: gameDetail.detailToJson.home.foulTot,
                    away: gameDetail.detailToJson.away.foulTot,
                },
                {
                    label: '턴오버',
                    home: gameDetail.detailToJson.home.to,
                    away: gameDetail.detailToJson.away.to,
                },
            ]);
        }
    }, [gameDetail]);

    const maxValue = Math.max(...graphData.flatMap((item) => [item.home, item.away]));

    return (
        <Box display='flex' flexDirection='column' alignItems='center' sx={{ mt: 2 }}>
            {/* 팀 이름 */}
            <Box display='flex' alignItems='center' sx={{ width: '100%' }}>
                <Typography variant='h6' sx={{ width: '45%', textAlign: 'right', mr: 1 }}>
                    {gameDetail.awayTeam}
                </Typography>

                <Typography variant='h6' sx={{ width: '10%', textAlign: 'center' }}>
                    VS
                </Typography>

                <Typography variant='h6' sx={{ width: '45%', textAlign: 'left', ml: 1 }}>
                    {gameDetail.homeTeam}
                </Typography>
            </Box>

            {/* 데이터 */}
            <Box display='flex' flexDirection='column' justifyContent='space-between' alignItems='center' sx={{ width: '100%' }}>
                {/* 경기 데이터 */}
                {graphData.map((item, index) => (
                    <Box key={index} display='flex' alignItems='center' sx={{ width: '80%', mb: 0.3 }}>
                        {/* 원정팀 데이터 */}
                        <Box
                            sx={{
                                width: '42%',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                pr: 1,
                                direction: 'rtl',
                            }}
                        >
                            <LinearProgress
                                variant='determinate'
                                // 오른쪽부터 시작하게 하기 위해서 색 반전 및 값 반전
                                value={((maxValue + 1 - item.away) / (maxValue + 1)) * 100}
                                sx={{
                                    width: '100%',
                                    height: 8,
                                    bgcolor: '#0d41e1',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: '#f0f0f0',
                                    },
                                }}
                            />

                            <Typography sx={{ width: 10, mr: 1 }}>{item.away}</Typography>
                        </Box>

                        {/* 명칭 */}
                        <Box sx={{ width: '15%', textAlign: 'center' }}>
                            <Typography sx={{ color: 'gray' }}>{item.label}</Typography>
                        </Box>

                        {/* 홈팀 데이터 */}
                        <Box sx={{ width: '42%', display: 'flex', alignItems: 'center', pl: 1 }}>
                            <LinearProgress
                                variant='determinate'
                                value={(item.home / (maxValue + 1)) * 100}
                                sx={{
                                    width: '100%',
                                    height: 8,
                                    bgcolor: '#f0f0f0',
                                    '& .MuiLinearProgress-bar': { bgcolor: '#0d41e1' },
                                }}
                            />

                            <Typography sx={{ width: 10, ml: 1 }}>{item.home}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default BasketballGraphComponent;
