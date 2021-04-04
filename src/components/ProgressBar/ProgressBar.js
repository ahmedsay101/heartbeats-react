import React from "react";
import styles from "./ProgressBar.module.css";

function ProgressBar(props) {
    return (
        <div className={styles.progressBarContainer}>
            <span className={styles.audioTime}>{(props.currentTime ? props.currentTime : "0.00")}</span>
            <div className={styles.progressBar} ref={props.progressBarRef} onMouseDown={props.mouseDown}>
                <div className={styles.progress} style={{width: props.width}}>
                    <div className={styles.progressBall}></div>	
                </div>
            </div>
            <span className={styles.audioTime}>{(props.remaining ? props.remaining : "0.00")}</span>
        </div>
    );
}

export default ProgressBar;
