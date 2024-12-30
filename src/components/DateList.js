import React, { useEffect, useState, useRef } from 'react';
import { Box, IconButton, Typography, Button, Container } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import koLocale from 'date-fns/locale/ko';

const DateList = ({ gameList, selectedYear, selectedMonth, setSelectedYear, setSelectedMonth, selectedDay, setSelectedDay }) => {
    const scrollRef = useRef(null);

    const [allDays, setAllDays] = useState([]);
    const [openPicker, setOpenPicker] = useState(false);

    const handleDateChange = (date) => {
        setSelectedYear(date.getFullYear());
        setSelectedMonth(date.getMonth());
        setOpenPicker(false);
    };

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

    // 해당 날짜에 경기가 있는지 확인하는 함수
    const hasGamesOnDate = (day) => {
        return Object.values(gameList).some((game) => new Date(game.gameDate).getDate() === day);
    };

    return (
        <Container maxWidth='lg'>
            {/* 연도, 월 선택 */}
            <Box display='flex' alignItems='center' justifyContent='center' gap={2} sx={{ position: 'relative' }}>
                <IconButton onClick={handlePreviousMonth}>
                    <ArrowBackIosIcon />
                </IconButton>

                <Typography variant='h6' sx={{ letterSpacing: '0.1em' }}>
                    {`${selectedYear}.${String(selectedMonth + 1).padStart(2, '0')}`}
                </Typography>

                <IconButton onClick={handleNextMonth}>
                    <ArrowForwardIosIcon />
                </IconButton>

                <IconButton
                    onClick={() => setOpenPicker(!openPicker)}
                    sx={{
                        pl: 0,
                        color: 'black',
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    <CalendarIcon />
                </IconButton>

                {/* 달력 팝업 */}
                {openPicker && (
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={koLocale}>
                        <Box
                            sx={{
                                position: 'absolute',
                                zIndex: 1000,
                                top: '100%',
                                rleft: '50%',
                                mt: 1,
                            }}
                        >
                            <StaticDatePicker
                                displayStaticWrapperAs='desktop'
                                openTo='month'
                                views={['year', 'month']}
                                value={new Date(selectedYear, selectedMonth)}
                                onChange={handleDateChange}
                                minDate={new Date(2008, 0, 1)}
                                maxDate={new Date(2025, 11, 31)}
                                sx={{
                                    border: '1px solid',
                                    height: '280px',
                                    borderColor: '#E2E3EB',
                                    borderRadius: 2,
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                    '.MuiPickersMonth-monthButton': {
                                        color: 'black',
                                        borderRadius: '10px',
                                    },
                                    '.MuiPickersMonth-monthButton.Mui-selected': {
                                        backgroundColor: '#0d41e1',
                                        color: 'white',
                                    },
                                }}
                            />
                        </Box>
                    </LocalizationProvider>
                )}
            </Box>

            {/* 일 선택 */}
            <Box
                ref={scrollRef}
                sx={{
                    borderTop: '1px solid #e0e0e0',
                    display: 'flex',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    gap: 1,
                    mt: 1,
                    mb: 1,
                }}
            >
                <IconButton
                    onClick={() => {
                        const preDay = allDays
                            .slice()
                            .reverse()
                            .find((day) => day < selectedDay && hasGamesOnDate(day));
                        if (preDay) {
                            setSelectedDay(preDay);
                        }
                    }}
                    disabled={!allDays.some((day) => day < selectedDay && hasGamesOnDate(day))}
                >
                    <ArrowBackIosIcon />
                </IconButton>

                <Box gap={1} sx={{ display: 'flex', overflow: 'hidden', mt: 1, mb: 1 }}>
                    {allDays.map((day) => (
                        <Button
                            key={day}
                            data-day={day}
                            variant={selectedDay === day ? 'contained' : 'outlined'}
                            disabled={!hasGamesOnDate(day)}
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
                                '&.Mui-disabled': {
                                    border: 'none',
                                },
                            }}
                        >
                            {day}
                        </Button>
                    ))}
                </Box>

                <IconButton
                    onClick={() => {
                        const nextDay = allDays.find((day) => day > selectedDay && hasGamesOnDate(day));
                        if (nextDay) {
                            setSelectedDay(nextDay);
                        }
                    }}
                    disabled={!allDays.some((day) => day > selectedDay && hasGamesOnDate(day))}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Container>
    );
};

export default DateList;
