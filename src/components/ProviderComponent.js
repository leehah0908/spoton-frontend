import { Box, Divider, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaGift } from 'react-icons/fa6';

const ProviderComponent = ({ providerEmail, isProvider, setIsProvider, nanumId, setNanumId }) => {
    const [providerData, setProviderData] = useState(null);
    const [providerGrade, setProviderGrade] = useState('');

    useEffect(() => {
        if (isProvider === true) {
            const loadProvider = async () => {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/provider`, {
                    params: {
                        email: providerEmail,
                    },
                });
                setProviderData(res.data.result);
            };
            loadProvider();
        }
    }, [isProvider]);

    useEffect(() => {
        if (providerData) {
            const grade = trustGrade(providerData.reportCount);
            setProviderGrade(grade);
        }
    }, [providerData]);

    const changeDetail = (id) => {
        if (id === nanumId) {
            setIsProvider(false);
        } else {
            setNanumId(id);
            setIsProvider(false);
        }
    };

    // 신뢰 등급 계산 함수
    const trustGrade = (reportCount) => {
        // if (reportRate <= 3) return 'MVP';
        // if (reportRate <= 7) return 'All-Star';
        // if (reportRate <= 15) return 'Pro Player';
        if (reportCount <= 21) return 'Player';
        if (reportCount <= 51) return 'Amateur';
        if (reportCount <= 81) return 'Rookie';
        return 'Benchwarmer';
    };

    return (
        <Box sx={{ p: 5, pt: 0 }}>
            {providerData && (
                <Box>
                    {/* 프로필 */}
                    <Box display='flex' flexDirection='row' alignItems='center'>
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '20%',
                                overflow: 'hidden',
                                marginRight: 2,
                            }}
                        >
                            <img
                                src={providerData.profile || 'default_profile.png'}
                                alt='프로필 사진'
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>

                        <Box display='flex' flexDirection='column'>
                            <Typography sx={{ fontSize: 25 }}>{providerData.nickname}</Typography>

                            <Typography sx={{ fontSize: 18 }}>
                                {providerData.createTime.substr(0, 10).replace(/-/g, '/')} 가입
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* 거래 정보 */}
                    <Box display='flex' flexDirection='row' gap={8} sx={{ pl: 2 }}>
                        <Box display='flex' flexDirection='column' alignItems='center'>
                            <Typography sx={{ fontSize: 20 }}>거래내역</Typography>
                            <Typography sx={{ fontSize: 17 }}>{providerData.nanumList.length}</Typography>
                        </Box>

                        <Box display='flex' flexDirection='column' alignItems='center'>
                            <Typography sx={{ fontSize: 20 }}>신뢰 등급</Typography>
                            <Typography sx={{ fontSize: 17 }}>{providerGrade}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* 나눔 내역 */}
                    <Box gap={2} display='flex' flexDirection='row' flexWrap='wrap' sx={{ mt: 3 }}>
                        {providerData.nanumList.map((nanum) => (
                            <Box
                                key={nanum.nanumId}
                                onClick={() => changeDetail(nanum.nanumId)}
                                display='flex'
                                flexDirection='column'
                                sx={{
                                    cursor: 'pointer',
                                    minWidth: '25.1%',
                                    maxWidth: '25.1%',
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                    p: 2,
                                }}
                            >
                                <Box
                                    alignContent='center'
                                    sx={{
                                        mb: 1,
                                        width: '100%',
                                        position: 'relative',
                                        paddingBottom: '100%',
                                    }}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_NANUM_IMAGE_URL}/${encodeURIComponent(nanum.imagePath[0].normalize('NFD'))}`}
                                        width='100%'
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: 10,
                                        }}
                                    />
                                </Box>

                                <Box justifyItems='left' sx={{ width: '100%' }}>
                                    <Typography
                                        sx={{
                                            textAlign: 'left',
                                            width: '95%',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {nanum.subject}
                                    </Typography>

                                    <Box sx={{ mt: 1 }}>
                                        {/* 제공 수량 */}
                                        <Typography sx={{ fontSize: 13 }}>
                                            <FaGift size={12} style={{ marginRight: '4px' }} color='red' />
                                            {nanum.quantity}개 나눔
                                        </Typography>

                                        <Typography sx={{ fontSize: 13 }}>
                                            ({nanum.giveMethod === 'direct' ? '직접 수령' : '택배 수령'})
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ProviderComponent;
