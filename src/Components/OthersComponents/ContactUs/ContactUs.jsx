import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ContactUs.css";
import { Row, Col } from "antd";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        agreeToTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    return (
        <div className="MainContainer marginTop50 paddingBottom50">
            <div className="PaddingTop ">
                <div className="breadCrumbContainer Container marginBottom20 marginTop20">
                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/WebsiteIdentityIcon.png" alt="" />
                    <span>Contact Us</span>
                </div>
                <div className="Container">
                    <div className="CommonFlexGap">
                        <h2>Let's Connect</h2>
                        {/* <p>We're here to help you with any questions or concerns you may have. Please fill out the form below, and we'll get back to you as soon as possible.</p> */}
                    </div>
                    <div className="marginTop50">
                        <Row gutter={[30, 30]}>
                            <Col lg={10} md={24} xs={24}>
                                <div className="ContactUsImageContainer h-100">
                                    <img src="https://cdn.prod.website-files.com/678ca1173be404b47f58be4e/67b417101b1fdd30ab7eb316_contact-image.jpg" alt="" />
                                </div>
                            </Col>
                            <Col lg={14} md={24} xs={24}>
                                <div className="ContactFormContainer">
                                    <form onSubmit={handleSubmit} className="ContactForm">
                                        <div className="FormRow">
                                            <div className="FormField">
                                                <label htmlFor="firstName">First Name*</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    placeholder="Enter your first name"
                                                    required
                                                />
                                            </div>
                                            <div className="FormField">
                                                <label htmlFor="lastName">Last Name*</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    placeholder="Enter your last name"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="FormRow">
                                            <div className="FormField">
                                                <label htmlFor="email">Email*</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>
                                            <div className="FormField">
                                                <label htmlFor="phone">Phone</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>
                                        </div>
                                        <div className="FormField">
                                            <label htmlFor="message">Message*</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Enter your message here..."
                                                rows={5}
                                                required
                                            />
                                        </div>
                                        <div className="FormFooter">
                                            <div className="CheckboxContainer">
                                                <label className="CheckboxLabel">
                                                    <input
                                                        type="checkbox"
                                                        name="agreeToTerms"
                                                        checked={formData.agreeToTerms}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <span className="CheckboxText">
                                                        I hereby agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> of Namunjii.
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <button className="CommonBtn" type="submit" >
                                            <span> Submit Now</span>
                                        </button>
                                    </form>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactUs;