import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import {
  verifyGraph8Connection,
  fetchGraph8IntentSignals,
  fetchGraph8ImportantReplies,
  fetchGraph8Sequences,
  getGraph8ContactDetail,
  addContactToGraph8Sequence,
  initiateGraph8VoiceCall,
  searchGraph8Prospects
} from './server/graph8Service.ts';

function parseJsonBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function graph8ApiPlugin(apiKey?: string): Plugin {
  return {
    name: 'vite-plugin-graph8-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Intercept GET /api/graph8/status
        if (req.method === 'GET' && req.url === '/api/graph8/status') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

          try {
            // Server-side secure authenticated probe to Graph8 REST API
            const result = await verifyGraph8Connection(apiKey);
            res.statusCode = result.connected ? 200 : 503;
            res.end(JSON.stringify(result));
          } catch {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                connected: false,
                message: 'Internal server error while probing Graph8 connection.',
                timestamp: new Date().toISOString()
              })
            );
          }
          return;
        }

        // Intercept GET /api/graph8/intent-signals
        if (req.method === 'GET' && req.url?.startsWith('/api/graph8/intent-signals')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

          try {
            const signals = await fetchGraph8IntentSignals(apiKey);
            res.statusCode = 200;
            res.end(JSON.stringify({
              signals,
              count: signals.length,
              timestamp: new Date().toISOString()
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Failed to fetch Graph8 intent signals',
                message: err?.message || 'Server error',
                signals: []
              })
            );
          }
          return;
        }

        // Intercept GET /api/graph8/prospects
        if (req.method === 'GET' && req.url?.startsWith('/api/graph8/prospects')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const q = urlObj.searchParams.get('query') || '';
            const limit = parseInt(urlObj.searchParams.get('limit') || '25', 10);
            const prospects = await searchGraph8Prospects(q, limit, apiKey);
            res.statusCode = 200;
            res.end(JSON.stringify({
              prospects,
              count: prospects.length,
              query: q,
              timestamp: new Date().toISOString()
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Failed to search Graph8 prospects',
                message: err?.message || 'Server error',
                prospects: []
              })
            );
          }
          return;
        }

        // Intercept GET /api/graph8/important-replies
        if (req.method === 'GET' && req.url?.startsWith('/api/graph8/important-replies')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

          try {
            const replies = await fetchGraph8ImportantReplies(apiKey);
            res.statusCode = 200;
            res.end(JSON.stringify({
              replies,
              count: replies.length,
              timestamp: new Date().toISOString()
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Failed to fetch Graph8 important replies',
                message: err?.message || 'Server error',
                replies: []
              })
            );
          }
          return;
        }

        // Intercept GET /api/graph8/sequences
        if (req.method === 'GET' && req.url?.startsWith('/api/graph8/sequences')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

          try {
            const sequences = await fetchGraph8Sequences(apiKey);
            res.statusCode = 200;
            res.end(JSON.stringify({
              sequences,
              count: sequences.length,
              timestamp: new Date().toISOString()
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Failed to fetch Graph8 sequences',
                message: err?.message || 'Server error',
                sequences: []
              })
            );
          }
          return;
        }

        // Intercept GET /api/graph8/contacts/:id
        const contactMatch = req.method === 'GET' && req.url?.match(/^\/api\/graph8\/contacts\/([^/?]+)/);
        if (contactMatch) {
          const contactId = contactMatch[1];
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

          try {
            const contact = await getGraph8ContactDetail(contactId, apiKey);
            if (!contact) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Contact not found' }));
            } else {
              res.statusCode = 200;
              res.end(JSON.stringify({ contact }));
            }
          } catch (err: any) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Failed to fetch contact profile',
                message: err?.message || 'Server error'
              })
            );
          }
          return;
        }

        // Intercept POST /api/graph8/actions/add-to-sequence
        if (req.method === 'POST' && req.url === '/api/graph8/actions/add-to-sequence') {
          res.setHeader('Content-Type', 'application/json');

          try {
            const body = await parseJsonBody(req);
            const result = await addContactToGraph8Sequence(body, apiKey);
            res.statusCode = result.success ? 200 : 400;
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                success: false,
                error: err?.message || 'Server error while executing sequence enrollment'
              })
            );
          }
          return;
        }

        // Intercept POST /api/graph8/actions/initiate-call
        if (req.method === 'POST' && req.url === '/api/graph8/actions/initiate-call') {
          res.setHeader('Content-Type', 'application/json');

          try {
            const body = await parseJsonBody(req);
            const result = await initiateGraph8VoiceCall(body, apiKey);
            res.statusCode = result.success ? 200 : 400;
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                success: false,
                error: err?.message || 'Server error while initiating call'
              })
            );
          }
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  // Load environment variables securely from .env on the server side only
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './',
    plugins: [
      react(),
      graph8ApiPlugin(env.GRAPH8_API_KEY)
    ],
    server: {
      port: 5175,
      host: '127.0.0.1'
    }
  };
});
