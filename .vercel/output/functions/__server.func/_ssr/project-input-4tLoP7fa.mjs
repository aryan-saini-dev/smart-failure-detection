import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/project-input-4tLoP7fa.js
var $$splitComponentImporter = () => import("./project-input-CyDoMPGI.mjs");
var Route = createFileRoute("/project-input")({
	validateSearch: (search) => {
		return {
			name: search.name || "",
			industry: search.industry || "",
			business_model: search.business_model || "",
			target_market: search.target_market || "",
			budget: Number(search.budget) || 0,
			description: search.description || ""
		};
	},
	head: () => ({ meta: [
		{ title: "Project Input — Smart Failure Detection" },
		{
			name: "description",
			content: "Submit your startup details for an instant market, competitor, and risk analysis."
		},
		{
			property: "og:title",
			content: "Project Input — Smart Failure Detection"
		},
		{
			property: "og:description",
			content: "Submit your startup details for an instant market, competitor, and risk analysis."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
