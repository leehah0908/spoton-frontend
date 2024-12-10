import React, { useEffect } from 'react';

const Community = () => {
    useEffect(() => {
        sessionStorage.removeItem('gameState');
    }, []);

    return <div>Community</div>;
};

export default Community;
