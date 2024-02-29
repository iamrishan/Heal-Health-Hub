import React from "react";
import "./Home.css";
import Home_img from "./../../Images/Home/hands.png";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <section className="frame-group home">
      <div className="connecting-frames-parent">
        <div className="connecting-frames">
          <div className="connecting-givers-and-container">
            <span>
              <div className="connecting-those-who">
                Connecting Those Who Give with Those Who Need
              </div>
              <p className="connecting">Connecting</p>
              <p className="givers-and-needers">Givers and needers</p>
            </span>
          </div>
        </div>
        <NavLink to="/register">
          {" "}
          <button className="rectangle-group">
            <div className="frame-inner"></div>

            <div className="get-started">Get Started</div>
          </button>
        </NavLink>
      </div>
      <img
        className="rectangle-icon"
        loading="eager"
        alt="Connecting Those Who Give with Those Who Need"
        src={Home_img}
      />
    </section>
  );
};

export default Home;
