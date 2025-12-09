import React, { useEffect } from "react";
import "./Policies.css";

const ReturnPolicy = () => {
  useEffect(() => {
    if (window.fbq) window.fbq("track", "ReturnPolicyPageView");
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
          <h1 className="main-heading">Returns & Exchange Policy</h1>

          <p className="effective-date">Effective Date: October 10, 2025</p>

          <h3>Exchanges Only</h3>
          <p>
            At Namunjii, we do not offer returns or refunds. Exchanges are
            accepted only in the following cases:
          </p>
          <ul>
            <li>You received a defective product.</li>
            <li>The product was damaged on arrival.</li>
            <li>You received the wrong product.</li>
          </ul>

          <h3>How to Request an Exchange</h3>
          <p>
            You can initiate an exchange within 7 days of delivery by either:
          </p>
          <ul>
            <li>
              Submitting an exchange request directly through your order page on
              the Namunjii website, or
            </li>
            <li>
              Email us at{" "}
              <a href="mailto:support@namunjii.com">support@namunjii.com</a>{" "}
              with your order number and reason for exchange.
            </li>
          </ul>

          <h3>Exchange Conditions</h3>
          <ul>
            <li>
              Products must be unused, in original condition, and with all
              original packaging, labels, and tags intact.
            </li>
            <li>
              Exchange requests made after 7 days of delivery will not be
              accepted.
            </li>
            <li>
              Once your request is approved, our logistics partner will arrange
              the pickup and delivery of the replacement product.
            </li>
          </ul>

          <h3>Shipping Costs</h3>
          <ul>
            <li>
              For approved exchanges due to defective, damaged, or wrong
              product, the cost of pickup and redelivery will be borne by the
              designer/brand.
            </li>
            <li>
              Customers do not have to pay any additional exchange shipping
              charges.
            </li>
          </ul>

          <h3>Important Notes</h3>
          <ul>
            <li>Refunds are not provided under any circumstances.</li>
            <li>
              Exchange is limited to a replacement of the same product (same
              style, different size in case available) or a corrected item.
            </li>
            <li>
              If a replacement is not available, Namunjii will work with the
              designer/brand to provide an alternative solution.
            </li>
          </ul>

          <h3>Contact Us</h3>
          <p>
            For any queries, write to us at{" "}
            <a href="mailto:support@namunjii.com">support@namunjii.com</a>.
          </p>

          <p>
            <strong>Last Updated:</strong> October 10, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
