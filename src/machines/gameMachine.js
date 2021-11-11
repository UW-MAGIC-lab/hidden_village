import { createMachine, assign } from "xstate";

export const GameMachine = createMachine({
  initial: "loading",
  context: {},
  states: {
    loading: {
      on: {
        TOGGLE: "ready",
      },
    },
    ready: {
      on: {
        TOGGLE: "playing",
      },
    },
    playing: {},
  },
});
