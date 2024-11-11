import { linkShortener, storeShortLink, getShortLink } from "./db.ts";
import { Router } from "./router.ts";

const app = new Router();

app.post("/links", async (req) => {
	const { longUrl } = await req.json();
	const shortCode = await linkShortener(longUrl);
	await storeShortLink(longUrl, shortCode, "testuser");

	return new Response("success!", {
		status: 201,
	});
});

app.get("/links/:id", async (_req, _info, params) => {
	const shortCode = params?.pathname.groups.id;

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const data = await getShortLink(shortCode!);

	return new Response(JSON.stringify(data), {
		status: 201,
		headers: {
			"content-type": "application/json",
		},
	});
});

export default {
	fetch(req) {
		return app.handler(req);
	},
} satisfies Deno.ServeDefaultExport;
