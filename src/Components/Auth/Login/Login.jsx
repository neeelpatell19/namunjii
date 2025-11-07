import React, { useState, useEffect } from "react";
import { Input, Button, message, Select } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import "./Login.css";

// Common country codes for India and Gulf region
const countryCodes = [
  { value: "+91", label: "+91", flag: "🇮🇳", country: "India" },
  { value: "+971", label: "+971", flag: "🇦🇪", country: "UAE" },
  { value: "+966", label: "+966", flag: "🇸🇦", country: "Saudi Arabia" },
  { value: "+965", label: "+965", flag: "🇰🇼", country: "Kuwait" },
  { value: "+974", label: "+974", flag: "🇶🇦", country: "Qatar" },
  { value: "+973", label: "+973", flag: "🇧🇭", country: "Bahrain" },
  { value: "+968", label: "+968", flag: "🇴🇲", country: "Oman" },
  { value: "+1", label: "+1", flag: "🇺🇸", country: "USA/Canada" },
  { value: "+44", label: "+44", flag: "🇬🇧", country: "UK" },
];

const Login = () => {
  const [step, setStep] = useState("phone"); // 'phone' or 'otp'
  const [countryCode, setCountryCode] = useState("+91"); // Default to India
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // OTP input refs
  const otpInputs = Array(6).fill(null);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only numbers
    // Allow up to 15 digits (international standard)
    if (value.length <= 15) {
      setPhone(value);
    }
  };

  const getPhoneNumberPlaceholder = () => {
    if (countryCode === "+91") return "Enter 10-digit phone number";
    if (countryCode === "+971") return "Enter 9-digit phone number";
    if (countryCode === "+966") return "Enter 9-digit phone number";
    return "Enter phone number";
  };

  const validatePhoneNumber = () => {
    if (!phone) {
      message.error("Please enter your phone number");
      return false;
    }

    // Basic validation based on country code
    if (countryCode === "+91" && phone.length !== 10) {
      message.error("Please enter a valid 10-digit phone number");
      return false;
    }
    
    if ((countryCode === "+971" || countryCode === "+966") && phone.length !== 9) {
      message.error("Please enter a valid 9-digit phone number");
      return false;
    }

    // Minimum length check for other countries
    if (phone.length < 7) {
      message.error("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handlePhoneSubmit = async () => {
    if (!validatePhoneNumber()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: API call to send OTP
      // await authApi.sendOTP({ phone: `${countryCode}${phone}`, countryCode, phone });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setStep("otp");
      setCountdown(60);
      message.success("OTP sent to your phone number");
    } catch (error) {
      message.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return; // Only single digit
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    const otpString = newOtpValues.join("");
    setOtp(otpString);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtpValues = Array(6).fill("");
    pastedData.split("").forEach((digit, index) => {
      if (index < 6) newOtpValues[index] = digit;
    });
    setOtpValues(newOtpValues);
    setOtp(pastedData);
    
    // Focus last filled input or first empty
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    const nextInput = document.getElementById(`otp-${lastFilledIndex}`);
    if (nextInput) nextInput.focus();
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      message.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      // TODO: API call to verify OTP and login/register
      // await authApi.verifyOTP({ phone: `${countryCode}${phone}`, countryCode, phone, otp });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      message.success("Login successful!");
      // TODO: Handle successful login (update Redux state, redirect, etc.)
    } catch (error) {
      message.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      // TODO: API call to resend OTP
      // await authApi.sendOTP({ phone: `${countryCode}${phone}`, countryCode, phone });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setCountdown(60);
      setOtpValues(Array(6).fill(""));
      setOtp("");
      message.success("OTP resent successfully");
    } catch (error) {
      message.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtpValues(Array(6).fill(""));
    setOtp("");
    setCountdown(0);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img
              src="/LogoImages/BrandColorIconLogo.svg"
              alt="Namunjii"
            />
          </div>
          <h1 className="login-title">
            {step === "phone" ? "Welcome Back" : "Verify OTP"}
          </h1>
          <p className="login-subtitle">
            {step === "phone"
              ? "Enter your phone number to continue"
              : `We've sent a 6-digit OTP to ${countryCode} ${phone}`}
          </p>
        </div>

        <div className="login-form">
          {step === "phone" ? (
            <div className="phone-step">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="phone-input-wrapper">
                  <Select
                    value={countryCode}
                    onChange={setCountryCode}
                    className="country-code-select"
                    options={countryCodes.map((code) => ({
                      value: code.value,
                      label: (
                        <span className="country-code-option">
                          <span className="country-flag">{code.flag}</span>
                          <span className="country-code-value">{code.label}</span>
                        </span>
                      ),
                    }))}
                    showSearch
                    filterOption={(input, option) =>
                      option?.value?.toLowerCase().includes(input.toLowerCase()) ||
                      countryCodes.find(c => c.value === option?.value)?.country.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                  <Input
                    size="large"
                    prefix={<PhoneOutlined />}
                    placeholder={getPhoneNumberPlaceholder()}
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                    className="phone-input"
                    onPressEnter={handlePhoneSubmit}
                  />
                </div>
              </div>
              <Button
                type="primary"
                size="large"
                block
                loading={loading}
                onClick={handlePhoneSubmit}
                className="submit-button"
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="otp-step">
              <div className="form-group">
                <label className="form-label">Enter OTP</label>
                <div className="otp-inputs">
                  {otpInputs.map((_, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpValues[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="otp-input"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>
              <Button
                type="primary"
                size="large"
                block
                loading={loading}
                onClick={handleOtpSubmit}
                className="submit-button"
                disabled={otp.length !== 6}
              >
                Verify & Login
              </Button>
              <div className="otp-actions">
                <Button
                  type="link"
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                  className="resend-button"
                >
                  {countdown > 0
                    ? `Resend OTP in ${countdown}s`
                    : "Resend OTP"}
                </Button>
                <Button type="link" onClick={handleBackToPhone} className="back-button">
                  Change Phone Number
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="login-footer">
          <p className="footer-text">
            By continuing, you agree to Namunjii's{" "}
            <a href="/terms-of-use" className="footer-link">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="footer-link">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

