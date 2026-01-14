export const Faq = () => (
  <section className="faq__area section-py-120">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="faq__img" data-aos="fade-right" data-aos-delay="0">
            <img src="assets/img/images/faq_img.png" alt="img" />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="faq__content" data-aos="fade-left" data-aos-delay="0">
            <div className="section__title mb-60">
              <span className="sub-title">faq & ans</span>
              <h2 className="title">
                Get every <span>single</span> <br /> answer
              </h2>
            </div>
            <div className="faq__wrap">
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Main purpose of a cryptocurrency
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p>
                        The private key, stored securely in the wallet, allows you to sign
                        transactions and prove ownership of the funds cryptocurrency wallet.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      How can I make refund?
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p>
                        The private key, stored securely in the wallet, allows you to sign
                        transactions and prove ownership of the funds cryptocurrency wallet.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      How do they operate on blockchain?
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p>
                        The private key, stored securely in the wallet, allows you to sign
                        transactions and prove ownership of the funds cryptocurrency wallet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);