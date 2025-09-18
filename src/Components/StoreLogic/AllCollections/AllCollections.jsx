import React from "react";
import "./AllCollections.css";
import AllCollectionsDemoData from "./AllCollectionsDemoData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Row, Col } from "antd";
// Simple parallax on scroll using IntersectionObserver and rAF (disabled on <=800px width)
const useParallax = (max = 100, speed = 1) => {
    const ref = React.useRef(null);
    const [offset, setOffset] = React.useState(0);
    const [enabled, setEnabled] = React.useState(() => {
        if (typeof window === "undefined") return true;
        return window.innerWidth > 800;
    });

    React.useEffect(() => {
        const onResize = () => {
            setEnabled(window.innerWidth > 800);
        };
        window.addEventListener("resize", onResize, { passive: true });
        return () => window.removeEventListener("resize", onResize);
    }, []);

    React.useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let ticking = false;
        let rafId = 0;
        let observer;

        const updateOffset = () => {
            if (!enabled) {
                setOffset(0);
                return;
            }
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const elementHeight = rect.height || 1;
            const progressRaw = (viewportHeight - rect.top) / (viewportHeight + elementHeight);
            const progress = Math.min(1, Math.max(0, progressRaw));
            const value = progress * max * speed;
            setOffset(value);
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                rafId = requestAnimationFrame(() => {
                    ticking = false;
                    updateOffset();
                });
            }
        };

        if (!enabled) {
            setOffset(0);
            return () => {
                cancelAnimationFrame(rafId);
            };
        }

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        updateOffset();
                        window.addEventListener("scroll", onScroll, { passive: true });
                    } else {
                        window.removeEventListener("scroll", onScroll);
                    }
                });
            },
            { threshold: [0, 1] }
        );

        observer.observe(element);

        return () => {
            window.removeEventListener("scroll", onScroll);
            if (observer) observer.disconnect();
            cancelAnimationFrame(rafId);
        };
    }, [max, speed, enabled]);

    return { ref, style: { transform: `translateY(${enabled ? offset : 0}px)`, willChange: enabled ? "transform" : "auto" } };
};

const ParallaxImage = ({ src, alt, className = "", max = 200, speed = 1 }) => {
    const { ref, style } = useParallax(max, speed);
    return (
        <div ref={ref} style={style} className={className}>
            <img src={src} alt={alt} />
        </div>
    );
};
import { Autoplay } from "swiper/modules";
const AllCollections = () => {
    return (
        <div className="MainContainer marginTop50 paddingBottom50 newRouteSectionPadding">
            <div className="PaddingTop maxWidth800" style={{ margin: "0 auto" }}>
                <h2 className="text-center">All Collections</h2>
                <br />
                <p className="text-center">Discover thoughtfully curated collections from emerging and established designers.
                    Every piece tells a story of craftsmanship, culture, and creativity.
                    Namunjii brings them together, giving each brand the stage it deserves.</p>
            </div>
            <div className="AllCollectionsContainerDesignsStyles Container marginTop50">
                <div className="CollectionDesignContainer">
                    {AllCollectionsDemoData.slice(0, 2).map((item) => (
                        <div key={item.id} className="marginTop50">
                            <div className="CollectionDesignImageContainer">
                                <ParallaxImage src={item.image} alt={item.title} max={200} speed={3} />
                                <div className="CollectionNameContainer">
                                    <p>Collection</p>
                                    <h3>{item.title}</h3>
                                </div>
                            </div>
                            <div className="maxWidth600 " style={{ margin: "0 auto" }}>
                                <div className="CollectionProductSwiperContainer">
                                    <Swiper
                                        spaceBetween={16}
                                        speed={800}
                                        loop={true}
                                        autoplay={{
                                            delay: 2000,
                                            disableOnInteraction: false,
                                            // pauseOnMouseEnter: true,
                                        }}
                                        breakpoints={{
                                            0: { slidesPerView: 1 },
                                            576: { slidesPerView: 2 },
                                            768: { slidesPerView: 2 },
                                            992: { slidesPerView: 2 },
                                        }}
                                        modules={[Autoplay]}
                                    >
                                        {item.CollectionsItems.map((collectionItem) => (
                                            <SwiperSlide key={collectionItem.id}>
                                                <div>
                                                    <div className="CollectionItemImageContainer">
                                                        <div className="BadgeContainer">
                                                            <span>{collectionItem.collectionBadge}</span>
                                                        </div>
                                                        <div className="CollectionItemImage">
                                                            <img src={Array.isArray(collectionItem.image) ? collectionItem.image[0] : collectionItem.image} alt={collectionItem.title} />
                                                        </div>
                                                        <div className="PopUpVieCollectionBTN PopUpcategoryBtn">
                                                            <button>View Collection</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="OtherAllCollectionsContainer">
                    {/* <div className="OtherAllCollectionsContainerTitle">
                        <h2>Other Collections</h2>
                    </div> */}
                    <div className="OtherAllCollectionsContainerContent">
                        <Row gutter={[30, 30]}>
                            {AllCollectionsDemoData.slice(2).map((item) => (
                                <Col lg={8} md={8} sm={12} xs={24} key={item.id}>
                                    <div className='DesignersListCardsContainer marginTop50'>
                                        <div className='DesignersListCards'>
                                            <div className='DesignersListCardsItem'>
                                                <div className='DesignersListCardsItemImage'>
                                                    <img src={item.image} alt={item.title} />
                                                </div>
                                                <div className='DesignersListCardsItemText'>
                                                    <h3>{item.title}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllCollections;