export type State = {
    matches: Match[];
    currentMatchIdx: number;
};

export type Match = {
    match_id: string;
    notes: Note[];
    last_accessed: Date;
    players: string[];
};

export type Note = InstNote | SpanNote | DockNote;

type InstNote = {
    text: string;
    mood: Mood;
    type: "Inst";

    timestamp: number;
    
};

type SpanNote = {
    text: string;
    mood: Mood;
    type: "Span";

    start_time: number;    
    end_time: number;    
};

type DockNote = {
    text: string;
    mood: Mood;
    type: "Dock";
};



export enum Mood {
    Positive = 0,
    Neutral = 1,
    Negative = 2
};