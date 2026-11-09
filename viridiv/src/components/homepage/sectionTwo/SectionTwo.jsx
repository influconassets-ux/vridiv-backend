import React from "react";
import styles from "./SectionTwo.module.css";
import StandCard from "../standCard/StandCard";
import { Link } from "react-router-dom";

const SectionTwo = () => {
  const standData = [
    {
      imgLink: "/images/standImages/stand1.png",
      header: "Climate Change",
      paras: [
        `The effect of climate change is being felt by all. Extreme heat, droughts, life-threatening floods and storms and so on have become more recurrent now than a decade ago.`,
        `Where, how and what we grow, how we store, trade, transport, and consume, everything needs an overhaul.`,
      ],
    },
    {
      imgLink: "/images/standImages/stand2.png",
      header: "Biodiversity",
      paras: [
        `The future of food has to be #biodiverse 75% of the world's food is generated from only 12 plants and 5 animal species.`,
        `Only three plant species - rice, wheat and maize - contribute nearly 60% of calories and proteins consumed by humans.`,
      ],
    },
    {
      imgLink: "/images/standImages/stand3.png",
      header: "Zero Wastage",
      paras: [
        `Daily 1 in 10 people go to bed hungry!`,
        `One-fifth of food produced for human consumption is lost or #wasted globally. This amounts to one billion meals a day. The total cost of food loss and waste for the global economy is estimated at roughly $1 trillion.`,
      ],
    },
    {
      imgLink: "/images/standImages/stand4.png",
      header: "Sustainability",
      paras: [
        `The world is moving towards Sustainable Trade. 64% of global consumers eagerly purchase from companies that support farmers and local communities.`,
        `It's smart to work with clients and partners who have made or are willing to make #sustainability part of their business process`,
      ],
    },
  ];
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>FOCUS AREA</h2>

      <div className={styles.cardContainer}>
        {standData.map((val, i) => {
          return (
            <div className={styles.card} key={i}>
              <StandCard data={val} />
            </div>
          );
        })}
      </div>

      <div className={styles.btnContainer}>
        <Link className={styles.btn}>Be the CHANGE today</Link>
      </div>
    </div>
  );
};

export default SectionTwo;
