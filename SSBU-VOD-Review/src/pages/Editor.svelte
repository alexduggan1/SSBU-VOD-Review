<script lang="ts" src="http://www.youtube.com/iframe_api">
    import { pageIndex } from "../stores";
    import type { State, Match, Note } from "../lib/types";
    import { Mood } from "../lib/types";
    import Modal,{getModal} from "../lib/Modal.svelte";
    import { get } from "svelte/store";
    import { onMount } from 'svelte';

    export let state: State;

    export let player;
    let match: Match = state.matches[state.currentMatchIdx];
    console.log(match.match_id);
    export let initialVideoId = "https://www.youtube.com/embed/" + match.match_id + "?enablejsapi=1";
    let vidWid = 1280 * 70/100;
    let vidHei = 720 * 70/100;

    const ytPlayerId = 'youtube-player';

    onMount(() => {
        function load() {
            player = new YT.Player(ytPlayerId, {
                height: '100%',
                width: '100%',
                videoId: match.match_id,
                playerVars: { autoplay: 0 }
            });
        }

        if (window.YT) {
            load();
        } else {
            window.onYouTubeIframeAPIReady = load;
        }
    });


    match = state.matches[state.currentMatchIdx];

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


    let notes = match.notes;
    let dock_notes: Note[] = [];
    let inst_notes: Note[] = [];
    $: {
        notes = match.notes;
        dock_notes = [];
        inst_notes = [];
        notes.forEach(note => {
            console.log(note.type);
            if(note.type === "Dock"){
                dock_notes.push(note);
            }
            if(note.type === "Inst"){
                inst_notes.push(note);
            }
        });
        console.log(notes);
        console.log(dock_notes);
        console.log(inst_notes);

        inst_notes.sort((a, b) => a.timestamp - b.timestamp);
    }


    function AddNote(newType: string, mtext: string, mmood: Mood, time1: string = "0", time2: string = "0"){
        console.log("adding note");
        let my_note: Note;
        if(newType === "Inst"){
            let new_note: Note = {
                text: mtext,
                mood: mmood,
                type: "Inst",

                timestamp: 0
            };

            let minutes = "";
            let seconds = "";
            let colon = false;
            for (let index = 0; index < time1.length + 1; index++) {
                const element = time1.charAt(index);
                console.log(element);
                if(time1.charAt(index) == ":"){
                    colon = true;
                }
                else if(colon == false){
                    minutes = minutes.concat(element);
                }
                else{
                    seconds = seconds.concat(element);
                }
            }
            console.log("time");
            console.log(time1);
            console.log(minutes);
            console.log(seconds);
            new_note.timestamp = (parseInt(minutes) * 60) + parseInt(seconds);
            my_note = new_note;
        }
        else if(newType === "Span"){
            let new_note: Note = {
                text: mtext,
                mood: mmood,
                type: "Span",

                start_time: time1,
                end_time: time2
            };
            my_note = new_note;
        }
        else{
            let new_note: Note = {
                text: mtext,
                mood: mmood,
                type: "Dock"
            };
            my_note = new_note;
        }
        
        notes.push(my_note);
        match.notes = notes;

        console.log(my_note);
    }
    let add_note_text: string = "";
    let add_note_mood: Mood = Mood.Positive;
    let add_note_time1: string = "";
    let add_note_time2: string = "";

    let currentViewingNote: Note;

    function AddDockNote(){
        console.log("add dock note");
        getModal("add-dock-note").open();
    }
    function AddInstNote(){
        console.log("add inst note");
        console.log(player.playerInfo.currentTime);
        add_note_time1 = ToMinutesSeconds(Math.floor(player.playerInfo.currentTime));
        getModal("add-inst-note").open();
    }
    
    function RemoveNote(note: Note){
        console.log("removing note " + note);
        let notes: Note[] = state.matches[state.currentMatchIdx].notes;
        notes = notes.filter(item => item != note);

        state.matches[state.currentMatchIdx].notes = notes;
        match = state.matches[state.currentMatchIdx];
        match.notes = notes;
    }

    function EditMatchInfo(){
        console.log("edit match info");
        getModal("match-info-editor").open();
    }

    function ToMinutesSeconds(timeIn: number){
        let minutes = Math.floor(timeIn / 60);
        let seconds = timeIn % 60;
        console.log(minutes);
        console.log(seconds);
        let strSeconds = seconds.toString();
        if(strSeconds.length == 1){
            strSeconds = "0".concat(strSeconds);
        }
        return(minutes.toString() + ":" + strSeconds);
    }
</script>

<svelte:head>
    <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<h1>Editor</h1>

<div class="editor">
    <div class="video-player">
        <button on:click={() => {EditMatchInfo()}}>Match Info</button>
        <div id={ytPlayerId} class="theVidPlayer" />

        <div class ="time-notes-bar scrollx">
            <button on:click={() => {AddInstNote()}} class="inst-button">
                <h6 class="inst-button-text">Add Inst Note</h6>
            </button>
            {#each inst_notes as inst_note}
                {#if inst_note.mood == "Positive"}
                    <button on:click={() => {
                        add_note_text = inst_note.text;
                        add_note_mood = inst_note.mood;
                        add_note_time1 = inst_note.timestamp;
                        currentViewingNote = inst_note;
                        getModal("view-inst-note").open();
                        console.log("player:");
                        console.log(player);
                        player.seekTo(inst_note.timestamp, true);
                        }} class="inst-button green">
                        <h5 class="inst-button-text">{ToMinutesSeconds(inst_note.timestamp)}</h5>
                        </button>
                {:else if inst_note.mood == "Negative"}
                    <button on:click={() => {
                        add_note_text = inst_note.text;
                        add_note_mood = inst_note.mood;
                        add_note_time1 = inst_note.timestamp;
                        currentViewingNote = inst_note;
                        getModal("view-inst-note").open();
                        console.log("player:");
                        console.log(player);
                        player.seekTo(inst_note.timestamp, true);
                        }} class="inst-button red">
                        <h5 class="inst-button-text">{ToMinutesSeconds(inst_note.timestamp)}</h5>
                    </button>
                {:else}
                    <button on:click={() => {
                        add_note_text = inst_note.text;
                        add_note_mood = inst_note.mood;
                        add_note_time1 = inst_note.timestamp;
                        currentViewingNote = inst_note;
                        getModal("view-inst-note").open();
                        console.log("player:");
                        console.log(player);
                        player.seekTo(inst_note.timestamp, true);
                        }} class="inst-button">
                        <h5 class="inst-button-text">{ToMinutesSeconds(inst_note.timestamp)}</h5>
                    </button>
                {/if}
                
            {/each}
        </div>

        <div class ="time-notes-bar">
            <button on:click={() => {AddInstNote()}} class="inst-button">
                <h6 style="margin:0%">Add Span Note</h6>
            </button>
            <h3>note1</h3>
            <h3>note2</h3>
        </div>
    </div>
    <div class="dock-notes-bar scrolly">
        <button on:click={() => {AddDockNote()}} class="dock-button">
            <h3 class="dock-button-text">Add Dock Note</h3>
        </button>
        {#each dock_notes as dock_note}
            {#if dock_note.mood == "Positive"}
                <button class="dock-button green"
                on:click={() => {
                    add_note_text = dock_note.text;
                    add_note_mood = dock_note.mood;
                    getModal("view-dock-note").open();
                }}>
                    <div class="dock-button-text">
                        <h3>{dock_note.text.substring(0,24)}</h3>
                    </div>
                    <button on:click={() => RemoveNote(dock_note)} class="dock-button-x"><p>X</p></button>
                </button>
            {:else if dock_note.mood == "Negative"}
                <button class="dock-button red"
                on:click={() => {
                    add_note_text = dock_note.text;
                    add_note_mood = dock_note.mood;
                    getModal("view-dock-note").open();
                }}>
                    <div class="dock-button-text">
                        <h3>{dock_note.text.substring(0,30)}</h3>
                    </div>
                    <button on:click={() => RemoveNote(dock_note)} class="dock-button-x"><p>X</p></button>
                </button>
            {:else}
                <button class="dock-button"
                on:click={() => {
                    add_note_text = dock_note.text;
                    add_note_mood = dock_note.mood;
                    getModal("view-dock-note").open();
                }}>
                    <div class="dock-button-text">
                        <h3>{dock_note.text.substring(0,30)}</h3>
                    </div>
                    <button on:click={() => RemoveNote(dock_note)} class="dock-button-x"><p>X</p></button>
                </button>
            {/if}    
        {/each}
    </div>
</div>

<button on:click={() => {getModal("delete-match-confirm").open()}}>Delete Match</button>
<button on:click={() => {GoBack()}}>Go Back</button>
<button on:click={() => {getModal("export-match").open()}}>Export Match Data</button>

<Modal id="match-info-editor">
    <label for="p1-name">Player 1</label>
    <input type = "text" id="p1-name" name = "p1-name" bind:value={match.players[0]}>
    <label for="p2-name">Player 2</label>
    <input type = "text" id="p2-name" name = "p2-name" bind:value={match.players[1]}>
</Modal>

<Modal id="delete-match-confirm">
    Are you sure?
    <button on:click={() => {
        DeleteMatch();
        getModal("delete-match-confirm").close();
        }}>Delete!</button>
</Modal>

<Modal id="add-dock-note">
    <h2>New Dock Note</h2>
    <label for="add-dock-note-text">Text</label>
    <textarea id="add-dock-note-text" name = "add-dock-note-text"
    bind:value={add_note_text}></textarea>
    <select bind:value={add_note_mood}>
        {#each Object.keys(Mood).filter(key => isNaN(Number(key))) as mood}
            <option>{mood}</option>
        {/each}
    </select>

    <button on:click={() => {
        AddNote("Dock", add_note_text, add_note_mood);
        getModal("add-dock-note").close();
        }}>Add</button>
</Modal>

<Modal id="add-inst-note">
    <h2>New Inst Note</h2>
    <label for="add-inst-note-text">Text</label>
    <textarea id="add-inst-note-text" name = "add-inst-note-text"
    bind:value={add_note_text}></textarea>
    <select bind:value={add_note_mood}>
        {#each Object.keys(Mood).filter(key => isNaN(Number(key))) as mood}
            <option>{mood}</option>
        {/each}
    </select>
    <label for="add-inst-note-time1">Timestamp</label>
    <input type="string" id="add-inst-note-time1" 
    name="add-inst-note-time1" bind:value={add_note_time1}>

    <button on:click={() => {
        AddNote("Inst", add_note_text, add_note_mood, add_note_time1);
        getModal("add-inst-note").close();
        }}>Add</button>
</Modal>

<Modal id="view-dock-note">
    <h2>Dock Note</h2>
    <p>{add_note_text}</p>
    <h4>{add_note_mood}</h4>
</Modal>

<Modal id="view-inst-note">
    <h2>Inst Note</h2>
    <p>{add_note_text}</p>
    <h4>{add_note_mood}</h4>
    <p>{ToMinutesSeconds(add_note_time1)}</p>
    <button on:click={() => {
        RemoveNote(currentViewingNote);
        getModal("view-inst-note").close();
    }}>Delete</button>
</Modal>

<Modal id="export-match">
    <h1>Copy Export Data:</h1>
    <p>{JSON.stringify(match)}</p>
</Modal>

<style>
    .editor {
        display: flex;
        flex-direction: row;
        margin-bottom: 3%;
    }
    .video-player {
        display: flex;
        flex-direction: column;
        width: 100vw;
        margin-right: 2%;
        margin-left: 0%;
    }
    .time-notes-bar {
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        margin-top: 2%;
        background-color: rgba(255, 255, 255, 0.05);
        height: 4vw;
    }
    .inst-button {
        display: flex;
        flex-direction: column;
        aspect-ratio: 1;
        border-radius:15%;
        height: 100%;
        padding: 0;
        align-items: center;
    }
    .inst-button-text{
        display:flex;
        height:100%;
        justify-content: center;
        align-items: center;
        width:100%;
        margin:0;
        vertical-align: middle;
    }
    .dock-notes-bar {
        display: flex;
        flex-direction: column;
        width: 100vw;
        background-color: rgba(255, 255, 255, 0.05);
        padding: 1%;
    }
    .dock-button {
        display: flex;
        flex-direction: row;
        margin-bottom: 2%;
        text-align:center;
    }
    .green {
        background-color: #04AA6D;
    }
    .red {
        background-color: #f44336;
    }
    .dock-button-text{
        position:relative;
        float: left;
        width:100%;
    }
    .dock-button-x {
        position:relative;
        justify-content: center;
        right:0%;
        top:0%;
        height:fit-content;
        width: fit-content;
        text-align: center;
        color: #f44336;
        font-weight: 800;
        line-height: 1px;
    }
    .scrolly {
        overflow-y: auto;
    }
    .scrollx {
        overflow-x: auto;
    }
    .theVidPlayer {
        width: 55vw;
        aspect-ratio: 1.78;
    }
</style>