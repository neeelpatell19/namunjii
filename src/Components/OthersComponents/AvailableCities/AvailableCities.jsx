import react from "react";
import "./AvailableCities.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const AvailableCities = () => {
    const cities = [
        "Ahmedabad", "Mumbai", "Delhi", "Goa", "Bengaluru",
        "Bekal", "Hyderabad", "Cochin", "Chennai"
    ];

    const contactInfo = {
        instagram: "@digvijaysingh_artwear",
        email: "digvijaysinghlabel@gmail.com"
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div className="MainContainer paddingBottom50 AllProductsPage marginTop50">
            <div className="PaddingTop">
                <div className="Container">
                    <div className="marginBottom50 text-center">
                        <h2>Available Cities</h2>
                        <p>Our luxury atelier services are available across major cities in India</p>
                    </div>

                    {/* Desktop Grid Layout */}
                    <div className="CitiesGridContainer DesktopOnly">
                        {cities.map((city, index) => (
                            <div key={index} className="CityNameCard">
                                <span className="CityName">{city}</span>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Swiper Layout */}
                    <div className="MobileOnly">
                        <Swiper
                            slidesPerView={2}
                            spaceBetween={20}
                            speed={800}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            loop={true}
                            modules={[Autoplay]}
                            className="citiesSwiper"
                        >
                            {cities.map((city, index) => (
                                <SwiperSlide key={index}>
                                    <div className="CityNameCard">
                                        <span className="CityName">{city}</span>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="text-center marginTop50">
                        <p className="CitiesNote">
                            Don't see your city? <span className="ContactLink" onClick={scrollToBottom}>Contact us</span> to bring our luxury atelier services to your area.
                        </p>
                    </div>
                    {/* <div className="ContactInfoContainer marginTop50">
                        <div className="ContactInfoCard">
                            <h3>We are available at</h3>
                            <div className="ContactDetails">
                                <p><strong>Instagram:</strong> {contactInfo.instagram}</p>
                                <p><strong>Email:</strong> {contactInfo.email}</p>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="backgroundFadeCityImage">
                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/modern-city-skyline.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default AvailableCities;