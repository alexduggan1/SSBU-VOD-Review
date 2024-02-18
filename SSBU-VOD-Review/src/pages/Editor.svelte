<script lang="ts">
    import { pageIndex } from "../stores";
    import type { State, Match, Note } from "../lib/types";

    export let state: State;

    let match: Match = state.matches[state.currentMatchIdx];

    function DeleteMatch(){
        console.log("mm");
        console.log(state.matches);

        let matches: Match[] = state.matches;
        matches = matches.filter(item => item != match);

        state.matches = matches;
        
        pageIndex.set(1)
    }
    function GoBack(){
        console.log("going back");
        pageIndex.set(1);
    }

</script>

<h1>Editor</h1>

<h2>Match ID: {match.match_id}</h2>

<button on:click={() => {DeleteMatch()}}>Delete Match</button>
<button on:click={() => {GoBack()}}>Go Back</button>