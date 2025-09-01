import React from "react";
import { motion } from "framer-motion";
import "./ProductForHome.css";
import { Row, Col } from "antd";
import FashionClothesData from "../../DummyData/DummyData";

// Animation variants for staggered animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const ProductForHome = () => {
    return (
        <div className="MainContainer ProductForHome paddingBottom50">
            <div className="PaddingTop">
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
                        <h2>Perfect Your Style</h2>
                        <p>It's a journey marked by repeated visits, a tapestry woven with diverse encounters, discoveries, and the pleasure derived from navigating the ever-evolving retail realms.</p>
                    </motion.div>
                    
                    <motion.div 
                        className="marginTop50"
                        variants={containerVariants}
                    >
                        <Row gutter={[30, 30]}>
                            {FashionClothesData.products.slice(0, 8).map((item, index) => (
                                <Col lg={6} md={8} sm={12} xs={24} key={item.id}>
                                    <motion.div 
                                        className="TrendingDesignsCard"
                                        variants={cardVariants}
                                        whileHover={{ y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="ProductCardImageContainer">
                                            <div className="ProductCardImage">
                                                <img src={item.images[0]} alt="" />
                                                <img src={item.images[1]} alt="" />
                                            </div>
                                            <div className="PopUpcategoryBtn">
                                                <button>Add to Cart +</button>
                                            </div>
                                        </div>
                                        <div className="CommonFlexGap">
                                            <div className="ProductTitle">
                                                <h3>{item.title}</h3>
                                            </div>
                                            <div className="ProductPrize">
                                                <p>₹&nbsp;{item.price}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </motion.div>
                    
                    <motion.div 
                        style={{ display: "flex", justifyContent: "center" }} 
                        className="paddingTop50"
                        variants={itemVariants}
                    >
                        <motion.button 
                            className="CommonBtn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span>Shop Now</span>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default ProductForHome;