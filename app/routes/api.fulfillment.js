import { json } from "@remix-run/node";
import axios from "axios";
import prisma from "../db.server";
// import { appUrl } from "../shopify.server";

// Function to get access token
const getAccessToken = async (shop) => {
    if (!shop) {
        throw new Error("Shop name is required to fetch settings.");
    }

    console.log("Fetching settings for shop:", shop);
    const session = await prisma.session.findUnique({
        where: { shop: shop },
        select: { accessToken: true }
    });

    if (!session) {
        console.error("No session found for shop:", shop);
        return null; 
    }

    return session.accessToken; 
};

// GraphQL queries and mutations
const GET_FULFILLMENT_ORDERS_QUERY = `
query GetFulfillmentOrders($orderId: ID!) {
  order(id: $orderId) {
    id
    fulfillmentOrders(first: 1) {
      edges {
        node {
          id
          status
        }
      }
    }
  }
}`; 

const GET_FINANCIAL_STATUS = `
query GetFinancialStatus($orderId: ID!) {
  order(id: $orderId) {
    id
    displayFinancialStatus
  }
}`;

const FULFILLMENT_ORDER_HOLD_MUTATION = `
mutation FulfillmentOrderHold($fulfillmentHold: FulfillmentOrderHoldInput!, $id: ID!) {
  fulfillmentOrderHold(fulfillmentHold: $fulfillmentHold, id: $id) {
    fulfillmentOrder {
      id
    }
    remainingFulfillmentOrder {
      id
    }
    userErrors {
      field
      message
    }
  }
}`;

export async function action({ request }) {
    try {
        const body = await request.json();
        console.log("Request Data in fulfillment page:", body);
        
        const { shop, orderId } = body; 

        console.log('shop is ', shop);

        const access_token = await getAccessToken(shop); 

        if (!shop || !orderId) {
            return ({ error: "Missing required fields: 'shop' or 'orderId'" }, { status: 400 });
        }

        const SHOPIFY_STORE_URL = `https://${shop}/admin/api/2024-01/graphql.json`;

        // Step 1: Get Fulfillment Orders
        const fulfillmentResponse = await axios.post(
            SHOPIFY_STORE_URL,
            {
                query: GET_FULFILLMENT_ORDERS_QUERY,
                variables: { orderId },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": access_token,
                },
            }
        );

        const fulfillmentData = fulfillmentResponse.data;

        if (fulfillmentData.errors || !fulfillmentData.data.order.fulfillmentOrders.edges.length) {
            return (
                { error: fulfillmentData.errors || "No fulfillment orders found." },
                { status: 400 }
            );
        }

        // Extract the first fulfillment order ID
        const fulfillmentOrderId = fulfillmentData.data.order.fulfillmentOrders.edges[0].node.id; // e.g. gid://shopify/FulfillmentOrder/697535361850

        // Step 2: Hold the Fulfillment Order
        const holdInput = {
            reason: "INCORRECT_ADDRESS", 
            reasonNotes: "Waiting on new shipment", 
            notifyMerchant: true 
        };

        const holdResponse = await axios.post(
            SHOPIFY_STORE_URL,
            {
                query: FULFILLMENT_ORDER_HOLD_MUTATION,
                variables: { fulfillmentHold: holdInput, id: fulfillmentOrderId },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": access_token,
                },
            }
        );

        const holdData = holdResponse.data;

        if (holdData.errors || (holdData.data.fulfillmentOrderHold && holdData.data.fulfillmentOrderHold.userErrors.length > 0)) {
            return Response.json(
                { error: holdData.errors || holdData.data.fulfillmentOrderHold.userErrors },
                { status: 400 }
            );
        }

        // get financial status like : partially fulfilled, partially refuned etc 

        const financialResponse = await axios.post(
            SHOPIFY_STORE_URL,
            {
                query: GET_FINANCIAL_STATUS,
                variables: { orderId },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": access_token,
                },
            }
        );

        const financialData = financialResponse.data;

        console.log('financial Status Data ', financialData);

        if (financialData.errors || !financialData.data.order) {
            return (
                { error: financialData.errors || "No financial status found." },
                { status: 400 }
            );
        }

        return Response.json({ success: true, fulfillmentOrder: holdData.data.fulfillmentOrderHold.fulfillmentOrder });
        
    } catch (error) {
        return ({ error: error.message }, { status: 500 });
    }
}
