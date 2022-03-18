import { createMachine, assign } from "xstate";
import intro from "../scripts/chapters.toml";
const chapterMachine = createMachine(
  {
    initial: "intro",
    context: {
      introText: intro["chapter-1"].intro,
      currentText: null,
      lastText: [],
      outroText: intro["chapter-1"].outro,
      cursorMode: true,
      scene: intro["chapter-1"].scene,
      loaded: false,
    },
    states: {
      idle: {
        after: {
          1000: {
            target: "intro",
          },
        },
      },
      intro: {
        entry: ["introDialogStep"],
        on: {
          NEXT: [
            {
              target: "intro",
              cond: "continueIntro",
            },
            {
              target: "experiment",
              cond: (context, event) => context.introText.length === 0,
            },
          ],
        },
      },
      introReading: {
        after: {
          3000: {
            target: "intro",
          },
        },
      },
      experiment: {
        on: {
          ADVANCE: {
            target: "outro",
          },
        },
      },
      outro: {
        entry: "outroDialogStep",
        on: {
          NEXT: [
            {
              target: "outro",
              cond: "continueOutro",
            },
            {
              target: "loadingNextChapter",
              actions: assign({
                currentText: (context) => {
                  console.log(context);
                  return { text: "Loading next chapter...", speaker: "player" };
                },
                loaded: () => false,
              }),
            },
          ],
        },
      },
      loadingNextChapter: {
        on: {
          target: "intro",
          RESET_CONTEXT: {
            actions: assign({
              introText: (_, event) => event.introText,
              outroText: (_, event) => event.outroText,
              currentText: (_, event) => null,
              lastText: () => [],
            }),
          },
        },
      },
    },
  },
  {
    guards: {
      continueIntro: (context) => {
        return context.introText.length > 0;
      },
      continueOutro: (context) => {
        return context.outroText.length > 0;
      },
    },
    actions: {
      introDialogStep: assign({
        currentText: (context) => {
          if (context.introText[0]) {
            return context.introText[0];
          }
          return {};
        },
        introText: (context) => {
          if (context.introText.length > 0) {
            return context.introText.slice(1);
          }
          return [];
        },
        lastText: (context) => {
          if (context.introText.length > 0) {
            return [...context.lastText, context.currentText];
          }
          return [];
        },
      }),
      toggleCursorMode: assign({
        cursorMode: (context) => {
          return !context.cursorMode;
        },
      }),
      outroDialogStep: assign({
        currentText: (context) => {
          if (context.outroText[0]) {
            return context.outroText[0];
          }
          return {};
        },
        outroText: (context) => {
          if (context.outroText.length > 0) {
            return context.outroText.slice(1);
          }
          return [];
        },
        lastText: (context) => {
          if (context.outroText.length > 0) {
            return [...context.lastText, context.currentText];
          }
          return [];
        },
      }),
    },
  }
);

export default chapterMachine;
