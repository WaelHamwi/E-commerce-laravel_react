import { Link } from "react-router-dom";
import "./NoEntry.css";

export default function NoEntry({ role }) {
  return (
    <div id="sec-1" class="section">
      <div id="ctn">
        <div class="marquee">
          <div class="marquee-text"></div>
          <div class="marquee-text"></div>
          <div class="marquee-text"></div>
        </div>

        <div class="text-ctn">ERROR</div>
        <div class="text-ctn">
          {role === "2" ? (// product manager?
             <Link to={"products"}>Go To product mangaer page</Link>
           
          ) : (// ordinary user?
            <Link to={"/"}>Go To Homepage</Link>
          )}
        </div>

        <div id="forbidden">FORBIDDEN</div>

        <div class="text-ctn">
          HTTP
          <br />
          403
        </div>

        <div class="marquee">
          <div class="marquee-text"></div>
          <div class="marquee-text"></div>
          <div class="marquee-text"></div>
        </div>
      </div>
    </div>
  );
}
