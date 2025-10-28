import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./AboutUs.css";
import { Row, Col } from "antd";
import Testimonials from "../Testemonial/Testimonials";
import AvailableCities from "../AvailableCities/AvailableCities";
import HeroHome from "./HeroHome/HeroHome";
import InstagramGrid from "../../CommonUserInteractions/InstagramGrid/InstagramGrid";
import Partnerus from "../../PartnerUs/Partnerus";

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const AboutInfo = [
    {
      title: "Our Brand",
      description:
        "We are a platform built for brands that are ready to grow not by following trends, but by staying true to who they are.",
      image:
        "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUs.jpg",
    },
    {
      title: "Our Vision",
      description:
        "To build a launchpad for design brands — a space where fresh ideas, rooted identities, and conscious aesthetics meet a discerning audience.",
      image:
        "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUs.jpg",
    },
    {
      title: "Our Motto",
      description: (
        <>
          <ul>
            <li>Not just shelf space— storytelling.</li>
            <li>Not just exposure— the right kind.</li>
            <li>Not just retail— the right fit.</li>
            <li>You curate with care. We support with strategy.</li>
          </ul>
        </>
      ),
      image:
        "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUs.jpg",
    },
  ];

  const GridData = [
    {
      icon: "/icons/HandCrafted.svg",
      title: "Handcrafted Perfection",
      description:
        "Shop your favorite styles with the convenience of free delivery, directly to your doorstep.",
    },
    {
      icon: "/icons/GlobalCraftmanship.svg",
      title: "Global Craftsmanship",
      description:
        "Shop now and pay your way with flexible payment options designed to fit your budget.",
    },
    {
      icon: "/icons/SizeInclusive.svg",
      title: "Size-Inclusive Designs",
      description:
        "Shop now and pay your way with flexible payment options designed to fit your budget.",
    },
  ];

  return (
    <>
      {/* Hero/Carousel Section - Same as home page */}
      <HeroHome />

      <div className="MainContainer marginTop50 paddingBottom50">
        <div className="PaddingTop">
          {/* <motion.div
                    className="breadCrumbContainer Container marginBottom20 marginTop20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={itemVariants}
                >
                    <span>About Us</span>
                </motion.div> */}

          <motion.div
            className="Container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div
              className="CommonFlexGap maxWidth800"
              variants={itemVariants}
            >
              <h2 style={{ textAlign: "start", textTransform: "uppercase" }}>
               <span className="img-logo-resize"><img src="/LogoImages/BrandColorIconLogo.svg" alt="" /></span>
                
               Namunjii
              </h2>
              <p style={{ textAlign: "start" }}>
                <b>
                  <i>A home for emerging brands</i>
                </b>
              </p>
            </motion.div>

            <motion.div className="marginTop50" variants={itemVariants}>
              <Row>
                <Col lg={24} md={12} sm={24} xs={24}>
                  <motion.div
                    className="LeftsideAboutContainer"
                    variants={itemVariants}
                  >
                    <div>
                      <p>
                        In a world where visibility is everything, even the most
                        promising brands can struggle to break through. Hundreds
                        of independent brands are building beautiful
                        products—carefully crafted collections and stories worth
                        sharing.
                      </p>
                      <br />
                      <p>
                        <b>That's where the idea of Namunjii was born.</b>
                      </p>
                    </div>
                  </motion.div>
                </Col>
                {/* <Col lg={24} md={12} sm={24} xs={24}>
                                <motion.div 
                                    className="RightsideAboutContainer marginBottom50"
                                    variants={imageVariants}
                                >
                                    <div>
                                        <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUsNamunjji1.jpg" alt="" />
                                    </div>
                                    <div>
                                        <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUsNamunjji2.jpeg" alt="About Namunjii" />
                                    </div>
                                </motion.div>
                            </Col> */}
              </Row>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div>
                <p>
                  We are a platform created for brands ready to grow—driven by
                  passionate minds and knowledgeable designers who stay true to
                  their identity rather than following fleeting trends. Namunjii
                  provides brands with the visibility, support, and platform
                  they need—without diluting their uniqueness.
                </p>
                <br />
                <p>
                  With a strategic offline presence in key cities across{" "}
                  <b>India and the Gulf</b>, we don't just offer shelf space—we
                  provide a stage. We bring together emerging labels and help
                  them reach the audience they deserve, both through{" "}
                  <b>
                    offline, curated premium retail spaces and online via our
                    e-commerce platform
                  </b>{" "}
                  across the Asia Pacific region.
                </p>
                <br />
                <p>
                  Namunjii isn't just a marketplace. Our offline and online
                  approach is thoughtfully crafted to meet the needs of talented
                  designers, artisans, and photographers—those who deserve a
                  promising presence and whose emerging brands deserve room to
                  rise.{" "}
                </p>
                <br />
                <p>
                  We are here for brands that are ready to grow, for passionate
                  creators and knowledgeable designers who want to make their
                  mark by staying authentic.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Available Cities Section - Moved from home page */}
        <AvailableCities />

        <Partnerus/>
      </div>

      {/* Instagram Grid Section */}
      {/* <InstagramGrid /> */}
    </>
  );
};

export default AboutUs;
