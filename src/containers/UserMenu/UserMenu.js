import React from 'react';
import { NavLink } from "react-router-dom";
import styles from "./UserMenu.module.css";
import playlist from "../../assets/playlist.svg";
import createPlaylist from "../../assets/addplaylist.svg";
import upload from "../../assets/upload.svg";
import pen from "../../assets/pen.svg";
import like from "../../assets/like.svg";

function UserMenu() {
    return (
        <div className={styles.menu}>
            <NavLink className={styles.menuItem} to="/profile/edit">
                <img src={pen} className={styles.menuIcon}/>
                <span className={styles.menuText}>Edit Your Profile</span>
            </NavLink>
            <NavLink className={styles.menuItem} to="/passwords">
                <img src={pen} className={styles.menuIcon}/>
                <span className={styles.menuText}>Change Your Password</span>
            </NavLink>
            <NavLink className={styles.menuItem} to="/likes">
                <img src={like} className={styles.menuIcon}/>
                <span className={styles.menuText}>Likes</span>
            </NavLink>
            <NavLink className={styles.menuItem} to="/Uploads">
                <img src={upload} className={styles.menuIcon}/>
                <span className={styles.menuText}>Uploads</span>
            </NavLink>
            <NavLink className={styles.menuItem} to="/playlists">
                <img src={playlist} className={styles.menuIcon}/>
                <span className={styles.menuText}>Playlists</span>
            </NavLink>
            <div className={styles.footer}>
                Music From <a className={styles.footerLink} href="http://bensound.com"> Bensound.com</a>
            </div>
        </div>
    );
}

export default UserMenu;