import pkg from '@shopify/polaris';
const { Page, Card, Text, CalloutCard, BlockStack } = pkg;

export default function SupportFAQPage() {
  return (
    <Page title="Support / FAQ">
      <CalloutCard
        title="FAQ / Support"
        primaryAction={{
          content: 'Contact Support',
          url: 'mailto:axel@yagisoftware.com',
        }}
      >
        <Text as="p">
          If you have any questions or need assistance with the Address Edit Helper app, you can contact Axel via email at <a href="mailto:axel@yagisoftware.com">axel@yagisoftware.com</a>. I will try to get back to you within 48 hours. (I am the sole developer of this app, living in UTC+8 timezone.)
        </Text>
      </CalloutCard>

      <BlockStack spacing="loose">
        <Card sectioned>
          <Text as="h3">Q. What do I need to do before uninstalling Address Edit Helper app?</Text>
          <Text as="p">
            When uninstalling the Address Edit Helper app, the Edit Shipping Address button in the order status (thank you) page will be automatically removed for you. If you are using the app section block on the customer account page, it will be removed automatically as well.
          </Text>
          <Text as="p">
            If you have manually copied and pasted code into the customer account page (customers/account.liquid), you will need to remove the following snippet:
          </Text>
          <pre>
            {/* Code snippet for removal */}
            {/* Start Address Edit Helper snippet */}
            &lt;a href="" target="_blank" title="Edit Shipping Address" class="link link--text"&gt;Edit Shipping Address&lt;/a&gt;
            {/* End Address Edit Helper snippet */}
          </pre>
        </Card>

        <Card sectioned>
          <Text as="h3">Q. Do I need to have customer accounts enabled to use Address Edit Helper app?</Text>
          <Text as="p">
            You do not need to have customer accounts enabled to use the Address Edit Helper. If you don't have customer accounts enabled, you can skip the customer account page installation step.
          </Text>
        </Card>

        <Card sectioned>
          <Text as="h3">Q. How do I cancel the subscription charge on Address Edit Helper app?</Text>
          <Text as="p">
            You can uninstall the app to stop the subscription charge. Once you uninstall the app, the subscription will be cancelled.
          </Text>
        </Card>
      </BlockStack>
    </Page>
  );
}
