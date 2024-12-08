import React, { useEffect, useState, useRef } from 'react';
import { Box, IconButton, Typography, Button, Container } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const DateList = ({ selectedYear, selectedMonth, setSelectedYear, setSelectedMonth, selectedDay, setSelectedDay }) => {
    const scrollRef = useRef(null);

    const [allDays, setAllDays] = useState([]);

    // selectedDay가 바뀔 때 버튼 스크롤 중앙으로 이동
    useEffect(() => {
        if (scrollRef.current) {
            const selectedButton = scrollRef.current.querySelector(`[data-day='${selectedDay}']`);
            if (selectedButton) {
                selectedButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            }
        }
    }, [selectedDay]);

    // 년, 월이 바뀔 때마다 마지막날 계산
    useEffect(() => {
        // 마지막날 계산
        const endDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();

        // 일 배열 만들기
        const dayArray = Array.from({ length: endDay }, (_, i) => i + 1);
        setAllDays(dayArray);
    }, [selectedYear, selectedMonth]);

    // 이전 화살표 누르면 이전 달로 이동
    const handlePreviousMonth = () => {
        setSelectedDay(1);
        setSelectedMonth((prevMonth) => {
            if (prevMonth === 0) {
                setSelectedYear((prevYear) => prevYear - 1);
                return 11;
            }
            return prevMonth - 1;
        });
    };

    // 다음 화살표 누르면 다음 달로 이동
    const handleNextMonth = () => {
        setSelectedDay(1);
        setSelectedMonth((prevMonth) => {
            if (prevMonth === 11) {
                setSelectedYear((prevYear) => prevYear + 1);
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
                    {`${selectedYear}.${String(selectedMonth + 1).padStart(2, '0')}`}
                </Typography>

                <IconButton onClick={handleNextMonth}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            {/* 일 선택 */}
            <Box
                ref={scrollRef}
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    gap: 1,
                    mt: 1,
                    mb: 1,
                }}
            >
                <IconButton onClick={() => setSelectedDay((prev) => Math.max(prev - 1, 1))} disabled={selectedDay <= 1}>
                    <ArrowBackIosIcon />
                </IconButton>

                <Box gap={1} sx={{ display: 'flex', overflow: 'hidden', mt: 1, mb: 1 }}>
                    {allDays.map((day) => (
                        <Button
                            key={day}
                            data-day={day}
                            variant={selectedDay === day ? 'contained' : 'outlined'}
                            onClick={() => setSelectedDay(day)}
                            sx={{
                                border: 'none',
                                minWidth: '35px',
                                minHeight: '35px',
                                width: '35px',
                                height: '35px',
                                bgcolor: selectedDay === day ? '#0d41e1' : 'transparent',
                                color: selectedDay === day ? 'white' : 'black',
                                fontSize: '15px',
                                scrollSnapAlign: 'center',
                            }}
                        >
                            {day}
                        </Button>
                    ))}
                </Box>

                <IconButton
                    onClick={() => setSelectedDay((prev) => Math.min(prev + 1, allDays.length))}
                    disabled={selectedDay >= allDays[allDays.length - 1]}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Container>
    );
};

export default DateList;
