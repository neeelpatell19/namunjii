import React, { useEffect } from "react";

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <h1>About Us</h1>
        </div>
    )
}

export default AboutUs; 