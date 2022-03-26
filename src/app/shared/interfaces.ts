// showing tab values 
export interface SingleSectionName {
  key: string;
  labelValue: string;
}

// single tab section
export interface SingleSectionTab {
    singleSectionName: SingleSectionName;
    inputFormsToAccept: InputForm[];
}

// single input form in the tab
export interface InputForm {
    label: string;
    inputRecordsToAccept: RecordInput[];
    disabledDiv?: boolean;
    twoColumnLayout?: boolean;
    showUnits?: boolean;
}

// single record input in the form
export interface RecordInput {
    type: string;
    label: string;
    isMandatory: boolean;
    valueToBind?: any;
    infoMessage?: string;
    selectedValueToBind?: any;
    keyToRead?:string;
}

// view only record TODO
export interface ViewRecordsForm {
    [key:string]: string;
}