import React from "react";
import "./OldFooter.css";

const OldFooter = () => {
  useEffect(() => {
    if(window.fbq)
  window.fbq("track", "OldFooterPageView");
  }, [])
  return (
    <>
      <footer className="rf-footer paddingTop50 paddingBottom50">
        {/* Top banner */}
        <div className="rf-footer__banner Container">
          <img
            src="https://images.unsplash.com/photo-1717851692937-f2ab7adb7630?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Palm leaves and flowers"
            className="rf-footer__banner-img"
          />
          <div className="rf-footer__banner-cta">FOLLOW OUR INSTAGRAM</div>
        </div>

        {/* Main footer */}
        <div className="rf-footer__inner Container marginTop50">
          {/* Brand / Address */}
          <div className="rf-footer__brand">
            <div className="rf-footer__logo">Namunjii</div>
            <address className="rf-footer__address">
              PO Box 1622 Colins Street West
              <br />
              Victoria 8077 Australia
              <br />
              +012 345 6789
              <br />
              <a href="mailto:info@retailflowfashion.com">
                info@retailflowfashion.com
              </a>
            </address>

            <div className="rf-footer__social">
              <a
                href="#"
                aria-label="Instagram"
                className="rf-footer__social-btn"
              >
                {/* Instagram SVG */}
                <svg
                  viewBox="0 0 24 24"
                  className="rf-footer__icon"
                  aria-hidden="true"
                >
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.75-.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="rf-footer__social-btn"
              >
                {/* Facebook SVG */}
                <svg
                  viewBox="0 0 24 24"
                  className="rf-footer__icon"
                  aria-hidden="true"
                >
                  <path d="M13 22v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2H6v4h3v8h4z" />
                </svg>
              </a>
              <a href="#" aria-label="X" className="rf-footer__social-btn">
                {/* X SVG */}
                <svg
                  viewBox="0 0 24 24"
                  className="rf-footer__icon"
                  aria-hidden="true"
                >
                  <path d="M4 3l7.4 9.3L4.4 21H8l6.2-6.8L19.7 21H22l-7.8-10 6.9-8h-3.6l-5.5 6.1L7.6 3H4z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="rf-footer__social-btn"
              >
                {/* LinkedIn SVG */}
                <svg
                  viewBox="0 0 24 24"
                  className="rf-footer__icon"
                  aria-hidden="true"
                >
                  <path d="M6 9h3v12H6zM7.5 3a1.8 1.8 0 1 1 0 3.6A1.8 1.8 0 0 1 7.5 3zM11 9h2.9v1.6h.1c.4-.8 1.5-1.7 3-1.7 3.3 0 3.9 2.1 3.9 4.8V21h-3v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H11z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Pages */}
          <nav className="rf-footer__col">
            <h4 className="rf-footer__heading">Pages</h4>
            <ul className="rf-footer__links">
              <li>
                <a href="#">Shop</a>
              </li>
              <li>
                <a href="#">Collection</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </nav>

          {/* Utility Pages */}
          <nav className="rf-footer__col">
            <h4 className="rf-footer__heading">Utility Pages</h4>
            <ul className="rf-footer__links">
              <li>
                <a href="#">Style Guide</a>
              </li>
              <li>
                <a href="#">Licenses</a>
              </li>
              <li>
                <a href="#">Changelog</a>
              </li>
              <li>
                <a href="#">Protected</a>
              </li>
              <li>
                <a href="#">Not Found</a>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="rf-footer__col">
            <h4 className="rf-footer__heading">Contact Us</h4>
            <p className="rf-footer__note">
              For any additional questions feel free to contact us here
            </p>
            <form
              className="rf-footer__form"
              onSubmit={(e) => {
                e.preventDefault();
                // hook your submit here
                alert("Thanks! We'll be in touch.");
              }}
            >
              <input
                type="email"
                required
                placeholder="enter mail address"
                className="rf-footer__input"
              />
              <button className="CommonBtn">
                <span>Contact Us</span>
              </button>
            </form>
          </div>
        </div>
      </footer>
    </>
  );
};

export default OldFooter;
