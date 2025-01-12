import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Typography,
    Box,
    Divider,
    IconButton,
    TextField,
    MenuItem,
    Select,
} from '@mui/material';
import { IoClose, IoChatboxEllipses } from 'react-icons/io5';
import { PiSirenFill } from 'react-icons/pi';
import { FaPen, FaCamera, FaEye, FaHeart, FaRegHeart } from 'react-icons/fa';
import axiosInstance from '../../configs/axios-config';
import axios from 'axios';
import AuthContext from '../../contexts/UserContext';
import { MdCancel, MdDeleteForever, MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import Swal from 'sweetalert2';
import NanumReportModal from './NanumReportModal';
import ProviderComponent from '../ProviderComponent';
import { useNavigate } from 'react-router-dom';

const NanumDetail = ({ open, onClose, setDetailModalOpen, nanumId, setNanumId, reRequestNanumData }) => {
    const navigate = useNavigate();

    const { isLoggedIn, userEmail } = useContext(AuthContext);
    const $fileTag = useRef();

    const [nanumData, setNanumData] = useState(null);
    const [isNanumLike, setIsNanumLike] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageHovered, setIsImageHovered] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editedSubject, setEditedSubject] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedSports, setEditedSports] = useState('');
    const [editedQuantity, setEditedQuantity] = useState('');
    const [editedGiveMethod, setEditedGiveMethod] = useState('');
    const [editedImagePaths, setEditedImagePaths] = useState([]);
    const [nanumImage, setNanumImage] = useState([]);

    const [nanumReportOpen, setNanumReportOpen] = useState(false);

    const [isProvider, setIsProvider] = useState(false);

    // 경로로 받은 이미지를 File 형태로 변환
    const onvertImagesToFileList = async (imagePaths) => {
        const fileList = [];

        for (const imagePath of imagePaths) {
            const allPath = `${process.env.REACT_APP_NANUM_IMAGE_URL}/${imagePath}`;
            console.log('allPath', allPath);
            const file = await fetchImageAsFile(allPath, imagePath);
            if (file) {
                fileList.push(file);
            }
        }
        setNanumImage(fileList);
    };

    // 이미지 경로를 File로 변환
    const fetchImageAsFile = async (imageUrl, fileName) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return new File([blob], fileName, { type: blob.type });
        } catch (e) {
            console.error('이미지 변환 실패');
            return null;
        }
    };

    useEffect(() => {
        if (open === true) {
            setIsEditing(false);
            setEditedSubject('');
            setEditedContent('');
            setEditedSports('');
            setEditedQuantity('');
            setEditedGiveMethod('');
            setEditedImagePaths([]);
            setCurrentImageIndex(0);
            setIsProvider(false);

            loadNanumDetail();
        }
    }, [open, nanumId]);

    const loadNanumDetail = async () => {
        try {
            const [detailRes, nanumLikeListRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BASE_URL}/nanum/detail`, {
                    params: {
                        nanumId,
                    },
                }),

                axios.get(`${process.env.REACT_APP_BASE_URL}/nanum/like_list`, {
                    params: {
                        nanumId,
                    },
                }),
            ]);

            setNanumData(detailRes.data.result);

            const nanumLikeList = nanumLikeListRes.data.result;
            setIsNanumLike(nanumLikeList.includes(userEmail));

            // 경로로 받은 이미지를 File 형태로 변환
            onvertImagesToFileList(detailRes.data.result.imagePath);
        } catch (e) {
            console.log('데이터 로드 실패', e);
        }
    };

    // 수정 화면 세팅
    const handleEditToggle = () => {
        setIsEditing(true);
        setEditedSubject(nanumData.subject);
        setEditedContent(nanumData.content);
        setEditedSports(nanumData.sports);
        setEditedQuantity(nanumData.quantity);
        setEditedGiveMethod(nanumData.giveMethod);
        setEditedImagePaths(nanumImage);
    };

    // 나눔글 좋아요
    const handleLike = async () => {
        if (!isLoggedIn) {
            await Swal.fire({
                width: '20rem',
                text: '좋아요는 로그인 후 이용가능힙니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    const popup = document.querySelector('.swal2-container');
                    if (popup) {
                        popup.style.fontFamily = '"Do Hyeon", sans-serif';
                        document.body.appendChild(popup);
                        popup.style.zIndex = '2001';
                    }
                },
            });
            return;
        }

        // 좋아요 누르기 및 취소
        try {
            await axiosInstance.post(
                '/nanum/like',
                {},
                {
                    params: {
                        nanumId: nanumData.nanumId,
                    },
                },
            );

            loadNanumDetail();
        } catch (e) {
            console.log(e);
        }
    };

    // 게시물 삭제
    const handleRemove = async () => {
        const result = await Swal.fire({
            width: '20rem',
            html: '정말로 삭제하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            confirmButtonColor: '#AAAAAA',
            cancelButtonColor: '#0d41e1',
            customClass: {
                popup: 'custom-swal-popup',
            },
            didOpen: () => {
                const popup = document.querySelector('.swal2-container');
                if (popup) {
                    popup.style.fontFamily = '"Do Hyeon", sans-serif';
                    document.body.appendChild(popup);
                    popup.style.zIndex = '2001';
                }
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const res = await axiosInstance.post(
                '/nanum/delete',
                {},
                {
                    params: {
                        nanumId: nanumData.nanumId,
                    },
                },
            );

            await Swal.fire({
                width: '20rem',
                text: res.data.statusMessage,
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    const popup = document.querySelector('.swal2-container');
                    if (popup) {
                        popup.style.fontFamily = '"Do Hyeon", sans-serif';
                        document.body.appendChild(popup);
                        popup.style.zIndex = '2001';
                    }
                },
            });

            setDetailModalOpen(false);
            reRequestNanumData();
        } catch (e) {
            console.log(e);
        }
    };

    // 업로드 사진 세팅
    const handleFileChange = async (event) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            if (selectedFiles.length + editedImagePaths.length > 10) {
                await Swal.fire({
                    width: '20rem',
                    text: '최대 10개의 이미지만 업로드할 수 있습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#0d41e1',
                    customClass: {
                        popup: 'custom-swal-popup',
                    },
                    didOpen: () => {
                        const popup = document.querySelector('.swal2-container');
                        if (popup) {
                            popup.style.fontFamily = '"Do Hyeon", sans-serif';
                            document.body.appendChild(popup);
                            popup.style.zIndex = '2001';
                        }
                    },
                });
                return;
            }
            setEditedImagePaths((prevFiles) => [...prevFiles, ...selectedFiles]);
        }
    };

    // 업로드 사진 삭제
    const handleRemoveFile = (file, index) => {
        setEditedImagePaths((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    // 게시물 수정
    const handleUpdate = async () => {
        if (editedImagePaths.length === 0) {
            await Swal.fire({
                width: '20rem',
                text: '최소 1개의 이미지가 필요합니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    const popup = document.querySelector('.swal2-container');
                    if (popup) {
                        popup.style.fontFamily = '"Do Hyeon", sans-serif';
                        document.body.appendChild(popup);
                        popup.style.zIndex = '2001';
                    }
                },
            });
            return;
        }

        const result = await Swal.fire({
            width: '20rem',
            html: '수정하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            confirmButtonColor: '#0d41e1',
            cancelButtonColor: '#AAAAAA',
            customClass: {
                popup: 'custom-swal-popup',
            },
            didOpen: () => {
                const popup = document.querySelector('.swal2-container');
                if (popup) {
                    popup.style.fontFamily = '"Do Hyeon", sans-serif';
                    document.body.appendChild(popup);
                    popup.style.zIndex = '2001';
                }
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        const jsonData = {
            nanumId,
            subject: editedSubject,
            content: editedContent,
            sports: editedSports,
            quantity: editedQuantity,
            giveMethod: editedGiveMethod,
        };

        // FormData에 파일 추가
        const formData = new FormData();

        editedImagePaths.forEach((file) => {
            formData.append('imagePaths', file);
        });
        formData.append('dto', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

        try {
            const res = await axiosInstance.patch('/nanum/modify', formData);

            await Swal.fire({
                width: '20rem',
                text: res.data.statusMessage,
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    const popup = document.querySelector('.swal2-container');
                    if (popup) {
                        popup.style.fontFamily = '"Do Hyeon", sans-serif';
                        document.body.appendChild(popup);
                        popup.style.zIndex = '2001';
                    }
                },
            });

            setIsEditing(false);
            loadNanumDetail();
        } catch (e) {
            console.error(e);
        }
    };

    // 수정 취소
    const handleCloseUpdateModal = async () => {
        const result = await Swal.fire({
            width: '20rem',
            html: '작성된 내용이 사라집니다. <br> 그래도 취소하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            confirmButtonColor: '#AAAAAA',
            cancelButtonColor: '#0d41e1',
            customClass: {
                popup: 'custom-swal-popup',
            },
            didOpen: () => {
                const popup = document.querySelector('.swal2-container');
                if (popup) {
                    popup.style.fontFamily = '"Do Hyeon", sans-serif';
                    document.body.appendChild(popup);
                    popup.style.zIndex = '2001';
                }
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        setDetailModalOpen(false);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? nanumData.imagePath.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === nanumData.imagePath.length - 1 ? 0 : prevIndex + 1));
    };

    const handleChat = async () => {
        if (!isLoggedIn) {
            await Swal.fire({
                width: '20rem',
                text: '로그인 후 채팅이 가능힙니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#0d41e1',
                customClass: {
                    popup: 'custom-swal-popup',
                },
                didOpen: () => {
                    const popup = document.querySelector('.swal2-container');
                    if (popup) {
                        popup.style.fontFamily = '"Do Hyeon", sans-serif';
                        document.body.appendChild(popup);
                        popup.style.zIndex = '2001';
                    }
                },
            });
            return;
        }

        // 좋아요 누르기 및 취소
        try {
            await axiosInstance.post(
                '/nanum/like',
                {},
                {
                    params: {
                        nanumId: nanumData.nanumId,
                    },
                },
            );
        } catch (e) {
            console.log(e);
        }

        try {
            const res = await axiosInstance.post('/chat/nanum_chat/room_create', {
                providerEmail: nanumData.email,
                receiverEmail: userEmail,
                nanumId,
            });

            onClose();
            navigate('/chat', { state: { chatRoom: res.data.result } });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Box maxWidth='xs'>
            {nanumData && (
                <Dialog open={open} onClose={!isEditing ? onClose : handleCloseUpdateModal} fullWidth maxWidth='sm'>
                    {/* 상단 제목 및 닫기 버튼 */}
                    <DialogTitle
                        sx={{
                            p: 0,
                            minHeight: 40,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pb: 2,
                        }}
                    >
                        {isProvider ? (
                            <MdNavigateBefore
                                size={30}
                                onClick={() => setIsProvider(false)}
                                style={{ marginLeft: 20, marginTop: 20, cursor: 'pointer' }}
                            ></MdNavigateBefore>
                        ) : (
                            <Box></Box>
                        )}

                        <IoClose
                            color='red'
                            onClick={!isEditing ? onClose : handleCloseUpdateModal}
                            style={{ marginRight: 20, marginTop: 20, cursor: 'pointer' }}
                        />
                    </DialogTitle>

                    {isProvider ? (
                        <ProviderComponent
                            providerEmail={nanumData.email}
                            isProvider={isProvider}
                            setIsProvider={setIsProvider}
                            nanumId={nanumId}
                            setNanumId={setNanumId}
                        />
                    ) : !isEditing ? (
                        <>
                            <DialogContent sx={{ p: 0 }}>
                                {/* 굿즈 이미지 */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        aspectRatio: '1 / 1',
                                    }}
                                    onMouseEnter={() => setIsImageHovered(true)}
                                    onMouseLeave={() => setIsImageHovered(false)}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_NANUM_IMAGE_URL}/${encodeURIComponent(nanumData.imagePath[currentImageIndex].normalize('NFD'))}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            color: 'white',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {`${currentImageIndex + 1} / ${nanumData.imagePath.length}`}
                                    </Box>

                                    {isImageHovered && (
                                        <Box>
                                            {/* 이전 화살표 */}
                                            <IconButton
                                                onClick={handlePrevImage}
                                                sx={{
                                                    position: 'absolute',
                                                    left: '10px',
                                                    top: '50%',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    color: 'white',
                                                }}
                                            >
                                                <MdNavigateBefore />
                                            </IconButton>

                                            {/* 다음 화살표 */}
                                            <IconButton
                                                onClick={handleNextImage}
                                                sx={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    color: 'white',
                                                }}
                                            >
                                                <MdNavigateNext />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>

                                <Box display='flex' flexDirection='column' sx={{ m: 2, mb: 0 }}>
                                    <Box display='flex' flexDirection='row'>
                                        {/* 프로필 이미지 */}
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '20%',
                                                overflow: 'hidden',
                                                marginRight: 2,
                                            }}
                                        >
                                            <img
                                                src={nanumData.profile || 'default_profile.png'}
                                                alt='프로필 사진'
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </Box>

                                        {/* 프로필 정보 */}
                                        <Box display='flex' flexDirection='column' sx={{ flexGrow: 1 }}>
                                            <Typography variant='body2' sx={{}}>
                                                {nanumData.nickname}
                                            </Typography>

                                            <Typography variant='body2'>
                                                {nanumData.createTime.substr(0, 10).replace(/-/g, '/')}{' '}
                                                {nanumData.createTime.substr(11, 5)}
                                            </Typography>
                                        </Box>

                                        <Button
                                            onClick={() => setIsProvider(true)}
                                            sx={{ fontSize: 15, bgcolor: '#0d41e1', color: 'white', mr: 1 }}
                                        >
                                            판매자 정보 보기
                                        </Button>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {/* 상품 정보 */}
                                    <Box display='flex' sx={{ pr: 1 }}>
                                        <Box display='flex' flexDirection='column'>
                                            <Typography sx={{ fontSize: 18 }}>{nanumData.subject}</Typography>
                                            <Typography sx={{ fontSize: 15, mt: 2, whiteSpace: 'pre-line' }}>
                                                {nanumData.content}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* 날짜 및 글 Count */}
                                    <Box display='flex' flexDirection='row' gap={1} sx={{ ml: 0.5, mt: 2 }}>
                                        <Typography sx={{ fontSize: 15 }}>
                                            <FaEye size={12} style={{ marginRight: '5px' }} />
                                            {nanumData.viewCount}
                                        </Typography>

                                        <Typography sx={{ fontSize: 15 }}>
                                            <FaHeart size={12} style={{ marginRight: '5px' }} />
                                            {nanumData.likeCount}
                                        </Typography>

                                        <Typography sx={{ fontSize: 15 }}>
                                            <IoChatboxEllipses size={12} style={{ marginRight: '5px' }} />
                                            {nanumData.chatCount}
                                        </Typography>
                                    </Box>
                                </Box>

                                {isLoggedIn && (
                                    <Box display='flex' justifyContent='right' sx={{ mr: 4, mb: 2 }}>
                                        {/* 수정하기 */}
                                        {nanumData.status !== '나눔 종료' && userEmail === nanumData.email && (
                                            <IconButton
                                                onClick={handleEditToggle}
                                                style={{ padding: '0' }}
                                                sx={{
                                                    '&:hover': { backgroundColor: 'transparent' },
                                                    '&:active': { transform: 'none' },
                                                }}
                                            >
                                                <FaPen size={15} color='gray' style={{ marginRight: 5 }} />
                                                <Typography>글 수정</Typography>
                                            </IconButton>
                                        )}
                                        {/* 삭제하기 */}
                                        {userEmail === nanumData.email && (
                                            <IconButton
                                                onClick={handleRemove}
                                                style={{ padding: '0', marginLeft: '12px' }}
                                                sx={{
                                                    '&:hover': { backgroundColor: 'transparent' },
                                                    '&:active': { transform: 'none' },
                                                }}
                                            >
                                                <MdDeleteForever size={20} color='red' style={{ marginRight: 3 }} />
                                                <Typography sx={{ color: 'red' }}>글 삭제</Typography>
                                            </IconButton>
                                        )}
                                        {/* 신고하기 */}
                                        {userEmail !== nanumData.email && (
                                            <Box>
                                                <IconButton
                                                    onClick={() => setNanumReportOpen(true)}
                                                    style={{ padding: '0' }}
                                                    sx={{
                                                        '&:hover': { backgroundColor: 'transparent' },
                                                        '&:active': { transform: 'none' },
                                                    }}
                                                >
                                                    <PiSirenFill size={20} color='red' style={{ marginRight: 3 }} />
                                                    <Typography sx={{ color: 'red' }}>신고하기</Typography>
                                                </IconButton>

                                                <NanumReportModal
                                                    open={nanumReportOpen}
                                                    onClose={() => setNanumReportOpen(false)}
                                                    nanumId={nanumData.nanumId}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </DialogContent>

                            <DialogContent sx={{ height: 60, p: 1.5, borderTop: '2px solid gray' }}>
                                <Box display='flex' flexDirection='row' alignItems='center' height='100%'>
                                    {/* 찜하기 */}
                                    <Box display='flex' alignItems='center' sx={{ cursor: 'pointer', ml: 1, mr: 2 }}>
                                        {isNanumLike ? (
                                            <FaHeart onClick={handleLike} color='red' size={20} />
                                        ) : (
                                            <FaRegHeart onClick={handleLike} color='red' size={20} />
                                        )}
                                    </Box>

                                    <Box sx={{ borderLeft: '1px solid gray', pl: 2 }}>
                                        <Typography sx={{ fontSize: 18 }}>
                                            {nanumData.status === '나눔 종료' && (
                                                <span style={{ color: 'red' }}>[{nanumData.status}]</span>
                                            )}{' '}
                                            {nanumData.quantity}개 나눔
                                        </Typography>
                                        <Typography sx={{ fontSize: 15 }}>
                                            ({nanumData.giveMethod === 'direct' ? '직접 수령' : '택배 수령'})
                                        </Typography>
                                    </Box>

                                    <Box sx={{ flexGrow: 1 }} />

                                    {userEmail !== nanumData.email && (
                                        <Box display='flex' alignItems='center'>
                                            <Button
                                                onClick={handleChat}
                                                sx={{
                                                    color: 'white',
                                                    px: 2,
                                                    mr: 1,
                                                    fontSize: 18,
                                                    height: 40,
                                                    bgcolor: '#0d41e1',
                                                }}
                                            >
                                                채팅하기
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </DialogContent>
                        </>
                    ) : (
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box>
                                    {/* 카테고리 선택 */}
                                    <Box display='flex' flexDirection='row'>
                                        <Select
                                            value={editedSports}
                                            onChange={(e) => setEditedSports(e.target.value)}
                                            displayEmpty
                                            sx={{
                                                height: 30,
                                                color: '#0d41e1',
                                                fontSize: '0.9rem',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none',
                                                },
                                                '& .MuiSelect-select': {
                                                    paddingLeft: 0,
                                                },
                                            }}
                                        >
                                            <MenuItem value='' disabled>
                                                스포츠 카테고리
                                            </MenuItem>
                                            <MenuItem value='baseball'>야구</MenuItem>
                                            <MenuItem value='soccer'>축구</MenuItem>
                                            <MenuItem value='basketball'>농구</MenuItem>
                                            <MenuItem value='volleyball'>배구</MenuItem>
                                            <MenuItem value='esports'>E-스포츠</MenuItem>
                                        </Select>

                                        <Select
                                            value={editedGiveMethod}
                                            onChange={(e) => setEditedGiveMethod(e.target.value)}
                                            displayEmpty
                                            sx={{
                                                height: 30,
                                                color: '#0d41e1',
                                                fontSize: '0.9rem',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none',
                                                },
                                                '& .MuiSelect-select': {
                                                    paddingLeft: 0,
                                                },
                                                ml: 1,
                                            }}
                                        >
                                            <MenuItem value='' disabled>
                                                수령 방법
                                            </MenuItem>
                                            <MenuItem value='direct'>직접 수령</MenuItem>
                                            <MenuItem value='delivery'>택배</MenuItem>
                                        </Select>

                                        <Typography alignContent='center' sx={{ ml: 1, fontSize: 15 }}>
                                            수량 :{' '}
                                        </Typography>

                                        <TextField
                                            value={editedQuantity}
                                            type='number'
                                            placeholder='수량 입력'
                                            variant='standard'
                                            onChange={(e) => setEditedQuantity(e.target.value)}
                                            sx={{ width: 75, ml: 1 }}
                                        />
                                    </Box>

                                    {/* 사진 업로드 버튼 */}
                                    <Box
                                        alignItems='center'
                                        gap={1}
                                        sx={{ display: 'flex', overflowX: 'auto', flexWrap: 'nowrap', p: 1, my: 1 }}
                                    >
                                        <Box
                                            display='flex'
                                            justifyContent='center'
                                            alignItems='center'
                                            onClick={() => $fileTag.current.click()}
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                border: '2px dashed #aaa',
                                                borderRadius: 3,
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <input
                                                accept='image/*'
                                                multiple
                                                type='file'
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                                ref={$fileTag}
                                            />
                                            <label>
                                                <Box
                                                    display='flex'
                                                    flexDirection='column'
                                                    alignItems='center'
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <FaCamera />
                                                    <Typography>{`${editedImagePaths.length}/10`}</Typography>
                                                </Box>
                                            </label>
                                        </Box>

                                        {/* 선택된 이미지 미리 보기 */}
                                        {editedImagePaths.map((file, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    position: 'relative',
                                                    width: 70,
                                                    height: 70,
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    border: '1px solid #ddd',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <img
                                                    // src={`/nanum_img/${file}`}
                                                    src={URL.createObjectURL(file)}
                                                    alt={`preview-${index}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                {/* 삭제 버튼 */}
                                                <Button
                                                    onClick={() => handleRemoveFile(file, index)}
                                                    sx={{ position: 'absolute', top: -5, right: -20 }}
                                                >
                                                    <MdCancel size={20} color='red' />
                                                </Button>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* 제목 입력 */}
                                    <TextField
                                        value={editedSubject}
                                        onChange={(e) => setEditedSubject(e.target.value)}
                                        fullWidth
                                        variant='standard'
                                        sx={{ mb: 2, mt: 1 }}
                                    />

                                    {/* 내용 입력 */}
                                    <TextField
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={10}
                                        variant='standard'
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* 수정 모드 버튼 */}
                            <Box display='flex' justifyContent='flex-end' mt={2}>
                                <Button variant='contained' sx={{ bgcolor: '#0d41e1', mr: 1 }} onClick={handleUpdate}>
                                    저장
                                </Button>

                                <Button
                                    variant='contained'
                                    sx={{ color: 'white', bgcolor: 'red' }}
                                    onClick={!isEditing ? onClose : handleCloseUpdateModal}
                                >
                                    취소
                                </Button>
                            </Box>
                        </DialogContent>
                    )}
                </Dialog>
            )}
        </Box>
    );
};

export default NanumDetail;
