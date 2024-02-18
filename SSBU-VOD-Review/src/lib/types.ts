export type State = {
    matches: Match[];
    currentMatchIdx: number;
};

export type Match = {
    match_id: string;
    notes: Note[];
    last_accessed: Date;
};

export type Note = InstNote | SpanNote | DockNote;

type InstNote = {
    text: string;
    mood: Mood;

    timestamp: number;    
};

type SpanNote = {
    text: string;
    mood: Mood;

    start_time: number;    
    end_time: number;    
};

type DockNote = {
    text: string;
    mood: Mood;  
};



export enum Mood {
    Positive = 0,
    Neutral = 1,
    Negative = 2
};