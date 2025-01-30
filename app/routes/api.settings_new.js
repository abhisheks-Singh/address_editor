import { json } from '@remix-run/node';
import shopify, { authenticate } from '../shopify.server';
import prisma from '../db.server';
import { url } from 'inspector';


export async function loader({ request }) {
  let shopDomain = request.headers.get('x-forwarded-host'); 
  let host = request.headers.get('host');
  console.log('Host:', host);

  if (!shopDomain) {
      const parsedUrl = new URL(request.url);
      shopDomain = parsedUrl.searchParams.get("shop"); 
      console.log('Shop Domain from URL:', shopDomain);
  }

  const headersObject = {};
  request.headers.forEach((value, key) => {
      headersObject[key] = value;
  });

  // Log all headers
  console.log('All Headers:', headersObject);

  // Fetch existing shop settings
  const existingSettings = await prisma.shopSettings.findUnique({
      where: { shop: shopDomain },
  });

  // Fetch existing design settings
  const existingDesignSettings = await prisma.designSettings.findUnique({
      where: { shop: shopDomain },
  });

  // Prepare the response object
  const responseData = {
      shopSettings: existingSettings || null,
      designSettings: existingDesignSettings || null,
  };

  // If neither settings are found, return a 404 error
  if (!existingSettings && !existingDesignSettings) {
      return Response.json({ error: 'No settings found' }, { status: 404 });
  }

  // Return the combined settings response
  return Response.json(responseData);
}


export async function action({ request }) {
  const { method } = request;

  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*'); 
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
  }

  const data = await request.json();
  const shopDomain = data.shopDomain;

  if (method === 'POST') {
      if (data.dataType === 'settings') {
        console.log('Settings Data:', data);
          const existingSettings = await prisma.shopSettings.findUnique({
              where: { shop: shopDomain },
          });

          if (existingSettings) {
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

              return updatedSettings;
          } else {
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

              return newSettings;
          }
      } 
      else if (data.dataType === 'design') {
         console.log('Design scope:', data);
          const existingDesignSettings = await prisma.designSettings.findUnique({
            where: { shop: shopDomain },
          });

          if (existingDesignSettings) {
            console.log('if scope');
              const updatedDesignSettings = await prisma.designSettings.update({
                  where: { shop: shopDomain },
                  data: {
                      buttonText: data.buttonText,
                      dialogHeader: data.dialogHeader,
                      instructionText: data.instructionText,
                      confirmText: data.confirmText,
                      updatingText: data.updatingText,
                      closeText: data.closeText,
                      errorText: data.errorText,
                      selectedCountries: data.selectedCountries
                  }
              });

              return updatedDesignSettings;
          } else {
            console.log('else scope');
              const newDesignSettings = await prisma.designSettings.create({
                  data: {
                      buttonText: data.buttonText,
                      dialogHeader: data.dialogHeader,
                      instructionText: data.instructionText,
                      confirmText: data.confirmText,
                      updatingText: data.updatingText,
                      closeText: data.closeText,
                      errorText: data.errorText,
                      selectedCountries: data.selectedCountries,
                      shop: data.shopDomain
                  }
              });

              return newDesignSettings;
          }
      }
  }

  return new Response('Method not allowed', { status: 405 });
}


  
