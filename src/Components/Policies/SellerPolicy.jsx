import React, { useEffect } from "react";
import "./Policies.css";

const SellerPolicy = () => {
  useEffect(() => {
    if (window.fbq) window.fbq("track", "SellerPolicyPageView");
  }, []);
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
          <h1 className="main-heading">Seller Policy</h1>

          <p className="effective-date">Effective Date: October 10, 2025</p>

          <p>
            Welcome to Namunjii. By onboarding as a Designer/Brand/Vendor
            ("Seller"), you agree to the below key policies. This is a
            plain-language summary; the Vendor Agreement prevails in case of any
            conflict.
          </p>

          <h3>1. How we work</h3>
          <ul>
            <li>
              <strong>Online first, data-driven offline:</strong> Your products
              go live on Namunjii e-commerce first. Based on performance and
              AI-backed insights, we may invite you to place selected SKUs at
              premium offline partner stores.
            </li>
            <li>
              <strong>Fees & Commission:</strong> For the first 12 months, no
              platform or marketing fees. We charge 25% commission on net sales
              actually made on Namunjii. No hidden costs.
            </li>
            <li>
              <strong>Payouts:</strong> Customers pay Namunjii at checkout. You
              fulfill using our designated logistics partner. We pay you twice
              monthly (bi-monthly) against your portal-generated invoice, net of
              commission/adjustments per policy.
            </li>
          </ul>

          <h3>2. Listing & Quality</h3>
          <ul>
            <li>
              <strong>Accurate info is mandatory:</strong> Sizes, fabric
              composition, care, MRP (GST-inclusive), lead times, and images
              must be correct and high quality.
            </li>
            <li>
              <strong>Authenticity:</strong> Only genuine, safe products. No
              counterfeit or IP-infringing listings.
            </li>
            <li>
              <strong>Compliance:</strong> Follow all labeling and legal
              requirements applicable to your products.
            </li>
          </ul>

          <h3>3. Pricing</h3>
          <p>
            <strong>No undercutting:</strong> The same SKU must not be cheaper
            on your own website/stores or other marketplaces than on Namunjii,
            except for pre-approved, public seasonal promotions.
          </p>

          <h3>4. Orders, Shipping & SLA</h3>
          <ul>
            <li>
              <strong>Logistics:</strong> Use Namunjii's approved logistics flow
              and packaging/labeling standards.
            </li>
            <li>
              <strong>Dispatch timelines:</strong> Ready-to-ship: within 2–3
              business days (unless otherwise stated). Made-to-order: as per
              your listed lead time.
            </li>
          </ul>

          <h3>5. Returns/Exchanges</h3>
          <p>
            <strong>Exchange-only policy:</strong> No returns. Exchanges allowed
            for defective/damaged/wrong items within the stated window via the
            Namunjii portal. Redelivery/pickup costs are borne by Seller for
            approved exchanges.
          </p>

          <h3>6. Support & Conduct</h3>
          <ul>
            <li>
              <strong>Customer service:</strong> Respond to tickets within 24
              business hours.
            </li>
            <li>
              <strong>No diversion:</strong> Don't insert leaflets/QRs/coupons
              to take customers off-platform. No fake or incentivized reviews.
            </li>
          </ul>

          <h3>7. KYC & Tax</h3>
          <p>
            <strong>Onboarding docs:</strong> Business details, bank details,
            PAN, and Aadhaar of owner/authorized signatory for KYC. GST is not
            mandatory to start; you're responsible for compliance if/when
            thresholds apply.
          </p>

          <h3>8. Data & IP</h3>
          <ul>
            <li>
              <strong>Use of brand assets:</strong> You permit Namunjii to use
              your brand name, logos, and product content to market and sell
              your products on/through our channels during the term.
            </li>
            <li>
              <strong>Customer data:</strong> Used only for order fulfillment
              and platform operations.
            </li>
          </ul>

          <h3>9. Delisting/Termination</h3>
          <p>
            We may delist or suspend SKUs for quality/safety/non-compliance.
            Either party may end the engagement per the Agreement.
          </p>

          <h3>10. Disputes</h3>
          <p>
            Governed by Indian law; arbitration/venue per the Vendor Agreement.
          </p>

          <p>
            <strong>Last Updated:</strong> October 10, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerPolicy;
