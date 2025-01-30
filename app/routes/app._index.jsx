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
import "./assets/custom.css";
import enableAddressEditorImage from "./assets/enable-address-editor.png";
import thankyouPage from "./assets/thankyou-page.png";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const storeDomain = url.hostname; // Extracts the domain only

  return storeDomain;
};

export default function HomePage() {
  const { storeDomain } = useLoaderData();
  // const storeDomain = window.location.href; // e.g., "abhishek-dev-storee.myshopify.com"
  // const designPageUrl = `https://${storeDomain}/admin/apps/addressease/app/design`;
  console.log("store domain ", storeDomain);

  return (
    <Box class="main-container-home margin-left-main bg-white">
      <Box class="margin-container">
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            paddingTop: "15px",
          }}
        >
          Read me
        </h1>
        <br />
        <h3 class="tracking-wide font-semibold">
          Installation steps are required for the app to work
        </h3>

        <p class="prose prose-blue">
          To make the "Edit Shipping Address" appear on the Order status (thank
          you) page and customer account page, you will need to enable it in the{" "}
          <a target="_blank" href="#">
            Settings page
          </a>
          , you can follow the instructions on the{" "}
          <a target="_blank" href="#">
            Installation page
          </a>
          .
          <br />
          <br />
          If you are not confident to perform the installation steps, you can
          email me at{" "}
          <strong class="font-bold">abhishek.singh@centire.in</strong> and I
          will get back to you as soon as I can, to help you perform the
          installation step (for free).
          <br /> <br />
          Please refer to the Privacy Policy and Data Protection Agreement to
          see what data is being accessed and stored by this app, all accessed
          data is used strictly for the app functionality only.
          <br />
          <br />
          <h3 class="tracking-wide font-semibold">
            Address Edit Helper app allows customers to update their order's
            shipping address
          </h3>
          Address Edit Helper app is designed to make it easy for your customers
          to edit existing order's shipping address themselves, without having
          to bother your precious support staff, as customer might have moved to
          another address or they have simply made a typo.
          <h3 class="tracking-wide font-semibold">
            Editing is automatically disabled when an order is fulfilled
          </h3>
          Customer can edit order shipping address from the order status page
          (thank you page) as long as the order is not fulfilled (either
          partially or fully). Once an order is marked as fullfilled or any
          fulfillment has been added to the order, the edit shipping address
          button will be hidden.
          <br/><br/>
          <h3 class="tracking-wide font-semibold">
            Control which orders can be edited using tags
          </h3>
          In the <Link to="#">Settings page</Link>, you can restrict which order
          that can be edited if they contain certain tag, or only allow order
          that has certain tag to be edited (eg: only allow order tagged with
          "preorder" to be able to edit shipping address).
          <br/><br/>
          <h3 class="tracking-wide font-semibold">
            Limit editable address field, and customize look
          </h3>
          You can customize which address fields are editable by customers (eg:
          don't allow customer to change country as this would incur additional
          shipping cost for you) on the <Link to="#">Settings page</Link> (from the Settings tab
          above), and customize the look and text on the order status page box
          and dialog on the <Link to="#">Design page </Link>(from the Design tab above).
        </p>
      </Box>
      <br/><br/><br/>
    </Box>
  );
}
