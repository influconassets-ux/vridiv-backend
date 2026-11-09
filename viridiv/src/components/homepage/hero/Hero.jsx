import React from "react";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <div className={styles.container}>
      <div className={styles.vidContainer}>
        <video
          autoPlay
          muted
          playsInline
          loop
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
          poster="https://res.cloudinary.com/dltyhcbm6/video/upload/so_1,q_auto,f_auto,w_720/v1746778980/videoplayback_nov2qt.jpg"
        >
          <source
            src="https://res.cloudinary.com/dltyhcbm6/video/upload/f_auto,q_auto,w_720/v1746778980/videoplayback_nov2qt.webm"
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className={styles.contentContainer}>
        <img src="/images/logo2.png" className={styles.headerImage} alt="" />
        <p className={styles.content}>
          A new-age climate resilient commodities platform
          <br />
          geared towards future proofing our food systems
        </p>
      </div>

      <div className={styles.bgWrapper}></div>
    </div>
  );
};

export default Hero;
