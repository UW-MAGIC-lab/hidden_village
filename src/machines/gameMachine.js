import { createMachine, assign } from "xstate";

export const GameMachine = createMachine({
  initial: "ready",
  context: {
    holistic: undefined,
  },
  states: {
    ready: {
      on: {
        TOGGLE: "playing",
      },
    },
    playing: {},
  },
});
