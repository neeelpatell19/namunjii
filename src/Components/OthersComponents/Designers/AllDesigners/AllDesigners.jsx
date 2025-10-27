import React, { useEffect, useRef, useState } from "react";
import "./AllDesigners.css";
import { Link } from "react-router-dom";
import { DesignerDummyData } from "../DesignerDummyData";
import DesignerImagesData from "./DesignerImagesData";
import { FiHeart } from "react-icons/fi";
import { Row, Col } from "antd";
import BlurImage from "../../../CommonUserInteractions/BlurImage/BlurImage";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Pagination, Autoplay } from "swiper/modules";
import DesignersList from "../DesignersList/DesignersList";

const AllDesigners = () => {
  const parallaxRef = useRef(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Intersection Observer to detect when section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (parallaxRef.current) {
      observer.observe(parallaxRef.current);
    }

    return () => {
      if (parallaxRef.current) {
        observer.unobserve(parallaxRef.current);
      }
    };
  }, []);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate parallax offset
  const calculateParallaxOffset = () => {
    if (!isInViewport || !parallaxRef.current) return 0;

    const elementTop = parallaxRef.current.offsetTop;
    const elementHeight = parallaxRef.current.offsetHeight;
    const windowHeight = window.innerHeight;

    // Calculate how much of the element is visible
    const elementBottom = elementTop + elementHeight;
    const scrollTop = window.scrollY;
    const windowBottom = scrollTop + windowHeight;

    // Only apply parallax when element is in viewport
    if (scrollTop > elementTop - windowHeight && scrollTop < elementBottom) {
      const progress =
        (scrollTop - elementTop + windowHeight) /
        (windowHeight + elementHeight);
      return Math.min(Math.max(progress * 100, 0), 100); // Clamp between 0 and 100px
    }

    return 0;
  };

  const parallaxOffset = calculateParallaxOffset();
  return (
    <div className="MainContainer">
      <div className="PaddingTop">
        {/* <div className="breadCrumbContainer Container marginBottom20 marginTop20">
                    <Link to="/">Home</Link>
                    <span> | </span>
                    <span className="ColorBlack">About Namunjii</span>
                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/WebsiteIdentityIcon.png" alt="" />
                    <span>Designers</span>
                </div> */}
        <div className="Container">
          <div className="DesignersPageContainer FlexContainerWrapper">
            <div style={{ width: "100%" }}>
              <h1>Where Talent Finds Its Stage</h1>
            </div>
            <div style={{ width: "100%" }}>
              <p>
                At Namunjii, we celebrate designers who stay true to their
                identity. We provide visibility through curated offline spaces
                and a strong online presence. More than a marketplace, we are a
                stage for authentic talent to rise.
              </p>
            </div>
          </div>
          <div className="AnimatedDesignersCarousalContainer marginTop50 PaddingTop">
            <div>
              <div className="CarousalContainer maxWidth800">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={50}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  speed={800}
                  modules={[Pagination, Autoplay]}
                  className="mySwiper"
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 1,
                      spaceBetween: 50,
                    },
                  }}
                >
                   {DesignerImagesData.map((designerData) => (
                     <SwiperSlide key={designerData.id}>
                       <div className="RotatingImageContainer">
                         <img
                           src={designerData.image[currentImageIndex]}
                           alt={`Designer ${designerData.id} - Image ${
                             currentImageIndex + 1
                           }`}
                           className="rotating-image"
                         />
                       </div>
                     </SwiperSlide>
                   ))}
                </Swiper>
                <div className="NamunjiiDesignersTextEdit">
                  <h2 className="text-center">Namunjii Designers</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="AboutDesignersContentContainer marginTop50 PaddingTop">
            <div>
              <div className="maxWidth800" style={{ margin: "0 auto" }}>
                <h3 className="text-center">
                  Namunjii empowers designers to rise authentically—offering
                  visibility through curated offline spaces and a strong online
                  presence, creating a stage where unique voices, true
                  craftsmanship, and timeless creativity find their audience.
                </h3>
              </div>
              <div
                ref={parallaxRef}
                className="GridImageAndButtonContainer marginTop50"
              >
                <div className="parallax-image-left">
                  <img
                    src="https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    style={{
                      transform: `translateX(${parallaxOffset}px)`,
                      transition: "transform 0.1s ease-out",
                    }}
                  />
                </div>
                <div>
                  <div className="WomenShoppingIcon">
                    <img
                      src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/WomenShoppingIcon.png"
                      alt=""
                    />
                  </div>
                  <div className="AnimatedButtonContainer">
                    <div>
                      <button className="AnimatedLineButton">Learn more</button>
                    </div>
                  </div>
                </div>

                <div className="parallax-image-right">
                  <img
                    src="https://images.unsplash.com/photo-1596725668413-d91baf68d9ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    style={{
                      transform: `translateX(-${parallaxOffset}px)`,
                      transition: "transform 0.1s ease-out",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="BrandMarketingTemplateContainer marginTop50">
            <div className="LeftPadding100px AttachmentContainerImageContent maxWidth800">
              <div>
                <h2 style={{ color: "white" }}>
                  Crafting diamond-shaped love stories time after time.
                </h2>
                <br />
                <p style={{ color: "white" }}>
                  Indulge in the opulence of handcrafted necklaces, bracelets,
                  earrings, and rings, each a masterpiece in its own right.
                  Immerse yourself in the sparkle of meticulously selected
                  gemstones and precious metals, expertly fashioned to create
                  pieces that transcend trends and stand the test of time.
                </p>
              </div>
            </div>
          </div>
          <DesignersList />
          {/* <div className="CommonFlexGap maxWidth800">
                        <h2 style={{ textAlign: "start" }}>Brands We Support</h2>
                        <p style={{ textAlign: "start" }}>It's a journey marked by repeated visits, a tapestry woven with diverse encounters, discoveries, and the pleasure derived from navigating the ever-evolving retail realms.</p>
                    </div> */}
          {/* <div className="marginTop50 DesignerCardContainer">
                        <Row gutter={[30, 30]}>
                            {DesignerDummyData.map((item) => (
                                <Col lg={8} md={8} sm={12} xs={24} key={item.id}>
                                    <Link to={`/designers/${item.slug}`} key={item.slug}>
                                        <div className="TrendingDesignsCard">
                                            <div className="ProductCardImageContainer">
                                                <div className="ProductCardImage">
                                                    <BlurImage 
                                                        src={item.image[0]} 
                                                        alt={item.DesignerName}
                                                        className="designer-image"
                                                    />
                                                    <BlurImage 
                                                        src={item.image[1]} 
                                                        alt={item.DesignerName}
                                                        className="designer-image"
                                                    />
                                                </div>
                                                <div className="PopUpcategoryBtn">
                                                    <button>View Designs</button>
                                                </div>
                                            </div>
                                            <div className="CommonFlexGap">
                                                <div className="ProductTitle">
                                                    <h4>{item.DesignerName}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default AllDesigners;
