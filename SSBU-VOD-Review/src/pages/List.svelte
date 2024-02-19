<script lang="ts">
    import { pageIndex } from "../stores";
    import type { Match, State, Note } from "../lib/types";
    import { getModal } from "../lib/Modal.svelte";
    import Modal from "../lib/Modal.svelte";

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
        let access_time: Date = new Date();

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

    let view_mode: string = "players"; // players or match_id
    let sort_mode: string = "accessed"; // accessed or added
    let filter_type: string = "none"; // reviewed or player or none
    let filter_player: string = "";
    let player_list: string[] = [];

    matches.forEach(element => {
        if(! player_list.includes(element.players[0])){
            player_list.push(element.players[0]);
        }
        if(! player_list.includes(element.players[1])){
            player_list.push(element.players[1]);
        }
    });


    let display_matches: Match[] = []
    $: {
        display_matches = [];
        matches.forEach(element => {
            // filter here
            if(filter_type == "none"){
                display_matches.push(element);
            }
            else if (filter_type == "reviewed"){
                if(element.notes.length > 0){
                    display_matches.push(element);
                }
            }
            else if (filter_type == "player"){
                if((element.players[0] == filter_player) || (element.players[1] == filter_player)){
                    display_matches.push(element);
                }
            }
        });

        // sort here
        if(sort_mode == "accessed"){
            console.log("resort");
            display_matches.sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime());
        }
    }
    // parse a date in yyyy-mm-dd format
    function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
    }
</script>

<h1>VOD List</h1>

<div class="view-options">
    <div class="view-option">
        <label for="view-mode-chooser">View Mode</label>
        <select id="view-mode-chooser" name="view-mode-chooser" 
        bind:value={view_mode}>
            <option value="match_id">match id</option>
            <option value="players">players</option>
        </select>
    </div>
    <div class="view-option">
        <label for="sort-mode-chooser">Sort By</label>
        <select id="sort-mode-chooser" name="sort-mode-chooser" 
        bind:value={sort_mode}>
            <option value="added">order added</option>
            <option value="accessed">last accessed</option>
        </select>
    </div>
    <div class="view-option">
        <button on:click={() => {getModal("filter-selector").open()}}>Filter</button>
    </div>
</div>

<div class="column">
    {#each display_matches as match, idx}
        {#if view_mode === "players" && 
        (match.players[0] !== "") && (match.players[1] !== "")}
            <button on:click={() => {
                ViewMatch(matches.indexOf(match));
                console.log(new Date());
                match.last_accessed = new Date();
                console.log(match.last_accessed);
                }}
                class="match">{matches.indexOf(match)}: {match.players[0]} vs {match.players[1]}</button>
        {:else}
            <button on:click={() => {
                ViewMatch(matches.indexOf(match));
                console.log(new Date());
                match.last_accessed = new Date();
                console.log(match.last_accessed);
                }}
                class="match">{matches.indexOf(match)}: {match.match_id}</button>
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


<Modal id="filter-selector">
    <h1>Filter</h1>
    <div class="view-option">
        <label for="filter-type-chooser">Filter Type</label>
        <select id="filter-type-chooser" name="filter-type-chooser" 
        bind:value={filter_type}>
            <option value="none">none</option>
            <option value="reviewed">reviewed</option>
            <option value="player">player</option>
        </select>
        {#if filter_type == "player"}
            <label for="filter-player-chooser">Player Name</label>
            <select id="filter-player-chooser" name="filter-player-chooser" 
            bind:value={filter_player}>
                {#each player_list as player_name}
                    <option value={player_name}>{player_name}</option>
                {/each}
            </select>
        {/if}
    </div>
</Modal>


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
        margin-bottom: 3%;
    }
    .view-options {
        display:flex;
        flex-direction: row;
        width: 100%;
        height: min(10vh, min-content);
        margin-bottom: 5%;
        justify-content:space-evenly;
    }
    .view-option {
        display: flex;
        flex-direction: column;
        row-gap: 5%;
    }
</style>