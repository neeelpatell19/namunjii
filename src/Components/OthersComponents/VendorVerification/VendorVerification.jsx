import React, { useState, useRef, useEffect } from "react";
import "./VendorVerification.css";
import { Link } from "react-router-dom";
import { IoCloudUploadSharp } from "react-icons/io5";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const initialState = {
  fullName: "",
  email: "",
  mobileNumber: "",
  brandName: "",
  brandDescription: "",
  portfolio: null,
  socialLinks: [],
  productCategories: [],
  priceRange: "",
  // describeYourBrand: "",
  describeYourIdealCustomer: "",
  whyNamunjii: "",
  termsAccepted: false,
};

const mainCategories = {
  "Mens Wear": ["Shirts", "Blazers", "Vest Coats"],
  "Womens Wear": ["Dresses", "Tunics", "Kurtas"],
};

const allCategories = [
  ...mainCategories["Mens Wear"],
  ...mainCategories["Womens Wear"],
  "Other",
];

const VendorVerification = () => {
  useEffect(() => {
    if (window.fbq) window.fbq("track", "VenderVerificationPageView");
  }, []);
  const STORAGE_KEY = "vendorVerificationForm";

  // Initialize form with data from localStorage if available
  const [form, setForm] = useState(() => {
    try {
      const savedForm = localStorage.getItem(STORAGE_KEY);
      if (savedForm) {
        const parsed = JSON.parse(savedForm);
        // Always restore saved data, even if minimal
        // Merge saved data with initial state to ensure all fields exist
        const restoredData = { ...initialState, ...parsed, portfolio: null }; // Don't restore file from localStorage
        return restoredData;
      }
    } catch (error) {
      console.warn("Failed to parse saved form data:", error);
    }
    return initialState;
  });

  // Initialize socialLinkInput with data from localStorage if available
  const [socialLinkInput, setSocialLinkInput] = useState(() => {
    try {
      const savedForm = localStorage.getItem(STORAGE_KEY);
      if (savedForm) {
        const parsed = JSON.parse(savedForm);
        return parsed.socialLinkInput || "";
      }
    } catch (error) {
      console.warn("Failed to parse saved socialLinkInput:", error);
    }
    return "";
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dataRestored, setDataRestored] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [selectedMainCategories, setSelectedMainCategories] = useState([]);
  const apibaseUrl = import.meta.env.VITE_BASE_URL;
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox" && name === "termsAccepted") {
      setForm({ ...form, [name]: checked });
    } else if (type === "checkbox" && name === "productCategories") {
      let updated = [...form.productCategories];

      if (checked) {
        if (value === "Other") {
          setShowCustomCategoryInput(true);
          updated.push(value);
        } else {
          updated.push(value);
        }
      } else {
        if (value === "Other") {
          setShowCustomCategoryInput(false);
          setCustomCategory("");
          // Remove custom category if it exists
          updated = updated.filter(
            (cat) => cat !== "Other" && cat !== customCategory
          );
        } else {
          updated = updated.filter((cat) => cat !== value);
        }
      }

      setForm({ ...form, productCategories: updated });
    } else if (type === "file") {
      setForm({ ...form, portfolio: files[0] });
    } else if (name !== "socialLinks") {
      // Simple validation: prevent 2 or more consecutive blank spaces
      let processedValue = value;
      if (type === "text" || type === "email" || type === "textarea") {
        // Remove 2 or more consecutive spaces, replace with single space
        processedValue = value.replace(/\s{2,}/g, " ");
        // If the result is only spaces, clear it completely
        if (processedValue.trim() === "") {
          processedValue = "";
        }
      }

      // Special handling for WhatsApp number - only allow digits and limit to 10
      if (name === "mobileNumber") {
        // PhoneInput component handles validation automatically
        processedValue = value;
      }

      // Auto-capitalize first letter of each word for specific fields
      if ((name === "fullName" || name === "brandName") && processedValue) {
        processedValue = processedValue.replace(/\b\w/g, (char) =>
          char.toUpperCase()
        );
      }

      setForm({ ...form, [name]: processedValue });
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

    // Validate URL format
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      showMessage(
        "error",
        "Please enter a valid URL starting with https:// or http://"
      );
      return;
    }

    // Additional URL validation
    try {
      new URL(link);
    } catch (error) {
      showMessage("error", "Please enter a valid URL format");
      return;
    }

    setForm({ ...form, socialLinks: [...form.socialLinks, link] });
    setSocialLinkInput("");
  };

  const handleRemoveSocialLink = (linkToRemove) => {
    setForm({
      ...form,
      socialLinks: form.socialLinks.filter((l) => l !== linkToRemove),
    });
  };

  const handleCustomCategoryChange = (e) => {
    const value = e.target.value;
    setCustomCategory(value);

    // Don't update form until user finishes typing (onBlur or when they stop typing)
    // This prevents saving every single character
  };

  const handleCustomCategoryBlur = () => {
    // Don't replace "Other" in the array - keep it there for checkbox state
    // The custom category is handled separately in the API payload logic
    // This ensures the checkbox stays checked
  };

  const handleMainCategoryChange = (mainCategory, checked) => {
    let updatedMainCategories = [...selectedMainCategories];

    if (checked) {
      updatedMainCategories.push(mainCategory);
    } else {
      updatedMainCategories = updatedMainCategories.filter(
        (cat) => cat !== mainCategory
      );
      // Remove all subcategories of this main category from form
      const subcategoriesToRemove = mainCategories[mainCategory];
      const updatedFormCategories = form.productCategories.filter(
        (cat) => !subcategoriesToRemove.includes(cat)
      );
      setForm({ ...form, productCategories: updatedFormCategories });
    }

    setSelectedMainCategories(updatedMainCategories);
  };

  const handleSubcategoryChange = (subcategory, checked) => {
    let updated = [...form.productCategories];

    if (checked) {
      updated.push(subcategory);
    } else {
      updated = updated.filter((cat) => cat !== subcategory);
    }

    setForm({ ...form, productCategories: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const errors = validateForm();
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      showMessage("error", "Please fix the errors in the form.");
      setSubmitting(false);
      return;
    }

    // Parse price range
    const [start, end] = form.priceRange
      .split("-")
      .map((s) => parseInt(s.trim(), 10));

    // Transform product categories to match API schema
    const structuredProductCategories = [];

    // Add main categories with their subcategories
    selectedMainCategories.forEach((mainCat) => {
      const subcategories = form.productCategories.filter((cat) =>
        mainCategories[mainCat].includes(cat)
      );
      if (subcategories.length > 0) {
        structuredProductCategories.push({
          mainCategory: mainCat,
          subcategories: subcategories,
        });
      }
    });

    // Add "Other" category if selected
    if (form.productCategories.includes("Other") && customCategory.trim()) {
      structuredProductCategories.push({
        mainCategory: "Other",
        subcategories: [],
        otherSpecification: customCategory.trim(),
      });
    }

    const payload = {
      fullName: form.fullName,
      emailAddress: form.email,
      mobileNumber: form.mobileNumber,
      brandName: form.brandName,
      brandDescription: form.brandDescription,
      portfolioUpload: form.portfolioUrl,
      socialMediaLinks: form.socialLinks,
      productCategories: structuredProductCategories,
      priceRange: { start, end },
      // describeYourBrand: form.describeYourBrand,
      describeYourIdealCustomer: form.describeYourIdealCustomer,
      whyNamunjii: form.whyNamunjii,
    };
    try {
      const res = await fetch(`${apibaseUrl}/namunjii/addVendorVerification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showMessage("success", "Application submitted successfully!");
        setSuccess(true);
        setForm(initialState);
        setSocialLinkInput("");
        setErrors({});
        // Clear localStorage on successful submission
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          console.warn("Failed to clear localStorage on submission:", error);
        }
        window.scrollTo(0, 0);
      } else {
        showMessage("error", "Failed to submit application.");
      }
    } catch (err) {
      showMessage("error", "Unexpected error submitting application.");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if the form is valid for submission
  const isFormValid = () => {
    // Check if at least one main category is selected
    const hasMainCategory = selectedMainCategories.length > 0;

    // Check if at least one subcategory is selected or "Other" is selected
    let hasSubcategories = false;
    selectedMainCategories.forEach((mainCat) => {
      const subcategories = form.productCategories.filter((cat) =>
        mainCategories[mainCat].includes(cat)
      );
      if (subcategories.length > 0) {
        hasSubcategories = true;
      }
    });

    const hasOtherCategory =
      form.productCategories.includes("Other") &&
      customCategory.trim().length >= 2;

    return (
      form.fullName.trim() !== "" &&
      form.email.trim() !== "" &&
      form.mobileNumber &&
      form.brandName.trim() !== "" &&
      form.brandDescription.trim() !== "" &&
      form.portfolio !== null &&
      form.priceRange.trim() !== "" &&
      // form.describeYourBrand.trim() !== "" &&
      form.describeYourIdealCustomer.trim() !== "" &&
      form.whyNamunjii.trim() !== "" &&
      hasMainCategory &&
      (hasSubcategories || hasOtherCategory)
      // form.termsAccepted - temporarily hidden
    );
  };

  // Helper for showing messages (replace with AntD if available)
  const showMessage = (type, msg) => {
    if (type === "error") window.alert(msg);
    else if (type === "success") window.alert(msg);
  };

  // Validate form fields according to backend schema
  const validateForm = () => {
    const errors = {};

    // Full Name validation - check for empty, spaces-only, and consecutive spaces
    if (!form.fullName.trim()) {
      errors.fullName = "Full Name is required.";
    } else if (form.fullName.trim().length < 2) {
      errors.fullName = "Full Name must be at least 2 characters long.";
    } else if (/\s{2,}/.test(form.fullName)) {
      errors.fullName = "2 or more consecutive blank spaces are not allowed.";
    } else if (/^\s+$/.test(form.fullName)) {
      errors.fullName = "Full Name cannot contain only spaces.";
    }

    // Email validation
    if (!form.email.trim()) {
      errors.email = "Email Address is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Phone Number validation
    if (!form.mobileNumber) {
      errors.mobileNumber = "WhatsApp Number is required.";
    } else if (!form.mobileNumber.startsWith("+")) {
      errors.mobileNumber = "Please select a valid country code.";
    } else if (form.mobileNumber.startsWith("+91")) {
      // For India, enforce exactly +91 followed by 10 digits
      if (!/^\+91\d{10}$/.test(form.mobileNumber)) {
        errors.mobileNumber =
          "For +91, please enter exactly 10 digits after country code.";
      }
    }

    // Brand Name validation - check for empty, spaces-only, and consecutive spaces
    if (!form.brandName.trim()) {
      errors.brandName = "Brand Name is required.";
    } else if (form.brandName.trim().length < 2) {
      errors.brandName = "Brand Name must be at least 2 characters long.";
    } else if (/\s{2,}/.test(form.brandName)) {
      errors.brandName = "2 or more consecutive blank spaces are not allowed.";
    } else if (/^\s+$/.test(form.brandName)) {
      errors.brandName = "Brand Name cannot contain only spaces.";
    }

    // Brand Description validation
    if (!form.brandDescription.trim()) {
      errors.brandDescription = "Brand Description is required.";
    } else if (form.brandDescription.trim().length < 20) {
      errors.brandDescription =
        "Brand Description must be at least 20 characters long.";
    }

    // Portfolio validation
    if (!form.portfolioUrl) {
      errors.portfolioUpload = "Portfolio upload is required.";
    }

    // Social Media Links validation
    if (
      !form.socialLinks ||
      !Array.isArray(form.socialLinks) ||
      form.socialLinks.length === 0
    ) {
      errors.socialMediaLinks = "At least one social media link is required.";
    } else {
      // Validate each social media link format
      for (let i = 0; i < form.socialLinks.length; i++) {
        const link = form.socialLinks[i];
        if (!link.startsWith("http://") && !link.startsWith("https://")) {
          errors.socialMediaLinks =
            "All social media links must start with https:// or http://";
          break;
        }
        try {
          new URL(link);
        } catch (error) {
          errors.socialMediaLinks =
            "Please enter valid URL formats for all social media links";
          break;
        }
      }
    }

    // Product Categories validation
    if (!selectedMainCategories || selectedMainCategories.length === 0) {
      errors.productCategories =
        "Please select at least one main category (Mens Wear or Womens Wear).";
    } else {
      let hasSelectedSubcategories = false;
      selectedMainCategories.forEach((mainCat) => {
        const subcategories = form.productCategories.filter((cat) =>
          mainCategories[mainCat].includes(cat)
        );
        if (subcategories.length > 0) {
          hasSelectedSubcategories = true;
        }
      });

      if (
        !hasSelectedSubcategories &&
        !form.productCategories.includes("Other")
      ) {
        errors.productCategories =
          'Please select at least one specific category or specify "Other".';
      }

      if (
        form.productCategories.includes("Other") &&
        (!customCategory || customCategory.trim().length < 2)
      ) {
        errors.productCategories =
          "Please specify a custom category (minimum 2 characters).";
      }
    }

    // Price Range validation
    if (!form.priceRange.trim()) {
      errors.priceRange = "Price Range is required.";
    } else if (!/^\s*\d+\s*-\s*\d+\s*$/.test(form.priceRange)) {
      errors.priceRange =
        "Price Range must be in format: start - end (e.g. 1000 - 10000)";
    } else {
      const [start, end] = form.priceRange
        .split("-")
        .map((s) => parseInt(s.trim(), 10));
      if (start >= end) {
        errors.priceRange = "Start price must be less than end price.";
      }
    }

    // Describe Your Brand validation
    // if (!form.describeYourBrand.trim()) {
    //   errors.describeYourBrand = "This field is required.";
    // } else if (form.describeYourBrand.trim().length < 10) {
    //   errors.describeYourBrand =
    //     "Please provide a more detailed response (minimum 10 characters).";
    // }

    // Describe Your Ideal Customer validation
    if (!form.describeYourIdealCustomer.trim()) {
      errors.describeYourIdealCustomer = "This field is required.";
    } else if (form.describeYourIdealCustomer.trim().length < 10) {
      errors.describeYourIdealCustomer =
        "Please provide a more detailed response (minimum 10 characters).";
    }

    // Why Namunjii validation
    if (!form.whyNamunjii.trim()) {
      errors.whyNamunjii = "This field is required.";
    } else if (form.whyNamunjii.trim().length < 10) {
      errors.whyNamunjii =
        "Please provide a more detailed response (minimum 10 characters).";
    }

    // Terms validation - temporarily hidden
    // if (!form.termsAccepted) {
    //     errors.termsAccepted = 'You must agree to the terms and conditions.';
    // }

    return errors;
  };

  // Upload file to AWS S3 using upload policy API
  const handlePortfolioUpload = async (file) => {
    if (!file) return;
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
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
        Object.entries(data.data.fields).forEach(([key, value]) =>
          formData.append(key, value)
        );
        formData.append("file", file);
        const uploadResponse = await fetch(data.data.url, {
          method: "POST",
          body: formData,
        });
        if (uploadResponse.ok) {
          const finalUrl = `${data.data.url}/${encodeURIComponent(
            data.filePath
          )}`;
          showMessage("success", `${file.name} was uploaded successfully!`);
          setForm((f) => ({ ...f, portfolio: file, portfolioUrl: finalUrl }));
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

  // Function to manually clear form and localStorage
  const clearForm = () => {
    setForm(initialState);
    setSocialLinkInput("");
    setCustomCategory("");
    setShowCustomCategoryInput(false);
    setSelectedMainCategories([]);
    setErrors({});
    setDataRestored(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      showMessage("success", "Form cleared successfully!");
    } catch (error) {
      console.warn("Failed to clear form data:", error);
    }
  };

  // Save to localStorage in real-time with minimal delay
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      try {
        // Create a copy of form data without the file object for localStorage
        const formDataToSave = {
          ...form,
          socialLinkInput: socialLinkInput, // Also save the current social link input
          customCategory: customCategory, // Save custom category
          showCustomCategoryInput: showCustomCategoryInput, // Save custom category input state
          selectedMainCategories: selectedMainCategories, // Save selected main categories
        };
        delete formDataToSave.portfolio; // Don't save file object
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formDataToSave));
      } catch (error) {
        console.warn("Failed to save form data to localStorage:", error);
      }
    }, 100); // Reduced delay for more real-time saving

    return () => clearTimeout(saveTimer);
  }, [form, socialLinkInput, selectedMainCategories, STORAGE_KEY]);

  // Clear localStorage on successful submission
  useEffect(() => {
    if (success) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn("Failed to clear saved form data:", error);
      }
    }
  }, [success, STORAGE_KEY]);

  // Restore custom category state from localStorage after component mounts
  useEffect(() => {
    try {
      const savedForm = localStorage.getItem(STORAGE_KEY);
      if (savedForm) {
        const parsed = JSON.parse(savedForm);

        // Restore custom category state
        if (parsed.customCategory) {
          setCustomCategory(parsed.customCategory);
        }
        if (parsed.showCustomCategoryInput) {
          setShowCustomCategoryInput(parsed.showCustomCategoryInput);
        }
        if (parsed.selectedMainCategories) {
          setSelectedMainCategories(parsed.selectedMainCategories);
        }

        // Check if the saved data has meaningful content to show notification
        const hasContent = Object.keys(parsed).some((key) => {
          if (key === "termsAccepted") return false; // Don't count checkbox for notification
          if (Array.isArray(parsed[key])) return parsed[key].length > 0;
          if (typeof parsed[key] === "string") return parsed[key].trim() !== "";
          return false;
        });

        if (hasContent) {
          setTimeout(() => setDataRestored(true), 100); // Show notification after component mounts
        }
      }
    } catch (error) {
      console.warn("Failed to restore custom category state:", error);
    }
  }, [STORAGE_KEY]);

  // Debounced effect to update custom category in form after user stops typing
  // Removed this effect as it was causing the "Other" checkbox to uncheck
  // The custom category is now handled separately in the API payload logic

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="MainContainer paddingBottom50 VendorVerificationPage marginTop50 ">
        <div>
          <div className="Container">
            {/* <div className="breadCrumbContainer  marginBottom20 marginTop20">
                            <Link to="/">Home</Link>
                            <span> | </span>
                            <Link to="/vendor-verification" className="ColorBlack">Join Us</Link>
                        </div> */}
            <div className="marginBottom50">
              <div className="CommonFlexGap ">
                <h2>Are You a Designer? </h2>
                {/* <br /> */}
                <p>Fill in your details below to join us </p>
              </div>

              <p></p>
              <div className="VendorVerificationFormContainer ">
                {/* {success && (
                                    <div className="success-message">Thank you for submitting your application! We will review and get back to you soon.</div>
                                )} */}

                {/* Data restored notification */}
                {/* {dataRestored && (
                                    <div style={{
                                        backgroundColor: '#d4edda',
                                        border: '1px solid #c3e6cb',
                                        color: '#155724',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        marginBottom: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span>✓ Your previous form data has been restored!</span>
                                        <button 
                                            type="button"
                                            onClick={() => setDataRestored(false)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#155724',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                padding: '0'
                                            }}
                                            title="Dismiss"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )} */}

                {/* Auto-save indicator and clear button */}
                {/* <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    marginBottom: '20px',
                                    padding: '10px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}>
                                    <span style={{ color: '#28a745' }}>
                                        ✓ Your progress is automatically saved (real-time)
                                    </span>
                                    <button 
                                        type="button" 
                                        onClick={clearForm}
                                        style={{
                                            background: 'none',
                                            border: '1px solid #dc3545',
                                            color: '#dc3545',
                                            padding: '4px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = '#dc3545';
                                            e.target.style.color = 'white';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.color = '#dc3545';
                                        }}
                                    >
                                        Clear All Data
                                    </button>
                                </div>
                                 */}
                <form className="vendor-form" onSubmit={handleSubmit}>
                  {/* Personal Information Row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        onBlur={() => {
                          const fieldErrors = validateForm();
                          if (fieldErrors.fullName) {
                            setErrors((prev) => ({
                              ...prev,
                              fullName: fieldErrors.fullName,
                            }));
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              fullName: undefined,
                            }));
                          }
                        }}
                        required
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="error-message">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Brand Name</label>
                      <input
                        type="text"
                        name="brandName"
                        value={form.brandName}
                        onChange={handleChange}
                        onBlur={() => {
                          const fieldErrors = validateForm();
                          if (fieldErrors.brandName) {
                            setErrors((prev) => ({
                              ...prev,
                              brandName: fieldErrors.brandName,
                            }));
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              brandName: undefined,
                            }));
                          }
                        }}
                        required
                        placeholder="Enter your brand name"
                      />
                      {errors.brandName && (
                        <p className="error-message">{errors.brandName}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information Row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>WhatsApp Number</label>
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        value={form.mobileNumber}
                        onChange={(value) => {
                          // If user changes country, clear the number part but keep country code
                          if (
                            form.mobileNumber &&
                            value &&
                            form.mobileNumber.split(" ")[0] !==
                              value.split(" ")[0]
                          ) {
                            // Country code changed, keep only the new country code
                            const countryCode = value.split(" ")[0];
                            setForm({ ...form, mobileNumber: countryCode });
                          } else {
                            setForm({ ...form, mobileNumber: value });
                          }
                        }}
                        placeholder="Enter your WhatsApp number"
                        className="phone-input"
                        flags={false}
                      />
                      {errors.mobileNumber && (
                        <p className="error-message">{errors.mobileNumber}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="error-message">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Full Width Fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Brand Description</label>
                      <textarea
                        name="brandDescription"
                        value={form.brandDescription}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Tell us about your brand (3-4 sentences)"
                      ></textarea>
                      {errors.brandDescription && (
                        <p className="error-message">
                          {errors.brandDescription}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Portfolio/Lookbook Upload</label>
                      <div
                        className={`drag-drop-area${
                          dragActive ? " drag-active" : ""
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleFileAreaClick}
                        tabIndex={0}
                        onKeyDown={(e) =>
                          (e.key === "Enter" || e.key === " ") &&
                          handleFileAreaClick()
                        }
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
                              <IoCloudUploadSharp />
                            </span>
                            <span className="file-name">
                              {form.portfolio.name}
                            </span>
                            {uploading && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  color: "#888",
                                  fontSize: 14,
                                }}
                              >
                                Uploading...
                              </span>
                            )}
                            {form.portfolioUrl && !uploading && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  color: "#1a7f37",
                                  fontSize: 14,
                                }}
                              >
                                Uploaded
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="drag-drop-prompt">
                            <span className="drag-drop-icon">
                              <IoCloudUploadSharp style={{ color: "gray" }} />
                            </span>
                            <span className="drag-drop-text">
                              Click or drag file to upload
                            </span>
                            <span className="drag-drop-hint">
                              Support for PDF, JPG, JPEG, PNG files only
                            </span>
                          </div>
                        )}
                      </div>
                      {errors.portfolioUpload && (
                        <p className="error-message">
                          {errors.portfolioUpload}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Social Media Links</label>
                    <div className="social-links-input-row">
                      <input
                        type="text"
                        name="socialLinksInput"
                        value={socialLinkInput}
                        onChange={handleSocialLinkInputChange}
                        placeholder="https://instagram.com/yourprofile or https://facebook.com/yourpage"
                      />
                      <button
                        className="add-link-btn"
                        onClick={handleAddSocialLink}
                        type="button"
                        disabled={
                          !socialLinkInput.trim() ||
                          form.socialLinks.includes(socialLinkInput.trim())
                        }
                      >
                        Add Link
                      </button>
                    </div>
                    <div className="social-links-list">
                      {form.socialLinks.map((link, idx) => (
                        <div className="social-link-item" key={link}>
                          <span className="social-link-url">{link}</span>
                          <button
                            type="button"
                            className="remove-link-btn"
                            onClick={() => handleRemoveSocialLink(link)}
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    {errors.socialMediaLinks && (
                      <p className="error-message">{errors.socialMediaLinks}</p>
                    )}
                  </div>
                  {/* 2-Column Layout: Product Categories | Price Range */}
                  <div className="form-row">
                    {/* Column 1: Product Categories with 3 checkboxes */}
                    <div className="form-group">
                      <label>Product Categories</label>

                      <div className="checkbox-group">
                        {/* Mens Wear Checkbox */}
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedMainCategories.includes(
                              "Mens Wear"
                            )}
                            onChange={(e) =>
                              handleMainCategoryChange(
                                "Mens Wear",
                                e.target.checked
                              )
                            }
                          />
                          Mens Wear
                        </label>

                        {/* Womens Wear Checkbox */}
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedMainCategories.includes(
                              "Womens Wear"
                            )}
                            onChange={(e) =>
                              handleMainCategoryChange(
                                "Womens Wear",
                                e.target.checked
                              )
                            }
                          />
                          Womens Wear
                        </label>

                        {/* Other Checkbox */}
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="productCategories"
                            value="Other"
                            checked={form.productCategories.includes("Other")}
                            onChange={handleChange}
                          />
                          Other
                        </label>
                      </div>

                      {/* Custom Category Input - Shows when Other is checked */}
                      {showCustomCategoryInput && (
                        <div
                          className="custom-category-input"
                          style={{ marginTop: "15px" }}
                        >
                          <input
                            type="text"
                            placeholder="Enter your category..."
                            value={customCategory}
                            onChange={handleCustomCategoryChange}
                            onBlur={handleCustomCategoryBlur}
                            style={{
                              width: "95%",
                              padding: "12px 14px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              fontSize: "13px",
                              background: "#fafbfc",
                            }}
                          />
                          <small
                            style={{
                              color: "#666",
                              fontSize: "12px",
                              marginTop: "5px",
                              display: "block",
                            }}
                          >
                            Please specify your product category (minimum 2
                            characters)
                          </small>
                        </div>
                      )}

                      {/* Subcategories - Show below when main categories are selected */}
                      {selectedMainCategories.length > 0 && (
                        <div style={{ marginTop: "15px" }}>
                          {selectedMainCategories.map((mainCat) => (
                            <div key={mainCat} style={{ marginBottom: "10px" }}>
                              <h5
                                style={{
                                  fontSize: "14px",
                                  marginBottom: "8px",
                                  color: "#555",
                                  marginTop: "10px",
                                }}
                              >
                                {mainCat}:
                              </h5>
                              <div
                                className="checkbox-group"
                                style={{ marginLeft: "15px" }}
                              >
                                {mainCategories[mainCat].map((subcat) => (
                                  <label
                                    key={subcat}
                                    className="checkbox-label"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={form.productCategories.includes(
                                        subcat
                                      )}
                                      onChange={(e) =>
                                        handleSubcategoryChange(
                                          subcat,
                                          e.target.checked
                                        )
                                      }
                                    />
                                    {subcat}
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {errors.productCategories && (
                        <p className="error-message">
                          {errors.productCategories}
                        </p>
                      )}
                    </div>

                    {/* Column 2: Price Range */}
                    <div className="form-group">
                      <label>Price Range</label>
                      <input
                        type="text"
                        name="priceRange"
                        value={form.priceRange}
                        onChange={handleChange}
                        required
                        placeholder="e.g. ₹ 1000 - ₹ 10000"
                      />
                      {errors.priceRange && (
                        <p className="error-message">{errors.priceRange}</p>
                      )}
                    </div>
                  </div>

                  {/* Continue with other full-width fields */}

                  {/* <div className="form-group full-width">
                    <label>Describe Your Brand?</label>
                    <textarea
                      name="describeYourBrand"
                      value={form.describeYourBrand}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Tell us more about your brand, its values, and what makes it unique"
                    ></textarea>
                    {errors.describeYourBrand && (
                      <p className="error-message">
                        {errors.describeYourBrand}
                      </p>
                    )}
                  </div> */}
                  {/* 2-Column Layout: Describe Your Ideal Customer | Why Namunjii */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Describe Your Ideal Customer?</label>
                      <textarea
                        name="describeYourIdealCustomer"
                        value={form.describeYourIdealCustomer}
                        onChange={handleChange}
                        required
                        rows={2}
                        placeholder="Who is your target audience? Describe your ideal customer"
                      ></textarea>
                      {errors.describeYourIdealCustomer && (
                        <p className="error-message">
                          {errors.describeYourIdealCustomer}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Why Namunjii?</label>
                      <textarea
                        name="whyNamunjii"
                        value={form.whyNamunjii}
                        onChange={handleChange}
                        required
                        rows={2}
                        placeholder="Why do you want to join us?"
                      ></textarea>
                      {errors.whyNamunjii && (
                        <p className="error-message">{errors.whyNamunjii}</p>
                      )}
                    </div>
                  </div>
                  {/* <br />
                  <div className="WhatsAppBtnContainer">
                    <a
                      href="https://wa.me/919106350206?text=Hi%20I%20would%20like%20to%20connect"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Get Credentials on WhatsApp</span>
                    </a>
                    <br />
                    <br />
                    <p>
                      You need to send the message: "Hi, I would like to
                      connect."
                    </p>
                  </div> */}
                  {/* <div className="form-group terms">
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
                                    </div> */}
                  <div
                    className="right-align"
                    style={{ marginTop: "20px", textAlign: "center" }}
                  >
                    {/* <small
                      style={{
                        color: "#666",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ color: "#dc3545" }}>*</span> All fields are
                      mandatory &nbsp;
                      <button
                        onClick={clearForm}
                        style={{
                          backgroundColor: "#6c757d",
                          border: "1px solid #6c757d",
                          opacity: 0.8,
                          color: "white",
                        }}
                      >
                        Reset Form
                      </button>
                    </small> */}
                    <button
                      className="CommonBtn submit"
                      type="submit"
                      disabled={submitting || !isFormValid()}
                      style={{
                        opacity: isFormValid() ? 1 : 0.6,
                        cursor: isFormValid() ? "pointer" : "not-allowed",
                      }}
                    >
                      <span className="sbmt-btn">
                        {submitting ? "Submitting..." : "Submit Application"}
                      </span>
                    </button>
                  </div>
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
