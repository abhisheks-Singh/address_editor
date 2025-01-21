import axios from "axios";

const SHOPIFY_STORE_URL = "https://abhishek-dev-storee.myshopify.com/admin/api/2024-01/graphql.json";
const SHOPIFY_ACCESS_TOKEN = "shpua_876ae0ab14f9a908014b4a1d89cccaef";

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
    id: "gid://shopify/Order/5766048645189", // Replace with actual order ID
    shippingAddress: {
        address1: "123 New Street",
        city: "New York",
        province: "NY",
        country: "US",
        zip: "10001",
    },
};

async function updateShippingAddress() {
    try {
        const response = await axios.post(
            SHOPIFY_STORE_URL,
            {
                query: UPDATE_SHIPPING_ADDRESS_MUTATION,
                variables: { input },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
                },
            }
        );

        const data = response.data;

        if (data.errors || (data.data.orderUpdate && data.data.orderUpdate.userErrors.length > 0)) {
            console.error("GraphQL API Error:", data.errors || data.data.orderUpdate.userErrors);
            throw new Error(
                data.errors ? data.errors[0].message : data.data.orderUpdate.userErrors[0].message
            );
        }

        console.log("Shipping address updated successfully:", data.data.orderUpdate.order);
    } catch (error) {
        console.error("Error updating shipping address:", error.message);
    }
}

updateShippingAddress();
