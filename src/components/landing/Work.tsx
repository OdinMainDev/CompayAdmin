import workImg from '@/assets/images/landing/images/work_img.png';
import featuresShape from '@/assets/images/landing/images/features_shape.png';

export const Work = () => (
  <section id="work" className="work__area section-py-120">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="section__title text-center mb-80">
            <span className="sub-title">how it works?</span>
            <h2 className="title">
              Core asset of the <span>crypto</span> marketplace
            </h2>
          </div>
        </div>
      </div>
      <div className="work__item-wrap">
        <div className="work__img">
          <img src={workImg} alt="img" className="alltuchtopdown" />
        </div>
        <div className="row">
          <div className="col-lg-6" data-aos="fade-right" data-aos-delay="0">
            <div className="work__item">
              <h1 className="number">01</h1>
              <h4 className="title">
                Currency <span>conversion</span>
              </h4>
              <p>Exportable reports for tax and accounting purposes.</p>
            </div>
            <div className="work__item mb-0">
              <h1 className="number">02</h1>
              <h4 className="title">
                Data <span>encryption</span>
              </h4>
              <p>Visual dashboards for trade performance.</p>
            </div>
          </div>
          <div className="col-lg-6" data-aos="fade-left" data-aos-delay="0">
            <div className="work__item work__item-right">
              <h1 className="number">03</h1>
              <h4 className="title">
                Cold wallet <span>storage</span>
              </h4>
              <p>Regular updates on crypto trends and platform features.</p>
            </div>
            <div className="work__item work__item-right mb-0">
              <h1 className="number">04</h1>
              <h4 className="title">
                Transfer crypto <span>& data</span>
              </h4>
              <p>Guides for beginners on crypto basics and trading.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="work__shape">
      <img src={featuresShape} alt="shape" />
    </div>
  </section>
);
