import { createMachine, assign } from "xstate";

const GameMachine = createMachine(
  {
    id: "GameMachine",
    initial: "tutorial",
    states: {
      tutorial: {
        on: {
          NEXT: {
            target: "#GameMachine.chapter",
          },
        },
      },
      chapter: {
        exit: ["updateCurrentConjecture"],
        on: {
          NEXT: [
            {
              target: "#GameMachine.intervention",
              cond: "moveToIntervention",
            },
            {
              target: "#GameMachine.ending",
              cond: "moveToEnding",
            },
            {
              target: "#GameMachine.chapter",
            },
          ],
        },
      },
      intervention: {
        on: {
          NEXT: {
            target: "#GameMachine.chapter",
          },
        },
      },
      ending: {
        type: "final",
      },
    },
  },
  {
    guards: {
      moveToIntervention: (context) => {
        return (
          context.currentConjectureIdx + 1 ===
          context.conjectureIdxToIntervention
        );
      },
      moveToEnding: (context) => {
        return context.currentConjectureIdx === context.conjectures.length - 1;
      },
    },
    actions: {
      updateCurrentConjecture: assign({
        currentConjectureIdx: (context) => {
          return context.currentConjectureIdx + 1;
        },
      }),
    },
  }
);

export default GameMachine;
