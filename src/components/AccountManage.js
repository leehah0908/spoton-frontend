import { Box, Button, Container, Divider, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../configs/axios-config';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/UserContext';
import SMSCertificationModal from './modals/SMSCertificationModal';

const AccountManage = () => {
    const navigate = useNavigate();
    const { onLogout, userEmail, isNumber, isSNS } = useContext(AuthContext);

    const [openSendSmsModal, setOpenSendSmsModal] = useState(false);

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
            axiosInstance.post('/user/pw_send', {}, { params: { email: userEmail } });
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
            text: '회원탈퇴를 하시려면 이메일을 정확하게 입력해주세요.',
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
                if (input === `${userEmail}`) {
                    const result = await Swal.fire({
                        width: '20rem',
                        html: '계정의 모든 정보를 잃습니다.</br>그래도 탈퇴하시겠습니까?',
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
                        await axiosInstance.post('/user/withdraw', {});
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
                        text: '이메일이 일치하지 않습니다.',
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
        <Container disableGutters>
            {/* SNS 계정 연동 해제 및 회원탈퇴 */}
            <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontSize: 17, mb: 1, textAlign: 'left' }}>인증하기</Typography>
                {!isNumber ? (
                    <Box display='flex' flexDirection='row' alignItems='center'>
                        <Button
                            variant='outlined'
                            onClick={() => setOpenSendSmsModal(true)}
                            sx={{ color: '#0d41e1', borderColor: '#0d41e1', bgcolor: 'rgba(13, 66, 225, 0.1)' }}
                        >
                            번호 인증
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Typography sx={{ fontSize: 15, textAlign: 'left', color: '#9A9A9A' }}>
                            번호 인증이 완료된 계정입니다.
                        </Typography>
                    </Box>
                )}
            </Box>
            <SMSCertificationModal open={openSendSmsModal} onClose={() => setOpenSendSmsModal(false)}></SMSCertificationModal>

            <Divider sx={{ my: 3 }} />

            <Box>
                <Typography sx={{ fontSize: 17, mb: 1, textAlign: 'left' }}>SNS 연동 해제</Typography>

                {isSNS ? (
                    <Box display='flex' flexDirection='row' alignItems='center'>
                        <Button
                            variant='outlined'
                            onClick={disconnectSNS}
                            sx={{ color: '#0d41e1', borderColor: '#0d41e1', bgcolor: 'rgba(13, 66, 225, 0.1)' }}
                        >
                            SNS 연동 해제
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Typography sx={{ fontSize: 15, textAlign: 'left', color: '#9A9A9A' }}>
                            SNS 로그인을 통해 SNS 계정과 연동해보세요!
                        </Typography>
                    </Box>
                )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
                <Typography sx={{ fontSize: 17, mb: 1, textAlign: 'left' }}>회원 탈퇴</Typography>

                <Box display='flex' flexDirection='row' alignItems='center'>
                    <Button
                        variant='outlined'
                        onClick={withDraw}
                        sx={{ color: 'red', borderColor: 'red', bgcolor: 'rgba(221, 51, 51, 0.1)' }}
                    >
                        회원탈퇴
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AccountManage;
