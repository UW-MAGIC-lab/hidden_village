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
              target: "introReading",
              cond: "continueIntro",
              actions: ["introDialogStep"],
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
        exit: "outroDialogStep",
        after: {
          3000: {
            target: "outro",
          },
        },
        on: {
          NEXT: {
            target: "outro",
          },
        },
      },
      outro: {
        entry: "toggleCursorMode",
        exit: "outroDialogStep",
        on: {
          NEXT: [
            {
              target: "outro",
              cond: "continueOutro",
            },
            {
              target: "loading",
            },
          ],
        },
      },
      final: {
        type: "final",
      },
      loading: {},
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
