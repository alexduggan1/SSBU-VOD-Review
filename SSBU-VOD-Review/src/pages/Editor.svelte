<script lang="ts">
    import { pageIndex } from "../stores";
    import type { State, Match, Note } from "../lib/types";
    import { Mood } from "../lib/types";
    import Modal,{getModal} from "../lib/Modal.svelte";
    import { get } from "svelte/store";
    
    var tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('existing-iframe-example', {
            events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
            }
        });
    }
    function onPlayerReady(event) {
        document.getElementById('existing-iframe-example').style.borderColor = '#FF6D00';
    }


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

    let vidSrc = "https://www.youtube.com/embed/" + match.match_id + "?enablejsapi=1"
    let vidWid = 1280 * 70/100;
    let vidHei = 720 * 70/100;


    let notes = match.notes;
    let dock_notes: Note[] = [];
    $: {
        notes = match.notes;
        dock_notes = [];
        notes.forEach(note => {
            console.log(note.type);
            if(note.type === "Dock"){
                dock_notes.push(note);
            }
        });
        console.log(notes);
        console.log(dock_notes);
    }
    


    function AddNote(newType: string, mtext: string, mmood: Mood, time1: number = 0, time2: number = 0){
        console.log("adding note");
        let my_note: Note;
        if(newType === "Inst"){
            let new_note: Note = {
                text: mtext,
                mood: mmood,
                type: "Inst",

                timestamp: time1
            };
            my_note = new_note;
        }
        if(newType === "Span"){
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
    let add_note_time1: number = 0;
    let add_note_time2: number = 0;

    function AddDockNote(){
        console.log("add dock note");
        getModal("add-dock-note").open();
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
</script>

<h1>Editor</h1>

<div class="editor">
    <div class="video-player">
        <button on:click={() => {EditMatchInfo()}}>Match Info</button>
        <iframe id="existing-iframe-example"
            width="{vidWid}" height="{vidHei}"
            src={vidSrc}
            frameborder="0"
            style="border: solid 4px #37474F"
            title="vid-iframe"
        ></iframe>
        <div class ="time-notes-bar">
            <h3>note1</h3>
            <h3>note2</h3>
        </div>
    </div>
    <div class="dock-notes-bar">
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
                        <h3>{dock_note.text.substring(0,30)}</h3>
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

<button on:click={() => {DeleteMatch()}}>Delete Match</button>
<button on:click={() => {GoBack()}}>Go Back</button>

<Modal id="match-info-editor">
    <label for="p1-name">Player 1</label>
    <input type = "text" id="p1-name" name = "p1-name" bind:value={match.players[0]}>
    <label for="p2-name">Player 2</label>
    <input type = "text" id="p2-name" name = "p2-name" bind:value={match.players[1]}>
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

<Modal id="view-dock-note">
    <h2>Dock Note</h2>
    <p>{add_note_text}</p>
    <h4>{add_note_mood}</h4>
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
        margin-right: 5%;
        margin-left: 0%;
    }
    .time-notes-bar {
        display: flex;
        flex-direction: row;
        margin-top: 5%;
        background-color: rgba(255, 255, 255, 0.05);
    }
    .dock-notes-bar {
        display: flex;
        flex-direction: column;
        width: 100vw;
        background-color: rgba(255, 255, 255, 0.05);
        padding: 2%;
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
        right:-3.6%;
        top:0%;
        height:fit-content;
        width: fit-content;
        text-align: center;
        color: #f44336;
        font-weight: 800;
        line-height: 1px;
    }
</style>