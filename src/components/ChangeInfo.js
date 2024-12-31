import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Avatar, Button, TextField, Container, Divider } from '@mui/material';
import TeamSelectorModal from './modals/TeamSelectorModal';
import PasswordModifyModal from './modals/PasswordModifyModal';
import axiosInstance from '../configs/axios-config';
import Swal from 'sweetalert2';

const ChangeInfo = () => {
    const [nickname, setNickname] = useState('');
    const [myTeam, setMyTeam] = useState({});
    const [profile, setProfile] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const fieldMapping = {
        NBA: 'nba',
        KBO: 'kbo',
        MLB: 'mlb',
        'K-League': 'kleague',
        'Premier League': 'epl',
        KBL: 'kbl',
        'V - League 남자부': 'kovo',
        'V - League 여자부': 'wkovo',
        LCK: 'lck',
    };

    const $fileTag = useRef();

    // 모달 상태
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openTeamModal, setOpenTeamModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await axiosInstance.get('/user/my_info');

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

    // 닉네임 변경
    const saveNickname = async () => {
        if (nickname.length < 2) {
            await Swal.fire({
                width: '20rem',
                text: '닉네임은 2자 이상으로 설정해주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                },
            });
            return;
        }

        try {
            await axiosInstance.patch('/user/modify', {
                type: 'nickname',
                nickname,
            });

            await Swal.fire({
                width: '20rem',
                text: '변경이 완료되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                },
            });
        } catch (e) {
            await Swal.fire({
                width: '20rem',
                text: e.response.data.statusMessage,
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                },
            });
        }
    };

    // 마이팀 변경
    const saveMyTeam = async () => {
        const transformedMyTeam = Object.keys(myTeam).reduce((acc, key) => {
            const newKey = fieldMapping[key];
            if (newKey) {
                acc[newKey] = myTeam[key];
            }
            return acc;
        }, {});

        try {
            await axiosInstance.patch('/user/modify', {
                type: 'myTeam',
                myTeam: transformedMyTeam,
            });

            await Swal.fire({
                width: '20rem',
                text: '변경이 완료되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                },
            });
        } catch (e) {
            await Swal.fire({
                width: '20rem',
                text: e.response.data.statusMessage,
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                },
            });
        }
    };

    // 프로필 사진 변경 (화면단)
    const handleProfilePictureChange = () => {
        const file = $fileTag.current.files[0];
        if (file) {
            setProfile(file);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setProfilePicture(reader.result);
        }
    };

    // 프로필 사진 삭제 (화면단)
    const removeProfile = () => {
        setProfilePicture('');
        setProfile('');
    };

    // 프로필 사진 변경 (백엔드 변경)
    const saveProfile = async () => {
        try {
            const formData = new FormData();
            formData.append('imgFile', profile);

            await axiosInstance.post('/user/set_profile', formData);

            await Swal.fire({
                width: '20rem',
                text: '변경이 완료되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                },
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Container disableGutters>
            {/* 닉네임 수정 */}
            <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontSize: 17, mb: 1, textAlign: 'left' }}>닉네임 변경</Typography>

                <Box display='flex' flexDirection='row' alignItems='center' gap={3}>
                    <TextField variant='standard' value={nickname} onChange={(e) => setNickname(e.target.value)} />

                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={saveNickname}
                        sx={{ color: '#0d41e1', borderColor: '#0d41e1', bgcolor: 'rgba(13, 66, 225, 0.1)' }}
                    >
                        닉네임 저장
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 마이팀 수정 */}
            <Box>
                <Typography sx={{ fontSize: 17, mb: 1, textAlign: 'left' }}>마이팀 변경</Typography>

                <Box display='flex' flexDirection='row' alignItems='flex-start' sx={{ mt: 2 }}>
                    <Button
                        variant='outlined'
                        sx={{
                            width: '38%',
                            bgcolor: '#f8f8f8',
                            color: '#343a40',
                            borderColor: '#858585',
                            borderWidth: 2,
                            py: 1,
                            mb: 1,
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
                            <Box>
                                <Typography sx={{ textTransform: 'none', textAlign: 'left' }}>팀선택</Typography>
                            </Box>
                        )}
                    </Button>

                    <Button
                        variant='outlined'
                        onClick={saveMyTeam}
                        sx={{
                            color: '#0d41e1',
                            borderColor: '#0d41e1',
                            bgcolor: 'rgba(13, 66, 225, 0.1)',
                            ml: 2,
                            alignSelf: 'flex-end',
                            my: 1,
                        }}
                    >
                        마이팀 저장
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 프로필 사진 변경 */}
            <Box>
                <Typography sx={{ fontSize: 17, mb: 1, textAlign: 'left' }}>프로필 사진 변경</Typography>

                <Box display='flex' flexDirection='row' alignItems='flex-start' sx={{ mt: 2 }}>
                    <Avatar
                        src={profilePicture || '/default-profile.png'}
                        onClick={() => $fileTag.current.click()}
                        sx={{ width: 100, height: 100, cursor: 'pointer', mr: 2 }}
                    />

                    {/* 사진 변경 태그 (숨겨놓고 사용) */}
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleProfilePictureChange}
                        style={{ display: 'none' }}
                        ref={$fileTag}
                    />

                    <Box display='flex' flexDirection='row' gap={1} sx={{ alignSelf: 'flex-end' }}>
                        <Button
                            variant='outlined'
                            sx={{ color: '#0d41e1', borderColor: '#0d41e1', bgcolor: 'rgba(13, 66, 225, 0.1)' }}
                            onClick={saveProfile}
                        >
                            프로필 저장
                        </Button>

                        <Button
                            variant='outlined'
                            onClick={removeProfile}
                            sx={{ color: '#0d41e1', borderColor: '#0d41e1', bgcolor: 'rgba(13, 66, 225, 0.1)' }}
                        >
                            프로필 삭제
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 비밀번호 변경 */}
            <Box>
                <Typography sx={{ fontSize: 17, mb: 1, textAlign: 'left' }}>비밀번호 변경</Typography>

                <Box display='flex' alignItems='flex-start' sx={{ mt: 2 }}>
                    <Button
                        variant='outlined'
                        sx={{ color: '#0d41e1', borderColor: '#0d41e1', bgcolor: 'rgba(13, 66, 225, 0.1)' }}
                        onClick={() => setOpenPasswordModal(true)}
                    >
                        비밀번호 변경
                    </Button>
                </Box>
            </Box>

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

export default ChangeInfo;
