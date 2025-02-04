import { TitleBar } from "@shopify/app-bridge-react";
import {
  Page,
  Layout,
  Card,
  TextField,
  Button,
  BlockStack,
  InlineStack,
  Grid,
  LegacyCard,
  InlineGrid,
  Box,
  Text,
  Form,
  Icon,
  OptionList,
  Popover,
  Modal,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { TextUnderlineIcon } from "@shopify/polaris-icons";
import { InlineLayout, View } from "@shopify/ui-extensions-react/checkout";
import { useLoaderData } from "@remix-run/react";
import "./assets/custom.css";
import { authenticate } from "../shopify.server";
import  app_url  from "./assets/app_url";

const CountrySelector = ({ selectedCountries, onChange }) => {
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const activator = <Button onClick={toggleActive}>Select Country</Button>;

  return (
    <Box padding={100} width="100%">
      <Popover active={active} activator={activator} onClose={toggleActive}>
        <OptionList
          className="option-list" // Add custom class here
          title="Select your countries"
          options={[
            { value: "coun1", label: "Country1" },
            { value: "coun2", label: "Country2" },
            { value: "coun3", label: "Country3" },
          ]}
          selected={selectedCountries}
          onChange={onChange}
          allowMultiple={true} // Change to true if you want multiple selections
        />
      </Popover>
    </Box>
  );
};

export const loader = async ({ request }) => {
  try {

    const main_session = await authenticate.admin(request);
    const session = main_session.session;

    const shopDomain = session?.shop;

    // const app_url = process.env.SHOPIFY_APP_URL;


    // console.log("Shop Domain:", shopDomain);
    // console.log("Session:", session);
    // console.log("Main Session:", main_session);

    if (!shopDomain) {
      throw new Response("Unauthorized", { status: 401 });
    }

    const backendUrl = `https://${shopDomain}/apps/proxy/settings_new`;

    return { shopDomain, backendUrl, app_url }; // Return relevant data
  } catch (error) {
    console.error("Error retrieving session:", error);
    throw new Response("Internal Server Error", { status: 500 });
  }
};

function DesignPage() {
  // const app_url = "https://optimize-zone-thousand-showtimes.trycloudflare.com"; // on shopify dev command it keep on changing
  const { shopDomain, backendUrl, app_url } = useLoaderData();

  console.log("Shop Domain:", shopDomain);
  console.log("App URL:", backendUrl);

  const [designsettings, setDesignSettings] = useState({
    buttonText: "Change Shipping Address",
    dialogHeader: "New Shipping Address",
    instructionText: "Enter your updated shipping details.",
    confirmText: "Confirm Update Shipping Address",
    updatingText: "Updating",
    closeText: "Close",
    errorText: "Please enter a valid address",
    selectedCountries: ["coun1"],
  });

  // Loader and success message states
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCountrySelectionChange = (selected) => {
    setDesignSettings((prevSettings) => ({
      ...prevSettings,
      selectedCountries: selected,
    }));
  };

  const fetchDesignSettings = async () => {
    try {
      const response = await fetch(
        `${app_url}/api/settings_new?shop=${shopDomain}`,
      );
      const data = await response.json();
      const { designSettings } = data;

      console.log("designSettings:", designSettings);

      // Update settings state with fetched design settings
      setDesignSettings((prevSettings) => ({
        ...prevSettings,
        ...designSettings,
      }));
    } catch (error) {
      console.error("Error fetching design settings:", error);
    }
  };

  // Destructure design settings
  const handleChange = (key) => (value) => {
    setDesignSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    const savedData = {
      ...designsettings,
      selectedCountries: JSON.stringify(designsettings.selectedCountries),
      shopDomain,
      dataType: "design", // Specify data type for differentiation
    };
    console.log("Saved Data:", savedData);

    setLoading(true);
    setSuccessMessage(""); // Clear previous success message

    try {
      const response = await fetch(`${app_url}/api/settings_new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(savedData),
      });

      if (!response.ok) {
        console.error("Failed to save settings:", await response.json());
        setSuccessMessage("Failed to save settings. Please try again.");
      } else {
        const result = await response.json();
        console.log("Saved Settings:", result);
        setSuccessMessage("Settings saved successfully!");

        // Hide the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000); // Adjust the time as needed (3000 ms = 3 seconds)
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage("Failed to save settings. Please try again.");
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignSettings(); // Fetch settings when component mounts
  }, []);

  return (
    <Box class="main-container-design" paddingInlineStart="500">
      {/* Main Parent Div */}
      <Box style={{ display: "flex" }}>
        {/* 1st row Main Parent Div */}
        <Box class="order-status-main">
          <Box minHeight="320px">
            <h1
              style={{
                fontSize: "19px",
                fontWeight: "bold",
                marginTop: "15px",
              }}
            >
              Order status page
            </h1>
            <hr
              style={{
                border: "1px solid #E1E1E1",
                margin: "8px 0",
                marginTop: "25px",
                marginBottom: "25px",
              }}
            />
            <Box
              style={{
                display: "flex",
                width: "600px",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Text as="h2" fontWeight="bold" color="primary">
                  Change Address Button text
                </Text>
                <Text as="p" color="subdued">
                  The button text below shipping address on order status page
                </Text>
              </Box>

              <Box width="300px">
                <TextField
                  value={designsettings.buttonText}
                  onChange={handleChange("buttonText")}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Second Column - Form Card */}
        <Box style={{ width: "50%" }}>
          {/* <Card sectioned style={{ width: "50%" }}> */}
          <Form method="POST">
            <Box gap="400" class="px-4">
              <h1
                style={{
                  fontSize: "19px",
                  marginTop: "15px",
                  marginBottom: "15px",
                  color: "rgb(107 114 128",
                }}
              >
                Order status page (Preview)
              </h1>
              <h2
                style={{
                  fontSize: "16px",
                  marginBottom: "14px",
                  color: "rgb(156 163 175)",
                }}
              >
                This is what your customer sees on the order status page after
                completing checkout
              </h2>
              <Box style={{ marginLeft: "10px" }}>
                <div class="customer-information-card">
                  <h2
                    style={{
                      fontSize: "1.3em",
                      lineHeight: "1.3em",
                      color: "#333333",
                      margin: "30px 0 1px 10px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Customer information
                  </h2>
                  <Box style={{ padding: "10px" }}>
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flex: 1,
                      }}
                    >
                      <Box style={{ flex: 1 }}>
                        <h3>Contact Information</h3>
                        <Text as="p" color="subdued">
                          abhishek.singh@centire.in
                        </Text>
                        <h3>Shipping address</h3>
                        <address
                          style={{
                            fontStyle: "normal",
                            color: "black",
                            marginTop: "10px",
                          }}
                        >
                          <Text as="p" color="subdued">
                            John Doe
                            <br />
                            1, Street Name
                            <br />
                            12345 City Name
                            <br />
                            State Name
                            <br />
                            Country
                          </Text>
                        </address>
                        <button class="text-sm text-sky-600 shadow py-2 px-4 bg-white border border-solid border-slate-300 shipping-btn-preview">
                          {designsettings.buttonText}
                        </button>
                        <h3>Shipping Method</h3>
                        <Text as="p" color="subdued">
                          Standard
                        </Text>
                      </Box>

                      <Box style={{ flex: 1 }}>
                        <h3>Payment Method</h3>
                        <Text as="p" color="subdued">
                          card ending with 4242 - $123.45
                        </Text>
                        <h3>Billing address</h3>
                        <address
                          style={{ fontStyle: "normal", color: "black" }}
                        >
                          <Text as="p" color="subdued">
                            John Doe
                            <br />
                            1, Street Name
                            <br />
                            12345 City Name
                            <br />
                            State Name
                            <br />
                            Country
                          </Text>
                        </address>
                        <h3>Shipping Method</h3>
                        <Text as="p" color="subdued">
                          Standard
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </div>
              </Box>
            </Box>
          </Form>
          {/* </Card> */}
        </Box>
      </Box>

      {/* 2nd row Main Parent Div */}
      <Box class="second-main-row">
        <Box style={{ display: "flex" }}>
          <Box class="order-status-main">
            <Box minHeight="320px">
              <h1
                style={{
                  fontSize: "19px",
                  fontWeight: "bold",
                  marginTop: "15px",
                }}
              >
                Update Address dialog
              </h1>
              <hr
                style={{
                  border: "1px solid #E1E1E1",
                  margin: "8px 0",
                  marginTop: "25px",
                  marginBottom: "25px",
                  width: "100%",
                }}
              />
              <Box>
                <Box
                  style={{
                    display: "flex",
                    width: "600px",
                    justifyContent: "space-between",
                  }}
                >
                  <Box width="200px">
                    <Text as="h2" color="primary" fontWeight="bold">
                      Dialog title text
                    </Text>
                    <Text as="p" color="subdued">
                      The title text for the update address dialog
                    </Text>
                  </Box>
                  <Box>
                    <Box width="250px">
                      <TextField
                        value={designsettings.dialogHeader}
                        onChange={handleChange("dialogHeader")}
                      />
                    </Box>
                  </Box>
                </Box>
                <hr
                  style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }}
                />
              </Box>

              <Box>
                <Box
                  style={{
                    display: "flex",
                    width: "600px",
                    justifyContent: "space-between",
                  }}
                >
                  <Box width="250px">
                    <Text as="h2" color="primary" fontWeight="bold">
                      Instruction text
                    </Text>
                    <Text as="p" color="subdued">
                      Optional instruction text that appears below title
                    </Text>
                  </Box>
                  <Box>
                    <Box width="250px">
                      <textarea
                        value={designsettings.instructionText}
                        onChange={handleChange("instructionText")}
                        style={{ width: "100%" }}
                      ></textarea>
                      {/* <TextField value={dialogHeader} onChange={setDialogHeader} /> */}
                    </Box>
                  </Box>
                </Box>
                <hr
                  style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }}
                />
              </Box>

              <Box>
                <Box
                  style={{
                    display: "flex",
                    width: "600px",
                    justifyContent: "space-between",
                  }}
                >
                  <Box width="200px">
                    <Text as="h2" color="primary" fontWeight="bold">
                      Confirm Update button text
                    </Text>
                    <Text as="p" color="subdued">
                      OThe button text for confirm update button (on lower left
                      corner of dialog)
                    </Text>
                  </Box>
                  <Box>
                    <Box width="250px">
                      <TextField
                        value={designsettings.confirmText}
                        onChange={handleChange("confirmText")}
                        style={{
                          maxWidth: "100%",
                        }}
                      ></TextField>
                      {/* <TextField value={dialogHeader} onChange={setDialogHeader} /> */}
                    </Box>
                  </Box>
                </Box>
                <hr
                  style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }}
                />
              </Box>

              <Box>
                <Box
                  style={{
                    display: "flex",
                    width: "600px",
                    justifyContent: "space-between",
                  }}
                >
                  <Box width="200px">
                    <Text as="h2" color="primary" fontWeight="bold">
                      Confirm Update button text (when updating)
                    </Text>
                    <Text as="p" color="subdued">
                      The text on the button when the update is in progress
                    </Text>
                  </Box>
                  <Box>
                    <Box width="250px">
                      <TextField
                        value={designsettings.updatingText}
                        onChange={handleChange("updatingText")}
                        style={{
                          maxWidth: "100%",
                        }}
                      ></TextField>
                      {/* <TextField value={dialogHeader} onChange={setDialogHeader} /> */}
                    </Box>
                  </Box>
                </Box>
                <hr
                  style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }}
                />
              </Box>

              <Box>
                <Box
                  style={{
                    display: "flex",
                    width: "600px",
                    justifyContent: "space-between",
                  }}
                >
                  <Box width="200px">
                    <Text as="h2" color="primary" fontWeight="bold">
                      Close button text
                    </Text>
                    <Text as="p" color="subdued">
                      The button text for close button (on lower right corner of
                      dialog)
                    </Text>
                  </Box>
                  <Box>
                    <Box width="250px">
                      <TextField
                        value={designsettings.closeText}
                        onChange={handleChange("closeText")}
                        style={{
                          maxWidth: "100%",
                        }}
                      ></TextField>
                      {/* <TextField value={dialogHeader} onChange={setDialogHeader} /> */}
                    </Box>
                  </Box>
                </Box>
                <hr
                  style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }}
                />
              </Box>

              <Box>
                <Box
                  style={{
                    display: "flex",
                    width: "600px",
                    justifyContent: "space-between",
                  }}
                >
                  <Box width="200px">
                    <Text as="h2" color="primary" fontWeight="bold">
                      Error text
                    </Text>
                    <Text as="p" color="subdued">
                      Error message that will be shown when there's input error
                      when updating
                    </Text>
                  </Box>
                  <Box>
                    <Box width="250px">
                      <TextField
                        value={designsettings.errorText}
                        onChange={handleChange("errorText")}
                        style={{
                          maxWidth: "100%",
                        }}
                      ></TextField>
                      {/* <TextField value={dialogHeader} onChange={setDialogHeader} /> */}
                    </Box>
                  </Box>
                </Box>
                <hr
                  style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }}
                />
              </Box>
            </Box>
          </Box>

          {/* Second Column - Form Card */}
          <Box style={{ width: "50%" }}>
            <Box gap="400" class="px-4">
              <h1
                style={{
                  fontSize: "19px",
                  marginTop: "15px",
                  marginBottom: "15px",
                  color: "rgb(107 114 128",
                }}
              >
                Update address dialog (Preview)
              </h1>
              <h2
                style={{
                  fontSize: "16px",
                  marginBottom: "14px",
                  color: "rgb(156 163 175)",
                }}
              >
                After customer click the "change address" button, this dialog
                will be shown (address fields might varies depending on country)
              </h2>

              <Box style={{ marginLeft: "10px" }}>
                <div className="customer-information-card">
                  <h2
                    style={{
                      fontSize: "1.3em",
                      lineHeight: "1.3em",
                      color: "#333333",
                      margin: "25px 0 5px 0",
                      fontFamily: "sans-serif",
                      textAlign: "center",
                    }}
                  >
                    {designsettings.dialogHeader}
                  </h2>
                  <Box style={{ padding: "10px" }}>
                    <Box>
                      <div className="input-style">
                        <input
                          type="text"
                          placeholder="Enter your email"
                          name="email"
                        />
                      </div>
                    </Box>
                    <CountrySelector
                      selectedCountries={designsettings.selectedCountries}
                      onChange={handleCountrySelectionChange}
                    />
                    <Box style={{ display: "flex", gap: "5px" }}>
                      <div className="input-style">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First name"
                        />
                      </div>
                      <div className="input-style">
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                        />
                      </div>
                    </Box>
                    <div className="input-style">
                      <input
                        type="text"
                        placeholder="Company (Optional)"
                        name="company"
                      />
                    </div>
                    <div className="input-style">
                      <input
                        type="text"
                        placeholder="Apartment, suite, etc. (optional)"
                        name="address1"
                      />
                    </div>
                    <InlineStack gap={200}>
                      <div className="input-style">
                        <input type="text" placeholder="City" name="city" />
                      </div>
                      <div className="input-style">
                        <input
                          type="text"
                          placeholder="Enter postal code"
                          name="postalCode"
                        />
                      </div>
                    </InlineStack>
                    <div className="input-style">
                      <input
                        type="text"
                        placeholder="Enter phone number (Optional)"
                        name="phone"
                      />
                    </div>
                    <InlineStack>
                      <Box
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "20px",
                        }}
                      >
                        <button class="preview-confirm-btn py-4">
                          {designsettings.confirmText}
                        </button>
                        <button class="preview-close-btn">
                          <svg
                            class="icon"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path
                              d="M6 18L18 6M6 6l12 12"
                              stroke="currentColor"
                              stroke-width="2"
                            />
                          </svg>
                          <span class="close-text">
                            {designsettings.closeText}
                          </span>
                        </button>
                      </Box>
                    </InlineStack>
                  </Box>
                </div>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* 3rd row Main Parent Div */}
        {/* <hr
          style={{ border: "1px solid #E1E1E1", margin: "8px 0", width: "40%" }}
        /> */}
        <Box
          style={{
            width: "45%",
            gap: "10px",
            display: "flex",
            flexDirection: "column", // Stack buttons and message vertically
            alignItems: "flex-end", // Align items to the right
            marginTop: "20px",
            marginBottom: "20px",
            marginLeft: "20px"
          }}
        >
          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button>Cancel</button>
            <button
              className="submit-btn text-white py-2 px-4"
              onClick={handleSave}
              disabled={loading} // Disable button while saving
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <Box
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#d4edda", // Light green background
                color: "#155724", // Dark green text
                border: "1px solid #c3e6cb", // Light green border
                borderRadius: "4px",
                textAlign: "center",
                width: "100%", // Ensure it spans the full width of the container
              }}
            >
              {successMessage}
            </Box>
          )}
        </Box>
        <br /> <br />
      </Box>
    </Box>
  );
}

export default DesignPage;
