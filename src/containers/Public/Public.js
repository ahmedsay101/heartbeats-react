import React, { useEffect } from 'react';
import {Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import MainMenu from '../MainMenu/MainMenu';
import Home from '../Home/Home';
import Artists from '../Artists/Artists';
import Artist from '../Artist/Artist';
import Album from '../Album/Album';
import PlaylistPage from '../PlaylistPage/PlaylistPage';

const Public = props => { 
    useEffect(() => {
        if(window.innerWidth < 1250) {
            props.setShowMenu(false);
        }
    }, [props.location.pathname]);   

    return (
        <React.Fragment>
            <MainMenu type='menu' />
            <div className={"mainContentContainer"} style={{paddingLeft: props.withMenu && window.innerWidth > 1250 ? '240px' : window.innerWidth <= 600 ? '0px' : '20px'}}>
                <Route path="/" exact render={() => (<Redirect to="/explore" />)} />
                <Route path="/explore" exact component={Home} />
                <Route path="/artists" exact component={Artists} />
                <Route path="/artist/:id" exact component={Artist} />
                <Route path="/album/:id" exact component={Album} />
                <Route path="/playlist/:id" exact component={PlaylistPage} />
            </div>
        </React.Fragment>       
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
export default connect(mapStateToProps, mapDispatchToProps)(Public);