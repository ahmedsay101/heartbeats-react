import React from 'react';
import { NavLink } from "react-router-dom";
import styles from "./MainMenu.module.css";
import explore from "../../assets/explore.svg";
import artist from "../../assets/mic.svg";
import playlist from "../../assets/playlist.svg";
import createPlaylist from "../../assets/addplaylist.svg";
import upload from "../../assets/upload.svg";


function MainMenu() {
    return (
        <div className={styles.menu}>
            <NavLink className={styles.menuItem} activeStyle={{ backgroundColor: '#555' }} to="/explore">
                <img src={explore} className={styles.menuIcon}/>
                <span className={styles.menuText}>Explore</span>
            </NavLink>
            <NavLink className={styles.menuItem} to="/artists">
                <img src={artist} className={styles.menuIcon}/>
                <span className={styles.menuText}>Artists</span>
            </NavLink>
            <NavLink className={styles.menuItem} to="/playlists">
                <img src={playlist} className={styles.menuIcon}/>
                <span className={styles.menuText}>Playlists</span>
            </NavLink>
            <NavLink className={styles.menuItem} to="/playlists">
                <img src={createPlaylist} className={styles.menuIcon}/>
                <span className={styles.menuText}>Create playlist</span>
            </NavLink>
            <NavLink className={styles.menuItem} to="/uploads">
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