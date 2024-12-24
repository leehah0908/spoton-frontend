import { Box, LinearProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const SoccerGraphComponent = ({ gameDetail, league }) => {
    const [graphData, setGraphData] = useState([]);
    const [awayBallPos, setAwayBallPos] = useState('');
    const [homeBallPos, setHomeBallPos] = useState('');

    useEffect(() => {
        if (league === 'kleague') {
            setAwayBallPos(gameDetail.detailToJson.away.ballPossession);
            setHomeBallPos(gameDetail.detailToJson.home.ballPossession);

            setGraphData([
                {
                    label: '슈팅',
                    home: gameDetail.detailToJson.home.shooting,
                    away: gameDetail.detailToJson.away.shooting,
                },
                {
                    label: '유효슈팅',
                    home: gameDetail.detailToJson.home.shotsOnGoal,
                    away: gameDetail.detailToJson.away.shotsOnGoal,
                },
                {
                    label: '코너킥',
                    home: gameDetail.detailToJson.home.cornerKick,
                    away: gameDetail.detailToJson.away.cornerKick,
                },
                {
                    label: '골킥',
                    home: gameDetail.detailToJson.home.goalKick,
                    away: gameDetail.detailToJson.away.goalKick,
                },
                {
                    label: '오프사이드',
                    home: gameDetail.detailToJson.home.offside,
                    away: gameDetail.detailToJson.away.offside,
                },
                {
                    label: '파울',
                    home: gameDetail.detailToJson.home.foul,
                    away: gameDetail.detailToJson.away.foul,
                },
                {
                    label: '경고',
                    home: gameDetail.detailToJson.home.yellow,
                    away: gameDetail.detailToJson.away.yellow,
                },
                {
                    label: '퇴장',
                    home: gameDetail.detailToJson.home.dismissal,
                    away: gameDetail.detailToJson.away.dismissal,
                },
                {
                    label: '선수교체',
                    home: gameDetail.detailToJson.home.substitution,
                    away: gameDetail.detailToJson.away.substitution,
                },
            ]);
        } else if (league === 'epl') {
            setAwayBallPos(gameDetail.detailToJson.away_teams[0].possession);
            setHomeBallPos(gameDetail.detailToJson.home_teams[0].possession);

            setGraphData([
                {
                    label: '슈팅',
                    home: gameDetail.detailToJson.home_teams[0].shots,
                    away: gameDetail.detailToJson.away_teams[0].shots,
                },
                {
                    label: '유효슈팅',
                    home: gameDetail.detailToJson.home_teams[0].shotsOnTarget,
                    away: gameDetail.detailToJson.away_teams[0].shotsOnTarget,
                },
                {
                    label: '코너킥',
                    home: gameDetail.detailToJson.home_teams[0].cornerKicks,
                    away: gameDetail.detailToJson.away_teams[0].cornerKicks,
                },
                {
                    label: '골킥',
                    home: gameDetail.detailToJson.home_teams[0].goalKicks,
                    away: gameDetail.detailToJson.away_teams[0].goalKicks,
                },
                {
                    label: '오프사이드',
                    home: gameDetail.detailToJson.home_teams[0].offsides,
                    away: gameDetail.detailToJson.away_teams[0].offsides,
                },
                {
                    label: '파울',
                    home: gameDetail.detailToJson.home_teams[0].fouls,
                    away: gameDetail.detailToJson.away_teams[0].fouls,
                },
                {
                    label: '경고',
                    home: gameDetail.detailToJson.home_teams[0].yellowCards,
                    away: gameDetail.detailToJson.away_teams[0].yellowCards,
                },
                {
                    label: '퇴장',
                    home: gameDetail.detailToJson.home_teams[0].redCards,
                    away: gameDetail.detailToJson.away_teams[0].redCards,
                },
                {
                    label: '선수교체',
                    home: gameDetail.detailToJson.home_teams[0].substitutions,
                    away: gameDetail.detailToJson.away_teams[0].substitutions,
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
                            value={awayBallPos}
                            sx={{
                                width: '100%',
                                height: 8,
                                bgcolor: '#0d41e1',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: '#f0f0f0',
                                },
                            }}
                        />

                        <Typography sx={{ width: 10, mr: 1 }}>{awayBallPos}</Typography>
                    </Box>

                    {/* 명칭 */}
                    <Box sx={{ width: '16%', textAlign: 'center' }}>
                        <Typography sx={{ color: 'gray' }}>볼점유율 (%)</Typography>
                    </Box>

                    {/* 홈팀 데이터 */}
                    <Box sx={{ width: '42%', display: 'flex', alignItems: 'center', pl: 1 }}>
                        <LinearProgress
                            variant='determinate'
                            value={homeBallPos}
                            sx={{
                                width: '100%',
                                height: 8,
                                bgcolor: '#f0f0f0',
                                '& .MuiLinearProgress-bar': { bgcolor: '#0d41e1' },
                            }}
                        />

                        <Typography sx={{ width: 10, ml: 1 }}>{homeBallPos}</Typography>
                    </Box>
                </Box>

                {/* 이외 데이터 */}
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
                        <Box sx={{ width: '16%', textAlign: 'center' }}>
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

export default SoccerGraphComponent;
