import React, { useEffect } from "react";
import "./Policies.css";

const TermsAndConditions = () => {
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
          <h1 className="main-heading">Terms & Conditions</h1>

          <p className="effective-date">Effective Date: October 10, 2025</p>

          <p>
            Welcome to Namunjii! By using our website, you agree to these Terms
            & Conditions, which are designed to make your shopping experience
            smooth and transparent. Please read carefully before accessing or
            using our site. By visiting or purchasing from Namunjii, you agree
            to be bound by these terms. If you do not agree, you should not
            access the website or use our services.
          </p>

          <h3>1. Quality Assurance</h3>
          <p>
            We aim to provide accurate product descriptions and high-quality
            imagery. If you notice any mismatch or error, kindly inform us so we
            can correct it.
          </p>

          <h3>2. Transparent Pricing</h3>
          <p>
            All prices displayed are inclusive of relevant taxes (unless stated
            otherwise) and visible before checkout. Prices may change without
            prior notice, but you will always see the final amount at
            checkout—no hidden charges.
          </p>

          <h3>3. Shipping & Delivery</h3>
          <p>
            We work with trusted logistics partners to ensure safe and timely
            delivery. For more information, please review our [Shipping Policy].
          </p>

          <h3>4. Eligibility & Online Store Terms</h3>
          <p>
            By agreeing to these Terms, you confirm that you are at least the
            age of majority in your state or region of residence, or that you
            have consented to allow your minor dependents to use this site. You
            must not use our services for any unlawful or unauthorized purpose,
            or in violation of applicable laws and regulations.
          </p>

          <h3>5. Modifications to Services & Prices</h3>
          <p>
            We may, at our discretion, modify or discontinue any product,
            service, or content on the website without notice. We are not liable
            to you or any third party for changes in pricing, service
            interruptions, or discontinuation.
          </p>

          <h3>6. Products & Services</h3>
          <p>
            Some items may be available exclusively online and may have limited
            quantities. Such products are subject to availability and our
            [Exchange Policy].
          </p>

          <h3>7. Accuracy of Billing & Account Information</h3>
          <p>
            We reserve the right to refuse or cancel any order placed. You agree
            to provide complete, current, and accurate billing and account
            details for all purchases made through Namunjii.
          </p>

          <h3>8. Third-Party Tools</h3>
          <p>
            We may provide access to third-party tools that we neither monitor
            nor control. You understand that such tools are provided "as is"
            without any warranties, and you use them at your own discretion.
          </p>

          <h3>9. Personal Information</h3>
          <p>
            Your submission of personal details through our store is governed by
            our [Privacy Policy].
          </p>

          <h3>10. Errors & Omissions</h3>
          <p>
            Occasionally, our site may contain typographical errors,
            inaccuracies, or omissions relating to product descriptions,
            pricing, promotions, shipping charges, or availability. We reserve
            the right to correct such errors, update information, or cancel
            orders if necessary—without prior notice.
          </p>

          <h3>11. Prohibited Uses</h3>
          <p>
            You agree not to use our website or its content for any unlawful
            purposes, to solicit others to perform unlawful acts, to violate
            local or international laws, or to infringe on intellectual property
            rights.
          </p>

          <h3>12. Disclaimer of Warranties & Limitation of Liability</h3>
          <p>
            We do not guarantee that your use of our website will be
            uninterrupted, timely, or error-free. Namunjii, its directors,
            employees, affiliates, partners, and service providers are not
            liable for any damages—direct, indirect, incidental, or
            consequential—arising from your use of our site or products.
          </p>

          <h3>13. Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless Namunjii, its affiliates,
            partners, officers, employees, and contractors against any claims,
            damages, or expenses (including reasonable legal fees) arising from
            your breach of these Terms or violation of any law or third-party
            rights.
          </p>

          <h3>14. Governing Law</h3>
          <p>
            These Terms & Conditions shall be governed by and construed in
            accordance with the laws of India, with exclusive jurisdiction in
            the courts of Ahmedabad, Gujarat.
          </p>

          <h3>15. Changes to Terms</h3>
          <p>
            We may revise these Terms & Conditions at any time by posting
            updates on our website. It is your responsibility to review this
            page periodically. Continued use of the site after changes are
            posted will constitute acceptance of the revised terms.
          </p>

          <p>
            <strong>Last Updated:</strong> October 10, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
