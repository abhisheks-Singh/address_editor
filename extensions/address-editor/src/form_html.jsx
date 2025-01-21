import React from 'react';

const SimplifiedModal = () => {
  return (
    <div id="Portal2" className="portal">
      <div className="modal-wrapper">
        <button className="close-btn" aria-hidden="true"></button>
        <div
          id="confirm-modal"
          className="modal"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          style={{ maxWidth: '48rem' }}
        >
          <div className="modal-content" tabindex="0">
            <div className="modal-header">
              <h3>Modal Title</h3>
              <button className="close-btn" aria-label="Close">
                <span className="close-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" focusable="false" aria-hidden="true">
                    <path strokeLinecap="round" d="M2.8 2.8 7 7m4.2 4.2L7 7m0 0 4.2-4.2M7 7l-4.2 4.2"></path>
                  </svg>
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="input-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="text" placeholder="Email" value="abhishek.singh@centire.in" />
              </div>
              <div className="input-field">
                <label htmlFor="first-name">First name</label>
                <input id="first-name" type="text" placeholder="First name" value="Abhishek" />
              </div>
              <div className="input-field">
                <label htmlFor="last-name">Last name</label>
                <input id="last-name" type="text" placeholder="Last name" value="Singh" />
              </div>
              <div className="input-field">
                <label htmlFor="company">Company</label>
                <input id="company" type="text" placeholder="Company" />
              </div>
              <div className="input-field">
                <label htmlFor="address">Address</label>
                <input id="address" type="text" placeholder="Address" value="123 MG Road" />
              </div>
              <div className="input-field">
                <label htmlFor="city">City</label>
                <input id="city" type="text" placeholder="City" value="Gurgaon" />
              </div>
              <div className="input-field">
                <label htmlFor="state">State</label>
                <select id="state" disabled>
                  <option value="AN">Andaman and Nicobar Islands</option>
                  <option value="AP">Andhra Pradesh</option>
                  <option value="BR">Bihar</option>
                  <option value="CH">Chandigarh</option>
                  <option value="DL">Delhi</option>
                  <option value="GJ">Gujarat</option>
                  <option value="HR">Haryana</option>
                  <option value="KA">Karnataka</option>
                  <option value="MP">Madhya Pradesh</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedModal;
