import {
  Box,
  Card,
  Checkbox,
  Layout,
  Link,
  Page,
  TextContainer,
} from "@shopify/polaris"; // Destructure the required components
import { Heading } from "@shopify/ui-extensions-react/checkout";
import "./assets/custom.css";

function SupportFAQPage() {
  return (
    <Box class="main-section-faq bg-white margin-left-main">
      <Box class="content-one">
        <h1
          style={{
            fontSize: "19px",
            fontWeight: "bold",
            paddingTop: "15px",
            marginBottom: "20px",
          }}
        >
          FAQ / Support
        </h1>
        <Layout>
          {/* Main Content Section */}
          <Layout.Section>
            <TextContainer>
              <p class="prose prose-blue">
                If you have any questions or need assistance on using Address
                Edit Helper app, you can contact Centire developer via email at{" "}
                <Link to="#">abhishek.singh@centire.in</Link>. I will try to get
                back to you within 48 hours.
              </p>
              <br /> <br />
            </TextContainer>
            {/* FAQ Section */}
            <TextContainer>
              {/* Question 1 */}
              <h2
                element="h2"
                style={{
                  fontWeight: "600",
                  letterSpacing: ".025",
                  fontSize: "20px",
                }}
              >
                What do I need to do before uninstalling Address Edit Helper
                app?
              </h2>
              <p class="prose prose-blue">
                When uninstalling Address Edit Helper app, the Edit Shipping
                Address button in the order status (thank you) page will be
                automatically removed for you. If you are using an app section
                block on the customer account page, it will also be removed
                automatically.
              </p>
              <br />
              <p class="prose prose-blue">
                If you have manually copied and pasted code into the customer
                account page (<code>customers/account.liquid</code>), you will
                need to remove the following snippet:
              </p>
              {/* Code Snippet in Border Box */}
              <textarea
                className="shadow-sm"
                style={{
                  fontSize: ".875rem",
                  lineHeight: "1.25rem",
                  borderColor: "rgb(209 213 219)",
                  borderRadius: ".375rem",
                  maxWidth: "42rem",
                  padding: "10px",
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                  height: "130px",
                  width: "100%",
                }}
              >
                {`
<!-- Start Address Edit Helper snippet -->
<a href="{{ order.order_status_url }}" target="_blank" title="Edit Shipping Address" class="link link--text">Edit Shipping Address</a>
<!-- End Address Edit Helper snippet -->
`}
              </textarea>
              <br /> <br />
              {/* Question 2 */}
              <h2
                element="h2"
                style={{
                  fontWeight: "600",
                  letterSpacing: ".025",
                  fontSize: "20px",
                }}
              >
                Do I need to have customer accounts enabled to use Address Ease
                app?
              </h2>
              <p class="prose prose-blue">
                You do not need to have customer accounts enabled to use Address
                Edit Helper. If you don't have customer accounts enabled, you
                can skip the customer account page installation step.
              </p>
              <br /> <br />
              <h2
                element="h2"
                style={{
                  fontWeight: "600",
                  letterSpacing: ".025",
                  fontSize: "20px",
                }}
              >
                How do I cancel the subscription charge on Address Ease app?
              </h2>
              <p class="prose prose-blue">
                You can uninstall the app to stop the subscription charge. Once
                you uninstall the app, the subscription will be cancelled.
              </p>
            </TextContainer>
            <br /> <br /> <br />
          </Layout.Section>
        </Layout>
      </Box>
      <br /> <br />
    </Box>
  );
}

export default SupportFAQPage;
