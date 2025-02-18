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
  Link,
} from "@shopify/polaris";
import './assets/custom.css'
import enableAddressEditorImage from './assets/enable-address-editor.png';
import thankyouPage from './assets/thankyou-page.png'
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const storeDomain = url.hostname; // Extracts the domain only

  return  storeDomain;
};

export default function InstallationPage() {

  const { storeDomain } = useLoaderData();
  // const storeDomain = window.location.href; // e.g., "abhishek-dev-storee.myshopify.com"
  // const designPageUrl = `https://${storeDomain}/admin/apps/addressease/app/design`;
  console.log('store domain ', storeDomain)


  return (
    <Box class="main-container-installation margin-left-main">
      <h1
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          paddingTop: "15px",
        }}
      >
        Installation
      </h1>
      <br />
      <p className="para para-blue">
        This one-time setup will take around 10 minutes. After the setup, your
        <strong>
          {" "}
          customers can edit their email and shipping address on the order
          status (thank you) page
        </strong>
        , and they can view the edit address link in the order detail page from
        their account.
        <br /> <br/> 
        If you are not confident to perform the installation steps, you can
        email me at <strong>abhishek.singh@centire.in</strong> and I will get
        back to you as soon as I can, to help you perform the installation step
        (for free).
      </p>
      <br /> 
      <p class="font-bold">Step 1: Enable the app</p>
      <p class="font-bold">Step 1a: Checkout Extensibility widget</p>
      <p class="font-bold">
        Step 2: Add a link to the customer order detail page (Optional)
      </p>
      <p class="font-bold">
        Step 3: Add a link on the order confirmation email (Optional)
      </p>

      <br/> <br/>
      
      <h1 class="prose prose-lg font-bold">
      Step 1 - Enable the app
      </h1>
      <p class="prose prose-blue">
        <p class="sub-p" style={{fontSize: '16px', fontFamily: "sans-serif", }}>
      Go to the <a target="_blank" href="/settings">Settings page</a>, and check the "Enable the Address Edit Helper app" checkbox, and click "Save".
      </p>
      <br/>

      <img className="max-w-2xl" src={enableAddressEditorImage} alt="Enable Address Editor" />
      <p class="sub-p" style={{fontSize: '16px', fontFamily: "sans-serif", }}>
      After enabling the app, you can go the <Link to="/app/design">Design</Link> page page and change the text and look of the button and dialog.
      </p>
     

      </p>
       
       <br/><br/>
       <h1 class="prose prose-lg font-bold">
       Step 1a - Checkout Extensibility widget
      </h1>

      <p class="prose prose-blue" style={{fontSize:'18px', maxWidth: '65ch'}}>
        <br/> <br/>
        As you have enabled the Checkout Extensibility for Thank you page and Order status page, you will need to add the Edit Address widget in the theme editor.
        <br/> <br/>
        Ensure you have enabled the app in the previous step, and head to the <Link to="/app/design">Checkout customize</Link>. (You will need to add the widget for thank you page, and order status page)
        <br/><br/>

      </p>
     
      <h1 class="prose prose-lg font-bold" >
      Thank you page
      </h1>
      <br/>
      <p class="prose prose-blue" style={{fontSize:'18px'}}>
      In the checkout customizer, select the "Thank you" page from the top navigation :
      </p>
      <img className="max-w-2xl" src={thankyouPage} alt="Enable Address Editor" />
      <p class="sub-p" style={{fontSize: '16px', fontFamily: "sans-serif", }}>Click "Add app block", then select "Edit Address button" (AddressEase, Thank you), then click "Save".</p>
      <br/><br/>
     <p class="sub-p" style={{fontSize: '18px', fontFamily: "sans-serif", }}>Do similar for Order Status Page </p>
     <br/><br/> <br/>
      
    </Box>
  );
}
