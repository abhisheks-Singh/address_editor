import pkg from '@shopify/polaris';
import { useState } from 'react';
const { Page, Card, Text, Checkbox, TextField, BlockStack } = pkg;
// import { useState } from 'react';

export default function SettingsPage() {
  // State management for checkboxes and input fields
  const [settings, setSettings] = useState({
    enableApp: false,
    allowNoteChange: false,
    allowEmailChange: false,
    allowCountryChange: false,
    allowProvinceChange: false,
    allowCityChange: false,
    allowZipCodeChange: false,
    disallowPOBox: false,
    restrictEditingTag: '',
    disableEditingTag: '',
    autoTagUpdatedOrder: false,
    sendEmailNotification: false,
    syncToShipStation: false,
    shipStationApiKey: '',
    shipStationApiSecret: '',
  });

  const handleCheckboxChange = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Page title="Settings">
      <BlockStack spacing="loose">
        <Card sectioned>
          <Text as="h1" spacing="normal" gap="tight">Settings</Text>
           
          <Text as="h2" variant="bodyMd">This will make the "Edit Address" button visible on the order status / thank you page.</Text>
          <Text as="span">Enable the Address Edit Helper app</Text>
          
          <Checkbox
            checked={settings.enableApp}
            onChange={() => handleCheckboxChange('enableApp')} 
          />
        </Card>

        <Card sectioned title="Fields Limitation">
          <Text as="p" variant="bodyMd">Allow customer to change the order's note.</Text>
          <Checkbox
            label="Allow note change"
            checked={settings.allowNoteChange}
            onChange={() => handleCheckboxChange('allowNoteChange')}
          />

          <Text as="p" variant="bodyMd">Allow customer to change the email address.</Text>
          <Checkbox
            label="Allow email address change"
            checked={settings.allowEmailChange}
            onChange={() => handleCheckboxChange('allowEmailChange')}
          />

          <Text as="p" variant="bodyMd">Allow customer to change the country.</Text>
          <Checkbox
            label="Allow country change"
            checked={settings.allowCountryChange}
            onChange={() => handleCheckboxChange('allowCountryChange')}
          />

          <Text as="p" variant="bodyMd">Allow customer to change the province/state.</Text>
          <Checkbox
            label="Allow province/state change"
            checked={settings.allowProvinceChange}
            onChange={() => handleCheckboxChange('allowProvinceChange')}
          />

          <Text as="p" variant="bodyMd">Allow customer to change the city.</Text>
          <Checkbox
            label="Allow city change"
            checked={settings.allowCityChange}
            onChange={() => handleCheckboxChange('allowCityChange')}
          />

          <Text as="p" variant="bodyMd">Allow customer to change the zip code.</Text>
          <Checkbox
            label="Allow zip code change"
            checked={settings.allowZipCodeChange}
            onChange={() => handleCheckboxChange('allowZipCodeChange')}
          />

          <Text as="p" variant="bodyMd">If checked, this app will show an error to customers when they attempt to use PO BOX as an address.</Text>
          <Checkbox
            label="Disallow PO BOX in address update"
            checked={settings.disallowPOBox}
            onChange={() => handleCheckboxChange('disallowPOBox')}
          />
        </Card>

        <Card sectioned title="Tag Restriction">
          <Text as="h4">Restrict address editing on order based on the tag</Text>
          <Text as="p" variant="bodyMd">Order containing product that has this tag cannot be edited as well.</Text>

          <Text as="p">Allow edit address on all orders, except those tagged with:</Text>
          <TextField
            label=""
            value={settings.restrictEditingTag}
            onChange={(value) => handleInputChange('restrictEditingTag', value)}
            placeholder="cannot-edit-address"
          />

          <Text as="p" variant="bodyMd">Disable edit address on all orders, except those tagged with:</Text>
          <TextField
            label=""
            value={settings.disableEditingTag}
            onChange={(value) => handleInputChange('disableEditingTag', value)}
            placeholder="preorder"
          />
          
          <Text as="p" variant="bodyMd">
              1. If all products in an order contain this tag, the order can be edited.
              2. If the order contains this tag (even if not all products have this tag), the order can be edited.
           </Text>

           <Text as="p" variant="bodyMd">After user edits the address of an order, tag the order with "customer-edited-address".</Text>
           <Checkbox
             label="Auto tag order that has been updated by customer"
             checked={settings.autoTagUpdatedOrder}
             onChange={() => handleCheckboxChange('autoTagUpdatedOrder')}
           />
        </Card>

        <Card sectioned title="Email Notification">
           <Text as="p" variant="bodyMd">An email will be sent to the store contact email every time a customer updates their shipping address (abhishek.singh@centire.in).</Text>
          <Checkbox
              label="Send email notification to store when customer updates address?"
              checked={settings.sendEmailNotification}
              onChange={() => handleCheckboxChange('sendEmailNotification')}
           />
        </Card>

        <Card sectioned title="ShipStation Sync">
           <Text as="p" variant="bodyMd">
          <Checkbox
              label="Sync order shipping address update to ShipStation?"
              checked={settings.syncToShipStation}
              onChange={() => handleCheckboxChange('syncToShipStation')}
           />
             If you are using ShipStation to ship orders, you can enable this option and input the API key and secret below to sync order updates to ShipStation.
           </Text>

           {/* API Key Input Field */}
           <TextField
             label="ShipStation API Key"
             value={settings.shipStationApiKey}
             onChange={(value) => handleInputChange('shipStationApiKey', value)}
             placeholder=""
           />
           <Text as="p" variant="bodyMd">You can retrieve your API Key following instructions here.</Text>

           {/* API Secret Input Field */}
           <TextField
             label="ShipStation API Secret"
             value={settings.shipStationApiSecret}
             onChange={(value) => handleInputChange('shipStationApiSecret', value)}
             placeholder=""
           />
           <Text as="p" variant="bodyMd">You can retrieve your API Secret following instructions here.</Text>
        </Card>
      </BlockStack>
    </Page>
  );
}
