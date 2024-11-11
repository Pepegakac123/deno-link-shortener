import { type Route, route, type Handler } from "@std/http";

export class Router {
	#routes: Route[] = [];

	get(path: string, handler: Handler) {
		this.#addRoute("GET", path, handler);
	}

	post(path: string, handler: Handler) {
		this.#addRoute("POST", path, handler);
	}

	delete(path: string, handler: Handler) {
		this.#addRoute("DELETE", path, handler);
	}

	put(path: string, handler: Handler) {
		this.#addRoute("PUT", path, handler);
	}

	#addRoute(method: string, path: string, handler: Handler) {
		const pattern = new URLPattern({ pathname: path });
		this.#routes.push({
			pattern,
			method,
			handler: async (req, info, params) => {
				try {
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					return await handler(req, info!, params!);
				} catch (error) {
					console.error("Error handling request:", error);
					return new Response("Internal server error", { status: 500 });
				}
			},
		});
	}

	get handler() {
		return route(
			this.#routes,
			() => new Response("Not found", { status: 404 }),
		);
	}
}
