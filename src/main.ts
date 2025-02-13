import { generateShortCode, getShortLink, storeShortLink } from "./db.ts";
import { Router } from "./router.ts";

const app = new Router();

app.get("/", () => new Response("Hello World"));

app.post("/links", async (req) => {
    try {
        const { longUrl } = await req.json();
        const shortCode = await generateShortCode(longUrl);
        const res = await storeShortLink(longUrl,shortCode,"testUser")
        
        
        return new Response(JSON.stringify(res), {
            status: 201,    
          });
        
    } catch (error) {
        throw new Error(`An error occurred: ${error}`)
    }
});

app.get("/links/:id", async (_req, _info, params) => {

    const shortCode = params;
    console.log(shortCode)
    // const data = await getShortLink(shortCode!)
  
    return new Response(JSON.stringify(shortCode), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
  
    });
  
  })

export default {
	fetch(req) {
		return app.handler(req);
	},
} satisfies Deno.ServeDefaultExport;
