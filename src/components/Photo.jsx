import React from 'react';

function Photo({ url, alt }) {
    return (<li>
        <img src={url} alt={alt} />
    </li>);
};

export default Photo;