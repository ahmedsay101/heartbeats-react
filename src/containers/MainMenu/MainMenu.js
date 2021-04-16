import React, {useEffect, useState, useRef} from 'react';
import { NavLink, Link } from "react-router-dom";
import { connect } from 'react-redux';
import $ from 'jquery';
import styles from "./MainMenu.module.css";
import explore from "../../assets/explore.svg";
import artist from "../../assets/mic.svg";
import playlist from "../../assets/playlist.svg";
import createPlaylist from "../../assets/addplaylist.svg";
import upload from "../../assets/upload.svg";
import guest from "../../assets/guest.svg";
import resume from "../../assets/resume.svg";
import logo from '../../assets/widelogo.svg';
import menu from "../../assets/menu.svg";
import { isAuthenticated } from "../../commonActions";

const MainMenu = props => {
    const [authenticated, setAuthenticated] = useState(false);
    const [withModal, setWithModal] = useState(window.innerWidth < 1250);
    const container = useRef(null);

    useEffect(() => {
        authenticate(); 
        window.addEventListener('resize', () => {
            console.log(window.innerWidth);
            if(window.innerWidth < 1250) {
                props.setShow(false);
                setWithModal(true);
            }
            else {
                props.setShow(true);
                setWithModal(false);
            }
        });
        
    }, []);

    useEffect(() => {
        if(container && container.current) {
            if(props.show) {
                open();
            }
            else {
                close();
            }
        }

    }, [props.show]);

    const open = () => {
        $(container.current).animate({left: '0px'}, 200);
    }
    const close = () => {
        $(container.current).animate({left: '-240px'}, 200);  
    }

    const authenticate = async () => {
        const auth = await isAuthenticated();
        if(auth) {
            setAuthenticated(true);
        }
        else {
            setAuthenticated(false);
        }
    }

    return (
        <React.Fragment>
            {( withModal ? <div className={styles.modal} onClick={() => props.setShow(false)} style={{display: props.show ? 'block' : 'none'}} /> : null )}
            <div className={styles.menu} ref={container}>
                <div className={styles.header}>
                    <button className={styles.menuButton} onClick={() => props.setShow(!props.show)}><img src={menu} className={styles.bars} /></button>
                    <Link className={styles.logoContainer} to="/"><img src={logo} className={styles.logo} /></Link>
                </div>
                {(!authenticated ? <NavLink className={styles.menuItem} to={{ 
                    pathname: '/auth', 
                    state: { guest: true, comingFrom: '/explore' } 
                }}>
                    <img src={guest} className={styles.menuIcon}/>
                    <span className={styles.menuText}>Login as guest</span>
                </NavLink> : null)}
                <a href="http://localhost:80/heartbeats/assets/cv.docx" className={styles.menuItem}>
                    <img src={resume} className={styles.menuIcon}/>
                    <span className={styles.menuText}>My Resume</span>
                </a>
                <NavLink className={styles.menuItem} activeStyle={{ backgroundColor: '#555' }} to="/explore">
                    <img src={explore} className={styles.menuIcon}/>
                    <span className={styles.menuText}>Explore</span>
                </NavLink>
                <NavLink className={styles.menuItem} activeStyle={{ backgroundColor: '#555' }} to="/artists">
                    <img src={artist} className={styles.menuIcon}/>
                    <span className={styles.menuText}>Artists</span>
                </NavLink>
                <NavLink className={styles.menuItem} activeStyle={{ backgroundColor: '#555' }} to="/playlists">
                    <img src={playlist} className={styles.menuIcon}/>
                    <span className={styles.menuText}>Playlists</span>
                </NavLink>
                <NavLink className={styles.menuItem} activeStyle={{ backgroundColor: '#555' }} to="/playlists">
                    <img src={createPlaylist} className={styles.menuIcon}/>
                    <span className={styles.menuText}>Create playlist</span>
                </NavLink>
                <NavLink className={styles.menuItem} activeStyle={{ backgroundColor: '#555' }} to="/uploads">
                    <img src={upload} className={styles.menuIcon}/>
                    <span className={styles.menuText}>Upload your songs</span>
                </NavLink>
                <div className={styles.footer}>
                    Music From <a className={styles.footerLink} href="http://bensound.com"> Bensound.com</a>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        show: state.showMenu
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setShow: (show) => dispatch({type: 'SHOW_MENU', show: show})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);