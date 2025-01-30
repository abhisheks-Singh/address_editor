import {
  Box,
  InlineStack,
  Checkbox,
  Page,
  Text,
  TextField,
  RadioButton,
  Button,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useLoaderData } from '@remix-run/react';
import {authenticate} from '../shopify.server';

export const loader = async ({ request }) => {
    try {
        const main_session = await authenticate.admin(request); 
        const session = main_session.session; 

        const shopDomain = session?.shop; 
        // console.log("Shop Domain:", shopDomain);
        // console.log("Session:", session);
        // console.log("Main Session:", main_session);

        if (!shopDomain) {
            throw new Response('Unauthorized', { status: 401 });
        }

        const backendUrl = `https://${shopDomain}/apps/proxy/settings_new`; 

        return { shopDomain, backendUrl}; // Return relevant data
    } catch (error) {
        console.error("Error retrieving session:", error);
        throw new Response('Internal Server Error', { status: 500 });
    }
};



function SettingsPage() {

    const app_url = 'https://posted-attributes-flexibility-theory.trycloudflare.com'; // on shopify dev command it keep on changing
    const { shopDomain, backendUrl } = useLoaderData();

    console.log("Shop Domain:", shopDomain);
    console.log("App URL:", backendUrl);
    
  // State management for settings
  const [settings, setSettings] = useState({
    enableApp: true,
    allowNoteChange: false,
    allowEmailChange: true,
    allowCountryChange: false,
    allowProvinceChange: false,
    allowCityChange: true,
    allowZipCodeChange: true,
    disallowPOBox: false,
    restrictEditingTag: "",
    disableEditingTag: "",
    autoTagUpdatedOrder: true,
    sendEmailNotification: false,
    syncToShipStation: false,
    shipStationApiKey: "",
    shipStationApiSecret: "",
    shopDomain: shopDomain,
    allowOrdersEdit: "cannot-edit-address",
    disallowOrdersEdit: "preorder",

  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // Handle checkbox changes
  const handleCheckboxChange = useCallback(
    (key) => (newChecked) => {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [key]: newChecked,
      }));
    },
    [],
  );
  const [selected, setSelected] = useState("allow");

  const handleChange = useCallback((key) => (newValue) => {
    setSettings((prevSettings) => ({
        ...prevSettings,
        [key]: newValue,
    }));
}, []);

// fn to fetch setting data : 


const fetchSettings = async () => {
    try {
      const response = await fetch(`${app_url}/api/settings_new?shop=${shopDomain}`); // using this getting cors error : https://${shop.myshopifyDomain}/apps/proxy/settings_new
      const data = await response.json();
      const { shopSettings } = data;
    //   const {designSettings} = data;
      
      console.log('shopSettings data ', data.shopSettings); 
      console.log('designSettings  ', data.designSettings);

      setSettings({
        enableApp: shopSettings.enableApp,
        allowNoteChange: shopSettings.allowNoteChange,
        allowEmailChange: shopSettings.allowEmailChange,
        allowCountryChange: shopSettings.allowCountryChange,
        allowProvinceChange: shopSettings.allowProvinceChange,
        allowCityChange: shopSettings.allowCityChange,
        allowZipCodeChange: shopSettings.allowZipCodeChange,
        disallowPOBox: shopSettings.disallowPOBox,
        restrictEditingTag: shopSettings.restrictEditingTag,
        disableEditingTag: shopSettings.disableEditingTag,
        autoTagUpdatedOrder: shopSettings.autoTagUpdatedOrder,
        sendEmailNotification: shopSettings.sendEmailNotification,
        syncToShipStation: shopSettings.syncToShipStation,
        shipStationApiKey: shopSettings.shipStationApiKey,
        shipStationApiSecret: shopSettings.shipStationApiSecret,
        allowOrdersEdit: shopSettings.allowOrdersEdit,
        disallowOrdersEdit: shopSettings.disallowOrdersEdit,
        shipStationApiSecretKey: shopSettings.shipStationApiSecretKey,
        shopDomain: shopDomain
      })
    //   setEditableFields({
    //     email: shopSettings.allowEmailChange, 
    //     city: shopSettings.allowCityChange,
    //     state: shopSettings.allowProvinceChange,
    //     zip: shopSettings.allowZipCodeChange,
    //     phone: true // Assuming phone is always editable
    //   });
    //   setModalSettings({
    //     buttonText : designSettings.buttonText || 'Edit Address',
    //     headerText : designSettings.dialogHeader || 'New Shipping Address',
    //     confirmText : designSettings.confirmText || 'Confirm Update Shipping Address',
    //     errorText : designSettings.errorText || 'Please enter a valid address',
    //     closeText : designSettings.closeText || 'Close',
    //     updatingText : designSettings.updatingText || 'Updating Address',
    //     selectedCountries : designSettings.selectedCountries || ['coun1']

    //   });

    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // fn to collect all data : 
  const handleSave = async () => {
    // Collect all data to be saved
    const dataToSave = {
        dataType: 'settings', // Add this to differentiate between different data types
      ...settings
    };
    console.log("Saved Data:", dataToSave);

    setLoading(true);
    setSuccessMessage(""); 

    try{
    const response = await fetch(`${app_url}/api/settings_new`, { // Adjusted URL to match your file structure
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave)
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
        // setSettings(result);
    }
    } catch (error) {
        console.error(error);
      setSuccessMessage("Failed to save settings. Please try again.");

    } finally {
        // Reset loading state
      setLoading(false);

    }
  };

  return (
    <Page title="Settings" variant="heading2xl">
      <Box marginTop="30px">
        <Box
          style={{
            width: "600px",
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box width="556">
            <Text as="h2" color="primary" fontWeight="bold">
              Enable the Address Edit Helper app
            </Text>
            <Text as="p" color="subdued">
              This will make the "Edit Address" button visible on the order
              status / thank you page.
            </Text>
          </Box>
          <Box>
            <Checkbox
              checked={settings.enableApp}
              onChange={handleCheckboxChange("enableApp")}
            />
          </Box>
        </Box>
      </Box>
      <Box style={{ width: "100%", marginTop: "20px" }}>
        <Box class="fields-limitation">
          <Text as="h2" color="primary" fontWeight="bold" variant="headingX1">
            Fields Limitation
          </Text>
          <Box
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Box>
              <Text as="h2" color="primary" fontWeight="bold">
                Allow Note Change
              </Text>
              <Text as="p" color="subdued">
                Allow customer to change the order's note
              </Text>
            </Box>

            <Checkbox
              checked={settings.allowNoteChange}
              onChange={handleCheckboxChange("allowNoteChange")}
            />
          </Box>
          <hr style={{ marginRight: "350px" }} />
          <Box
            style={{
              width: "600px",
              marginTop: "30px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Text as="h2" color="primary" fontWeight="bold">
                Allow Email Change
              </Text>
              <Text as="p" color="subdued">
                Allow customer to change the order's email
              </Text>
            </Box>
            <Checkbox
              checked={settings.allowEmailChange}
              onChange={handleCheckboxChange("allowEmailChange")}
            />
          </Box>
          <hr style={{ marginRight: "350px" }} />
          <Box
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              style={{
                width: "600px",
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <Box>
                <Text as="h2" color="primary" fontWeight="bold">
                  Allow Country Change
                </Text>
                <Text as="p" color="subdued">
                  Allow customer to change the order's country
                </Text>
              </Box>
              <Checkbox
                checked={settings.allowCountryChange}
                onChange={handleCheckboxChange("allowCountryChange")}
              ></Checkbox>
            </Box>
          </Box>
          <hr style={{ marginRight: "350px" }} />
          <Box
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Box>
              <Text as="h2" color="primary" fontWeight="bold">
                Allow Province Change
              </Text>
              <Text as="p" color="subdued">
                Allow customer to change the order's province
              </Text>
            </Box>
            <Checkbox
              checked={settings.allowProvinceChange}
              onChange={handleCheckboxChange("allowProvinceChange")}
            ></Checkbox>
          </Box>
          <hr style={{ marginRight: "350px" }} />
          <Box
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Box>
              <Text as="h2" color="primary" fontWeight="bold">
                Allow City Change
              </Text>
              <Text as="p" color="subdued">
                Allow customer to change the order's city
              </Text>
            </Box>
            <Checkbox
              checked={settings.allowCityChange}
              onChange={handleCheckboxChange("allowCityChange")}
            />
          </Box>
          <hr style={{ marginRight: "350px" }} />
          <Box
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Box>
              <Text as="h2" color="primary" fontWeight="bold">
                Allow zip code change
              </Text>
              <Text as="p" color="subdued">
                Allow customer to change the zip code
              </Text>
            </Box>
            <Checkbox
              checked={settings.allowZipCodeChange}
              onChange={handleCheckboxChange("allowZipCodeChange")}
            />
          </Box>
          <hr style={{ marginRight: "350px" }} />
          <Box
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Box>
              <Text as="h2" color="primary" fontWeight="bold">
                Disallow PO BOX in address update
              </Text>
              <Text as="p" color="subdued">
                If checked, this app will show error to customer when they
                attempt to use PO BOX as address
              </Text>
            </Box>
            <Checkbox
              checked={settings.disallowPOBox}
              onChange={handleCheckboxChange("disallowPOBox")}
            />
          </Box>
        </Box>
        <br /> <br />
        <Box
          id="tag_restriction"
          class="tag-registration"
          style={{ maxWidth: "600px" }}
        >
          <Text as="h2" color="primary" fontWeight="bold">
            Tag restriction
          </Text>
          <Text as="p" color="subdued">
            Restrict address editing on order based on the tag
          </Text>
          <fieldset style={{ width: "600px" }}>
            <Box>
              <Box
                style={{
                  width: "500px",
                  marginTop: "20px",
                  marginBottom: "30px",
                  gap: "5px",
                }}
              >
                <RadioButton
                  label={
                    <Text fontWeight="bold">
                      Allow edit address on all orders, except those tagged with
                      tag below:
                    </Text>
                  }
                  checked={selected === "allow"}
                  id="allow"
                  name="tagRestriction"
                  onChange={() => handleChange("allow")}
                />
                <Box style={{ marginLeft: "25px" }}>
                  <Box style={{ width: "300px" }}>
                    <TextField
                      value={settings.allowOrdersEdit}
                      onChange={(value) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          allowOrdersEdit: value,
                        }))
                      }
                    />
                  </Box>
                  <Text as="p" color="subdued">
                    Order containing product that has this tag cannot be edited
                    as well.
                  </Text>
                </Box>
              </Box>
              <Box
                style={{
                  width: "500px",
                  marginTop: "20px",
                  marginBottom: "30px",
                  gap: "5px",
                }}
              >
                <RadioButton
                  label={
                    <Text fontWeight="bold">
                      Disable edit address on all orders, except those tagged
                      with tag below:
                    </Text>
                  }
                  checked={selected === "allow"}
                  id="allow"
                  name="tagRestriction"
                  onChange={() => handleChange("allow")}
                />
                <Box style={{ marginLeft: "25px" }}>
                  <Box style={{ width: "300px" }}>
                    <TextField
                      value={settings.disallowOrdersEdit}
                      onChange={(value) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          disallowOrdersEdit: value,
                        }))
                      }
                    />
                  </Box>
                  <Text as="p" color="subdued">
                    If all products in an order contain this tag, the order can
                    be edited.
                  </Text>
                </Box>
              </Box>
            </Box>
          </fieldset>
          <Box
            class="auto-tag"
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Box>
              <Text as="h2" color="primary" fontWeight="bold">
                Auto tag order that has been updated by customer
              </Text>
              <Text as="p" color="subdued">
                After user edit address of an order, tag the order with
                "customer-edited-address".
              </Text>
            </Box>
            <Checkbox
              checked={settings.autoTagUpdatedOrder}
              onChange={handleCheckboxChange("autoTagUpdatedOrder")}
            />
          </Box>
        </Box>
        <br /> <br /> <br />
        <Box marginTop="30px" class="email-notification">
          <h1 style={{ fontSize: "20px" }}>Email Notification</h1>
          <Box
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box width="556">
              <Text as="h2" color="primary" fontWeight="bold">
                Send email notification to store when customer update address?
              </Text>
              <Text as="p" color="subdued">
                An email will be sent to the Store contact email every time a
                customer update the shipping address (abhishek.singh@centire.in)
              </Text>
            </Box>
            <Box>
              <Checkbox
                checked={settings.sendEmailNotification}
                onChange={handleCheckboxChange("sendEmailNotification")}
              />
            </Box>
          </Box>
        </Box>
        <br /> <br />
        <Box marginTop="30px" class="ship-station">
          <h1 style={{ fontSize: "20px" }}>ShipStation Sync</h1>
          <Box
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
            class="ship-station-sync"
          >
            <Box width="556">
              <Text as="h2" color="primary" fontWeight="bold">
                Sync order shipping address update to ShipStation?
              </Text>
              <Text as="p" color="subdued">
                If you are using ShipStation to ship order, you can enable this
                option and input the API key and secret below to sync order
                update to ShipStation.
              </Text>
            </Box>
            <Box>
              <Checkbox
                checked={settings.syncToShipStation}
                onChange={handleCheckboxChange("syncToShipStation")}
              />
            </Box>
          </Box>
          <hr style={{ marginRight: "350px" }} />

          <Box
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
            class="ship-station-Api-Key"
          >
            <Box width="556">
              <Text as="h2" color="primary" fontWeight="bold">
                ShipStation API Key
              </Text>
              <Text as="p" color="subdued">
                You can retrieve your API Key following instruction here
              </Text>
            </Box>
            <Box>
              <TextField
                value={settings.shipStationApiKey}
                onChange={setSettings.shipStationApiKey}
              ></TextField>
            </Box>
          </Box>
          <hr style={{ marginRight: "350px" }} />

          <Box
            style={{
              width: "600px",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
            class="ship-station-Api-Secret-Key"
          >
            <Box width="556">
              <Text as="h2" color="primary" fontWeight="bold">
                ShipStation API Secret
              </Text>
              <Text as="p" color="subdued">
                You can retrieve your API Secret following instruction here
              </Text>
            </Box>
            <Box>
              <TextField
                value={settings.shipStationApiSecretKey}
                onChange={setSettings.shipStationApiSecretKey}
              ></TextField>
            </Box>
          </Box>
          <hr style={{ marginRight: "350px" }} />
        </Box>
      </Box>

      <Box
        style={{
          maxWidth: "600px",
          gap: "10px",
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Button variant="primary" onClick={handleSave}>
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button>Cancel</Button>
        {/* Success Message */}
        {successMessage && (
          <div style={{ marginTop: "20px", color: "green" }}>
            {successMessage}
          </div>
        )}
      </Box>
    </Page>
  );
}

export default SettingsPage;
