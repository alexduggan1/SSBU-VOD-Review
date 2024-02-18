<script lang="ts">
    import { pageIndex } from "../stores";
    import type { State, Match } from "../lib/types";

    export let state: State;
    // use to recreate localstorage after deletion
    //localStorage.setItem("state", JSON.stringify(state));
    
    let matches: Match[] = [];
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
        console.log("cccc " + matches);
        if(matches === undefined){
            matches = [];
        }
    }
    console.log("matches " + matches);
    localStorage.setItem("state", JSON.stringify(state));

</script>

<h1>SSBU VOD Review</h1>
<button on:click={() => {pageIndex.set(1)}}>Start</button>