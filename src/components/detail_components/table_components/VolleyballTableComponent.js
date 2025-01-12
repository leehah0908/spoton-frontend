import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const VolleyballTableComponent = ({ gameDetail, league }) => {
    const [selectedTeam, setSelectedTeam] = useState('AWAY');

    const [rows, setRows] = useState([]);

    const columns = [
        { field: 'name', headerName: '선수명', flex: 1 },
        { field: 'position', headerName: '포지션', flex: 1 },
        { field: 'point', headerName: '득점', flex: 1 },
        { field: 'attack', headerName: '공격', flex: 1 },
        { field: 'attackSuccessRate', headerName: '공격 성공률', flex: 1 },
        { field: 'blocking', headerName: '블로킹', flex: 1 },
        { field: 'blockingSuccessRate', headerName: '블로킹 성공률', flex: 1 },
        { field: 'dig', headerName: '디그', flex: 1 },
        { field: 'digSuccessRate', headerName: '디그 성공률', flex: 1 },
        { field: 'receive', headerName: '리시브', flex: 1 },
        { field: 'receiveSuccessRate', headerName: '리시브 성공률', flex: 1 },
        { field: 'serve', headerName: '서브', flex: 1 },
        { field: 'serveSuccessRate', headerName: '서브 성공률', flex: 1 },
        { field: 'error', headerName: '범실', flex: 1 },
    ];

    useEffect(() => {
        const loadData =
            selectedTeam === 'AWAY'
                ? gameDetail.detailToJson.playerStatOfGame.away
                : gameDetail.detailToJson.playerStatOfGame.home;

        setRows(
            loadData.map((value, index) => ({
                id: index,
                name: value.playerName,
                position: value.position,
                point: value.point,
                attack: `${value.attackSuccess}/${value.attack}`,
                attackSuccessRate: `${value.attackSuccessRate}%`,
                blocking: `${value.blockingSuccess}/${value.blocking}`,
                blockingSuccessRate: `${value.blockingSuccessRate}%`,
                dig: `${value.digSuccess}/${value.dig}`,
                digSuccessRate: `${value.digSuccessRate}%`,
                receive: `${value.receiveSuccess}/${value.receive}`,
                receiveSuccessRate: `${value.receiveSuccessRate}%`,
                serve: `${value.serveSuccess}/${value.serve}`,
                serveSuccessRate: `${value.serveSuccessRate}%`,
                error: value.error,
            })),
        );
    }, [gameDetail, selectedTeam]);

    return (
        <Box sx={{ mt: 2 }}>
            {/* 팀 선택 버튼 */}
            <Box sx={{ mb: 2 }}>
                <Button
                    onClick={() => setSelectedTeam('AWAY')}
                    sx={{
                        height: 40,
                        width: 200,
                        bgcolor: selectedTeam === 'AWAY' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedTeam === 'AWAY' ? '#0d41e1' : '#7D7D7D',
                        border: '1px solid',
                        borderColor: selectedTeam === 'AWAY' ? '#0d41e1' : '#D4D4D8',
                        mr: 1,
                    }}
                >
                    {gameDetail.awayTeam}
                    <img
                        src={`${process.env.REACT_APP_STATIC_IMAGE_URL}/leagueLogo/${gameDetail.league}/${encodeURIComponent(gameDetail.awayTeam.normalize('NFD'))}.png`}
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
                        width: 200,
                        bgcolor: selectedTeam === 'HOME' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedTeam === 'HOME' ? '#0d41e1' : '#7D7D7D',
                        border: '1px solid',
                        borderColor: selectedTeam === 'HOME' ? '#0d41e1' : '#D4D4D8',
                        ml: 1,
                    }}
                >
                    <img
                        src={`${process.env.REACT_APP_STATIC_IMAGE_URL}/leagueLogo/${gameDetail.league}/${encodeURIComponent(gameDetail.homeTeam.normalize('NFD'))}.png`}
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
                    width: '100%',
                    mx: 'auto',
                    '& .MuiDataGrid-footerContainer': {
                        display: 'none',
                    },
                }}
            />
        </Box>
    );
};

export default VolleyballTableComponent;
