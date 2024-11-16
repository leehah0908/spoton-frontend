import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, TextField, Card, CardContent, Container } from '@mui/material';
import TeamSelectorModal from '../modals/TeamSelectorModal';
import PasswordModifyModal from '../modals/PasswordModifyModal';
import axios from 'axios';

const MyPage = () => {
    const [nickname, setNickname] = useState('');
    const [myTeam, setMyTeam] = useState({});
    const [profilePicture, setProfilePicture] = useState('');

    const fieldMapping = {
        NBA: 'nbaTeam',
        KBO: 'kboTeam',
        MLB: 'mlbTeam',
        'K-League': 'kleagueTeam',
        'Premier League': 'eplTeam',
        KBL: 'kblTeam',
        'V - League 남자부': 'kovoTeam',
        'V - League 여자부': 'wkovwTeam',
        LCK: 'lckTeam',
    };

    // 모달 상태
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openTeamModal, setOpenTeamModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/my_info`, { withCredentials: true });
                console.log(res.data);

                // mtId 빼고, 팀이 지정되어있지 않은 리그는 제외
                const fitedMyTeam = Object.fromEntries(
                    Object.entries(res.data.result.myTeam)
                        .filter(([key, value]) => key !== 'mtId' && value)
                        .map(([key, value]) => {
                            const leagueName = Object.keys(fieldMapping).find((league) => fieldMapping[league] === key) || key;
                            return [leagueName, value];
                        }),
                );

                setNickname(res.data.result.nickname);
                setMyTeam(fitedMyTeam);
                setProfilePicture(res.data.result.profile);
            } catch (error) {
                console.error('유저 데이터 로드 실패', error);
            }
        };

        loadData();
    }, []);

    // 모달에서 선택한 팀 세팅
    const handleTeamSelect = (team) => {
        setMyTeam(team);
    };

    const handleProfilePictureChange = (e) => {
        // try {
        //     const file = e.target.files[0];
        //     if (file) {
        //         const reader = new FileReader();
        //         reader.onload = () => setTempProfilePicture(reader.result);
        //         reader.readAsDataURL(file);
        //     }
        // } catch (e) {
        //     console.log('지우기');
        //     setProfilePicture('');
        // }
    };

    const saveNickname = () => {};

    const saveProfilePicture = () => {};

    return (
        <Container maxWidth='sm'>
            <Typography variant='h4' sx={{ color: '#0d41e1', mb: 5, mt: 5 }}>
                My Page
            </Typography>

            {/* 닉네임 수정 */}
            <Card sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ mb: 0, mt: 2 }}>
                    닉네임
                </Typography>

                <CardContent sx={{ pt: 0 }}>
                    <Box display='flex' flexDirection='row' alignItems='center' gap={3} justifyContent='center'>
                        <TextField
                            label='닉네임'
                            variant='outlined'
                            margin='normal'
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />

                        <Button variant='contained' color='primary' onClick={saveNickname} sx={{ bgcolor: '#0d41e1' }}>
                            변경 사항 적용
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* 마이팀 수정 */}
            <Card sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ mt: 2 }}>
                    마이팀
                </Typography>

                <CardContent sx={{ pt: 0 }}>
                    <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
                        <Button
                            variant='outlined'
                            sx={{
                                mt: 2,
                                width: '70%',
                                bgcolor: 'rgba(13, 65, 225, 0.05)',
                                color: '#343a40',
                                borderColor: Object.keys(myTeam).length > 0 ? '#0d41e1' : '#C4C4C4',
                                borderWidth: 2,
                            }}
                            onClick={() => setOpenTeamModal(true)}
                        >
                            {Object.keys(myTeam).length > 0 ? (
                                <Box>
                                    {Object.entries(myTeam).map(([league, team]) => (
                                        <Typography key={league} sx={{ mb: 0.5, textTransform: 'none', textAlign: 'left' }}>
                                            {league} : {team}
                                        </Typography>
                                    ))}
                                </Box>
                            ) : (
                                '팀 선택'
                            )}
                        </Button>

                        <Button
                            variant='contained'
                            color='primary'
                            onClick={saveProfilePicture}
                            sx={{ width: '70%', bgcolor: '#0d41e1' }}
                        >
                            변경 사항 적용
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* 프로필 사진 변경 */}
            <Card sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ mb: 2, mt: 2 }}>
                    프로필 사진
                </Typography>

                <CardContent sx={{ pt: 0 }}>
                    <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
                        <Avatar src={profilePicture || '/default-profile.png'} sx={{ width: 50, height: 50 }} />

                        <Box display='flex' flexDirection='row' alignItems='center' gap={3}>
                            <Button variant='contained' sx={{ width: '70%', bgcolor: '#0d41e1' }}>
                                프로필 사진 변경
                                <input type='file' hidden onChange={handleProfilePictureChange} />
                            </Button>

                            <Button
                                variant='contained'
                                onClick={handleProfilePictureChange}
                                sx={{ width: '70%', bgcolor: '#0d41e1' }}
                            >
                                프로필 사진 삭제
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* 비밀번호 변경 */}
            <Card sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ mb: 0, mt: 2 }}>
                    비밀번호 변경
                </Typography>
                <CardContent>
                    <Button variant='contained' color='primary' onClick={() => setOpenPasswordModal(true)}>
                        비밀번호 변경
                    </Button>
                </CardContent>
            </Card>

            {/* SNS 계정 연동 해제 및 회원탈퇴 */}
            <Card sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ mb: 0, mt: 2 }}>
                    계정 관리
                </Typography>

                <CardContent>
                    <Box display='flex' flexDirection='row' alignItems='center' gap={3} justifyContent='center'>
                        <Button variant='contained' color='error'>
                            SNS 연동 해제
                        </Button>

                        <Button variant='contained' color='error'>
                            회원탈퇴
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* 마이팀 모달 */}
            <TeamSelectorModal
                open={openTeamModal}
                onClose={() => setOpenTeamModal(false)}
                onSelectTeam={handleTeamSelect}
                selectedTeam={myTeam}
            />

            {/* 비밀번호 변경 모달 */}
            <PasswordModifyModal open={openPasswordModal} onClose={() => setOpenPasswordModal(false)} />
        </Container>
    );
};

export default MyPage;
