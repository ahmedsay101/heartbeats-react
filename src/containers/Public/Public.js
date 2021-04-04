import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import MainMenu from '../MainMenu/MainMenu';
import Home from '../Home/Home';
import Artists from '../Artists/Artists';
import Artist from '../Artist/Artist';
import Album from '../Album/Album';
import PlaylistPage from '../PlaylistPage/PlaylistPage';

function Public() {
    return (
        <React.Fragment>
            <MainMenu />
            <Route path="/" exact render={() => (<Redirect to="/explore" />)} />
            <Route path="/explore" exact component={Home} />
            <Route path="/artists" exact component={Artists} />
            <Route path="/artist/:id" exact component={Artist} />
            <Route path="/album/:id" exact component={Album} />
            <Route path="/playlist/:id" exact component={PlaylistPage} />
        </React.Fragment>       
    );
}
export default Public;