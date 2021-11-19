import type { IJournal } from "../../modules/journal/journal";

export const journalTemplates: Array<IJournal> = [
  {journalname: "Morning Journal Template",
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
}
]
