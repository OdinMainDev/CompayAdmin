export const Crypto = () => (
  <section className="crypto__area section-py-120">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="section__title text-center mb-80">
            <span className="sub-title">crypto direction</span>
            <h2 className="title">
              Goods & assets <span>according</span> <br /> to users interests.
            </h2>
          </div>
        </div>
      </div>
      <div className="row gutter-y-30 justify-content-center">
        <div className="col-lg-4 col-md-6">
          <div className="crypto__item">
            <div className="crypto__icon">
              <img src="assets/img/icon/crypto_icon01.svg" alt="icon" />
            </div>
            <div className="crypto__content">
              <h2 className="title">
                Read our <span>white paper</span>
              </h2>
              <a href="#!" className="tg-btn tg-btn-two">
                open whitepaper
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="crypto__item">
            <div className="crypto__icon">
              <img src="assets/img/icon/crypto_icon02.svg" alt="icon" />
            </div>
            <div className="crypto__content">
              <h2 className="title">
                1 CRN token price <span>0.00014 BTC</span>
              </h2>
              <a href="#!" className="tg-btn tg-btn-two">
                Buy tokens <span>(-25%)</span>
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="crypto__item">
            <div className="crypto__icon">
              <img src="assets/img/icon/crypto_icon03.svg" alt="icon" />
            </div>
            <div className="crypto__content">
              <h2 className="title">
                ICO Participants <span>370,000+</span>
              </h2>
              <a href="#!" className="tg-btn tg-btn-two">
                join our telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="crypto__shape">
      <img src="assets/img/images/features_shape.png" alt="shape" />
    </div>
  </section>
);