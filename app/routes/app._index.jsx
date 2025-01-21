import {
    Page,
    Card,
    Text,
    CalloutCard,
    Divider,
    BlockStack
  } from "@shopify/polaris";
  import { json } from "@remix-run/node";
  import { useLoaderData } from "@remix-run/react";
  
  export async function loader() {
    // You can implement any necessary data fetching here if needed
    return json({});
  }
  
  export default function ReadMePage() {
    // const data = useLoaderData();
  
    return (
      <Page title="Read Me">
        <CalloutCard
          title="Important Information"
          primaryAction={{
            content: 'Contact Support',
            url: 'abhishek.singh@centire.in',
          }}
        >
          <Text as="p">
            Before you start to setup and use the app, please take a moment to read the important information below.
          </Text>
        </CalloutCard>
  
        <Divider />
  
        <BlockStack vertical spacing="loose">
          <Card sectioned>
            <Text as="h3">Installation Steps</Text>
            <Text as="p">
              To make the "Edit Shipping Address" appear on the Order status page and customer account page, enable it in the Settings page. Follow the instructions on the Installation page.
            </Text>
            <Text as="p">
              If you need assistance, email me at <a href="abhishek.singh@centire.in">abhishek.singh@centire.in</a> for free help.
            </Text>
          </Card>
  
          <Card sectioned>
            <Text as="h3">Privacy Policy</Text>
            <Text as="p">
              Please refer to the Privacy Policy and Data Protection Agreement to see what data is being accessed and stored by this app. All accessed data is used strictly for app functionality only.
            </Text>
          </Card>
  
          <Card sectioned>
            <Text as="h3">About Address Edit Helper</Text>
            <Text as="p">
              The Address Edit Helper app allows customers to update their order's shipping address easily, without needing to contact support.
            </Text>
          </Card>
  
          <Card sectioned>
            <Text as="h3">Editing Restrictions</Text>
            <Text as="p">
              Editing is disabled when an order is fulfilled. Customers can edit their shipping address from the order status page as long as the order is not fulfilled.
            </Text>
          </Card>
  
          <Card sectioned>
            <Text as="h3">Control Editable Orders</Text>
            <Text as="p">
              In the Settings page, you can restrict which orders can be edited based on tags (e.g., only allow orders tagged with "preorder" to edit shipping address).
            </Text>
          </Card>
  
          <Card sectioned>
            <Text as="h3">Customization Options</Text>
            <Text as="p">
              Customize which address fields are editable by customers and adjust the look and text on the order status page in the Design settings.
            </Text>
          </Card>
        </BlockStack> 
      </Page>
    );
  }
  