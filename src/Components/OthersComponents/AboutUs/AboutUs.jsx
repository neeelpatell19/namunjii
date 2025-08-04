import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";
import { Row, Col } from "antd";
import Testimonials from "../Testemonial/Testimonials";
const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const AboutInfo = [
        {
            title: "Our Brand",
            description: "We are a platform built for brands that are ready to grow not by following trends, but by staying true to who they are.",
            image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUs.jpg"
        },
        {
            title: "Our Vision",
            description: "To build a launchpad for design brands — a space where fresh ideas, rooted identities, and conscious aesthetics meet a discerning audience.",
            image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUs.jpg"
        },
        {
            title: "Our Motto",
            description: <>
                <ul>
                    <li>Not just shelf space—
                        storytelling.</li>
                    <li>Not just exposure— the right
                        kind.</li>
                    <li>Not just retail— the right fit.</li>
                    <li>You curate with care. We
                        support with strategy.</li>
                </ul>
            </>,
            image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUs.jpg"
        }
    ]

    const GridData = [
        {
            icon: "/icons/HandCrafted.svg",
            title: "Handcrafted Perfection",
            description: "Shop your favorite styles with the convenience of free delivery, directly to your doorstep."
        },
        {
            icon: "/icons/GlobalCraftmanship.svg",
            title: "Global Craftsmanship",
            description: "Shop now and pay your way with flexible payment options designed to fit your budget."
        },
        {
            icon: "/icons/SizeInclusive.svg",
            title: "Size-Inclusive Designs",
            description: "Shop now and pay your way with flexible payment options designed to fit your budget."
        },

    ]
    return (
        <div className="MainContainer marginTop50 paddingBottom50">
            <div className="PaddingTop">
                <div className="breadCrumbContainer Container marginBottom20 marginTop20">
                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/WebsiteIdentityIcon.png" alt="" />
                    <span>About Us</span>
                    {/* <Link to="/">Home</Link>
                    <span> | </span>
                    <span className="ColorBlack">About Namunjii</span> */}
                </div>
                <div className="Container">
                    <div className="CommonFlexGap maxWidth800">
                        <h2 style={{ textAlign: "start" }}>Namunjii</h2>
                        <p style={{ textAlign: "start" }}><b><i>A home for emerging brands</i></b></p>
                    </div>
                    {/* <div className="AboutMainStoryBox marginTop50  ">
                        <p>In a world where visibility is everything, even the most promising brands can struggle to break through. Hundreds of independent brands are building beautiful products—carefully crafted collections and stories worth sharing.</p>
                        <p><b>That’s where the idea of Namunjii was born.</b></p>
                        <p>We are a platform created for brands ready to grow—driven by passionate minds and knowledgeable designers who stay true to their identity rather than following fleeting trends.</p>
                        <p>Namunjii provides brands with the visibility, support, and platform they need—without diluting their uniqueness.</p>
                        <p>With a strategic offline presence in key cities across <b>India and the Gulf</b>, we don’t just offer shelf space—we provide a stage. We bring together emerging labels and help them reach the audience they deserve, both through <b>offline, curated premium retail spaces</b> and <b>online via our e-commerce platform</b> across the Asia Pacific region.</p>
                        <p>Namunjii isn’t just a marketplace. Our offline and online approach is thoughtfully crafted to meet the needs of talented designers, artisans, and photographers—those who deserve a promising presence and whose emerging brands deserve room to rise.</p>
                        <p>We are here for brands that are ready to grow, for passionate creators and knowledgeable designers who want to make their mark by staying authentic.</p>
                    </div> */}

                    <div className="marginTop50">
                        <Row gutter={[30, 30]}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <div className="LeftsideAboutContainer">
                                    <div className="marginBottom50">
                                        <p>In a world where visibility is everything, even the most promising brands can struggle to break through. Hundreds of independent brands are building beautiful products—carefully crafted collections and stories worth sharing.</p>
                                        {/* <p><b>That’s where the idea of Namunjii was born.</b></p> */}
                                        <br />
                                        <p><b>That’s where the idea of Namunjii was born.</b></p>
                                        <br />
                                        {/* <p>We are a platform created for brands ready to grow—driven by passionate minds and knowledgeable designers who stay true to their identity rather than following fleeting trends.</p> */}
                                        <br />
                                        <Link to="/all-products"> <button className="CommonBtn"><span>Explore Collections</span></button></Link>
                                    </div>
                                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/NamunjiiAbout1.jpeg" alt="About Namunjii" />
                                </div>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <div className="RightsideAboutContainer">
                                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/NamunjiiAbout2.jpeg" alt="" />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="marginTop50">
                        <div>
                            <p>We are a platform created for brands ready to grow—driven by passionate minds and knowledgeable designers who stay true to their identity rather than following fleeting trends.</p>
                            <br />
                            <p>Namunjii provides brands with the visibility, support, and platform they need—without diluting their uniqueness.</p>
                            <br />
                            <p>With a strategic offline presence in key cities across <b>India and the Gulf</b>, we don’t just offer shelf space—we provide a stage. We bring together emerging labels and help them reach the audience they deserve, both through <b>offline, curated premium retail spaces and online via our e-commerce platform</b> across the Asia Pacific region.</p>
                            <br />
                            <p>Namunjii isn’t just a marketplace. Our offline and online approach is thoughtfully crafted to meet the needs of talented designers, artisans, and photographers—those who deserve a promising presence and whose emerging brands deserve room to rise. </p>
                            <br />
                            <p>We are here for brands that are ready to grow, for passionate creators and knowledgeable designers who want to make their mark by staying authentic.</p>
                        </div>
                    </div>

                    {/* <div className="AboutUsImageSection">
                        <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUs.jpg" alt="About Namunjii" />
                    </div> */}
                    {/* <div className="AboutInfoCards marginTop20">
                        {AboutInfo.map((item, index) => (
                            <div className="AboutInfoCard" key={index}>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div> */}
                </div>
                <div className="marginTop50 GridEditContainer paddingBottom50 paddingTop50">
                    <div className="Container">
                        <Row gutter={[30, 30]}>
                            {GridData.map((item, index) => (
                                <Col lg={8} md={8} sm={24} xs={24} key={index}>
                                    <div className="GridItem">
                                        <div>
                                            <img src={item.icon} alt={item.title} />
                                            <h4>{item.title}</h4>
                                        </div>
                                        <p>{item.description}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
                <Testimonials />
            </div>
        </div>
    )
}

export default AboutUs; 