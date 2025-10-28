import "./App.css";

function App() {
  return (
    <div className="maintenance-page">
      <div className="maintenance-container">
        <div className="logo-container">
          <img
            src="/LogoImages/WithNamebrandLogo.svg"
            alt="Namunjii Logo"
            className="maintenance-logo"
          />
        </div>

        <div className="maintenance-content">
          <h1 className="maintenance-title">
            We're Working on Something Amazing!
          </h1>

          <div className="maintenance-message">
            <p className="greeting">Hello there! 👋</p>
            <p className="main-text">
              Our website is currently under maintenance as we're busy crafting
              something extraordinary for you. We're putting the finishing
              touches on an enhanced experience that will be worth the wait.
            </p>
            <p className="sub-text">
              We'll be back online very soon with exciting new features and
              improvements. Thank you for your patience!
            </p>
          </div>

          <div className="maintenance-footer">
            <div className="contact-info">
              <p>Need immediate assistance?</p>
              <p>
                Contact us at:{" "}
                <a href="mailto:support@namunjii.com">support@namunjii.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
