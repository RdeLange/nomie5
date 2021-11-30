import type { IJournal } from "../../modules/journal/journal";

export const journalTemplates: Array<IJournal> = [
  {journalname: "Morning",
displayName: "Morning",
avatar:"",
last: new Date(),
notes: "This is a test",
prompts: ["How do you feel","Tell me about the day"],
journalcolor: "#66BB6A",
},
{journalname: "Evening",
displayName: "Evening",
avatar:"",
last: new Date(),
notes: "This is a test for evening",
prompts: ["How do you feel","Tell me about the day"],
journalcolor: "#66BB6A",
},
{journalname: "Boilerplate",
displayName: "Boilerplate",
avatar:"",
last: new Date(),
notes: "This is a boilerplate for creating a guided journal",
prompts: ["Placeholder for first prompt","Placeholde for second prompt"],
journalcolor: "#66EE6A",
}
]
