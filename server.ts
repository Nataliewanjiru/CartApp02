import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import { Request } from 'express';

const server = express();
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const commonEngine = new CommonEngine();

server.set('view engine', 'html');
server.set('views', browserDistFolder);

// Serve static files from /browser
server.get('*.*', express.static(browserDistFolder, {
  maxAge: '1y'
}));

export async function netlifyCommonEngineHandler(request: Request, context: any): Promise<Response> {
  const { protocol, originalUrl, baseUrl, headers } = request;

  const html = await commonEngine.render({
    bootstrap: AppServerModule,
    documentFilePath: indexHtml,
    url: `${protocol}://${headers.host}${originalUrl}`,
    publicPath: browserDistFolder,
    providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

// Optional, for local development:
function run(): void {
  const port = process.env['PORT'] || 4000;
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

if (process.env['NETLIFY'] !== 'true') {
  run();
}