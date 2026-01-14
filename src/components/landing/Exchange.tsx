import exchangeImg from '@/assets/images/landing/images/exchange_img.png';
import exchangeIcon01 from '@/assets/images/landing/icon/exchange_icon01.svg';
import exchangeIcon02 from '@/assets/images/landing/icon/exchange_icon02.svg';
import exchangeIcon03 from '@/assets/images/landing/icon/exchange_icon03.svg';
import exchangeIcon04 from '@/assets/images/landing/icon/exchange_icon04.svg';

export const Exchange = () => (
  <section className="exchange__area section-pb-120" data-aos="fade-up" data-aos-delay="0">
    <div className="container">
      <div className="exchange__inner-wrap">
        <div className="exchange__content">
          <div className="icon">
            <img src={exchangeImg} alt="img" />
          </div>
          <div className="content">
            <h4 className="title">
              Exchange <span>availability</span>
            </h4>
            <p>AI-powered tools to detect and prevent fraudulent activities.</p>
          </div>
        </div>
        <div className="exchange__icons">
          <ul className="list-wrap">
            <li>
              <img src={exchangeIcon01} alt="icon" />
            </li>
            <li>
              <img src={exchangeIcon02} alt="icon" />
            </li>
            <li>
              <img src={exchangeIcon03} alt="icon" />
            </li>
            <li>
              <img src={exchangeIcon04} alt="icon" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);
