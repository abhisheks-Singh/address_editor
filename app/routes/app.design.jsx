import { 
    Page, Layout, Card, TextField, Button, BlockStack, InlineStack, Grid, 
    LegacyCard,
    InlineGrid,
    Box,
    Text,
    Form
  } from '@shopify/polaris';
  import { useState } from 'react';
  
  function DesignPage() {
    const [buttonText, setButtonText] = useState('Change Shipping Address');
    const [dialogHeader, setDialogHeader] = useState('New Shipping Address');
    const [instructionText, setInstructionText] = useState('Enter your updated shipping details.');
    const [confirmText, setConfirmText] = useState('Confirm Update Shipping Address');
  
    return (
        <Page>
        <ui-title-bar title="Design" />
        <BlockStack gap={{ xs: "800", sm: "400" }}>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: 400, sm: 0 }}
              paddingInlineEnd={{ xs: 400, sm: 0 }}
            >
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  Settings
                </Text>
                <Text as="p" variant="bodyMd">
                  Update app settings and preferences.
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <Form method="POST">
                <BlockStack gap="400">
                  <TextField label="App name" name="name" value="" />
                  <TextField label="Description" name="description" value="" />
  
                  <Button submit={true}>Save </Button>
                </BlockStack>
              </Form>
            </Card>
          </InlineGrid>
  
  
        </BlockStack>
      </Page>
    );
  }
  
  export default DesignPage;
  