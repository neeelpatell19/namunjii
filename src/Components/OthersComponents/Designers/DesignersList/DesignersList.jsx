import React from "react";
import "./DesignersList.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../StoreLogic/Context/AppContext";
const DesignersList = () => {
  const { state } = useAppContext();
  const vendors = Array.isArray(state?.verifiedVendors)
    ? state.verifiedVendors
    : state?.verifiedVendors?.data || [];

  const pickImage = (index) => {
    const demoImages = [
      "/Images/DemoImage1.svg",
      "/Images/DemoImage2.jpg",
      "/Images/DemoImage3.jpg",
    ];
    return demoImages[index % demoImages.length];
  };

  const toSlug = (text, id) => {
    if (!text && !id) return "";
    const base = (text || `${id}`).toString().toLowerCase().trim();
    return base
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };
  return (
    <>
      <div className="DesignersListContainer marginTop50 PaddingTop">
        <div className="FlexContainerWrapper DesignersPageContainer">
          <div style={{ width: "100%" }} className="DesignersListHeader">
            <h2>Namunjii Designers List</h2>
          </div>
          <div style={{ width: "100%" }} className="DesignersListBody">
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi
              expedita saepe unde qui numquam inventore aperiam laudantium earum
              perspiciatis quas.
            </p>
          </div>
        </div>
        <div className="DesignersListCardsContainer marginTop50">
          <div className="DesignersListCards">
            {vendors.map((vendor, idx) => {
              const name = vendor.brandName || vendor.fullName || "Designer";
              const description = vendor.brandDescription || "";
              const shortDesc = description
                ? description.split(/\s+/).slice(0, 20).join(" ") +
                  (description.trim().split(/\s+/).length > 20 ? "..." : "")
                : "";
              const slug = toSlug(
                vendor.brandName || vendor.fullName,
                vendor._id
              );
              const imageSrc = pickImage(idx);
              return (
                <Link to={`/designers/${slug}`} key={vendor._id || slug || idx}>
                  <div className="DesignersListCardsItem">
                    <div className="DesignersListCardsItemImage">
                      <img src={imageSrc} alt={name} />
                    </div>
                    <div className="DesignersListCardsItemText">
                      <h3>{name}</h3>
                      <p>{shortDesc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignersList;
