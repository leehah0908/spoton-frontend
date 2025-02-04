import { Box, LinearProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const BaseballGraphComponent = ({ gameDetail, league }) => {
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        if (league === 'kbo') {
            setGraphData([
                {
                    label: '안타',
                    home: gameDetail.gameDetail.todayKeyStats.home.hit,
                    away: gameDetail.gameDetail.todayKeyStats.away.hit,
                },
                {
                    label: '홈런',
                    home: gameDetail.gameDetail.todayKeyStats.home.hr,
                    away: gameDetail.gameDetail.todayKeyStats.away.hr,
                },
                {
                    label: '도루',
                    home: gameDetail.gameDetail.todayKeyStats.home.sb,
                    away: gameDetail.gameDetail.todayKeyStats.away.sb,
                },
                {
                    label: '삼진',
                    home: gameDetail.gameDetail.todayKeyStats.home.kk,
                    away: gameDetail.gameDetail.todayKeyStats.away.kk,
                },
                {
                    label: '실책',
                    home: gameDetail.gameDetail.todayKeyStats.home.err,
                    away: gameDetail.gameDetail.todayKeyStats.away.err,
                },
                {
                    label: '병살',
                    home: gameDetail.gameDetail.todayKeyStats.home.gd,
                    away: gameDetail.gameDetail.todayKeyStats.away.gd,
                },
            ]);
        } else if (league === 'mlb') {
            setGraphData([
                {
                    label: '안타',
                    home: gameDetail.gameDetail.homeKeyStat.hit,
                    away: gameDetail.gameDetail.awayKeyStat.hit,
                },
                {
                    label: '홈런',
                    home: gameDetail.gameDetail.homeKeyStat.hr,
                    away: gameDetail.gameDetail.awayKeyStat.hr,
                },
                {
                    label: '도루',
                    home: gameDetail.gameDetail.homeKeyStat.sb,
                    away: gameDetail.gameDetail.awayKeyStat.sb,
                },
                {
                    label: '삼진',
                    home: gameDetail.gameDetail.homeKeyStat.so,
                    away: gameDetail.gameDetail.awayKeyStat.so,
                },
                {
                    label: '실책',
                    home: gameDetail.gameDetail.homeKeyStat.err,
                    away: gameDetail.gameDetail.awayKeyStat.err,
                },
                {
                    label: '병살',
                    home: gameDetail.gameDetail.homeKeyStat.gd,
                    away: gameDetail.gameDetail.awayKeyStat.gd,
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
                {graphData.map((item, index) => (
                    <Box key={index} display='flex' alignItems='center' sx={{ width: '80%', mb: 0.3 }}>
                        {/* 원정팀 데이터 */}
                        <Box
                            sx={{
                                width: '45%',
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
                        <Box sx={{ width: '10%', textAlign: 'center' }}>
                            <Typography sx={{ color: 'gray' }}>{item.label}</Typography>
                        </Box>

                        {/* 홈팀 데이터 */}
                        <Box sx={{ width: '45%', display: 'flex', alignItems: 'center', pl: 1 }}>
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

export default BaseballGraphComponent;
