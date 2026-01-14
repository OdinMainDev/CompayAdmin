export const Header = () => (
  <header id="home">
    <div id="sticky-header" className="tg-header__area transparent-header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="tgmenu__wrap">
              <nav className="tgmenu__nav">
                <div className="logo">
                  <a href="index.html">
                    <img src="assets/img/logo/logo.svg" alt="Logo" />
                  </a>
                </div>
                <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex">
                  <ul className="navigation">
                    <li>
                      <a href="#home" className="section-link">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#features" className="section-link">
                        features
                      </a>
                    </li>
                    <li>
                      <a href="#token" className="section-link">
                        token
                      </a>
                    </li>
                    <li>
                      <a href="#work" className="section-link">
                        how it works
                      </a>
                    </li>
                    <li>
                      <a href="#roadmap" className="section-link">
                        roadmap
                      </a>
                    </li>
                    <li className="menu-item-has-children">
                      <a href="blog.html">blog</a>
                      <ul className="sub-menu">
                        <li>
                          <a href="blog.html">Our Blog</a>
                        </li>
                        <li>
                          <a href="blog-details.html">Blog Details</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="tgmenu__action">
                  <ul className="list-wrap">
                    <li className="header-btn">
                      <a href="#!" className="tg-btn">
                        buy now
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mobile-nav-toggler">
                  <i className="tg-flaticon-menu-1"></i>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="tgmobile__menu">
      <nav className="tgmobile__menu-box">
        <div className="close-btn">
          <i className="tg-flaticon-close-1"></i>
        </div>
        <div className="nav-logo">
          <a href="index.html">
            <img src="assets/img/logo/logo.svg" alt="Logo" />
          </a>
        </div>
        <div className="tgmobile__search">
          <form action="#">
            <input type="text" placeholder="Search here..." />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
        <div className="tgmobile__menu-outer">
          {/* Here Menu Will Come Automatically Via Javascript / Same Menu as in Header */}
        </div>
        <div className="social-links">
          <ul className="list-wrap">
            <li>
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fab fa-youtube"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <div className="tgmobile__menu-backdrop"></div>
  </header>
);