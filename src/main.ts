import { generateShortCode, getShortLink, storeShortLink } from "./db.ts";
import { Router } from "./router.ts";

const app = new Router();

app.get("/", () => new Response("Hello World"));

app.post("/links", async (req) => {
	try {
		const { longUrl } = await req.json();
		const shortCode = await generateShortCode(longUrl);
		const res = await storeShortLink(longUrl, shortCode, "testUser");

		return new Response(JSON.stringify(res), {
			status: 201,
		});
	} catch (error) {
		throw new Error(`An error occurred: ${error}`);
	}
});

app.get("/links/:id", async (_req, _info, params) => {
	const shortCode = _info?.pathname.groups.id;
	if (!shortCode) throw new Error("The value wasn't provided");
	try {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const data = await getShortLink(shortCode as string);
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"content-type": "application/json",
			},
		});
	} catch (error) {
		throw new Error(`An error occurred: ${error}`);
	}
});

export default {
	fetch(req) {
		return app.handler(req);
	},
} satisfies Deno.ServeDefaultExport;
