import React, { useState, useRef } from "react";
import "./VendorVerification.css";
import { Link } from "react-router-dom";

const initialState = {
    fullName: "",
    email: "",
    brandName: "",
    brandDescription: "",
    portfolio: null,
    socialLinks: [],
    productCategories: [],
    priceRange: "",
    whyNamunjii: "",
    termsAccepted: false,
};

const categories = [
    "Apparel",
    "Accessories",
    "Footwear",
    "Jewelry",
];

const VendorVerification = () => {
    const [form, setForm] = useState(initialState);
    const [socialLinkInput, setSocialLinkInput] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const apibaseUrl = import.meta.env.VITE_BASE_URL;
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox" && name === "termsAccepted") {
            setForm({ ...form, [name]: checked });
        } else if (type === "checkbox" && name === "productCategories") {
            let updated = [...form.productCategories];
            if (checked) {
                updated.push(value);
            } else {
                updated = updated.filter((cat) => cat !== value);
            }
            setForm({ ...form, productCategories: updated });
        } else if (type === "file") {
            setForm({ ...form, portfolio: files[0] });
        } else if (name !== "socialLinks") {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSocialLinkInputChange = (e) => {
        setSocialLinkInput(e.target.value);
    };

    const handleAddSocialLink = (e) => {
        e.preventDefault();
        const link = socialLinkInput.trim();
        if (!link) return;
        if (form.socialLinks.includes(link)) return;
        setForm({ ...form, socialLinks: [...form.socialLinks, link] });
        setSocialLinkInput("");
    };

    const handleRemoveSocialLink = (linkToRemove) => {
        setForm({
            ...form,
            socialLinks: form.socialLinks.filter((l) => l !== linkToRemove),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const errors = validateForm();
        setErrors(errors);
        if (Object.keys(errors).length > 0) {
            showMessage('error', 'Please fix the errors in the form.');
            setSubmitting(false);
            return;
        }
        // Parse price range
        const [start, end] = form.priceRange.split('-').map(s => parseInt(s.trim(), 10));
        const payload = {
            fullName: form.fullName,
            emailAddress: form.email,
            brandName: form.brandName,
            brandDescription: form.brandDescription,
            portfolioUpload: form.portfolioUrl,
            socialMediaLinks: form.socialLinks,
            productCategories: form.productCategories,
            priceRange: { start, end },
            whyNamunjii: form.whyNamunjii,
        };
        try {
            const res = await fetch(`${apibaseUrl}/namunjii/addVendorVerification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                showMessage('success', 'Application submitted successfully!');
                setSuccess(true);
                setForm(initialState);
                window.scrollTo(0, 0);
            } else {
                showMessage('error', 'Failed to submit application.');
            }
        } catch (err) {
            showMessage('error', 'Unexpected error submitting application.');
        } finally {
            setSubmitting(false);
        }
    };

    // Check if the form is valid for submission
    const isFormValid = () => {
        return (
            form.fullName.trim() !== "" &&
            form.email.trim() !== "" &&
            form.brandName.trim() !== "" &&
            form.brandDescription.trim() !== "" &&
            form.portfolio !== null &&
            form.priceRange.trim() !== "" &&
            form.whyNamunjii.trim() !== "" &&
            form.productCategories.length > 0 &&
            form.termsAccepted
        );
    };

    // Helper for showing messages (replace with AntD if available)
    const showMessage = (type, msg) => {
        if (type === 'error') window.alert(msg);
        else if (type === 'success') window.alert(msg);
    };

    // Validate form fields according to backend schema
    const validateForm = () => {
        const errors = {};
        if (!form.fullName.trim()) errors.fullName = 'Full Name is required.';
        if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'Valid Email Address is required.';
        if (!form.brandName.trim()) errors.brandName = 'Brand Name is required.';
        if (!form.brandDescription.trim()) errors.brandDescription = 'Brand Description is required.';
        if (!form.portfolioUrl) errors.portfolioUpload = 'Portfolio upload is required.';
        if (!form.socialLinks || !Array.isArray(form.socialLinks) || form.socialLinks.length === 0) errors.socialMediaLinks = 'At least one social media link is required.';
        if (!form.productCategories || !Array.isArray(form.productCategories) || form.productCategories.length === 0) errors.productCategories = 'At least one product category is required.';
        if (!form.priceRange.trim() || !/^\s*\d+\s*-\s*\d+\s*$/.test(form.priceRange)) errors.priceRange = 'Price Range must be in format: start - end (e.g. 100 - 500)';
        if (!form.whyNamunjii.trim()) errors.whyNamunjii = 'This field is required.';
        if (!form.termsAccepted) errors.termsAccepted = 'You must agree to the terms.';
        return errors;
    };

    // Upload file to AWS S3 using upload policy API
    const handlePortfolioUpload = async (file) => {
        if (!file) return;
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg"
        ];
        if (!allowedTypes.includes(file.type)) {
            showMessage("error", "Only PDF, JPG, JPEG, or PNG files are allowed!");
            return;
        }
        setUploading(true);
        try {
            const response = await fetch(`${apibaseUrl}/chats/uploadPolicy`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWJkNGM4YWQ3NzczMjc5YzVhZTM4MCIsInJvbGUiOiJtb2RlcmF0b3IiLCJleHAiOjE3MzAwMjc4MzksInBocyI6e30sImlhdCI6MTcyNDg0MzgzOH0.gNjc_Z5LD9vqtZ7V15CQhXsAdXrhbW9OEwOMEDz7MMg`,
                },
                body: JSON.stringify({
                    fileName: encodeURIComponent(file.name),
                    mime: file.type,
                    acl: "public-read",
                }),
            });
            const data = await response.json();
            if (data?.data?.fields && data?.data?.url) {
                const formData = new FormData();
                Object.entries(data.data.fields).forEach(([key, value]) => formData.append(key, value));
                formData.append("file", file);
                const uploadResponse = await fetch(data.data.url, {
                    method: "POST",
                    body: formData,
                });
                if (uploadResponse.ok) {
                    const finalUrl = `${data.data.url}/${encodeURIComponent(data.filePath)}`;
                    showMessage("success", `${file.name} was uploaded successfully!`);
                    setForm(f => ({ ...f, portfolio: file, portfolioUrl: finalUrl }));
                } else {
                    showMessage("error", "S3 upload failed");
                }
            } else {
                showMessage("error", "Upload policy generation failed");
            }
        } catch (error) {
            showMessage("error", "Unexpected error during portfolio upload");
        } finally {
            setUploading(false);
        }
    };

    // Drag and drop handlers for portfolio upload
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handlePortfolioUpload(e.dataTransfer.files[0]);
        }
    };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handlePortfolioUpload(e.target.files[0]);
        }
    };
    const handleFileAreaClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <div className="MainContainer paddingBottom50 VendorVerificationPage marginTop50">
                <div className="PaddingTop">
                    <div className="Container">
                        <div className="breadCrumbContainer  marginBottom20 marginTop20">
                            <Link to="/">Home</Link>
                            <span> | </span>
                            <Link to="/vendor-verification" className="ColorBlack">Join Us</Link>
                        </div>
                        <div className="marginBottom50">
                            <div className="CommonFlexGap ">
                            <h2>Are You Desinger</h2>
                            {/* <br /> */}
                            <p><b><i>Want To Join us</i> </b></p>
                            </div>
                           
                            <p></p>
                            <div className="VendorVerificationFormContainer marginTop50">
                                {success && (
                                    <div className="success-message">Thank you for submitting your application! We will review and get back to you soon.</div>
                                )}
                                <form className="vendor-form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Full Name<span className="required">*</span></label>
                                        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Enter your full name" />
                                        {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address<span className="required">*</span></label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Enter your email address" />
                                        {errors.email && <p className="error-message">{errors.email}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label>Brand Name<span className="required">*</span></label>
                                        <input type="text" name="brandName" value={form.brandName} onChange={handleChange} required placeholder="Enter your brand name" />
                                        {errors.brandName && <p className="error-message">{errors.brandName}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label>Brand Description<span className="required">*</span></label>
                                        <textarea name="brandDescription" value={form.brandDescription} onChange={handleChange} required rows={4} placeholder="Tell us about your brand (3-4 sentences)"></textarea>
                                        {errors.brandDescription && <p className="error-message">{errors.brandDescription}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label>Portfolio/Lookbook Upload<span className="required">*</span></label>
                                        <div
                                            className={`drag-drop-area${dragActive ? " drag-active" : ""}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={handleFileAreaClick}
                                            tabIndex={0}
                                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleFileAreaClick()}
                                            role="button"
                                            aria-label="Upload Portfolio or Lookbook"
                                        >
                                            <input
                                                type="file"
                                                name="portfolio"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                ref={fileInputRef}
                                                style={{ display: "none" }}
                                                onChange={handleFileChange}
                                                required
                                            />
                                            {form.portfolio ? (
                                                <div className="file-selected">
                                                    <span className="file-icon">
                                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="24" height="24" rx="4" fill="#E5E7EB" />
                                                            <path d="M7 7H13V9H7V7ZM7 11H17V13H7V11ZM7 15H17V17H7V15Z" fill="#36424e" />
                                                        </svg>
                                                    </span>
                                                    <span className="file-name">{form.portfolio.name}</span>
                                                    {uploading && <span style={{ marginLeft: 8, color: '#888', fontSize: 14 }}>Uploading...</span>}
                                                    {form.portfolioUrl && !uploading && (
                                                        <span style={{ marginLeft: 8, color: '#1a7f37', fontSize: 14 }}>Uploaded</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="drag-drop-prompt">
                                                    <span className="drag-drop-icon">
                                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="24" height="24" rx="4" fill="#E5E7EB" />
                                                            <path d="M7 7H13V9H7V7ZM7 11H17V13H7V11ZM7 15H17V17H7V15Z" fill="#36424e" />
                                                        </svg>
                                                    </span>
                                                    <span className="drag-drop-text">Click or drag file to upload</span>
                                                    <span className="drag-drop-hint">Support for PDF, JPG, JPEG, PNG files only</span>
                                                </div>
                                            )}
                                        </div>
                                        {errors.portfolioUpload && <p className="error-message">{errors.portfolioUpload}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label>Social Media Links</label>
                                        <div className="social-links-input-row">
                                            <input
                                                type="text"
                                                name="socialLinksInput"
                                                value={socialLinkInput}
                                                onChange={handleSocialLinkInputChange}
                                                placeholder="Paste a link (Instagram, Facebook, etc.)"
                                            />
                                            <button className="add-link-btn" onClick={handleAddSocialLink} type="button" disabled={!socialLinkInput.trim() || form.socialLinks.includes(socialLinkInput.trim())}>
                                                Add Link
                                            </button>
                                        </div>
                                        <div className="social-links-list">
                                            {form.socialLinks.map((link, idx) => (
                                                <div className="social-link-item" key={link}>
                                                    <span className="social-link-url">{link}</span>
                                                    <button type="button" className="remove-link-btn" onClick={() => handleRemoveSocialLink(link)} title="Remove">
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.socialMediaLinks && <p className="error-message">{errors.socialMediaLinks}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label>Product Categories<span className="required">*</span></label>
                                        <div className="checkbox-group">
                                            {categories.map((cat) => (
                                                <label key={cat} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        name="productCategories"
                                                        value={cat}
                                                        checked={form.productCategories.includes(cat)}
                                                        onChange={handleChange}
                                                    />
                                                    {cat}
                                                </label>
                                            ))}
                                        </div>
                                        {errors.productCategories && <p className="error-message">{errors.productCategories}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label>Price Range<span className="required">*</span></label>
                                        <input type="text" name="priceRange" value={form.priceRange} onChange={handleChange} required placeholder="e.g. ₹ 50 - ₹ 500" />
                                        {errors.priceRange && <p className="error-message">{errors.priceRange}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label>Why Namunjii?<span className="required">*</span></label>
                                        <textarea name="whyNamunjii" value={form.whyNamunjii} onChange={handleChange} required rows={3} placeholder="Why do you want to join us?"></textarea>
                                        {errors.whyNamunjii && <p className="error-message">{errors.whyNamunjii}</p>}
                                    </div>
                                    <div className="form-group terms">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="termsAccepted"
                                                checked={form.termsAccepted}
                                                onChange={handleChange}
                                                required
                                            />
                                            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">terms and conditions</a>.<span className="required">*</span>
                                        </label>
                                        {errors.termsAccepted && <p className="error-message">{errors.termsAccepted}</p>}
                                    </div>
                                    <button className="CommonBtn" type="submit" disabled={submitting || !isFormValid()}>
                                        <span>{submitting ? "Submitting..." : "Submit Application"}</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorVerification;