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
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { TextUnderlineIcon } from "@shopify/polaris-icons";
import { View } from "@shopify/ui-extensions-react/checkout";

const CountrySelector = ({ selectedCountries, onChange }) => {
    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);
    
    const activator = (
        <Button onClick={toggleActive} disclosure>
            Select Country
        </Button>
    );

    return (
        <Box padding={100} width="100%">
            <Popover active={active} activator={activator} onClose={toggleActive} >
                <OptionList
                    title="Select your countries"
                    options={[
                        { value: 'coun1', label: 'Country1' },
                        { value: 'coun2', label: 'Country2' },
                        { value: 'coun3', label: 'Country3' }
                    ]}
                    selected={selectedCountries}
                    onChange={onChange}
                    allowMultiple={false} // Change to true if you want multiple selections
                    
                />
            </Popover>
        </Box>
    );
};

function DesignPage() {


    
  const [buttonText, setButtonText] = useState("Change Shipping Address");

  const [dialogHeader, setDialogHeader] = useState("New Shipping Address");
  const [instructionText, setInstructionText] = useState(
    "Enter your updated shipping details.",
  );
  const [confirmText, setConfirmText] = useState(
    "Confirm Update Shipping Address",
  );
  const [updatingText, setUpdatingText] = useState("Updating");
  const [closeText, setCloseText] = useState("Close");
  const [errorText, setErrorText] = useState("Please enter a valid address");
  const [selectedCountries, setSelectedCountries] = useState(['coun1']);
  const handleCountrySelectionChange = (selected) => {
    setSelectedCountries(selected);
};

const handleSave = () => {
    const savedData = {
        buttonText,
        dialogHeader,
        instructionText,
        confirmText,
        updatingText,
        closeText,
        errorText,
        selectedCountries
    };
    console.log("Saved Data:", savedData);
};

  

  return (
    <Box paddingInlineStart="500">
      {/* Main Parent Div */}
      <InlineStack gap="200" blockAlign="start">
        {/* 1st row Main Parent Div */}
        <Card sectioned style={{ width: "50%", marginLeft: "100px" }}>
          <Box minHeight="320px">
            <Text as="h4" variant="heading2xl">
              Order Status Page
            </Text>
            <hr style={{ border: "1px solid #E1E1E1", margin: "8px 0" }} />
            <Box>
              <InlineStack gap="200">
                <Box>
                  <Text as="h2" fontWeight="bold" color="primary">
                    Change Address Button Text
                  </Text>
                  <Text as="p" color="subdued">
                    Update app settings
                  </Text>
                </Box>

                <Box width="300px">
                  <TextField value={buttonText} onChange={setButtonText} />
                </Box>
              </InlineStack>
            </Box>
          </Box>
        </Card>

        {/* Second Column - Form Card */}
        <Card sectioned style={{ width: "50%" }}>
          <Form method="POST">
            <Box gap="400">
              <Text as="h4">Order Status Page (Preview)</Text>
              <Text as="p" color="subdued">
                This is what your customer sees on the order.
              </Text>
              <Card sectioned>
                <Box>
                  <Text as="h1" fontWeight="bold" color="primary">
                    Customer information
                  </Text>
                  <BlockStack>
                    <InlineStack gap={300}>
                      <Box>
                        <Text as="h2" fontWeight="bold" color="primary">
                          Contact information{" "}
                        </Text>
                        <Text as="p" color="subdued">
                          abhishek.singh@centire.in
                        </Text>
                        <Text as="h2" fontWeight="bold" color="primary">
                          Shipping address
                        </Text>
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
                        <Button>{buttonText}</Button>
                        <Text as="h2" fontWeight="bold" color="primary">
                          Shipping Method
                        </Text>
                        <Text as="p" color="subdued">
                          Standard
                        </Text>
                      </Box>

                      <Box>
                        <Text as="h2" fontWeight="bold" color="primary">
                          Payment method
                        </Text>
                        <Text as="p" color="subdued">
                          card ending with 4242 - $123.45
                        </Text>
                        <Text as="h2" fontWeight="bold" color="primary">
                          Billing address
                        </Text>
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
                        <Text as="h2" ontWeight="bold" color="primary">
                          Shipping Method
                        </Text>
                        <Text as="p" color="subdued">
                          Standard
                        </Text>
                      </Box>
                    </InlineStack>
                  </BlockStack>
                </Box>
              </Card>
            </Box>
          </Form>
        </Card>
      </InlineStack>

      {/* 2nd row Main Parent Div */}
      <InlineStack gap="200">
        <Card sectioned style={{ width: "50%", marginLeft: "100px" }}>
          <Box minHeight="320px" width="490px">
            <Text as="h4" variant="heading2xl">
              Update address dialog
            </Text>
            <hr style={{ border: "0.5px solid #E1E1E1", margin: "12px 0" }} />
            <Box>
              <InlineStack gap="300">
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
                      value={dialogHeader}
                      onChange={setDialogHeader}
                    />
                  </Box>
                </Box>
              </InlineStack>
              <hr style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }} />
            </Box>

            <Box>
              <InlineStack gap="300">
                <Box width="200px">
                  <Text as="h2" color="primary" fontWeight="bold">
                    Instruction text
                  </Text>
                  <Text as="p" color="subdued">
                    Optional instruction text that appears below title
                  </Text>
                </Box>
                <Box
                  style={{
                    flex: 1,
                  }}
                >
                  <Box width="250px">
                    <textarea
                      value={instructionText}
                      onChange={setInstructionText}
                      style={{
                        maxWidth: "250px",
                      }}
                    ></textarea>
                    {/* <TextField value={dialogHeader} onChange={setDialogHeader} /> */}
                  </Box>
                </Box>
              </InlineStack>
              <hr style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }} />
            </Box>

            <Box>
              <InlineStack gap="300">
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
                      value={confirmText}
                      onChange={setConfirmText}
                      style={{
                        maxWidth: "100%",
                      }}
                    ></TextField>
                    {/* <TextField value={dialogHeader} onChange={setDialogHeader} /> */}
                  </Box>
                </Box>
              </InlineStack>
              <hr style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }} />
            </Box>

            <Box>
              <InlineStack gap="300">
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
                      value={updatingText}
                      onChange={setUpdatingText}
                      style={{
                        maxWidth: "100%",
                      }}
                    ></TextField>
                    {/* <TextField value={dialogHeader} onChange={setDialogHeader} /> */}
                  </Box>
                </Box>
              </InlineStack>
              <hr style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }} />
            </Box>

            <Box>
              <InlineStack gap="300">
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
                      value={closeText}
                      onChange={setCloseText}
                      style={{
                        maxWidth: "100%",
                      }}
                    ></TextField>
                    {/* <TextField value={dialogHeader} onChange={setDialogHeader} /> */}
                  </Box>
                </Box>
              </InlineStack>
              <hr style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }} />
            </Box>

            <Box>
              <InlineStack gap="300">
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
                      value={errorText}
                      onChange={setErrorText}
                      style={{
                        maxWidth: "100%",
                      }}
                    ></TextField>
                    {/* <TextField value={dialogHeader} onChange={setDialogHeader} /> */}
                  </Box>
                </Box>
              </InlineStack>
              <hr style={{ border: "0.5px solid #E1E1E1", margin: "15px 0" }} />
            </Box>
          </Box>
        </Card>

        {/* Second Column - Form Card */}
        <Card sectioned style={{ width: "50%" }}>
          <Box>
            <Box maxWidth="420px">
              <Text as="h4" color="primary">
                Update address dialog (Preview)
              </Text>
              <Text as="p" color="subdued">
                After customer click the "change address" button, this dialog
                will be shown (address fields might varies depending on country)
              </Text>
            </Box>
            <Box>
                <Card sectioned>
                   <Text as="h4" color="primary" fontWeight="bold">
                    {dialogHeader}
                   </Text>
                   <Box>
                   <TextField  placeholder="Enter your address" name="email" label="Address"/>
                   </Box>
                   <CountrySelector  selectedCountries={selectedCountries}  onChange={handleCountrySelectionChange} />
                   <InlineStack gap={600}>
                   <TextField  placeholder="Enter first name" name="email" label="First name"/>
                   <TextField  placeholder="Enter last name" name="email" label="Last name"/>
                   </InlineStack>
                   <TextField  placeholder="Company(Optional)" name="company" label="Company name"/>
                   <TextField  placeholder="Apartment, suite, etc. (optional)" name="Address1" label="Apartment, suite, etc. (optional)"/>
                     <InlineStack gap={200}>
                     <TextField  placeholder="City" name="city" label="City"/>
                        <TextField  placeholder="Enter postal code" name="state" label="Postal code"/>
                    </InlineStack>  
                    <TextField  placeholder="Enter phone number(Optional)" name="phone" label="Phone number"/>
                    <InlineStack >
                    <Box style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button variant="secondary">{confirmText}</Button>
                    <Button>{closeText}</Button>
                </Box>
                    </InlineStack>

                   


                   
                </Card>
            </Box>
          </Box>
        </Card>
      </InlineStack>

      <hr style={{ border: "1px solid #E1E1E1", margin: "8px 0" }} />
      <InlineStack gap="200">
      <Box style={{ width: '400', gap:'10px', display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom:"20px"}}>
            
            <Button variant="primary" onClick={handleSave}>Save</Button>
            <Button>Cancel</Button>
            </Box>
            </InlineStack>

     
    </Box>
  );
}

export default DesignPage;
