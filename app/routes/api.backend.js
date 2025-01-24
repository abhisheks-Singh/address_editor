import { json } from "@remix-run/node";
import axios from "axios";
import prisma from "../db.server";


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

    console.log('shop', shop)

    console.log('session data access token ', session.accessToken);
    return session.accessToken; // Adjust according to how you store the access token in your session
};

const UPDATE_SHIPPING_ADDRESS_MUTATION = `
mutation updateShippingAddress($input: OrderInput!) {
    orderUpdate(input: $input) {
        order {
            id
            shippingAddress {
                firstName
                lastName
                address1
                city
                province
                zip
            }
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
        console.log("Request Data:", body);
        // Extract necessary data dynamically
        const { shop, orderId, address1, city, state, country, zip, first_name, last_name } = body;
        
        const access_token = await getAccessToken(shop); 

        console.log('access token get', access_token);
        
        if (!shop || !orderId) {
            return json({ error: "Missing required fields: 'shop' or 'orderId'" }, { status: 400 });
        }

        const SHOPIFY_STORE_URL = `https://${shop}/admin/api/2024-01/graphql.json`;
        const SHOPIFY_ACCESS_TOKEN = access_token;
        // console.log('access token', access_token);
        // "shpua_876ae0ab14f9a908014b4a1d89cccaef"; // Fetch from environment variables

        console.log('shopoify store url ', SHOPIFY_STORE_URL);

        const input = {
            id: orderId,
            shippingAddress: {
                firstName: first_name,
                lastName: last_name,
                address1: address1,
                province: state,
                city: city,
                zip: zip
            },
        };

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
            return json(
                { error: data.errors || data.data.orderUpdate.userErrors },
                { status: 400 }
            );
        }

        return Response.json({ success: true, order: data.data.orderUpdate.order });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
