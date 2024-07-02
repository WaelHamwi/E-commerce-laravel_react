import "./Landing.css";
import banner1 from "./../../../Assets/banner1.png";
import banner2 from "./../../../Assets/banner2.webp";
import banner3 from "./../../../Assets/banner3.webp";
export default function LandingPage() {
  return (
    <div className="LandingPage-wrapper">
      <>
        <main>
          <div className="banner">
            <div className="container">
              <div className="slider-container has-scrollbar">
                <div className="slider-item">
                  <img
                    src={banner1}
                    alt="women's latest fashion sale"
                    className="banner-img"
                  />

                  <div className="banner-content">
                    <p className="banner-subtitle">Latest sale products</p>

                    <h2 className="banner-title">Latest fashion sale</h2>

                    <p className="banner-text">
                    Shop our exclusive collection now
                    </p>

                    <a href="#latest-sale-products" className="banner-btn">
                      Shop now
                    </a>
                  </div>
                </div>

                <div className="slider-item">
                  <img
                    src={banner2}
                    alt="modern sunglasses"
                    className="banner-img"
                  />

                  <div className="banner-content">
                    <p className="banner-subtitle">Top rated products</p>

                    <h2 className="banner-title">Modern top rated products</h2>

                    <p className="banner-text">
                    Shop our exclusive collection now
                    </p>

                    <a href="#top-rated" className="banner-btn">
                      Shop now
                    </a>
                  </div>
                </div>

                <div className="slider-item">
                  <img
                    src={banner3}
                    alt="new fashion summer sale"
                    className="banner-img"
                  />

                  <div className="banner-content">
                    <p className="banner-subtitle">Latest sale</p>

                    <h2 className="banner-title">fashion latest sale</h2>

                    <p className="banner-text">
                    Shop our exclusive collection now
                    </p>

                    <a href="#latest-sale" className="banner-btn">
                      Shop now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    </div>
  );
}
