export const Banner = () => (
  <section className="banner__area banner__bg" data-background="assets/img/banner/hero_bg.svg">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-7 col-lg-8 col-md-10">
          <div className="banner__content">
            <span className="sub-title wow fadeInUp" data-wow-delay=".2s" data-wow-duration="1s">
              Built on web3. Powered by You
            </span>
            <h2 className="title wow fadeInUp" data-wow-delay=".4s" data-wow-duration="1s">
              The <span>future</span> of leverage is here
            </h2>
            <p className="wow fadeInUp" data-wow-delay=".6s" data-wow-duration="1s">
              Leverage on any tokens with a protocol trusted with billions for its performance and
              reliability.
            </p>
            <form
              action="#"
              className="banner__form wow fadeInUp"
              data-wow-delay=".8s"
              data-wow-duration="1s"
            >
              <label htmlFor="email">
                <img src="assets/img/icon/envelope.svg" alt="" />
              </label>
              <input type="email" id="email" placeholder="Business email" />
              <button type="submit" className="tg-btn">
                get early access
              </button>
            </form>
            <span
              className="banner__content-bottom wow fadeInUp"
              data-wow-delay=".8s"
              data-wow-duration="1s"
            >
              Start monitoring for free or <a href="#!">msg us!</a>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="banner__shape">
      <img src="assets/img/banner/hero_img01.png" alt="shape" className="alltuchtopdown" />
      <img src="assets/img/banner/hero_img02.png" alt="shape" className="rotateme" />
      <img src="assets/img/banner/hero_img03.png" alt="shape" className="alltuchtopdown" />
      <img src="assets/img/banner/hero_bg_shape.svg" alt="shape" className="banner__bg-shape" />
    </div>
  </section>
);