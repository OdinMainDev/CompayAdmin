export const Roadmap = () => (
  <section id="roadmap" className="roadmap__area section-py-120">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="section__title text-center mb-80" data-aos="fade-up" data-aos-delay="0">
            <span className="sub-title">roadmap</span>
            <h2 className="title">
              Our <span>strategy</span> & Planning
            </h2>
          </div>
        </div>
      </div>
      <div className="roadmap__item-wrap" data-aos="fade-up" data-aos-delay="300">
        <div className="row gutter-y-40">
          <div className="col-lg-3 col-md-6">
            <div className="roadmap__item">
              <div className="roadmap__icon">
                <img src="assets/img/icon/roadmap_icon01.png" alt="icon" />
              </div>
              <div className="roadmap__content">
                <h3 className="title">2014</h3>
                <p>Definitions of key terms in cryptocurrency</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="roadmap__item">
              <div className="roadmap__icon">
                <img src="assets/img/icon/roadmap_icon02.png" alt="icon" />
              </div>
              <div className="roadmap__content">
                <h3 className="title">2017</h3>
                <p>Automated tools for executing strategies</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="roadmap__item">
              <div className="roadmap__icon">
                <img src="assets/img/icon/roadmap_icon03.png" alt="icon" />
              </div>
              <div className="roadmap__content">
                <h3 className="title">2022</h3>
                <p>APIs for developers to build custom tools</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="roadmap__item">
              <div className="roadmap__icon">
                <img src="assets/img/icon/roadmap_icon04.png" alt="icon" />
              </div>
              <div className="roadmap__content">
                <h3 className="title">2025</h3>
                <p>A space for users to discuss trends</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="roadmap__shape">
      <img src="assets/img/images/features_shape.png" alt="shape" />
    </div>
  </section>
);