<script lang="ts">
    import { pageIndex } from "../stores";
    import type { Match, State, Note } from "../lib/types";

    let matches: Match[] = [];

    export let state: State;

    let data = localStorage.getItem("state");
    console.log(data);
    if(data === "undefined"){
        console.log("undefined")
        matches = [];
    }
    else{
        console.log("not undefined");
        state = JSON.parse(data);
        matches = state.matches;
        console.log("check " + matches);
        if(matches === undefined){
            matches = [];
        }
    }
    console.log("matches " + matches);

    let add_match_id: string;
    function AddMatch(){
        let match_notes: Note[] = [];
        let access_time = new Date();

        let new_match: Match = {
            match_id: "",
            notes: match_notes,
            last_accessed: access_time,
            players: ["",""]
        };

        new_match.match_id = add_match_id;

        console.log("new match " + new_match);
        matches.push(new_match);

        console.log("matches2 " + matches);
        state.matches = matches;
        state.currentMatchIdx = matches.length - 1;
        pageIndex.set(2);
    }

    function ViewMatch(idx: number){
        state.currentMatchIdx = idx;
        console.log("viewing match " + state.matches[state.currentMatchIdx].match_id);
        pageIndex.set(2);
    }

    let view_mode: string = "players";
</script>

<h1>List</h1>

<select bind:value={view_mode}>
    <option value="match_id">match id</option>
    <option value="players">players</option>
</select>

<div class="column">
    {#each matches as match, idx}
        {#if view_mode === "players" && 
        (match.players[0] !== "") && (match.players[1] !== "")}
            <button on:click={() => {ViewMatch(idx)}}
                class="match">{idx}: {match.players[0]} vs {match.players[1]}</button>
        {:else}
            <button on:click={() => {ViewMatch(idx)}}
                class="match">{idx}: {match.match_id}</button>
        {/if}
    {/each}
</div>

<label for="add-match-id">New Match Id:</label>
<input
	type="text"
	name="add-match-id"
	bind:value={add_match_id}
	id="add-match-id"
/>

<button on:click={() => {
    AddMatch();
}}>Add Match</button>


<style>
    .column {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
    .match {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: min(10vh, min-content);
        font-size: 1.5em;
        justify-content: space-around;
        align-items: center;
    }
</style>