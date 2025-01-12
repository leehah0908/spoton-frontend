import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const BasketballTableComponent = ({ gameDetail, league }) => {
    const [selectedTeam, setSelectedTeam] = useState('AWAY');

    const [rows, setRows] = useState([]);

    const columns = [
        { field: 'name', headerName: '선수명', flex: 1 },
        { field: 'scoreTot', headerName: '득점', flex: 1 },
        { field: 'reboundTot', headerName: '리바운드', flex: 1 },
        { field: 'as', headerName: '어시스트', flex: 1 },
        { field: 'st', headerName: '스틸', flex: 1 },
        { field: 'bs', headerName: '블록', flex: 1 },
        { field: 'fg', headerName: '야투', flex: 1 },
        { field: 'fgP', headerName: '야투 성공률', flex: 1 },
        { field: 'three', headerName: '3점슛', flex: 1 },
        { field: 'threeP', headerName: '3점슛 성공률', flex: 1 },
        { field: 'ft', headerName: '자유투', flex: 1 },
        { field: 'ftP', headerName: '자유투 성공률', flex: 1 },
        { field: 'or', headerName: '공격 리바운드', flex: 1 },
        { field: 'dr', headerName: '수비 리바운드', flex: 1 },
        { field: 'to', headerName: '턴오버', flex: 1 },
        { field: 'foulTot', headerName: '파울', flex: 1 },
        { field: 'playTime', headerName: '출전시간', flex: 1 },
    ];

    useEffect(() => {
        if (league === 'kbl') {
            const loadData =
                selectedTeam === 'AWAY' ? gameDetail.detailToJson.awayPlayerStats : gameDetail.detailToJson.homePlayerStats;

            setRows(
                loadData.map((value, index) => ({
                    id: index,
                    name: value.playerShortName,
                    scoreTot: value.scoreTot,
                    reboundTot: value.reboundTot,
                    as: value.as,
                    st: value.st,
                    bs: value.bs,
                    fg: `${value.fgA}/${value.fgPA}`,
                    fgP: `${value.fgP.toFixed(2)}%`,
                    three: `${value.threeP}/${value.threePA}`,
                    threeP: `${value.threePP.toFixed(2)}%`,
                    ft: `${value.ft}/${value.ftA}`,
                    ftP: `${value.ftP.toFixed(2)}%`,
                    or: value.or,
                    dr: value.dr,
                    to: value.to,
                    foulTot: value.foulTot,
                    playTime: value.playTimeStr,
                })),
            );
        } else if (league === 'nba') {
            const loadData =
                selectedTeam === 'AWAY' ? gameDetail.detailToJson.awayPlayerStats : gameDetail.detailToJson.homePlayerStats;

            setRows(
                loadData.map((value, index) => ({
                    id: index,
                    name: value.lastName,
                    scoreTot: value.pts,
                    reboundTot: value.treb,
                    as: value.assists,
                    st: value.steals,
                    bs: value.blocks,
                    fg: `${value.fgm}/${value.fga}`,
                    fgP: `${(value.fgpct * 100).toFixed(2)}%`,
                    three: `${value.pgm3}/${value.pga3}`,
                    threeP: `${(value.ppct3 * 100).toFixed(2)}%`,
                    ft: `${value.ftm}/${value.fta}`,
                    ftP: `${(value.ftpct * 100).toFixed(2)}%`,
                    or: value.oReb,
                    dr: value.dReb,
                    to: value.turnOver,
                    foulTot: value.pFouls,
                    playTime: `${value.playMin}:${value.playSec}`,
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

export default BasketballTableComponent;
