// app/routes/update-shipping-address.js
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, Page } from "@shopify/polaris";
import { apiVersion, authenticate } from "../shopify.server";



export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    const { shop, accessToken } = session;

    const UPDATE_SHIPPING_ADDRESS_MUTATION = `
mutation updateShippingAddress($input: OrderInput!) {
  orderUpdate(input: $input) {
    order {
      id
      shippingAddress {
        address1
        city
        province
        country
        zip
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

    const input = {
        id: "gid://shopify/Order/5766048645189",
        shippingAddress: {
            address1: "My newest address",
            city: "Gurugram",
            province: "HR",
            country: "INDIA",
            zip: "122008"
        }
    };

    try {
        const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
            },
            body: JSON.stringify({
                query: UPDATE_SHIPPING_ADDRESS_MUTATION,
                variables: { input },
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update shipping address: ${response.statusText}`);
        }

        const data = await response.json();

        // Check for user errors in the GraphQL response
        if (data.errors || data.data.orderUpdate.userErrors.length > 0) {
            throw new Error(data.errors ? data.errors[0].message : data.data.orderUpdate.userErrors[0].message);
        }

        return json(data.data.orderUpdate.order);
    } catch (err) {
        console.error("Error updating shipping address:", err);
        return json({ error: "Failed to update shipping address" }, { status: 500 });
    }
};

const UpdateShippingAddress = () => {
    const order = useLoaderData();

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Card title="Updated Shipping Address" sectioned>
                        {order ? (
                            <div>
                                <h2>Order ID: {order.id}</h2>
                                <h3>Shipping Address:</h3>
                                <p>{order.shippingAddress.address1}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.country}, {order.shippingAddress.zip}</p>
                            </div>
                        ) : (
                            <p>No order found or update failed.</p>
                        )}
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default UpdateShippingAddress;
