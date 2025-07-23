import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";
import { Row, Col } from "antd";
const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const AboutInfo = [
        {
            title: "Our Brand",
            description: "We are a platform built for brands that are ready to grownot by following trends, but by staying true to who they are.",
            image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUs.jpg"
        },
        {
            title: "Our Vision",
            description: "To build a launchpad for up-and-coming design brands — a space where fresh ideas, rooted identities, and conscious aesthetics meet a discerning audience.",
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
    return (
        <div className="MainContainer marginTop50 paddingBottom50">
            <div className="PaddingTop">
                <div className="breadCrumbContainer Container marginBottom20 marginTop20">
                    <Link to="/">Home</Link>
                    <span> | </span>
                    <span className="ColorBlack">About Namunjii</span>
                </div>
                <div className="Container">
                    <div className="CommonFlexGap ">
                        <h2 style={{ textAlign: "start" }}>About Namunjii</h2>
                        <p style={{ textAlign: "start" }}><b><i>A home for emerging brands</i></b></p>
                    </div>
                    <div className="AboutMainStoryBox marginTop50  ">
                        <p>In a world where visibility is everything, even the most promising brands can struggle to break through. Hundreds of independent brands are building beautiful products—carefully crafted collections and stories worth sharing.</p>
                        <p><b>That’s where the idea of Namunjii was born.</b></p>
                        <p>We are a platform created for brands ready to grow—driven by passionate minds and knowledgeable designers who stay true to their identity rather than following fleeting trends.</p>
                        <p>Namunjii provides brands with the visibility, support, and platform they need—without diluting their uniqueness.</p>
                        <p>With a strategic offline presence in key cities across <b>India and the Gulf</b>, we don’t just offer shelf space—we provide a stage. We bring together emerging labels and help them reach the audience they deserve, both through <b>offline, curated premium retail spaces</b> and <b>online via our e-commerce platform</b> across the Asia Pacific region.</p>
                        <p>Namunjii isn’t just a marketplace. Our offline and online approach is thoughtfully crafted to meet the needs of talented designers, artisans, and photographers—those who deserve a promising presence and whose emerging brands deserve room to rise.</p>
                        <p>We are here for brands that are ready to grow, for passionate creators and knowledgeable designers who want to make their mark by staying authentic.</p>
                    </div>
                    <div className="AboutUsImageSection">
                        <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/AboutUs.jpg" alt="About Namunjii" />
                    </div>
                    <div className="AboutInfoCards">
                        {AboutInfo.map((item, index) => (
                            <div className="AboutInfoCard" key={index}>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs; 