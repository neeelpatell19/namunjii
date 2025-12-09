import React, { useEffect } from "react";
import "./Policies.css";

const ShippingPolicy = () => {

  useEffect(() => {
    if(window.fbq)
  window.fbq("track", "ShippingPolicyPageView");
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
          <h1 className="main-heading">Shipping Policy</h1>

          <p className="effective-date">Effective Date: October 10, 2025</p>

          <h3>Stock Availability</h3>
          <p>
            We work hard to keep our website inventory accurate and up to date.
            In the unlikely event that a product you ordered is unavailable, we
            will get in touch with you to arrange either a restock timeline or a
            refund.
          </p>

          <h3>Shipping Costs</h3>
          <p>
            Shipping charges are calculated automatically at checkout based on
            the order weight, package dimensions, and delivery location. The
            final shipping amount will be clearly shown before you confirm your
            purchase.
          </p>

          <h3>Order Processing & Dispatch</h3>
          <ul>
            <li>
              <strong>Ready-to-Ship Products:</strong> Generally dispatched
              within 5 business days of payment confirmation.
            </li>
            <li>
              <strong>Made-to-Order Products:</strong> May take up to 10
              business days to dispatch.
            </li>
            <li>
              <strong>Mixed Orders:</strong> If your order includes both
              ready-to-ship and made-to-order items, available items will be
              dispatched first, and the rest will follow once prepared.
            </li>
          </ul>

          <h3>Change of Delivery Address</h3>
          <p>
            You can request a change in delivery address any time before your
            order has been dispatched. To update your address, please email us
            at <a href="mailto:support@namunjii.com">support@namunjii.com</a>{" "}
            with your order number and new address details.
          </p>

          <h3>Order Tracking</h3>
          <p>
            After dispatch, you will receive an email with a tracking link so
            you can follow the progress of your shipment.
          </p>

          <h3>Delivery Delays</h3>
          <p>
            If your order does not arrive within the expected delivery timeline,
            please reach out to us at{" "}
            <a href="mailto:support@namunjii.com">support@namunjii.com</a> with
            your order details, and we will investigate promptly.
          </p>

          <p>
            <strong>Last Updated:</strong> October 10, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
