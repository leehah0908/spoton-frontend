import React from 'react';
import { useParams } from 'react-router-dom';

const GameDetail = () => {
    const { id } = useParams();

    return <div>GameDetail {id}</div>;
};

export default GameDetail;
