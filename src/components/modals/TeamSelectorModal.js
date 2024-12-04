import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box, Chip, Divider } from '@mui/material';
import { sportsData } from '../../assets/sportsData';

const TeamSelectorModal = ({ open, onClose, onSelectTeam, selectedTeam }) => {
    const [selectedSport, setSelectedSport] = useState('');
    const [selectedLeague, setSelectedLeague] = useState('');
    const [selectedTeams, setSelectedTeams] = useState(selectedTeam);

    // Props(selectedTeam)가 변경될 때 상태 업데이트
    useEffect(() => {
        if (selectedTeam) {
            setSelectedTeams(selectedTeam);
        }
    }, [selectedTeam]);

    // 팀 선택 -> 리그, 팀 초기화
    const handleSportSelect = (sport) => {
        setSelectedSport(sport);
        setSelectedLeague('');
    };

    // 리그 선택 -> 팀 초기화
    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
    };

    // 팀 선택 -> 팀 추가
    const handleTeamSelect = (team) => {
        setSelectedTeams((prevTeams) => ({
            ...prevTeams,
            [selectedLeague]: team,
        }));
    };

    // 팀 선택 취소
    const handleRemoveTeam = (league) => {
        setSelectedTeams((prevTeams) => {
            const updatedTeams = { ...prevTeams };
            delete updatedTeams[league];
            return updatedTeams;
        });
    };

    // 정보 저장 및 모달 닫기
    const handleConfirmSelection = () => {
        onSelectTeam(selectedTeams);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle
                sx={{
                    color: '#0d41e1',
                    fontSize: '2rem',
                    textAlign: 'center',
                }}
            >
                팀 선택
            </DialogTitle>

            <DialogContent>
                {/* 종목 선택 */}
                <Box display='flex' gap={1} mb={2} sx={{ mb: 5, mt: 2 }}>
                    {Object.keys(sportsData).map((sport) => (
                        <Button
                            key={sport}
                            variant={selectedSport === sport ? 'contained' : 'outlined'}
                            onClick={() => handleSportSelect(sport)}
                            sx={{
                                bgcolor: selectedSport === sport ? '#124e78' : 'transparent',
                                color: selectedSport === sport ? 'white' : '#124e78',
                                borderColor: '#124e78',
                            }}
                        >
                            {sport}
                        </Button>
                    ))}
                </Box>

                {/* 리그 선택 */}
                {selectedSport && (
                    <Box display='flex' gap={1} sx={{ mb: 5 }}>
                        {sportsData[selectedSport].leagues
                            .filter((league) => league !== 'ALL')
                            .map((league) => (
                                <Button
                                    key={league}
                                    variant={selectedLeague === league ? 'contained' : 'outlined'}
                                    onClick={() => handleLeagueSelect(league)}
                                    sx={{
                                        bgcolor: selectedLeague === league ? '#f2bb05' : 'transparent',
                                        color: selectedLeague === league ? 'white' : '#f2bb05',
                                        borderColor: '#f2bb05',
                                        textTransform: 'none',
                                    }}
                                >
                                    {league}
                                </Button>
                            ))}
                    </Box>
                )}

                {/* 팀 선택 */}
                {selectedLeague && (
                    <Box display='flex' flexWrap='wrap' gap={1} mb={2} sx={{ mb: 3 }}>
                        {sportsData[selectedSport].teams[selectedLeague]
                            .filter((team) => team !== 'ALL')
                            .map((team) => (
                                <Button
                                    key={team}
                                    variant={selectedTeams[selectedLeague] === team ? 'contained' : 'outlined'}
                                    onClick={() => handleTeamSelect(team)}
                                    sx={{
                                        bgcolor: selectedTeams[selectedLeague] === team ? '#d74e09' : 'transparent',
                                        color: selectedTeams[selectedLeague] === team ? 'white' : '#d74e09',
                                        borderColor: '#d74e09',
                                    }}
                                >
                                    {team}
                                </Button>
                            ))}
                    </Box>
                )}

                {/* 선택된 팀 확인 */}
                <>
                    <Divider sx={{ my: 2, borderColor: 'black' }} />
                    <Box display='flex' flexWrap='wrap' gap={1} mt={2} sx={{ mb: 3, mt: 3 }}>
                        {Object.entries(selectedTeams).map(([league, team]) => (
                            <Chip
                                key={league}
                                label={`${league} : ${team}`}
                                onDelete={() => handleRemoveTeam(league)}
                                sx={{
                                    bgcolor: '#0d41e1',
                                    color: 'white',
                                    '& .MuiChip-deleteIcon': {
                                        color: 'white',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </>

                <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    sx={{
                        mt: 2,
                        bgcolor: '#0d41e1',
                        color: 'white',
                    }}
                    onClick={handleConfirmSelection}
                >
                    선택 완료
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default TeamSelectorModal;
