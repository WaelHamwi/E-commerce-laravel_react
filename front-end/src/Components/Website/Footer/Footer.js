import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Footer.css";
import {
  faGithub,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
export default function Footer() {
  return (
    <>
      <footer class="footer">
        <div class="waves">
          <div class="wave" id="wave1"></div>
          <div class="wave" id="wave2"></div>
          <div class="wave" id="wave3"></div>
          <div class="wave" id="wave4"></div>
        </div>

        <ul class="menu">
          <li class="menu__item">
            <a class="menu__link" href="/">
              Home
            </a>
          </li>
          <li class="menu__item">
            <a class="menu__link" href="about">
              About us
            </a>
          </li>
          <li class="menu__item">
            <a class="menu__link" href="#">
              Contact us
            </a>
          </li>
        </ul>
        <p>
          E-commerce  created by <FontAwesomeIcon icon={faHeart} /> Wael Hamwi{" "}
          </p>
      </footer>

    </>
  );
}
