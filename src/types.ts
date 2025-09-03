export type Interval = { 
    start: Date; 
    end: Date 
};

export type Row = { 
    empId: string;
    projectId: string; 
    from: Date; 
    to: Date 
};

export type PairKey = string;

export type PairProjectItem = {
     emp1: string;
     emp2: string; 
     projectId: string; 
     days: number 
};

export type Result = {
     emp1: string; 
     emp2: string;
     totalDays: number; 
     items: PairProjectItem[] 
};
