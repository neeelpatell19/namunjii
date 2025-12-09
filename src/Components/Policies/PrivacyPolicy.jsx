import React, { useEffect } from "react";
import "./Policies.css";

const PrivacyPolicy = () => {
  useEffect(() => {
    if(window.fbq)
  window.fbq("track", "PrivacyPolicyPageView");
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="MainContainer marginTop50 paddingBottom50">
      <br />
      <br />
      <br />
      <div className="Container paddingBottom50">
        <div className="policy-content">
          <h1 className="main-heading">Privacy Policy</h1>

          <p className="effective-date">Effective Date: October 10, 2025</p>

          <p>
            Namunjii (Callingcrafts Pvt Ltd) is committed to respecting and
            safeguarding your privacy. This Privacy Policy explains how we
            collect, use, and share your personal information when you visit or
            shop on our website.
          </p>

          <h3>1. Information We Collect</h3>
          <p>
            We may collect information you provide directly, such as when you
            create an account, place an order, subscribe to our updates, or
            reach out to us. This information can include your name, email
            address, phone number, billing and shipping addresses, and payment
            details.
          </p>
          <p>
            In addition, we automatically collect certain information about your
            device and browsing activity through cookies and similar tracking
            technologies.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>The information we collect may be used to:</p>
          <ul>
            <li>Process, ship, and fulfill your orders</li>
            <li>Communicate with you regarding your purchases or account</li>
            <li>
              Send you promotional updates, offers, or newsletters (if you have
              opted in)
            </li>
            <li>
              Enhance our website, product offerings, and overall customer
              experience
            </li>
            <li>Meet legal, tax, or regulatory requirements</li>
          </ul>

          <h3>3. Sharing Your Information</h3>
          <p>
            We do not sell or rent your personal information. We may share your
            details with trusted third-party service providers who help us
            operate the website, process payments, deliver orders, or provide
            customer support—strictly under confidentiality obligations. We may
            also disclose information if required to comply with applicable laws
            or lawful government requests.
          </p>

          <h3>4. Data Security</h3>
          <p>
            We take appropriate technical and organizational steps to protect
            your information. While we strive to use commercially acceptable
            safeguards, no online transmission or electronic storage system can
            be guaranteed 100% secure.
          </p>

          <h3>5. Cookies</h3>
          <p>
            Our site uses cookies and similar tools to improve your browsing
            experience, personalize content, and analyze website traffic. You
            can disable cookies in your browser settings, though some site
            features may not function properly as a result.
          </p>

          <h3>6. Your Rights</h3>
          <p>
            You have the right to request access, correction, or deletion of
            your personal information. To exercise these rights, please contact
            us at <a href="mailto:support@namunjii.com">support@namunjii.com</a>
            .
          </p>

          <h3>7. Third-Party Links</h3>
          <p>
            Our website may include links to other external sites. We are not
            responsible for their privacy practices or content, and we encourage
            you to review the privacy policies of any third-party sites you
            visit.
          </p>

          <h3>8. Policy Updates</h3>
          <p>
            We may revise this Privacy Policy from time to time. Any changes
            will be reflected on this page with an updated "Effective Date."
            Continued use of our website after updates constitutes acceptance of
            the revised policy.
          </p>

          <h3>9. Contact Us</h3>
          <p>
            For questions or concerns about this Privacy Policy, please contact
            us at:{" "}
            <a href="mailto:support@namunjii.com">support@namunjii.com</a>
          </p>

          <p>
            <strong>Last Updated:</strong> October 10, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
