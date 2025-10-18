import React, { useEffect } from "react";
import "./Policies.css";

const TermsOfUse = () => {
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
          <h1 className="main-heading">Terms of Use</h1>

          <p className="effective-date">Effective Date: October 10, 2025</p>

          <p>
            Welcome to Namunjii! These Terms of Use ("Terms") govern your access
            to and use of our website, services, and features (collectively, the
            "Site"). By accessing or using the Site, you agree to be bound by
            these Terms. If you do not agree, you must not use the Site.
          </p>

          <h3>1. Accounts</h3>
          <ul>
            <li>
              <strong>Account Creation:</strong> To make purchases, you may be
              required to create an account and provide accurate, up-to-date
              information. You are responsible for maintaining the accuracy of
              this information.
            </li>
            <li>
              <strong>Account Responsibilities:</strong> You are responsible for
              safeguarding your login credentials and for all activity under
              your account. Please notify us immediately at{" "}
              <a href="mailto:support@namunjii.com">support@namunjii.com</a> if
              you suspect unauthorized use.
            </li>
          </ul>

          <h3>2. Access & Permitted Use</h3>
          <p>
            Namunjii grants you a limited, non-exclusive, non-transferable
            license to use the Site for personal, non-commercial shopping
            purposes.
          </p>
          <p>You agree not to:</p>
          <ul>
            <li>
              Reproduce, copy, resell, or exploit any portion of the Site
              without written consent.
            </li>
            <li>
              Reverse engineer, tamper, or interfere with the Site's
              functionality.
            </li>
            <li>Use the Site for unlawful or fraudulent purposes.</li>
            <li>
              Post, upload, or distribute harmful, offensive, or infringing
              content.
            </li>
          </ul>

          <h3>3. Products, Pricing & Availability</h3>
          <ul>
            <li>
              Product details, descriptions, images, and prices are provided for
              your shopping convenience. While we strive for accuracy, errors
              may occur; we reserve the right to correct inaccuracies and cancel
              orders if necessary.
            </li>
            <li>
              Prices may change without notice. You will always see the final
              amount at checkout.
            </li>
            <li>
              Product availability is subject to stock; some items may be
              exclusive or limited.
            </li>
          </ul>

          <h3>4. Orders & Payments</h3>
          <ul>
            <li>
              By placing an order, you agree to provide current and accurate
              billing and shipping details.
            </li>
            <li>
              We reserve the right to refuse or cancel any order, including in
              cases of suspected fraud or violation of these Terms.
            </li>
            <li>
              Payments are processed securely through trusted third-party
              providers.
            </li>
          </ul>

          <h3>5. Shipping, Delivery & Exchanges</h3>
          <ul>
            <li>
              Orders are dispatched in accordance with our [Shipping Policy].
            </li>
            <li>
              Exchanges are accepted only for defective, damaged, or incorrect
              products, as per our [Exchange Policy].
            </li>
            <li>
              Delivery times are estimates; delays may occur beyond our control.
            </li>
          </ul>

          <h3>6. User Content & Feedback</h3>
          <p>
            If you submit reviews, comments, or other content ("User Content"),
            you grant Namunjii a non-exclusive, royalty-free license to use,
            display, and share this content for promotional or operational
            purposes. You are solely responsible for your User Content and must
            not post unlawful, misleading, or infringing material.
          </p>

          <h3>7. Intellectual Property</h3>
          <p>
            All trademarks, logos, product photos, designs, and other
            intellectual property on the Site belong to Namunjii or its
            partners. You may not use these without written permission.
          </p>

          <h3>8. Prohibited Conduct</h3>
          <p>You may not use the site to:</p>
          <ul>
            <li>Harass, abuse, or harm other users.</li>
            <li>Spread spam, malware, or unauthorized advertising.</li>
            <li>Collect data about others without consent.</li>
            <li>
              Interfere with the security, operation, or availability of the
              Site.
            </li>
          </ul>

          <h3>9. Disclaimers & Limitation of Liability</h3>
          <ul>
            <li>
              The Site and its services are provided on an "as-is" and
              "as-available" basis.
            </li>
            <li>
              We do not guarantee uninterrupted, error-free, or virus-free use
              of the Site.
            </li>
            <li>
              To the fullest extent permitted by law, Namunjii shall not be
              liable for any indirect, incidental, or consequential damages
              arising from your use of the Site or products purchased.
            </li>
          </ul>

          <h3>10. Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless Namunjii, its officers,
            employees, partners, and affiliates against any claims, damages, or
            expenses resulting from your breach of these Terms, unlawful use of
            the Site, or violation of third-party rights.
          </p>

          <h3>11. Termination</h3>
          <p>
            Namunjii may suspend or terminate your account and access to the
            Site if you breach these Terms or misuse the platform. Upon
            termination, your right to use the Site will immediately end.
          </p>

          <h3>12. Governing Law</h3>
          <p>
            These Terms shall be governed by and construed under the laws of
            India, with exclusive jurisdiction in the courts of Ahmedabad,
            Gujarat.
          </p>

          <h3>13. Changes to Terms</h3>
          <p>
            We may update or revise these Terms at any time. Changes will be
            posted on this page with an updated "Effective Date." Continued use
            of the Site constitutes your acceptance of the revised Terms.
          </p>

          <h3>14. Contact Us</h3>
          <p>
            For questions about these Terms of Use, please contact us at:{" "}
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

export default TermsOfUse;
