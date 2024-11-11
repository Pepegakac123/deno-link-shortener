import { encodeBase64Url, encodeHex } from "jsr:@std/encoding";
import { crypto } from "jsr:@std/crypto/crypto";

const kv = await Deno.openKv();

export type ShortLink = {
	shortCode: string;
	longUrl: string;
	createdAt: number;
	userId: string;
	clickCount: number;
	lastClickEvent?: string;
};

export async function storeShortLink(
	longUrl: string,
	shortCode: string,
	userId: string,
) {
	const shortLinkKey = ["shortlinks", shortCode];

	const data: ShortLink = {
		shortCode,
		longUrl,
		userId,
		createdAt: Date.now(),
		clickCount: 0,
	};

	const res = await kv.set(shortLinkKey, data);

	if (!res.ok) {
	}

	return res;
}

export async function getShortLink(shortCode: string) {
	const link = await kv.get<ShortLink>(["shortlinks", shortCode]);
	return link.value;
}

export const linkShortener = async (longUrl: string) => {
	try {
		new URL(longUrl);
	} catch (error) {
		console.log(error);
		throw new Error("Invalid URL");
	}

	// Generate a unique id for the url

	const urlData = new TextEncoder().encode(longUrl + Date.now());
	const hash = await crypto.subtle.digest("SHA-256", urlData);

	// Take the first 8 of the hash for the short URL
	const shortCode = encodeBase64Url(hash.slice(0, 8));

	return shortCode;
};

const longUrl = "https://kacperadamczyk.pl";
const shortCode = await linkShortener(longUrl);
const userId = "test";

console.log(shortCode);

await storeShortLink(longUrl, shortCode, userId);

const link = await getShortLink(shortCode);

console.log(link);
