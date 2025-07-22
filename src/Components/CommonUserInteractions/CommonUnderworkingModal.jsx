import React from "react";
import { Modal, Button } from "antd";

const luxurySvg = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 16px auto' }}>
    <circle cx="32" cy="32" r="32" fill="#b79a80"/>
    <path d="M32 18L36.4721 28.9443L48 30.1803L39 38.0557L41.4721 49.8197L32 43.0557L22.5279 49.8197L25 38.0557L16 30.1803L27.5279 28.9443L32 18Z" fill="white"/>
  </svg>
);

const modalContentStyle = {
  textAlign: 'center',
  fontFamily: 'Poppins, serif',
  padding: '12px 0 0 0',
};
const headingStyle = {
  fontWeight: 600,
  fontSize: 22,
  color: '#222',
  marginBottom: 8,
  letterSpacing: 0.5,
};
const textStyle = {
  color: '#555',
  fontSize: 16,
  marginBottom: 0,
  lineHeight: 1.7,
};

const CommonUnderworkingModal = ({ open, onClose, children }) => (
  <Modal
    open={open}
    onCancel={onClose}
    footer={[
      <Button key="close" onClick={onClose} type="primary" style={{ background: '#b79a80', border: 'none', fontWeight: 500 }}>Close</Button>
    ]}
    centered
    bodyStyle={{ padding: '32px 24px 24px 24px', borderRadius: 16 }}
  >
    <div style={modalContentStyle}>
      {luxurySvg}
      <div style={headingStyle}>Coming Soon</div>
      <div style={textStyle}>
        {children || (
          <>
            This luxury feature is currently under development.<br />
            Please check back soon for an elevated experience.
          </>
        )}
      </div>
    </div>
  </Modal>
);

export default CommonUnderworkingModal; 