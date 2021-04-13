import React, {useEffect, useState} from 'react';
import { NavLink } from "react-router-dom";
import styles from "./MainMenu.module.css";
import explore from "../../assets/explore.svg";
import artist from "../../assets/mic.svg";
import playlist from "../../assets/playlist.svg";
import createPlaylist from "../../assets/addplaylist.svg";
import upload from "../../assets/upload.svg";
import guest from "../../assets/guest.svg";
import resume from "../../assets/resume.svg";

import { isAuthenticated } from "../../commonActions";


function MainMenu() {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        authenticate(); 
    }, []);

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
        <div className={styles.menu}>
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
    );
}

export default MainMenu;