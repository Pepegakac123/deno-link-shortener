import { assertEquals, assertNotEquals, assertRejects } from "@std/assert";
import { delay } from "jsr:@std/async/delay";
import { linkShortener } from "../src/db.ts";

Deno.test("URL Shortener", async (t) => {
	await t.step("Should generate a shot code for a valid URL", async () => {
		const longUrl = "https://deno.land/std";
		const shortCode = await linkShortener(longUrl);
		assertEquals(typeof shortCode, "string");
		assertEquals(shortCode.length, 11);
	});
	await t.step("Should generate a unique shortcode", async () => {
		const longUrl = "https://www.example.com/some/long/path";
		const a = await linkShortener(longUrl);
		delay(5);
		const b = await linkShortener(longUrl);

		assertNotEquals(a, b);
	});

	await t.step("Should throw an error for an invalid URL", async () => {
		const longUrl = "invalid-url";

		//Passes only when the promise rejects
		assertRejects(async () => {
			await linkShortener(longUrl);
		});
	});
});
