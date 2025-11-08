import React, { useState } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "Designers", path: "/designers" },
    { name: "About Us", path: "/about-us" },
    { name: "Join Us", path: "/vendor-verification" },
  ];

  const policyLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Return Policy", path: "/return-policy" },
    { name: "Shipping Policy", path: "/shipping-policy" },
    { name: "Terms & Conditions", path: "/terms-and-conditions" },
    { name: "Seller Policy", path: "/seller-policy" },
    { name: "Terms of Use", path: "/terms-of-use" },
  ];

  return (
    <div className="FooterContainer">
      {/* Main Footer Content */}
      <div className="FooterMain">
        <div className="Container">
          <Row gutter={[32, 32]}>
            {/* Column 1: NAMUNJII Brand Information */}
            <Col xs={24} sm={12} md={6}>
              <div className="FooterColumn FooterColumnBrand">
                <div className="FooterLogo">
                  <div className="FooterLogoIcon">
                    <img
                      src="/LogoImages/WhiteColorIconLogo.svg"
                      alt="Namunjii"
                    />
                  </div>
                  <span className="FooterLogoText">NAMUNJII</span>
                </div>
                <p className="FooterDescription  nowraap">
                  A HOME FOR EMERGING BRANDS
                </p>
                <div className="ContactDetails">
                  <p>
                    {" "}
                    <span className="contact-label">Phone number:</span>
                    <span className="contact-value"> +91 98789 11223</span>
                  </p>
                  <p>
                    {" "}
                    <span className="contact-label">Email:</span>
                    <span className="contact-value"> design@namunjii.com</span>
                  </p>
                </div>
              </div>
            </Col>

            {/* Column 2: QUICK LINKS */}
            <Col
              xs={12}
              sm={12}
              md={6}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className="FooterColumn">
                <h3 className="FooterHeading">QUICK LINKS</h3>
                <ul className="FooterLinks">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="FooterLink">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* Column 3: POLICIES */}
            <Col
              xs={12}
              sm={12}
              md={6}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className="FooterColumn">
                <h3 className="FooterHeading">POLICIES</h3>
                <ul className="FooterLinks">
                  {policyLinks.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="FooterLink">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* Column 4: LET'S STAY IN TOUCH */}
            <Col xs={24} sm={12} md={6}>
              <div className="FooterColumn FooterColumnNewsletter">
                <h3 className="FooterHeading">LET'S STAY IN TOUCH</h3>
                <p className="FooterDescription">
                  Discover trends, get early access to collections, and never
                  miss a designer drop again.
                </p>
                <form onSubmit={handleEmailSubmit} className="NewsletterForm">
                  <div className="EmailInputContainer">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="EmailInput"
                      required
                    />
                    <div className="EmailUnderline"></div>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="FooterCopyright">
        <div className="Container FooterCopyrightContent">
          <p>
            Copyright @ 2025 <span>Namunjii</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
