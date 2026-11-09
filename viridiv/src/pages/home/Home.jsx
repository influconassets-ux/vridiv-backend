import React from "react";
import styles from "./Home.module.css";
import Hero from "../../components/homepage/hero/Hero";
import SectionTwo from "../../components/homepage/sectionTwo/SectionTwo";

const Home = () => {
  return (
    <div className={styles.container}>
      <Hero />
      <SectionTwo />
    </div>
  );
};

export default Home;
