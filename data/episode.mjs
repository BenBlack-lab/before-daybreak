const rule = (id, channel, when, text) => ({ id, channel, when, text });
export const episode = {
  id: "before-daybreak-v2",
  title: "Before Daybreak",
  subtitle: "Getting everyone out is only half the story.",
  version: 2,
  characters: [
    {
      id: "alex",
      name: "Alex",
      role: "The one who came back.",
      motive: "Get people out. Even at a personal cost.",
    },
    {
      id: "morgan",
      name: "Morgan",
      role: "The one with a way through.",
      motive: "Make a deal that actually holds.",
    },
    {
      id: "sam",
      name: "Sam",
      role: "The one carrying the truth.",
      motive: "Expose the harm. Protect the sources.",
    },
  ],
  initialKnowledge: {
    you: ["offer"],
    alex: ["offer", "extension"],
    morgan: ["offer", "extension"],
    sam: ["offer", "names"],
  },
  facts: {
    offer:
      "Four escorted departures in return for keeping the report unpublished. Copies may be kept. Publication ends the offer.",
    extension:
      "Two more passes can protect the witnesses. A named guarantor must sign for the group and answer to security if the agreement is broken.",
    names:
      "The original identifies both witnesses. Sam needs your help to remove names and indirect clues to their identities.",
  },
  scenes: [
    {
      id: "discovery",
      chapter: "The offer",
      title: "Someone came back for you.",
      time: "04:40",
      place: "The records room",
      paragraphs: [
        "The shutter is already falling when Alex turns back. A shoulder under the steel. A hand around your wrist. Their bag disappears on the other side.",
        "You reach an empty records room. Morgan watches the gate through wired glass. Sam holds your report: proof that the company running this site covered up workers’ injuries. Two witnesses are still inside.",
        "Alex gives you their device while they bandage their hand. A message from the security chief fills the screen. Everyone knows there is an offer. No one knew Alex had been negotiating.",
      ],
      quote:
        "FOUR PASSES APPROVED. NO PUBLIC RELEASE. ANSWER BEFORE THE SHIFT CHANGES.",
      prompt: "How do you handle what you found?",
      choices: [
        {
          id: "private",
          label: "Give Alex a private hearing",
          hint: "Let Alex explain. They may put their own name behind your decision.",
          effects: { approach: "private", guarantor: "alex" },
          reveal: { you: ["extension"] },
          event:
            "You heard Alex privately. They offered to be the guarantor if you sought two more passes.",
        },
        {
          id: "open",
          label: "Bring everyone into the conversation",
          hint: "Put the terms in the open. Take responsibility for any deal you sign.",
          effects: { approach: "open", guarantor: "you" },
          reveal: {
            you: ["names", "extension"],
            alex: ["names"],
            morgan: ["names"],
            sam: ["extension"],
          },
          event:
            "You brought the offer to the group and took responsibility for signing any extended deal.",
        },
      ],
    },
    {
      id: "commitment",
      chapter: "Your word",
      title: "Who pays for a way out?",
      time: "04:45",
      place: "The last preparation",
      paragraphs: [
        "Morgan can get the two witnesses escorted out too. Six passes, one signed promise: keep the report unpublished. If you break it, the named guarantor will be held to answer for the group.",
        "Sam turns a page towards you. “These people trusted us.” Their names are there. So are details that could identify them even if the names were crossed out.",
        "Ten minutes remain before the escort offer expires. Morgan needs you at the checkpoint to confirm the witness list. Sam needs you—the report’s author—to check every identifying detail. Either preparation takes those ten minutes.",
        "Without an escort, you can use the ordinary exit. Expect questioning and a delay. The choice is yours; the others have agreed to follow it, not necessarily forgive it.",
      ],
      prompt: "What do you commit to?",
      reveal: {
        you: ["names", "extension"],
        alex: ["names"],
        morgan: ["names"],
        sam: ["extension"],
      },
      choices: [
        {
          id: "passes",
          label: "Get six people out. Promise silence.",
          hint: "Secure escorted passage for the group and both witnesses. Keep the report private.",
          effects: { preparation: "passes", promise: "silence" },
          event:
            "You promised silence and secured six passes. The report stayed unredacted.",
        },
        {
          id: "redact",
          label: "Protect the sources. Prepare to publish.",
          hint: "Check the report with Sam. Promise never to release the identifying version. The original four-pass offer remains.",
          effects: { preparation: "redact", promise: "sources" },
          event:
            "You promised to protect the sources and prepared a redacted report. No extra passes were secured.",
        },
      ],
    },
    {
      id: "departure",
      chapter: "The cost",
      title: "There is still time to change your mind.",
      time: "04:55",
      place: "At the gate",
      paragraphs: [
        "Morgan holds out the device. Beyond the glass, the morning shift is gathering. Your report is ready to send—or to keep.",
        "“We can keep copies,” Sam says. “But copies in our pockets won’t make anyone answer for this.”",
        "Alex looks at you. “Whatever you choose, know whose name is underneath it.”",
      ],
      prompt: "What do you send?",
      choices: [
        {
          id: "withhold",
          label: "Nothing. Accept the escort.",
          hint: "Keep the report private and use the passes you secured. The company’s wrongdoing stays unexposed.",
          outcome: "withheld",
          event:
            "You kept the report unpublished and accepted escorted passage.",
        },
        {
          id: "publish_safe",
          label: "Send the redacted report.",
          hint: "Expose the wrongdoing without the details you removed. Give up escorted passage.",
          requires: { preparation: "redact" },
          outcome: "redacted",
          event:
            "You released the checked, redacted report. The escort offer ended.",
        },
        {
          id: "publish_full",
          label: "Send the original report.",
          hint: "Publish everything, including the sources’ identities. Break any promise of silence or source protection.",
          outcome: "original",
          event:
            "You published the original, including the witnesses’ identities. The escort offer ended.",
        },
      ],
    },
  ],
  rules: [
    rule(
      "title-silence",
      "title",
      { outcome: "withheld" },
      "The price of passage",
    ),
    rule(
      "title-redacted",
      "title",
      { outcome: "redacted" },
      "A truth with names removed",
    ),
    rule(
      "title-original",
      "title",
      { outcome: "original" },
      "Everything goes out",
    ),
    rule(
      "six-leave",
      "passage",
      { outcome: "withheld", preparation: "passes" },
      "All six leave under escort. At the street, one witness asks when the report will come out. You have no answer you can give them.",
    ),
    rule(
      "four-leave",
      "passage",
      { outcome: "withheld", preparation: "redact" },
      "The four of you leave under escort. The two witnesses remain inside. You have protected their names, but you did not secure their passage.",
    ),
    rule(
      "alex-held",
      "passage",
      { outcome: "original", preparation: "passes", guarantor: "alex" },
      "Security holds Alex, the named guarantor, overnight. You, Morgan and Sam leave after questioning. Alex walks out the next morning alone. The witnesses never receive their escorts.",
    ),
    rule(
      "you-held",
      "passage",
      { outcome: "original", preparation: "passes", guarantor: "you" },
      "Security holds you, the named guarantor, overnight. Alex, Morgan and Sam leave after questioning. You walk out the next morning alone. The witnesses never receive their escorts.",
    ),
    rule(
      "ordinary-release",
      "passage",
      {},
      "Security questions all four of you until morning, then lets you leave. Your report is already outside. The witnesses remain inside without escorted passage.",
    ),
    rule(
      "report-private",
      "evidence",
      { outcome: "withheld" },
      "You keep copies. Nothing is public. The company gets the silence it wanted; your chance to expose it has been postponed.",
    ),
    rule(
      "report-checked",
      "evidence",
      { outcome: "redacted" },
      "The wrongdoing is public. Names and identifying details were removed. You reduced the sources’ exposure, without pretending you could guarantee their safety.",
    ),
    rule(
      "report-original",
      "evidence",
      { outcome: "original" },
      "The wrongdoing is public—and so are both witnesses’ identities. The report cannot be recalled. You do not know what that exposure will cost them.",
    ),
    rule(
      "alex-betrayed",
      "alex",
      { outcome: "original", preparation: "passes", guarantor: "alex" },
      "“You let me put my name to it. You could have told me you were going to change your mind.”",
    ),
    rule(
      "alex-you-pay",
      "alex",
      { outcome: "original", preparation: "passes", guarantor: "you" },
      "“You took the cost yourself. That doesn’t make the promise disappear.”",
    ),
    rule(
      "alex-kept",
      "alex",
      { outcome: "withheld", preparation: "passes" },
      "“They’re out. All of them. I need that to mean something.”",
    ),
    rule(
      "alex-other",
      "alex",
      {},
      "“I came back for you. I would do it again. I’m still trying to understand this.”",
    ),
    rule(
      "sam-exposed",
      "sam",
      { outcome: "original" },
      "“They trusted us with their names. Not with the right to give them away.”",
    ),
    rule(
      "sam-six",
      "sam",
      { outcome: "withheld", preparation: "passes" },
      "“We got them out. Now we have to live with what we signed.”",
    ),
    rule(
      "sam-four",
      "sam",
      { outcome: "withheld" },
      "“Four passes. Six people. Remember which side of the gate we left them on.”",
    ),
    rule(
      "sam-report",
      "sam",
      {},
      "“Let them answer for what they did. At least we didn’t hand over the names.”",
    ),
  ],
};
