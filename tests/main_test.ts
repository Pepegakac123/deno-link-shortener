import { assertEquals, assertNotEquals, assertRejects } from "@std/assert";
import { delay } from "jsr:@std/async/delay";
import { generateShortCode } from "../src/db.ts";

const TestUrl = {
	valid:
		"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
	invalid: "/docs/Web/JavaScript/Reference/Global_Obj",
};
Deno.test("URL Shortener", async (t) => {
	await t.step("Should generate a short code for a valid URL", async () => {
		const longUrl = TestUrl.valid;
		const shortCode = await generateShortCode(longUrl);

		assertEquals(typeof shortCode, "string");
		assertEquals(shortCode.length, 11);
	});
	await t.step("should be unique for each timestamp", async () => {
		const longUrl = TestUrl.valid;
		const a = await generateShortCode(longUrl);
		await delay(5);
		const b = await generateShortCode(longUrl);

		assertNotEquals(a, b);
	});

	await t.step("throw error on bad URL", () => {
		const longUrl = TestUrl.invalid;

		assertRejects(async () => {
			await generateShortCode(longUrl);
		});
	});
});
