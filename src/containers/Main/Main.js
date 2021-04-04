import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Header from "../Header/Header";
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import Public from "../Public/Public";
import User from "../User/User";
import NotFound from "../NotFound/NotFound";


function Main() {
    return (
        <div className='main'>
            <Header />
                <Switch>
                    <Route path="/profile" exact component={User}/> 
                    <Route path="/profile/edit" exact component={User}/> 
                    <Route path="/passwords" exact component={User}/> 
                    <Route path="/likes" exact component={User}/> 
                    <Route path="/uploads" exact component={User}/> 
                    <Route path="/playlists" exact component={User}/> 
                    <Route path="/" exact component={Public}/>
                    <Route path="/explore" exact component={Public} />
                    <Route path="/artists" exact component={Public} />
                    <Route path="/artist/:id" exact component={Public} />
                    <Route path="/album/:id" exact component={Public} />
                    <Route path="/playlist/:id" exact component={Public} />
                    <Route component={NotFound} />  
                </Switch>
            <AudioPlayer /> 
        </div>
    );
}
export default Main;