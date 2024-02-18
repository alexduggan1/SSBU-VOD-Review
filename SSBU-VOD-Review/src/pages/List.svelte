<script lang="ts">
    import { pageIndex } from "../stores";
</script>

<h1>List</h1>

<button on:click={() => {
    pageIndex.set(1);
}}>NextPage</button>