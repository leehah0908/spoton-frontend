import { Box, LinearProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const VolleyballGraphComponent = ({ gameDetail }) => {
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        setGraphData([
            {
                label: '공격 득점',
                home: gameDetail.detailToJson.gameRecord.home.attackSuccessCount,
                away: gameDetail.detailToJson.gameRecord.away.attackSuccessCount,
            },
            {
                label: '블로킹 득점',
                home: gameDetail.detailToJson.gameRecord.home.blockSuccessCount,
                away: gameDetail.detailToJson.gameRecord.away.blockSuccessCount,
            },
            {
                label: '서브 득점',
                home: gameDetail.detailToJson.gameRecord.home.serveSuccessCount,
                away: gameDetail.detailToJson.gameRecord.away.serveSuccessCount,
            },
            {
                label: '삼대 범실',
                home: gameDetail.detailToJson.gameRecord.home.opponentErrorCount,
                away: gameDetail.detailToJson.gameRecord.away.opponentErrorCount,
            },
            {
                label: '디그 성공',
                home: gameDetail.detailToJson.gameRecord.home.digSuccessCount,
                away: gameDetail.detailToJson.gameRecord.away.digSuccessCount,
            },
            {
                label: '리시브 정확',
                home: gameDetail.detailToJson.gameRecord.home.exactReceiveCount,
                away: gameDetail.detailToJson.gameRecord.away.exactReceiveCount,
            },
            {
                label: '세트 성공',
                home: gameDetail.detailToJson.gameRecord.home.exactTossCount,
                away: gameDetail.detailToJson.gameRecord.away.exactTossCount,
            },
        ]);
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
                <Box display='flex' alignItems='center' sx={{ width: '80%', mb: 0.3 }}>
                    {/* 볼점유율 따로 */}
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
                            value={gameDetail.detailToJson.gameRecord.away.attackSuccessRate}
                            sx={{
                                width: '100%',
                                height: 8,
                                bgcolor: '#0d41e1',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: '#f0f0f0',
                                },
                            }}
                        />

                        <Typography sx={{ width: 10, mr: 1 }}>
                            {gameDetail.detailToJson.gameRecord.away.attackSuccessRate}
                        </Typography>
                    </Box>

                    {/* 명칭 */}
                    <Box sx={{ width: '15%', textAlign: 'center' }}>
                        <Typography sx={{ color: 'gray' }}>공격 성공률 (%)</Typography>
                    </Box>

                    {/* 홈팀 데이터 */}
                    <Box sx={{ width: '42%', display: 'flex', alignItems: 'center', pl: 1 }}>
                        <LinearProgress
                            variant='determinate'
                            value={gameDetail.detailToJson.gameRecord.home.attackSuccessRate}
                            sx={{
                                width: '100%',
                                height: 8,
                                bgcolor: '#f0f0f0',
                                '& .MuiLinearProgress-bar': { bgcolor: '#0d41e1' },
                            }}
                        />

                        <Typography sx={{ width: 10, ml: 1 }}>
                            {gameDetail.detailToJson.gameRecord.home.attackSuccessRate}
                        </Typography>
                    </Box>
                </Box>

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

export default VolleyballGraphComponent;
