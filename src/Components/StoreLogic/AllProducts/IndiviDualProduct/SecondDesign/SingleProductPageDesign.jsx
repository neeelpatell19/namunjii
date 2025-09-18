import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useParams } from "react-router-dom";
import { DesignerDummyData } from "../../../../OthersComponents/Designers/DesignerDummyData";
import CommonUnderworkingModal from "../../../../CommonUserInteractions/CommonUnderworkingModal";
import "./SingleProductPageDesign.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import BlurImage from "../../../../CommonUserInteractions/BlurImage/BlurImage";

const SingleProductPageDesign = () => {
    const { productName } = useParams();
    const designer = DesignerDummyData.find(d => d.DesignerProducts.some(p => p.ProductName === productName));
    const product = designer?.DesignerProducts.find(p => p.ProductName === productName);

    const [selectedSize, setSelectedSize] = useState("M");
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const prevTitle = document.title;
        if (product?.ProductName) {
            document.title = `${product.ProductName} | Namunjii`;
        }
        return () => {
            document.title = prevTitle;
        };
    }, [product?.ProductName]);

    const SizeBoxes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
    const sizeFullForms = { XXS: "Extra Extra Small", XS: "Extra Small", S: "Small", M: "Medium", L: "Large", XL: "Extra Large", XXL: "Double Extra Large" };
    const DISCOUNT_PERCENT = 20; // 20% discount for sale items

    const mainImage = product?.image?.[0] || "https://images.unsplash.com/photo-1523297467724-f6758d7124c5?q=80&w=1019&auto=format&fit=crop&ixlib=rb-4.1.0";
    const secondaryImage = product?.image?.[1] || product?.image?.[0] || mainImage;

    // Get related products (exclude current product)
    const allProducts = DesignerDummyData.flatMap(designer =>
        designer.DesignerProducts.map(product => ({
            ...product,
            designerName: designer.DesignerName
        }))
    );

    const filteredProducts = allProducts
        .filter(item => item.ProductName !== productName) // Exclude current product
        .slice(0, 6); // Show maximum 6 related products

    return (
        <>
            <div className="MainContainer marginTop50 paddingBottom50 newRouteSectionPadding SingleProductPageDesign">
                <div className="BackgroundOverlayImageContainerContainer">
                    <div className="BackgroundOverlayImageContainer">
                        <img src={mainImage} alt={product?.ProductName || "Product"} />
                    </div>
                </div>

                {/* <div className="Container"> */}
                {/* <div> */}
                <div className="ProductDetaileContainer Container">
                    <div className="DetailsContainerSticky ">
                        <div className="DetailsPanel">
                            <h3>{product?.ProductName}</h3>
                            <div className="CommonFlexGap">
                                <p className="productPrice "><b>₹&nbsp;{product?.price?.toLocaleString('en-IN')}</b></p>
                                <p className=" smallFont"><i>incl. local Tax & Shipping.</i></p>
                            </div>
                            {/* <div className="marginTop10 productDescription">
                            {product?.ProductDescription}
                        </div> */}

                            {/* <div className="marginTop20 SizeBoxesContainer">
                            <p>Select Size: <span style={{ color: "#fff" }}>{sizeFullForms[selectedSize]}</span></p>
                            <div className="SizeBoxesContainerEdit">
                                {SizeBoxes.map((size) => (
                                    <div
                                        key={size}
                                        className={selectedSize === size ? "SizeBox selected" : "SizeBox"}
                                        onClick={() => setSelectedSize(size)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <p>{size}</p>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                            <div className="ProductDetailsTabContainer marginTop20">
                                <Tabs
                                    defaultActiveKey="description"
                                    items={[
                                        {
                                            key: "description",
                                            label: "Description",
                                            children: (
                                                <div>
                                                    {product?.ProductBrief}
                                                </div>
                                            ),
                                        },
                                        {
                                            key: "delivery",
                                            label: "Delivery Information",
                                            children: (
                                                <div>
                                                    <p>Shipping within India: 3-7 business days. International: 7-15 business days. Free shipping on orders above ₹5,000.</p>
                                                </div>
                                            ),
                                        },
                                        {
                                            key: "size",
                                            label: "Size",
                                            children: (
                                                <div>
                                                    <div className=" SizeBoxesContainer">
                                                        <p className="smallFont">Select Size: <span className="smallFont">{sizeFullForms[selectedSize]}</span></p>
                                                        <div className="SizeBoxesContainerEdit">
                                                            {SizeBoxes.map((size) => (
                                                                <div
                                                                    key={size}
                                                                    className={selectedSize === size ? "SizeBox selected" : "SizeBox"}
                                                                    onClick={() => setSelectedSize(size)}
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <p className="smallFont">{size}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        }
                                    ]}
                                />
                            </div>
                            <div className="BuyingOptionsContainer marginTop20">
                                <button className="CommonBtn" onClick={() => setModalOpen(true)}><span>Add to Cart</span></button>
                                <button className="CommonBtn" onClick={() => setModalOpen(true)}><span>Buy Now</span></button>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="OtherAllImagesContainer">
                    <div>
                        <img src={secondaryImage} alt={product?.ProductName || "Product"} />
                        <img src={mainImage} alt={product?.ProductName || "Product"} />
                    </div>
                </div>
                <CommonUnderworkingModal open={modalOpen} onClose={() => setModalOpen(false)} />

                {/* </div> */}
                {/* </div> */}
            </div>
            <div className="RelatedOtherProductsContainer Container marginTop50">
                <div className="HeaderContainer">
                    <h3>People also liked</h3>
                    <div className="AnimatedButtonContainer">
                        <button className="AnimatedLineButton">View All</button>
                    </div>
                </div>
                <div className="RelatedProductSwiperContainer marginTop50">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        loop={true}
                        // navigation={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        modules={[Autoplay, Navigation]}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {filteredProducts.map((item) => (
                            <SwiperSlide key={item.ProductName + item.price}>
                                <Link to={`/product/${encodeURIComponent(item.ProductName)}`}>
                                    <div className="TrendingDesignsCard">
                                        {item.sale && (
                                            <div className="BadgeContainer">
                                                <span className="smallFont">Sale</span>
                                            </div>
                                        )}
                                        <div className="CommonFlexGap">
                                            <div className="ProductTitle">
                                                <h4 className="text-center" style={{ fontWeight: "400" }}>{item.ProductName}</h4>
                                            </div>
                                            <div className="ProductPrize">
                                                {item.sale ? (
                                                    (() => {
                                                        const original = Number(item.price) || 0;
                                                        const discounted = Math.round(original * (1 - DISCOUNT_PERCENT / 100));
                                                        return (
                                                            <p className="text-center smallFont">
                                                                <span className="smallFont" style={{ textDecoration: 'line-through', opacity: 0.7 }}>₹&nbsp;{original.toLocaleString('en-IN')}</span>
                                                                &nbsp;&nbsp;
                                                                <span className="smallFont">₹&nbsp;{discounted.toLocaleString('en-IN')}</span>
                                                                &nbsp;
                                                            </p>
                                                        );
                                                    })()
                                                ) : (
                                                    <p className="text-center smallFont">₹&nbsp;{item.price?.toLocaleString('en-IN')}</p>
                                                )}
                                            </div>
                                            <br />
                                        </div>
                                        <div className="ProductCardImageContainer">
                                            <div className="ProductCardImage AllProductSwiperContainer">
                                                <Swiper
                                                    slidesPerView={1}
                                                    loop={true}
                                                    // navigation={true}
                                                    // autoplay={{ delay: 2000, disableOnInteraction: false }}
                                                    modules={[Autoplay, Navigation]}
                                                >
                                                    {item.image?.map((imgSrc, idx) => (
                                                        <SwiperSlide key={idx}>
                                                            <BlurImage
                                                                src={imgSrc}
                                                                alt={item.ProductName}
                                                                className="product-image"
                                                            />
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                            <div className="PopUpcategoryBtn">
                                                <button>View Product</button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default SingleProductPageDesign;