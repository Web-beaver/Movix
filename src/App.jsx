import { useState} from 'react';
import {useDispatch} from 'react-redux'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import './App.css'
import Home from './pages/home/Home'
import SearchResult from './pages/searchResult/SearchResult'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Details from './pages/details/Details'
import Explore from './pages/explore/Explore';
import PageNotFound from './pages/404/PageNotFound';
import { fetchDataApi } from './utils/api';
import { getApiConfiguration, getGeneres } from './store/homeSlice';
import { useEffect } from 'react';

function App({store:Store}) {
   const dispatch = useDispatch();
  const fecthApiConfig = ()=>{
    fetchDataApi('/configuration')
    .then(res=>{
      console.log(res);
      const url = {
        backdrop:res.images.secure_base_url + "original",
        poster:res.images.secure_base_url + "original",
        profile:res.images.secure_base_url + "original",
      }

      dispatch(getApiConfiguration(url));
    }
    ).catch("Wrong endpoint");
  }

const genresCall = async()=>{
  let promises = [],endpoints = ['tv','movie']
  let allGenres = {}
  endpoints.forEach((ep)=>{
    promises.push(fetchDataApi(`/genre/${ep}/list`));
  });
  const data = await Promise.all(promises);
  
  data.map(({genres})=>{
    return genres.map((item)=>(allGenres[item.id]=item))
  });

  dispatch(getGeneres(allGenres));
}

  useEffect(()=>{
    fecthApiConfig();
    genresCall();
  },[]);
  return (
    <BrowserRouter>
    <Header></Header>
    <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/:mediaType/:id' element={<Details></Details>}></Route>
      <Route path='/search/:query' element={<SearchResult></SearchResult>}></Route>
      <Route path='/explore/:mediaType' element={<Explore></Explore>}></Route>
      <Route path='*' element={<PageNotFound></PageNotFound>}></Route>
    </Routes>
    <Footer></Footer>
    </BrowserRouter>
  )
}

export default App
