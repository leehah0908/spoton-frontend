import React, { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    Select,
    MenuItem,
} from '@mui/material';
import { FaCamera } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import Swal from 'sweetalert2';
import axiosInstance from '../../configs/axios-config';

const WriteNanumModal = ({ open, onClose, setWriteModalOpen, reRequestNanumData }) => {
    const $fileTag = useRef();

    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sports, setSports] = useState('');
    const [quantity, setQuantity] = useState('');
    const [giveMethod, setGiveMethod] = useState('');
    const [imagePaths, setImagePaths] = useState([]);

    useEffect(() => {
        setSubject('');
        setContent('');
        setSports('');
        setQuantity('');
        setGiveMethod('');
        setImagePaths([]);
    }, [open]);

    // 업로드 사진 세팅
    const handleFileChange = async (event) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);

            if (selectedFiles.length + imagePaths.length > 10) {
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
            setImagePaths((prevFiles) => [...prevFiles, ...selectedFiles]);
        }
    };

    // 업로드 사진 삭제
    const handleRemoveFile = (index) => {
        setImagePaths((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // 제목 여부
        if (subject === '') {
            await Swal.fire({
                width: '20rem',
                text: '제목을 입력해주세요.',
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

        // 내용 여부
        if (content === '') {
            await Swal.fire({
                width: '20rem',
                text: '내용을 입력해주세요.',
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

        // 카테고리 여부
        if (sports === '') {
            await Swal.fire({
                width: '20rem',
                text: '스포츠 카테고리를 정해주세요.',
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

        // 수량 여부
        if (quantity === '' || !/^\d*$/.test(quantity)) {
            await Swal.fire({
                width: '20rem',
                text: '수량를 확인해주세요.',
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

        // 수령 방법 여부
        if (giveMethod === '') {
            await Swal.fire({
                width: '20rem',
                text: '수령 방법을 입력해주세요.',
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

        // 사진 갯수
        if (imagePaths.length === 0) {
            await Swal.fire({
                width: '20rem',
                text: '최소 1개 이미지를 제공해야 합니다.',
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

        const jsonData = {
            subject,
            content,
            sports,
            quantity,
            giveMethod,
        };

        // FormData에 파일 추가
        const formData = new FormData();

        imagePaths.forEach((file) => {
            formData.append('imagePaths', file);
        });
        formData.append('dto', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

        const res = await axiosInstance.post('/nanum/create', formData);

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

        setWriteModalOpen(false);
        reRequestNanumData();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
            <DialogTitle sx={{ textAlign: 'center' }}>나눔하기</DialogTitle>

            <DialogContent>
                <Box>
                    {/* 카테고리 선택 */}
                    <Box display='flex' flexDirection='row'>
                        <Select
                            value={sports}
                            onChange={(e) => setSports(e.target.value)}
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
                            value={giveMethod}
                            onChange={(e) => setGiveMethod(e.target.value)}
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
                            type='number'
                            placeholder='수량 입력'
                            variant='standard'
                            onChange={(e) => setQuantity(e.target.value)}
                            sx={{ width: 75, ml: 1 }}
                        />
                    </Box>

                    {/* 사진 업로드 버튼 */}
                    <Box alignItems='center' gap={1} sx={{ display: 'flex', overflowX: 'auto', flexWrap: 'nowrap', p: 1, my: 1 }}>
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
                                <Box display='flex' flexDirection='column' alignItems='center' sx={{ cursor: 'pointer' }}>
                                    <FaCamera />
                                    <Typography>{`${imagePaths.length}/10`}</Typography>
                                </Box>
                            </label>
                        </Box>

                        {/* 선택된 이미지 미리 보기 */}
                        {imagePaths.map((file, index) => (
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
                                    onClick={() => handleRemoveFile(index)}
                                    sx={{ position: 'absolute', top: -5, right: -20 }}
                                >
                                    <MdCancel size={20} color='red' />
                                </Button>
                            </Box>
                        ))}
                    </Box>

                    {/* 제목 입력 */}
                    <TextField
                        fullWidth
                        placeholder='제목'
                        variant='standard'
                        sx={{ mb: 2, mt: 1 }}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    {/* 내용 입력 */}
                    <TextField
                        fullWidth
                        placeholder='내용을 입력하세요.'
                        multiline
                        rows={10}
                        variant='standard'
                        InputProps={{
                            disableUnderline: true,
                        }}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            fontSize: '0.8rem',
                            color: '#aaa',
                            lineHeight: 1.5,
                        }}
                    >
                        주소, 전화번호, SNS 계정 등 개인정보 입력은 제한될 수 있습니다.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant='contained' sx={{ color: 'white', bgcolor: 'red' }}>
                    취소
                </Button>

                <Button onClick={handleSubmit} variant='contained' sx={{ color: 'white', bgcolor: '#0d41e1' }}>
                    제출
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WriteNanumModal;
