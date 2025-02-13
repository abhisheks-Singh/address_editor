import { Grid, InlineStack } from '@shopify/polaris';
import {
reactExtension,
BlockStack,
View,
Heading,
Text,
ChoiceList,
Choice,
Button,
useStorage,
TextField,
Modal,
TextBlock,
useApi,  
useOrder,
useShippingAddress,
useCustomer,
useBillingAddress
} from '@shopify/ui-extensions-react/checkout';
import { GridItem, InlineLayout } from '@shopify/ui-extensions/checkout';
import e from 'cors';
// import { request } from 'https';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
// import { cors } from "remix-utils/cors";
// import { json } from 'stream/consumers';
// Define the extensions
const thankYouBlock = reactExtension("purchase.thank-you.customer-information.render-after", () => <EditAddressButton />);
export { thankYouBlock };

const address_btn_edit = reactExtension("customer-account.order-status.customer-information.render-after", () => <EditAddressButton />);
export { address_btn_edit };

// const orderDetailsBlock = reactExtension("customer-account.order-status.block.render", () => <ProductReview />);
// export { orderDetailsBlock };

// script creation 

// function ScriptInjector() {
//   useEffect(() => {
//     // Create a script element
//     const script = document.createElement('script');
    
//     // Set script properties
//     // script.src = './customScript.js'// Replace with your script URL
//     // script.async = true; // Make it load asynchronously
    
//     // Optional: Add inline script content
//     script.textContent = `
//       alert('papa');
//       console.log('Script injected and running!');
//       // You can add inline JavaScript here
//     `;

//     // Append the script to the document head or body
//     document.body.appendChild(script);

//     // Clean up by removing the script when the component unmounts
//     // return () => {
//     //   document.body.removeChild(script);
//     // };
//   }, []); // Run only once when the component mounts

//   return (
//     <div>
//       <h2>Script Injector</h2>
//       <p>The script has been injected into the DOM.</p>
//     </div>
//   );
// }



// Edit Address Button Component
function EditAddressButton() {

   const app_url = 'https://evaluate-assess-writing-revolution.trycloudflare.com';   // keep changing this url after every deployment
  const {query} = useApi();

  // useEffect(() => {
  //   query(
  //     `query ($first: Int!) {
  //       products(first: $first) {
  //         nodes {
  //           id
  //           title
  //         }
  //       }
  //     }`,
  //     {
  //       variables: {first: 5},
  //     },
  //   )
  //     .then(({data, errors}) => console.log(data))
  //     .catch(console.error);
  // }, [query]);

  const {shop} = useApi(); 
  const buyerIdentity = useApi().buyerIdentity;
  console.log('buyer identity checkout',  JSON.stringify(buyerIdentity));
  console.log('shop id is ', shop.id, shop.myshopifyDomain, shop.storefrontUrl);

  const order = useOrder();
  const customer = useCustomer();
  // const address_data = useBillingAddress();
  const ShippingAddress = useShippingAddress();

  // console.log('address data ', address_data);
  console.log('shipping address ', ShippingAddress);




  // console.log(`order id is ${order.id}`);
  // // console.log(`billing address ${order.address1}`);
  console.log('order data ', JSON.stringify(order))
  // //   const {customer}  = useApi();
  // // // Access customer details
  // console.log(`customer first name is ${customer.firstName},<br> customer last name is ${customer.lastName},<br> customer email is ${customer.email}`);
  console.log('customer data is ', JSON.stringify(customer));
  // console.log(`Customer address is ${customer.}`);

  // const { countryCode } = useShippingAddress();
  // console.log(`country code is ${countryCode}`);

  // const {order} = useOrder();
  // console.log(`Order data ${order}`); 

  // console.log(`shop name is , ${shop.name}`); 

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    first_name: ShippingAddress.firstName || '',
    last_name: ShippingAddress.lastName || '',
    email: customer.email || '', // Assuming you want to leave this empty for now
    address1: ShippingAddress.address1 || '',
    city: ShippingAddress.city || '',
    state: ShippingAddress.provinceCode || '', // Assuming provinceCode is used for state
    zip: ShippingAddress.zip || '',
    country: ShippingAddress.countryCode || '',
    phone: ShippingAddress.phone || '',
    orderId: order.id,
    shop: shop.myshopifyDomain

  });

  const [modalSettings, setModalSettings] = useState({});
  const [editableFields, setEditableFields] = useState({});
  // is on Hold state 
  const [onHold, setOnHold] = useState(false);

  // mutable data 
  const [mutData, setMutData]= useState({
    mutState: ShippingAddress.provinceCode,
    mutCountry: ShippingAddress.countryCode

  })

  // can edit address : 

  const [canEditAddress, setCanEditAddress] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${app_url}/api/settings_new?shop=${shop.myshopifyDomain}`); // using this getting cors error : https://${shop.myshopifyDomain}/apps/proxy/settings_new
      const data = await response.json();
      const { shopSettings } = data;
      const {designSettings} = data;
      const {timeLimits} = data;
      const onHOld = timeLimits.onHold;
      console.log('on HOld data ', onHOld)
      
      console.log('checking data  ', data.shopSettings, 'time limits data ', timeLimits); 
      setEditableFields({
        email: shopSettings.allowEmailChange, 
        city: shopSettings.allowCityChange,
        state: shopSettings.allowProvinceChange,
        zip: shopSettings.allowZipCodeChange,
        phone: true // Assuming phone is always editable
      });
      setModalSettings({
        buttonText : designSettings.buttonText || 'Edit Address',
        headerText : designSettings.dialogHeader || 'New Shipping Address',
        confirmText : designSettings.confirmText || 'Confirm Update Shipping Address',
        errorText : designSettings.errorText || 'Please enter a valid address',
        closeText : designSettings.closeText || 'Close',
        updatingText : designSettings.updatingText || 'Updating Address',
        selectedCountries : designSettings.selectedCountries || ['coun1']

      });
      setOnHold(timeLimits.onHold);

      if (timeLimits.addressEditTimeLimit) {
        const processedAt = new Date(order.processedAt);
        const timeLimitDays = parseInt(timeLimits.timeLimitsDays) || 0;
        const timeLimitHours = parseInt(timeLimits.timeLimitsHours) || 0;
        const timeLimitMinutes = parseInt(timeLimits.timeLimitsMinutes) || 0;

        // Calculate total time limit in milliseconds
        const totalTimeLimit = (timeLimitDays * 24 * 60 * 60 * 1000) +
                               (timeLimitHours * 60 * 60 * 1000) +
                               (timeLimitMinutes * 60 * 1000);

        // Calculate the cut-off date for editing
        const cutOffDate = new Date(processedAt.getTime() + totalTimeLimit);
        
        // Check if current date is before cut-off date
        setCanEditAddress(new Date() <= cutOffDate);
      }

    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);




  const handleInputChange = (name, value) => {
    console.log(`name: ${name}, value: ${value}`);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  

  const handleEditClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  const { ui } = useApi();

  const handleSubmit = async () => {
    // Handle form submission logic here
    console.log("Submitted form data:", formData);

    try {
      const response = await fetch(`${app_url}/api/backend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Convert formData to JSON
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (responseData.success && responseData.order?.shippingAddress) {
        
        const previousState = mutData.mutState;
        const previousCountry = mutData.mutCountry;

        if (onHold) {
          const newState = formData.state;
          const newCountry = formData.country;
          console.log(`new state ${newState} and new country ${newCountry}, old state ${previousState} and previous country ${previousCountry}`);



          if (previousState !== newState || previousCountry !== newCountry) {
            console.log('State or country has changed, running handleMutation...');
            await handleMutation();
          }
        }


        setFormData((prevData) => ({
          ...prevData,
          first_name:
            responseData.order.shippingAddress.firstName || prevData.first_name,
          last_name:
            responseData.order.shippingAddress.lastName || prevData.last_name,
          address1:
            responseData.order.shippingAddress.address1 || prevData.address1,
          city: responseData.order.shippingAddress.city || prevData.city,
          state: responseData.order.shippingAddress.province || prevData.state,
          zip: responseData.order.shippingAddress.zip || prevData.zip,
        }));
        
        // console.log('previous data is ')
        console.log(`previous state ${previousState} and and response state ${responseData.order.shippingAddress.provinceCode}`)
      }

      console.log("Updated form data:", formData);

      console.log("Response from server:", responseData);
      // if (onHold) {
      //   console.log('if scope ');
      //   await handleMutation();
      // }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      ui.overlay.close("my-modal"); // Close the modal after submission
    }
    ui.overlay.close("my-modal");
  };

  // handle mutation 
  const handleMutation = async () => {
    console.log('mutatation fn ran or not ');
   // Add a condition type to formData for mutation
   const mutationFormData = {
     ...formData,
     conditionType: 'mutation', // Example condition type for mutation
   };
 
   try {
     const mutationResponse = await fetch(`${app_url}/api/fulfillment`, {
       method: 'POST', 
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(mutationFormData), // Convert mutationFormData to JSON
     });
 
     if (!mutationResponse.ok) throw new Error(`Error in mutation: ${mutationResponse.statusText}`);
     
     console.log('Mutation executed successfully');
   } catch (error) {
     console.error("Error executing mutation:", error);
   }
 };
  return (
    <BlockStack spacing="tight">
      {canEditAddress && (
    <Button
      overlay={
        <Modal id="my-modal" padding title={modalSettings.headerText}>
         
          <View padding="base">
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              disabled={!editableFields.email}
            />
          </View>
  
          <InlineLayout columns={['50%', '50%']} padding="none">
            <View padding="base">
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={(value)=> handleInputChange('first_name', value)}
              />
            </View>
            <View padding="base">
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={(value)=> handleInputChange('last_name', value)}
              />
            </View>
          </InlineLayout>
  
          <View padding="base">
            <TextField
              label="Company"
              name="company"
              value={formData.company}
              onChange={(value)=> handleInputChange('company', value)}

            />
          </View>
  
          <View padding="base">
            <TextField
              label="Address"
              name="address1"
              value={formData.address1}
              onChange={(value)=> handleInputChange('address1', value)}
            />
          </View>
  
          <InlineLayout columns={['33.3%', '33.3%', 'Fill']} padding="none">
            <View padding="base">
              <TextField
                label="City"
                name="city"
                value={formData.city}
                onChange={(value)=> handleInputChange('city', value)}
                attribute_data={editableFields.city}
              />
            </View>
            <View padding="base">
              <TextField
                label="State"
                name="state"
                value={formData.state}
                onChange={(value)=> handleInputChange('state', value)}
                disabled={!editableFields.state}
              />
            </View>
            <View padding="base">
              <TextField
                label="Zip Code"
                name="zip"
                value={formData.zip}
                onChange={(value)=> handleInputChange('zip', value)}
                disabled={!editableFields.zip}
              />
            </View>
          </InlineLayout>
  
          <View padding="base">
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={(value)=> handleInputChange('phone', value)}

            />
          </View>
  
          <InlineLayout padding="base" spacing="tight">
            <Button onPress={handleSubmit}>{modalSettings.confirmText}</Button>
            <Button onPress={() => ui.overlay.close('my-modal')}>{modalSettings.closeText}</Button>
          </InlineLayout>
        </Modal>
      }
    >
     {isFormVisible ? modalSettings.errorText : modalSettings.buttonText}

    </Button>
     )}
  </BlockStack>
  
  );
}
