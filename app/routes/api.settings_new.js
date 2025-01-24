import { json } from '@remix-run/node';
import shopify, { authenticate } from '../shopify.server';
import prisma from '../db.server';
import { url } from 'inspector';


export async function loader({ request }) {

  let shopDomain= request.headers.get('x-forwarded-host'); 

  if (!shopDomain) {
    const parsedUrl = new URL(request.url);
    shopDomain = parsedUrl.searchParams.get("shop"); 
    console.log('Shop Domain from url :', shopDomain);
  }

  // console.log('Shop Domain from url :', shopDomainn);
  const headersObject = {};
  request.headers.forEach((value, key) => {
      headersObject[key] = value;
  });

  // Log all headers
  console.log('All Headers:', headersObject);

  // console.log("Shop Domain:", shopDomain); 
  
  // const shopDomain = 'abhishek-dev-storee.myshopify.com';  // static shop domain
  // const main_session = await authenticate.admin(request);   Note : I can't use authenticate.admin here as it is for authentication it redirects to shopify login page
  const existingSettings = await prisma.shopSettings.findUnique({
      where: { shop: shopDomain },
  });

  if (!existingSettings) {
      return Response.json({ error: 'No settings found' }, { status: 404 });
  }

  return Response.json(existingSettings);
}

export async function action({ request }) {
  
    const { method } = request;
    

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*'); // Adjust this for production
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    
    // const currentUrl = new URL(request.url).origin;
    const data = await request.json();

    const shopDomain = data.shopDomain;
    // console.log('currentUrl backend', currentUrl);

    console.log('data fetched ', data);
  
    if (method === 'POST') {
      // Check if shop settings already exist
      const existingSettings = await prisma.shopSettings.findUnique({
        where: { shop: shopDomain },
      });
  
      if (existingSettings) {
        // Update existing shop settings
        const updatedSettings = await prisma.shopSettings.update({
          where: { shop: shopDomain },
          data: {
            enableApp: data.enableApp,
            allowNoteChange: data.allowNoteChange,
            allowEmailChange: data.allowEmailChange,
            allowCountryChange: data.allowCountryChange,
            allowProvinceChange: data.allowProvinceChange,
            allowCityChange: data.allowCityChange,
            allowZipCodeChange: data.allowZipCodeChange,
            disallowPOBox: data.disallowPOBox,
            restrictEditingTag: data.restrictEditingTag,
            disableEditingTag: data.disableEditingTag,
            autoTagUpdatedOrder: data.autoTagUpdatedOrder,
            sendEmailNotification: data.sendEmailNotification,
            syncToShipStation: data.syncToShipStation,
            shipStationApiKey: data.shipStationApiKey,
            shipStationApiSecret: data.shipStationApiSecret,
            allowOrdersEdit: data.allowOrdersEdit,
            disallowOrdersEdit: data.disallowOrdersEdit,
            shipStationApiSecretKey: data.shipStationApiSecretKey
          }
        });
  
        // return updatedSettings;
        return Response.json({test: true})
      } else {
        // Create new shop settings
        const newSettings = await prisma.shopSettings.create({
          data: {
            shop: shopDomain,
            enableApp: data.enableApp,
            allowNoteChange: data.allowNoteChange,
            allowEmailChange: data.allowEmailChange,
            allowCountryChange: data.allowCountryChange,
            allowProvinceChange: data.allowProvinceChange,
            allowCityChange: data.allowCityChange,
            allowZipCodeChange: data.allowZipCodeChange,
            disallowPOBox: data.disallowPOBox,
            restrictEditingTag: data.restrictEditingTag,
            disableEditingTag: data.disableEditingTag,
            autoTagUpdatedOrder: data.autoTagUpdatedOrder,
            sendEmailNotification: data.sendEmailNotification,
            syncToShipStation: data.syncToShipStation,
            shipStationApiKey: data.shipStationApiKey,
            shipStationApiSecret: data.shipStationApiSecret,
            allowOrdersEdit: data.allowOrdersEdit,
            disallowOrdersEdit: data.disallowOrdersEdit,
            shipStationApiSecretKey: data.shipStationApiSecretKey
          }
        });
  
        // return newSettings;
        return Response.json({test: true})
      }
    }
  
    return { error: 'Method not allowed' }, { status: 405 };
  }
  
