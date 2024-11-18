import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, Typography, Avatar, Button, TextField, Card, CardContent, Container } from '@mui/material';
import TeamSelectorModal from '../modals/TeamSelectorModal';
import PasswordModifyModal from '../modals/PasswordModifyModal';
import AuthContext from '../../contexts/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
    const navigate = useNavigate();
    const { onLogout } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [myTeam, setMyTeam] = useState({});
    const [profile, setProfile] = useState('');
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

    const $fileTag = useRef();

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

                setEmail(res.data.result.email);
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
            await axios.patch(
                `${process.env.REACT_APP_BASE_URL}/user/modify`,
                {
                    type: 'nickname',
                    nickname,
                },
                {
                    withCredentials: true,
                },
            );

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
            await axios.patch(
                `${process.env.REACT_APP_BASE_URL}/user/modify`,
                {
                    type: 'myTeam',
                    myTeam: transformedMyTeam,
                },
                {
                    withCredentials: true,
                },
            );

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

            await axios.post(`${process.env.REACT_APP_BASE_URL}/user/set_profile`, formData, {
                withCredentials: true,
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
            console.log(e);
        }
    };

    // SNS 연동 해제
    const disconnectSNS = async () => {
        const result = await Swal.fire({
            width: '40rem',
            html: '<div style="color: #333; text-align: center; line-height: 2;">SNS 연동을 해제하려면 새로운 비밀번호 설정이 필요합니다.<br />그래도 진행하시겠습니까?</div>',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            confirmButtonColor: '#0d41e1',
            customClass: {
                popup: 'custom-swal-popup',
            },
            didOpen: () => {
                document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            axios.post(`${process.env.REACT_APP_BASE_URL}/user/pw_send`, {}, { params: { email }, withCredentials: true });
        } catch (e) {
            await Swal.fire({
                width: '20rem',
                text: '다시 시도해주세요.',
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

        await Swal.fire({
            width: '40rem',
            html: '<div style="color: #333; text-align: center; line-height: 2;">회원정보에 등록된 이메일로 임시 비밀번호를 전송합니다.<br />로그아웃 하시고, 임시 비밀번호로 로그인한 후 비밀번호를 변경해주세요.</div>',
            confirmButtonText: '연동 해제중...',
            confirmButtonColor: '#0d41e1',
            customClass: {
                popup: 'custom-swal-popup',
            },
            didOpen: () => {
                document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';

                // 버튼 비활성화
                const confirmButton = Swal.getConfirmButton();
                confirmButton.disabled = true;

                // 3초 후 버튼 활성화
                setTimeout(() => {
                    confirmButton.disabled = false;
                    confirmButton.textContent = '확인';
                }, 5000);
            },
        });

        navigate('/');
        onLogout();
    };

    const withDraw = () => {
        // sweetalert2로 전체 로직 처리
        Swal.fire({
            width: '40rem',
            text: "회원탈퇴를 하시려면 계정 정보를 '이메일/닉네임' 형식으로 입력해주세요.",
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
            },
            showCancelButton: true,
            confirmButtonText: '탈퇴하기',
            cancelButtonText: '취소',
            confirmButtonColor: '#AAAAAA',
            cancelButtonColor: '#0d41e1',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            customClass: {
                popup: 'custom-swal-popup',
            },
            didOpen: () => {
                document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
            },
            preConfirm: async (input) => {
                // 입력값 검증
                if (input === `${email}/${nickname}`) {
                    const result = await Swal.fire({
                        width: '20rem',
                        text: '정말 탈퇴하시겠습니까?',
                        showCancelButton: true,
                        confirmButtonText: '네',
                        cancelButtonText: '아니요',
                        confirmButtonColor: '#AAAAAA',
                        cancelButtonColor: '#0d41e1',
                        customClass: {
                            popup: 'custom-swal-popup',
                        },
                        didOpen: () => {
                            document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                        },
                    });

                    if (!result.isConfirmed) {
                        return false;
                    }

                    try {
                        await axios.post(`${process.env.REACT_APP_BASE_URL}/user/withdraw`, {}, { withCredentials: true });
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
                    onLogout();
                    navigate('/');
                    return true;
                } else {
                    await Swal.fire({
                        width: '20rem',
                        text: '계정 정보가 일치하지 않습니다.',
                        confirmButtonText: '확인',
                        confirmButtonColor: '#0d41e1',
                        customClass: {
                            popup: 'custom-swal-popup',
                        },
                        didOpen: () => {
                            document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                        },
                    });
                    return false;
                }
            },
        }).then(async (result) => {
            if (result.dismiss === Swal.DismissReason.cancel || !result.value) {
                return;
            }

            await Swal.fire({
                width: '20rem',
                text: '회원탈퇴가 완료되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                },
            });
        });
    };

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
                            onClick={saveMyTeam}
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
                            <Button
                                variant='contained'
                                sx={{ width: '70%', bgcolor: '#0d41e1' }}
                                onClick={() => $fileTag.current.click()}
                            >
                                프로필 사진 변경
                                {/* 사진 변경 태그 (숨겨놓고 사용) */}
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleProfilePictureChange}
                                    style={{ display: 'none' }}
                                    ref={$fileTag}
                                />
                            </Button>

                            <Button variant='contained' onClick={removeProfile} sx={{ width: '70%', bgcolor: '#0d41e1' }}>
                                프로필 사진 삭제
                            </Button>
                        </Box>
                        <Button variant='contained' sx={{ width: '54%', bgcolor: '#0d41e1' }} onClick={saveProfile}>
                            변경 사항 적용
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* 비밀번호 변경 */}
            <Card sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ mb: 0, mt: 2 }}>
                    비밀번호 변경
                </Typography>

                <CardContent>
                    <Button variant='contained' sx={{ bgcolor: '#0d41e1' }} onClick={() => setOpenPasswordModal(true)}>
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
                        <Button variant='contained' color='error' onClick={disconnectSNS}>
                            SNS 연동 해제
                        </Button>

                        <Button variant='contained' color='error' onClick={withDraw}>
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
