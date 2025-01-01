import { useState, useEffect } from 'react';
const apiKey = process.env.REACT_APP_API_KEY;
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Nav from './components/Nav';
import PhotoList from './components/PhotoList';
import Search from './components/Search';
import PageNotFound from './components/PageNotFound';

function App() {

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchImages, setSearchImages] = useState([]);

  //Images kept and stored on page load
  const [homeImages, setHomeImages] = useState([]);
  const [catImages, setCatImages] = useState([]);
  const [dogImages, setDogImages] = useState([]);
  const [computerImages, setComputerImages] = useState([]);

  const handleQueryChange = searchText => { setQuery(searchText) };

  const fetchImages = (url, setFunction) => {
    setLoading(true);
    //activeFetch will be set to false on cleanup to avoid setting images on new requests
    let activeFetch = true;
    axios.get(url)
      .then(response => {
        if (activeFetch) {
          //Setting the value of images to undefined if there are no images so we can tell if the results were empty in PhotoList
          //Checking the length of data in photolist would sometimes result in not found being displayed before displaying images
          if (!response.data.photos || response.data.photos.photo.length === 0)
            setFunction(undefined)
          else
            setFunction(response.data.photos.photo);
          setLoading(false);
        }
      })
      .catch(error => { console.log("Error fetching and parsing data", error); setLoading(false); });
    return (() => { activeFetch = false; setLoading(false); })
  }

  //Search Effect
  useEffect(() => {
    fetchImages(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${query}&per_page=24&format=json&nojsoncallback=1`
      , setSearchImages)
  }, [query]);

  //Page First Load Effects
  useEffect(() => {
    fetchImages(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=trending&per_page=24&format=json&nojsoncallback=1`
      , setHomeImages)
  }, []);
  useEffect(() => {
    fetchImages(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=cats&per_page=24&format=json&nojsoncallback=1`
      , setCatImages)
  }, []);
  useEffect(() => {
    fetchImages(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=dogs&per_page=24&format=json&nojsoncallback=1`
      , setDogImages)
  }, []);
  useEffect(() => {
    fetchImages(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=computers&per_page=24&format=json&nojsoncallback=1`
      , setComputerImages)
  }, []);


  return (
    <>
      <BrowserRouter>
        <Search />
        <Nav />
        <Routes>
          <Route path="/" element={<PhotoList data={homeImages} loading={loading} />} />
          <Route path="/cats" element={<PhotoList data={catImages} loading={loading} />} />
          <Route path="/dogs" element={<PhotoList data={dogImages} loading={loading} />} />
          <Route path="/computers" element={<PhotoList data={computerImages} loading={loading} />} />
          <Route path="/search/:query" element={<PhotoList data={searchImages} changeQuery={handleQueryChange} loading={loading} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;