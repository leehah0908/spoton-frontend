import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BaseballComponent from '../detail_components/BaseballComponent';
import SoccerComponent from '../detail_components/SoccerComponent';
import BasketballComponent from '../detail_components/BasketballComponent';
import VolleyballComponent from '../detail_components/VolleyballComponent';

const GameDetail = () => {
    const { id, league } = useParams();
    const [gameDetail, setGameDetail] = useState({});

    const componentMap = {
        kbo: BaseballComponent,
        mlb: BaseballComponent,

        kleague: SoccerComponent,
        epl: SoccerComponent,

        kbl: BasketballComponent,
        nba: BasketballComponent,

        kovo: VolleyballComponent,
        wkovo: VolleyballComponent,
    };

    const SelectedComponent = componentMap[league] || (() => <div>Unknown league</div>);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/game/detail`, {
                    params: {
                        gameId: id,
                    },
                });
                console.log(res);
                console.log(res.data.result);

                setGameDetail(res.data.result);
            } catch (e) {
                console.log(e);
                if (e.response.data.statusMessage === '경기 정보를 찾을 수 없습니다.') {
                    setGameDetail({});
                } else {
                    console.log('게임 데이터 로드 실패');
                }
            }
        };
        loadData();
    }, []);

    return <SelectedComponent gameDetail={gameDetail} />;
};

export default GameDetail;
