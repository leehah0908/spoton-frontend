import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Button, Container } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const DateList = ({ selectedDate, setSelectedDate }) => {
    const today = new Date();

    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentDay, setCurrentDay] = useState(today.getDay());
    const [allDays, setAllDays] = useState([]);

    // 년, 월이 바뀔 때마다 마지막날 계산
    useEffect(() => {
        // 마지막날 계산
        const endDay = new Date(currentYear, currentMonth + 1, 0).getDate();

        // 일 배열 만들기
        const dayArray = Array.from({ length: endDay }, (_, i) => i + 1);
        setAllDays(dayArray);
    }, [currentYear, currentMonth]);

    // 이전 화살표 누르면 이전 달로 이동
    const handlePreviousMonth = () => {
        setCurrentDay(1);
        setCurrentMonth((prevMonth) => {
            if (prevMonth === 0) {
                setCurrentYear((prevYear) => prevYear - 1);
                return 11;
            }
            return prevMonth - 1;
        });
    };

    // 다음 화살표 누르면 다음 달로 이동
    const handleNextMonth = () => {
        setCurrentDay(1);
        setCurrentMonth((prevMonth) => {
            if (prevMonth === 11) {
                setCurrentYear((prevYear) => prevYear + 1);
                return 0;
            }
            return prevMonth + 1;
        });
    };

    return (
        <Container maxWidth='md'>
            {/* 연도, 월 선택 */}
            <Box display='flex' alignItems='center' justifyContent='center' gap={3} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                <IconButton onClick={handlePreviousMonth}>
                    <ArrowBackIosIcon />
                </IconButton>

                <Typography variant='h6' sx={{ letterSpacing: '0.1em' }}>
                    {`${currentYear}.${String(currentMonth + 1).padStart(2, '0')}`}
                </Typography>

                <IconButton onClick={handleNextMonth}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            {/* 일 선택 */}
            <Box display='flex' flexDirection='row' alignItems='center' gap={2}>
                <IconButton onClick={() => setCurrentDay((prev) => Math.max(prev - 1, 1))} disabled={currentDay <= 1}>
                    <ArrowBackIosIcon />
                </IconButton>

                <Box gap={1} sx={{ display: 'flex', overflow: 'hidden', mt: 1, mb: 1 }}>
                    {allDays.map((day) => (
                        <Button
                            key={day}
                            variant={currentDay === day ? 'contained' : 'outlined'}
                            onClick={() => setCurrentDay(day)}
                            sx={{
                                border: 'none',
                                minWidth: '35px',
                                minHeight: '35px',
                                width: '35px',
                                height: '35px',
                                bgcolor: currentDay === day ? '#0d41e1' : 'transparent',
                                color: currentDay === day ? 'white' : 'black',
                                fontSize: '15px',
                            }}
                        >
                            {day}
                        </Button>
                    ))}
                </Box>

                <IconButton
                    onClick={() => setCurrentDay((prev) => Math.min(prev + 1, allDays.length))}
                    disabled={currentDay >= allDays[allDays.length - 1]}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
            {currentDay}
        </Container>
    );
};

export default DateList;
