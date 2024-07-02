import React from "react";
import "./About.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faLaptop, faTshirt, faShoePrints } from '@fortawesome/free-solid-svg-icons';

export default function About() {
  return (
    <section className="about about-wrapper" id="about">
      <div className="container">
        <div className="heading">
          <h2>About Our Products</h2>
          <p>
            Explore our wide range of products across various categories.
            From electronics to fashion, we have something for everyone.
          </p>
        </div>

        <div className="content mtop flex">
          <div className="left">
            <div className="features_box flex">
              <div className="img">
                <FontAwesomeIcon icon={faMobileAlt} aria-label="Electronics" />
              </div>
              <div className="text">
                <h3>Electronics</h3>
                <p>
                  Discover the latest gadgets and technology innovations.
                  From smartphones to smart home devices, we have it all.
                </p>
              </div>
            </div>
            <div className="features_box flex">
              <div className="img">
                <FontAwesomeIcon icon={faLaptop} aria-label="Computers" />
              </div>
              <div className="text">
                <h3>Computers</h3>
                <p>
                  Power up your productivity with our selection of laptops,
                  desktops, and accessories.
                </p>
              </div>
            </div>
            <div className="features_box flex">
              <div className="img">
                <FontAwesomeIcon icon={faTshirt} aria-label="Fashion" />
              </div>
              <div className="text">
                <h3>Fashion</h3>
                <p>
                  Stay stylish with our trendy collection of clothing, shoes,
                  and accessories for every occasion.
                </p>
              </div>
            </div>
            <div className="features_box flex">
              <div className="img">
                <FontAwesomeIcon icon={faShoePrints} aria-label="Footwear" />
              </div>
              <div className="text">
                <h3>Footwear</h3>
                <p>
                  Step out in style with our comfortable and fashionable
                  footwear options for men, women, and kids.
                </p>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="img_animation">
              <img src="image/a.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
