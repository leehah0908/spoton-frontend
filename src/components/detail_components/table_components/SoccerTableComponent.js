import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const SoccerTableComponent = ({ gameDetail, league }) => {
    const [selectedTeam, setSelectedTeam] = useState('AWAY');

    const [rows, setRows] = useState([]);

    const columns = [
        { field: 'playerName', headerName: '선수명', flex: 1 },
        { field: 'position', headerName: '포지션', flex: 1 },
        { field: 'goals', headerName: '득점', flex: 1 },
        { field: 'assists', headerName: '도움', flex: 1 },
        { field: 'shots', headerName: '슈팅', flex: 1 },
        { field: 'shotsOnGoal', headerName: '유효슈팅', flex: 1 },
        { field: 'playerPoint', headerName: '평균평점', flex: 1 },
        { field: 'foulsCommitted', headerName: '파울', flex: 1 },
        { field: 'booking', headerName: '경고', flex: 1 },
        { field: 'dismissal', headerName: '퇴장', flex: 1 },
        { field: 'workTime', headerName: '출전시간', flex: 1 },
    ];

    useEffect(() => {
        // 데이터 세팅
        if (league === 'kleague') {
            const loadData =
                selectedTeam === 'AWAY' ? gameDetail.detailToJson.awayPlayerStats : gameDetail.detailToJson.homePlayerStats;

            setRows(
                loadData.map((value, index) => ({
                    id: index,
                    playerName: value.playerName,
                    position: value.position,
                    goals: value.goals,
                    assists: value.assists,
                    shots: value.shots,
                    shotsOnGoal: value.shotsOnGoal,
                    playerPoint: value.playerPoint,
                    foulsCommitted: value.foulsCommitted,
                    booking: value.booking,
                    dismissal: value.dismissal,
                    workTime: value.workTime,
                })),
            );
        } else if (league === 'mlb') {
            const loadData = selectedTeam === 'AWAY' ? gameDetail.detailToJson.awayBatter : gameDetail.detailToJson.homeBatter;

            setRows(
                loadData.map((value, index) => ({
                    id: index,
                    batOrder: value.seqno === 1 ? value.batOrder : '⇋',
                    name: value.name,
                    pos: value.posName,
                    ab: value.ab,
                    run: value.run,
                    hit: value.hit,
                    rbi: value.rbi,
                    hr: value.hr,
                    bb: value.bb,
                    kk: value.so,
                    sb: value.sb,
                    hra: value.hra,
                })),
            );
        }
    }, [gameDetail, selectedTeam]);

    return (
        <Box sx={{ mt: 2 }}>
            {/* 팀 선택 버튼 */}
            <Box sx={{ mb: 2 }}>
                <Button
                    onClick={() => setSelectedTeam('AWAY')}
                    sx={{
                        height: 40,
                        width: 150,
                        bgcolor: selectedTeam === 'AWAY' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedTeam === 'AWAY' ? '#0d41e1' : '#7D7D7D',
                        border: '1px solid',
                        borderColor: selectedTeam === 'AWAY' ? '#0d41e1' : '#D4D4D8',
                        mr: 1,
                    }}
                >
                    {gameDetail.awayTeam}
                    <img
                        src={`/leagueLogo/${gameDetail.league}/${gameDetail.awayTeam}.png`}
                        alt={gameDetail.awayTeam}
                        width='40'
                        height='40'
                        style={{ marginLeft: 10 }}
                    />
                </Button>

                <Button
                    onClick={() => setSelectedTeam('HOME')}
                    sx={{
                        height: 40,
                        width: 150,
                        bgcolor: selectedTeam === 'HOME' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedTeam === 'HOME' ? '#0d41e1' : '#7D7D7D',
                        border: '1px solid',
                        borderColor: selectedTeam === 'HOME' ? '#0d41e1' : '#D4D4D8',
                        ml: 1,
                    }}
                >
                    <img
                        src={`/leagueLogo/${gameDetail.league}/${gameDetail.homeTeam}.png`}
                        alt={gameDetail.homeTeam}
                        width='40'
                        height='40'
                        style={{ marginRight: 10 }}
                    />
                    {gameDetail.homeTeam}
                </Button>
            </Box>

            <DataGrid
                rows={rows}
                columns={columns}
                sx={{
                    mb: 3,
                    width: '95%',
                    mx: 'auto',
                    '& .MuiDataGrid-footerContainer': {
                        display: 'none',
                    },
                }}
            />
        </Box>
    );
};

export default SoccerTableComponent;
