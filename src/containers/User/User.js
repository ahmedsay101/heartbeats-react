import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import {Route} from 'react-router-dom';
import UserHeader from '../UserHeader/UserHeader';
import Guard from '../Guard/Guard';
import Profile from '../Profile/Profile';
import EditProfile from '../EditProfile/EditProfile';
import Likes from '../Likes/Likes';
import Uploads from '../Uploads/Uploads';
import Playlists from '../Playlists/Playlists';
import ChangePassword from '../EditProfile/ChangePassword';
import MainMenu from '../MainMenu/MainMenu';


const User = props => {

    useEffect(() => {
        if(window.innerWidth < 1250) {
            props.setShowMenu(false);
        }
    }, [props.location.pathname]);  

    return (
        <Guard>
            <MainMenu type='user'/>
            <div className={"mainContentContainer"} style={{paddingLeft: props.withMenu && window.innerWidth > 1250 ? '240px' : '20px'}}>
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

const mapStateToProps = state => {
    return {
        withMenu: state.showMenu
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setShowMenu: (show) => dispatch({type: 'SHOW_MENU', show: show})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(User);