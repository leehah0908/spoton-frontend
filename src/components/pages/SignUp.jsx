import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoHeartCircle } from 'react-icons/io5';
import { Container, TextField, Button, Typography, Box, InputAdornment, Divider } from '@mui/material';
import TeamSelectorModal from '../modals/TeamSelectorModal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../modals/LoginModal';

const SignUp = () => {
    const navigate = useNavigate();
    const [loginOpen, setLoginOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [myTeam, setMyTeam] = useState({});
    const [number, setNumber] = useState('');

    const [emailCheck, setEmailCheck] = useState(false);
    const [nicknameCheck, setNicknameCheck] = useState(false);
    const [numberCheck, setNumberCheck] = useState(false);
    const [openTeamModal, setOpenTeamModal] = useState(false);

    const [preSumbmit, setPreSumbmit] = useState(false);
    const [errors, setErrors] = useState({
        nickname: '',
        email: '',
        password: '',
        checkPassword: '',
    });

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

    // 백엔드 양식에 맞게 매핑
    const transformedMyTeam = Object.keys(myTeam).reduce((acc, key) => {
        const newKey = fieldMapping[key];
        if (newKey) {
            acc[newKey] = myTeam[key];
        }
        return acc;
    }, {});

    // 처음 회원가입 페이지에 들어왔을 때, error 표시X
    const [touched, setTouched] = useState({
        nickname: false,
        email: false,
        password: false,
        checkPassword: false,
    });

    const handleLoginClick = () => {
        setLoginOpen(true);
    };

    const handleLoginClose = () => {
        setLoginOpen(false);
    };

    // 모달 핸들러
    const handleOpenTeamModal = () => setOpenTeamModal(true);
    const handleCloseTeamModal = () => setOpenTeamModal(false);

    // 모달에서 선택한 팀 세팅
    const handleTeamSelect = (team) => {
        setMyTeam(team);
    };

    useEffect(() => {
        sessionStorage.removeItem('gameState');
    }, []);

    // 회원가입 요청보내기 전에 모든값에 대해서 유효성 검사 진행
    useEffect(() => {
        let tempErrors = { nickname: '', email: '', password: '', checkPassword: '' };
        let isValid = true;

        if (!/\S+@\S+\.\S+/.test(email)) {
            tempErrors.email = '이메일 형식이 올바르지 않습니다.';
            isValid = false;
        }

        if (password.length < 8) {
            tempErrors.password = '비밀번호는 최소 8자 이상으로 설정해주세요.';
            isValid = false;
        }

        if (password !== checkPassword) {
            tempErrors.checkPassword = '비밀번호가 일치하지 않습니다.';
            isValid = false;
        }

        if (nickname.length < 2) {
            tempErrors.nickname = '닉네임은 2자 이상으로 설정해주세요.';
            isValid = false;
        }

        setPreSumbmit(isValid);
        setErrors(tempErrors);
    }, [nickname, email, password, checkPassword]);

    // 이메일 중복확인
    const handleEmailCheck = async (email) => {
        let tempError = '';
        let isValid = true;

        if (!/\S+@\S+\.\S+/.test(email)) {
            tempError = '이메일 형식이 올바르지 않습니다.';
            isValid = false;
        }

        // 형식이 맞지 않으면 중복확인 불가
        if (isValid) {
            try {
                await axios.get(`${process.env.REACT_APP_BASE_URL}/user/check_email`, {
                    params: { email },
                });

                setEmailCheck(true);

                await Swal.fire({
                    width: '20rem',
                    html: '<div style="text-align: center; line-height: 2;">사용 가능한 이메일입니다.<br/>이메일 인증을 진행해주세요.<div/>',
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
            } catch (e) {
                tempError = e.response.data?.statusMessage;
                setEmailCheck(false);
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            email: tempError,
        }));
    };

    // 이메일 인증번호 보내기
    const handleNumberSend = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/user/email_send`, null, {
                params: { email },
            });
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
    };

    // 이메일 인증번호 확인하기
    const handleVerifyCode = async (number) => {
        if (number === '') {
            await Swal.fire({
                width: '20rem',
                text: '인증번호를 입력해주세요.',
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
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/email_certi`, {
                params: { email, reqNumber: number },
            });

            if (res.status === 200) {
                setNumberCheck(true);

                await Swal.fire({
                    width: '20rem',
                    text: '인증이 완료되었습니다.',
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
        } catch (e) {
            if (e.response.status === 401) {
                setNumberCheck(false);

                await Swal.fire({
                    width: '20rem',
                    text: '인증번호가 일치하지 않습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#0d41e1',
                    customClass: {
                        popup: 'custom-swal-popup',
                    },
                    didOpen: () => {
                        document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                    },
                });
            } else if (e.response.status === 408) {
                setNumberCheck(false);

                await Swal.fire({
                    width: '20rem',
                    text: '3분이 지났습니다. 인증번호를 다시 보내주세요.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#0d41e1',
                    customClass: {
                        popup: 'custom-swal-popup',
                    },
                    didOpen: () => {
                        document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                    },
                });
            } else {
                setNumberCheck(false);

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
        }
    };

    // 닉네임 중복확인
    const handleNicknameCheck = async (nickname) => {
        let tempError = '';
        let isValid = true;

        if (nickname.length < 2) {
            tempError = '닉네임은 2자 이상으로 설정해주세요.';
            isValid = false;
        }

        // 형식이 맞지 않으면 중복확인 불가
        if (isValid) {
            try {
                await axios.get(`${process.env.REACT_APP_BASE_URL}/user/check_nickname`, {
                    params: { nickname },
                });

                setNicknameCheck(true);

                await Swal.fire({
                    width: '20rem',
                    text: '사용 가능한 닉네임입니다.',
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
            } catch (e) {
                tempError = e.response.data?.statusMessage;
                setNicknameCheck(false);
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            nickname: tempError,
        }));
    };

    // 회원가입 요청 보내기
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 이메일 중복체크 여부
        if (!emailCheck) {
            await Swal.fire({
                width: '20rem',
                text: '이메일 중복확인을 해주세요.',
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

        // 이메일 인증 여부
        if (!numberCheck) {
            await Swal.fire({
                width: '20rem',
                text: '이메일 인증을 해주세요.',
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

        // 닉네임 중복체크 여부
        if (!nicknameCheck) {
            await Swal.fire({
                width: '20rem',
                text: '닉네임 중복확인을 해주세요.',
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

        // 값을 다 입력했는지 검증
        if (!preSumbmit) {
            await Swal.fire({
                width: '20rem',
                text: '비밀번호를 입력해주세요.',
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

        if (Object.keys(myTeam).length === 0) {
            const result = await Swal.fire({
                width: '20rem',
                text: '마이팀 선택없이 가입하시겠습니까?',
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
                return;
            }
        }

        // 모든 값에 대해서 유효성을 검사하고 회원가입 요청
        if (preSumbmit) {
            const result = await Swal.fire({
                width: '20rem',
                text: '가입하시겠습니까?',
                showCancelButton: true,
                confirmButtonText: '네',
                cancelButtonText: '아니요',
                confirmButtonColor: '#0d41e1',
                cancelButtonColor: '#AAAAAA',
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
                await axios.post(`${process.env.REACT_APP_BASE_URL}/user/signup`, {
                    email,
                    password,
                    nickname,
                    myTeam: transformedMyTeam,
                });

                await Swal.fire({
                    width: '20rem',
                    text: '회원가입이 완료되었습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#0d41e1',
                    customClass: {
                        popup: 'custom-swal-popup',
                    },
                    didOpen: () => {
                        document.querySelector('.custom-swal-popup').style.fontFamily = '"Do Hyeon", sans-serif';
                    },
                });

                navigate('/');
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
        }
    };

    return (
        <Container maxWidth='sm' sx={{ p: 2 }}>
            <Box
                sx={{
                    mt: 3,
                    p: 4,
                    bgcolor: 'rgb(234, 237, 244, 0.2)',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    borderRadius: 3,
                }}
            >
                <Box
                    sx={{
                        padding: 1.5,
                        borderRadius: 3,
                        border: '2px solid #0d41e1',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        bgcolor: 'rgba(13, 65, 225, 0.1)',
                    }}
                >
                    <Typography sx={{ fontSize: 20 }}>
                        SNS를 통해{' '}
                        <span
                            onClick={handleLoginClick}
                            style={{ fontSize: 23, cursor: 'pointer', color: '#0d41e1', textDecoration: 'underline' }}
                        >
                            3초만에 가입하기!
                        </span>
                    </Typography>
                </Box>
                <LoginModal open={loginOpen} onClose={handleLoginClose} />

                <Box display='flex' alignItems='center' gap={1} sx={{ mt: 5 }}>
                    <FaUser size={24} />
                    <Typography sx={{ textTransform: 'none', fontSize: '1.3rem', textAlign: 'left' }}>회원 정보 입력</Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    {/* 이메일 */}
                    <TextField
                        fullWidth
                        label='이메일'
                        variant='outlined'
                        margin='normal'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailCheck(false);
                            setNumberCheck(false);
                            setNumber('');
                        }}
                        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                        FormHelperTextProps={{ sx: { fontSize: '0.88rem' } }}
                        sx={{ bgcolor: emailCheck ? 'rgba(0, 128, 0, 0.1)' : '' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        onClick={() => handleEmailCheck(email)}
                                        sx={{
                                            bgcolor: '#0d41e1',
                                            color: 'white',
                                        }}
                                    >
                                        중복확인
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 이메일 인증 */}
                    {emailCheck && (
                        <>
                            <TextField
                                fullWidth
                                label='인증번호 (숫자만 입력 가능합니다.)'
                                variant='outlined'
                                margin='normal'
                                value={number}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    if (/^\d*$/.test(input)) {
                                        setNumber(input);
                                    }
                                    setNumberCheck(false);
                                }}
                                FormHelperTextProps={{ sx: { fontSize: '0.88rem' } }}
                                sx={{ bgcolor: numberCheck ? 'rgba(0, 128, 0, 0.1)' : '' }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                size='small'
                                                onClick={handleNumberSend}
                                                sx={{
                                                    bgcolor: '#0d41e1',
                                                    color: 'white',
                                                }}
                                            >
                                                인증번호 보내기
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {emailCheck && (
                                <Typography sx={{ color: '#0d41e1', mt: 1, fontSize: '0.9rem' }}>
                                    입력하신 이메일로 인증번호를 전송한 후 3분 이내로 인증을 완료해주세요.
                                </Typography>
                            )}

                            <Button
                                variant='contained'
                                color='primary'
                                sx={{ mt: 2, bgcolor: '#0d41e1' }}
                                onClick={() => handleVerifyCode(number)}
                            >
                                인증번호 확인
                            </Button>
                        </>
                    )}

                    {/* 닉네임 */}
                    <TextField
                        fullWidth
                        label='닉네임'
                        variant='outlined'
                        margin='normal'
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                            setNicknameCheck(false);
                        }}
                        onBlur={() => setTouched((prev) => ({ ...prev, nickname: true }))}
                        error={Boolean(touched.nickname && errors.nickname)}
                        helperText={touched.nickname && errors.nickname}
                        FormHelperTextProps={{
                            sx: { fontSize: '0.88rem' },
                        }}
                        sx={{ bgcolor: nicknameCheck ? 'rgba(0, 128, 0, 0.1)' : '' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        onClick={() => handleNicknameCheck(nickname)}
                                        sx={{
                                            bgcolor: '#0d41e1',
                                            color: 'white',
                                        }}
                                    >
                                        중복확인
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 비밀번호 */}
                    <TextField
                        fullWidth
                        label='비밀번호'
                        type='password'
                        variant='outlined'
                        margin='normal'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                        FormHelperTextProps={{
                            sx: { fontSize: '0.88rem' },
                        }}
                    />

                    {/* 비밀번호 확인 */}
                    <TextField
                        fullWidth
                        label='비밀번호 확인'
                        type='password'
                        variant='outlined'
                        margin='normal'
                        value={checkPassword}
                        onChange={(e) => setCheckPassword(e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, checkPassword: true }))}
                        error={Boolean(touched.checkPassword && errors.checkPassword)}
                        helperText={touched.checkPassword && errors.checkPassword}
                        FormHelperTextProps={{
                            sx: { fontSize: '0.88rem' },
                        }}
                    />

                    <Divider sx={{ my: 2, borderWidth: 1 }} />

                    {/* 마이팀 선택 */}
                    <Box display='flex' alignItems='center' gap={1} sx={{ mt: 1 }}>
                        <IoHeartCircle size={24} />
                        <Typography sx={{ textTransform: 'none', fontSize: '1.3rem', textAlign: 'left' }}>마이팀 선택</Typography>
                    </Box>

                    <Button
                        fullWidth
                        variant='outlined'
                        sx={{
                            mt: 2,
                            mb: 3,
                            bgcolor: 'rgba(13, 65, 225, 0.05)',
                            color: '#343a40',
                            borderColor: Object.keys(myTeam).length > 0 ? '#0d41e1' : '#C4C4C4',
                            borderWidth: 2,
                        }}
                        onClick={handleOpenTeamModal}
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
                    <TeamSelectorModal
                        open={openTeamModal}
                        onClose={handleCloseTeamModal}
                        onSelectTeam={handleTeamSelect}
                        selectedTeam={myTeam}
                    />

                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'
                        sx={{ mt: 2, bgcolor: '#0d41e1', color: 'white' }}
                    >
                        회원가입
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default SignUp;
