import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const BaseballTableComponent = ({ gameDetail, league }) => {
    const [selectedTeam, setSelectedTeam] = useState('AWAY');
    const [selectedPosition, setSelectedPosition] = useState('batter');

    const [batterRows, setBatterRows] = useState([]);
    const [pitcherRows, setPitcherRows] = useState([]);

    const batterColumns = [
        { field: 'batOrder', headerName: '타순', flex: 1 },
        { field: 'name', headerName: '타자명', flex: 1 },
        { field: 'pos', headerName: '포지션', flex: 1 },
        { field: 'ab', headerName: '타수', flex: 1 },
        { field: 'run', headerName: '득점', flex: 1 },
        { field: 'hit', headerName: '안타', flex: 1 },
        { field: 'rbi', headerName: '타점', flex: 1 },
        { field: 'hr', headerName: '홈런', flex: 1 },
        { field: 'bb', headerName: '볼넷', flex: 1 },
        { field: 'kk', headerName: '삼진', flex: 1 },
        { field: 'sb', headerName: '도루', flex: 1 },
        { field: 'hra', headerName: '타율', flex: 1 },
    ];

    const pitcherColumns = [
        { field: 'name', headerName: '투수명', flex: 1 },
        { field: 'inn', headerName: '이닝', flex: 1 },
        { field: 'hit', headerName: '피안타', flex: 1 },
        { field: 'r', headerName: '실점', flex: 1 },
        { field: 'er', headerName: '자책', flex: 1 },
        { field: 'bbhp', headerName: '4사구', flex: 1 },
        { field: 'kk', headerName: '삼진', flex: 1 },
        { field: 'hr', headerName: '피홈런', flex: 1 },
        { field: 'bf', headerName: '투구수', flex: 1 },
        { field: 'era', headerName: '평균자책', flex: 1 },
    ];

    const positionMap = {
        포: '포수',
        좌: '좌익수',
        중: '중견수',
        우: '우익수',
        유: '유격수',
        一: '1루수',
        二: '2루수',
        三: '3루수',
        지: '지명타자',

        우좌: '우·좌익수',
        좌우: '좌·우익수',
        三一: '3·1루수',
        三二: '3·2루수',
        우중: '우익·중견수',
        유三: '유격·3루수',
        중좌: '중견·좌익수',
        지중: '지명·중견수',
    };

    const wlsIconMap = {
        '': '',
        세: '🅂',
        홀: '🄷',
        승: '🅆',
        패: '🄻',
    };

    useEffect(() => {
        // 타자 데이터 세팅
        if (league === 'kbo') {
            const loadData =
                selectedTeam === 'AWAY'
                    ? gameDetail.detailToJson.battersBoxscore.away
                    : gameDetail.detailToJson.battersBoxscore.home;

            setBatterRows(
                loadData.map((value, index) => ({
                    id: index,
                    batOrder: value.pos === '교' ? '⇋' : value.batOrder,
                    name: value.name,
                    pos: value.pos === '교' ? '대타' : positionMap[value.pos],
                    ab: value.ab,
                    run: value.run,
                    hit: value.hit,
                    rbi: value.rbi,
                    hr: value.hr,
                    bb: value.bb,
                    kk: value.kk,
                    sb: value.sb,
                    hra: value.hra,
                })),
            );
        } else if (league === 'mlb') {
            const loadData = selectedTeam === 'AWAY' ? gameDetail.detailToJson.awayBatter : gameDetail.detailToJson.homeBatter;

            setBatterRows(
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

        // 투수 데이터 세팅
        if (league === 'kbo') {
            const loadData =
                selectedTeam === 'AWAY'
                    ? gameDetail.detailToJson.pitchersBoxscore.away
                    : gameDetail.detailToJson.pitchersBoxscore.home;

            setPitcherRows(
                loadData.map((value, index) => ({
                    id: index,
                    name: `${value.name} ${wlsIconMap[value.wls]}`,
                    inn: value.inn,
                    hit: value.hit,
                    r: value.r,
                    er: value.er,
                    bbhp: value.bbhp,
                    kk: value.kk,
                    hr: value.hr,
                    bf: value.bf,
                    era: value.era,
                    wls: value.wls,
                })),
            );
        } else if (league === 'mlb') {
            const loadData = selectedTeam === 'AWAY' ? gameDetail.detailToJson.awayPitcher : gameDetail.detailToJson.homePitcher;
            setPitcherRows(
                loadData.map((value, index) => ({
                    id: index,
                    name: `${value.name} ${wlsIconMap[value.wls]}`,
                    inn: value.inn,
                    hit: value.hit,
                    r: value.r,
                    er: value.er,
                    bbhp: value.bb,
                    kk: value.kk,
                    hr: value.hr,
                    bf: value.bf,
                    era: value.era,
                    wls: value.wls,
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
                        width: 150,
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

            {/* 포지션 선택 버튼 */}
            <Box sx={{ mb: 3 }}>
                <Button
                    onClick={() => setSelectedPosition('batter')}
                    sx={{
                        height: 30,
                        width: 130,
                        bgcolor: selectedPosition === 'batter' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedPosition === 'batter' ? '#0d41e1' : '#7D7D7D',
                        border: '1px solid',
                        borderColor: selectedPosition === 'batter' ? '#0d41e1' : '#D4D4D8',
                        mr: 1,
                    }}
                >
                    타자 상세 기록
                </Button>

                <Button
                    onClick={() => setSelectedPosition('pitcher')}
                    sx={{
                        height: 30,
                        width: 130,
                        bgcolor: selectedPosition === 'pitcher' ? 'rgba(13, 66, 225, 0.1)' : 'white',
                        color: selectedPosition === 'pitcher' ? '#0d41e1' : '#7D7D7D',
                        border: '1px solid',
                        borderColor: selectedPosition === 'pitcher' ? '#0d41e1' : '#D4D4D8',
                        ml: 1,
                    }}
                >
                    투수 상세 기록
                </Button>
            </Box>

            {selectedPosition === 'batter' ? (
                <DataGrid
                    rows={batterRows}
                    columns={batterColumns}
                    sx={{
                        mb: 3,
                        width: '95%',
                        mx: 'auto',
                        '& .MuiDataGrid-footerContainer': {
                            display: 'none',
                        },
                    }}
                />
            ) : (
                <DataGrid
                    rows={pitcherRows}
                    columns={pitcherColumns}
                    sx={{
                        mb: 3,
                        width: '95%',
                        mx: 'auto',
                        '& .MuiDataGrid-footerContainer': {
                            display: 'none',
                        },
                    }}
                />
            )}
        </Box>
    );
};

export default BaseballTableComponent;
