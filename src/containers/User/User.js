import React from 'react';
import {Route} from 'react-router-dom';
import UserHeader from '../UserHeader/UserHeader';
import UserMenu from '../UserMenu/UserMenu';
import Guard from '../Guard/Guard';
import Profile from '../Profile/Profile';
import EditProfile from '../EditProfile/EditProfile';
import Likes from '../Likes/Likes';
import Uploads from '../Uploads/Uploads';
import Playlists from '../Playlists/Playlists';
import ChangePassword from '../EditProfile/ChangePassword';


function User() {

    return (
        <Guard>
            <UserMenu />
            <div className="mainContentContainer">
                <div className="contentContainer">
                <UserHeader />
                <Route path="/profile" exact component={Profile}/> 
                <Route path="/profile/edit" exact component={EditProfile}/> 
                <Route path="/passwords" exact component={ChangePassword}/> 
                <Route path="/likes" exact component={Likes}/> 
                <Route path="/uploads" exact component={Uploads}/> 
                <Route path="/playlists" exact component={Playlists}/> 
                </div>
            </div>
        </Guard>
    );
}
export default User;