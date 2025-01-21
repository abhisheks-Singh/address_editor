import pkg from '@shopify/polaris';
const { Page, Card, Text, CalloutCard, Divider, BlockStack } = pkg;

export default function InstallationPage() {
  return (
    <Page title="Installation">
      <CalloutCard
        title="Installation Overview"
        primaryAction={{
          content: 'Contact Support',
          url: 'mailto:abhishek.singh@centire.in',
        }}
      >
        <Text as="p">
          This one-time setup will take around 10 minutes. After the setup, your customers can edit their email and shipping address on the order status (thank you) page, and they can view the edit address link in the order detail page from their account.
        </Text>
        <Text as="p">
          If you are not confident to perform the installation steps, you can email me at <a href="mailto:abhishek.singh@centire.in">abhishek.singh@centire.in</a> and I will get back to you as soon as I can, to help you perform the installation step (for free).
        </Text>
      </CalloutCard>

      <Divider />

      <BlockStack spacing="loose">
        <Card sectioned>
          <Text as="h3">Step 1: Enable the App</Text>
          <Text as="p">
            Go to the Settings page, check the "Enable the Address Edit Helper app" checkbox, and click "Save".
          </Text>
          {/* Placeholder for Screenshot */}
          <Text as="p">[Insert Screenshot Here]</Text>
        </Card>

        <Card sectioned>
          <Text as="h3">Step 1a: Checkout Extensibility Widget</Text>
          <Text as="p">
            As you have enabled the Checkout Extensibility for Thank You page and Order Status page, you will need to add the Edit Address widget in the theme editor.
            Ensure you have enabled the app in the previous step, and head to the Checkout customize.
          </Text>

          <Text as="p">Thank You Page:</Text>
          <Text as="p">
            In the checkout customizer, select the "Thank You" page from the top navigation:
          </Text>
          {/* Placeholder for Screenshot */}
          <Text as="p">[Insert Screenshot Here]</Text>

          <Text as="p">
            Click "Add app block", then select "Edit Address button" (Address-ease Address Edit Helper, Thank You), then click "Save".
          </Text>
          {/* Placeholder for Screenshots */}
          <Text as="p">[Insert Screenshot Here]</Text>
          <Text as="p">[Insert Screenshot Here]</Text>

          <Text as="p">
            You can customize the text in the edit address popup by clicking the "Edit Address button".
          </Text>
          {/* Placeholder for Screenshot */}
          <Text as="p">[Insert Screenshot Here]</Text>

          <Text as="p">Order Status Page:</Text>
          <Text as="p">
            In the checkout customizer, select the "Order Status" page from the top navigation:
          </Text>
          {/* Placeholder for Screenshot */}
          <Text as="p">[Insert Screenshot Here]</Text>

          <Text as="p">
            Click "Add app block", then select "Edit Address button" (Address-ease Address Edit Helper, Order Status), then click "Save".
          </Text>
          {/* Placeholder for Screenshots */}
          <Text as="p">[Insert Screenshot Here]</Text>
          <Text as="p">[Insert Screenshot Here]</Text>

          <Text as="p">
            You can customize the text in the edit address popup by clicking the "Edit Address button".
          </Text>
          {/* Placeholder for Screenshot */}
          <Text as="p">[Insert Screenshot Here]</Text>

          <Text as="p">
            After adding the app widgets in the Thank You page and Order Status page, you can go to the Design page and change the text and look of the button and dialog.
          </Text>
        </Card>

        <Card sectioned>
          <Text as="h3">Step 2: Add a Link to Customer Order Detail Page</Text>
          <Text as="p">
            As your store is using the new customer account system (email login code), no action is required here. Customers can now click on their order in their account page and they will see the order status page where they can edit their shipping address.
          </Text>
        </Card>

        <Card sectioned>
          <Text as="h3">Step 3: Add a Link on Order Confirmation Email</Text>
          <Text as="p">
          This will add a link to the order confirmation email, which will link customer to the order status page (thank you page), and they can edit their shipping address there. Go to your store Settings > Notifications > Orders > Order confirmation.

         Insert the code below, below the shipping_address variable 
          </Text>

           {/* Text area for code snippet */}
           <textarea 
             rows={5} 
             style={{ width: '100%', fontFamily: 'monospace', padding: '10px' }} 
             readOnly
           >
            Test Content
             {/* <!-- Start Address Edit Helper snippet -->
             &lt;br&gt;&lt;br&gt;
             &lt;a href="{{ shop.url }}/apps/address-update?order={{ id }}&url={{ order_status_url | url_encode }}" target="_blank" title="Edit Shipping Address" class="link link--text"&gt;Edit Shipping Address&lt;/a&gt;
             <!-- End Address Edit Helper snippet --> */}
           </textarea>

           {/* Placeholder for Screenshot */}
           <Text as="p">[Insert Screenshot Here]</Text>

           <Divider />

           {/* Example of how it will look */}
           <Card sectioned>
             <Text as="h4">It will look like this:</Text>
             {/* Placeholder for Screenshot */}
             <Text as="p">[Insert Screenshot Here]</Text>
           </Card>
        </Card>
      </BlockStack>
    </Page>
  );
}
