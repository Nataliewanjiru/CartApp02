import { netlifyCommonEngineHandler } from '../../dist/cart-app02/server/main.mjs';

export default async (request, context) => {
  try {
    // Convert Netlify Edge request to Express-like request
    const req = {
      protocol: 'https',
      originalUrl: new URL(request.url).pathname,
      baseUrl: '',
      headers: {
        host: request.headers.get('host') || 'localhost',
        ...Object.fromEntries(request.headers.entries())
      }
    };

    return await netlifyCommonEngineHandler(req, context);
  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
