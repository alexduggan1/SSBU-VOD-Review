<script lang="ts">
	import Editor from "./pages/Editor.svelte";
	import List from "./pages/List.svelte";
	import { pageIndex } from "./stores";

	let pages = [List, Editor];
	let pageIdx = 0;
	let state = {};
	$: (() => {
		if (pageIdx != 0) {
			localStorage.setItem("state", JSON.stringify(state));
		}
	})();
	pageIndex.subscribe((val) => {
		window.scrollTo(0, 0);
		pageIdx = val;
	});
</script>

<main>
	<svelte:component this={pages[pageIdx]} bind:state></svelte:component>
</main>