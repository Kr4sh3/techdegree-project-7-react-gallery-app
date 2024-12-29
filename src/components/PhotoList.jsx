import React from 'react';
import Photo from './Photo';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';

//Used to build image urls from the data retrieved from the api request
const getFlickrImageURL = (photo, size) => {
    let url = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret
        }`;
    if (size) {
        // Configure image size
        url += `_${size}`;
    }
    url += '.jpg';
    return url;
};

function PhotoList({ data, changeQuery, loading }) {
    //Whenever this component is loaded, update our query state if there is a query in the url
    let { query } = useParams();
    if (query)
        changeQuery(query);

    //Set content to loading if still retrieving request, NotFound component if we didnt recieve any data, or list images if we do have data
    let content;
    if (loading) {
        content = (<p>Loading...</p>)
    } else
        if (data === undefined) {
            content = (< NotFound />);
        } else {
            content = (
                <div class="photo-container">
                    <h2>Results</h2>
                    <ul>
                        {data.map((photo) => { return <Photo url={getFlickrImageURL(photo, 'c')} alt={photo.title} key={photo.id} />; })}
                    </ul>
                </div>);
        }


    return (
        <>{content}</>
    );
}
export default PhotoList;