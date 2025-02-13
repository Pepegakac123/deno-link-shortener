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
	try {
		const res = await kv.set(shortLinkKey, data);
		return shortLinkKey;
	} catch (error) {
		console.error(error);
	}
}

export async function getShortLink(shortCode: string) {
	try {
		const link = await kv.get<ShortLink>(["shortlinks", shortCode]);
		return link.value;
	} catch (error) {
		console.error(error);
	}
}

export async function generateShortCode(longUrl: string) {
	try {
		new URL(longUrl);
	} catch (error) {
		console.log(error);
		throw new Error("Invalid URL provided");
	}

	// Generate a unique identifier for the URL
	const urlData = new TextEncoder().encode(longUrl + Date.now());
	const hash = await crypto.subtle.digest("SHA-256", urlData);
	// Take the first 8 of the hash for the short URL
	const shortCode = encodeBase64Url(hash.slice(0, 8));

	return shortCode;
}
