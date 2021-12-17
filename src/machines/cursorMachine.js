import { createMachine, assign } from "xstate";

const CursorMachine = createMachine(
  {
    initial: "idle",
    context: {
      callback: () => {
        console.log("called");
      },
      hovering: false,
      canTransition: true,
    },
    states: {
      activated: {
        after: {
          3500: {
            target: "idle",
            cond: (context) => context.canTransition,
          },
          4000: {
            target: "idle",
            actions: [
              assign({
                hovering: (context) => !context.hovering,
                canTransition: (context) => !context.canTransition,
              }),
            ],
          },
        },
      },
      idle: {
        exit: assign({
          canTransition: (context) => !context.canTransition,
        }),
        on: {
          TRIGGER: {
            target: "activated",
            cond: (context) => context.canTransition,
            actions: [
              assign({
                hovering: (context) => !context.hovering,
              }),
              (context) => {
                context.callback();
              },
            ],
          },
        },
      },
    },
  },
  {
    actions: {
      toggleHovering: assign({
        hovering: (context) => !context.hovering,
      }),
      triggerCallback: (context) => {
        context.callback();
      },
      toggleCanTransition: assign({
        canTransition: (context) => !context.canTransition,
      }),
    },
  }
);

export default CursorMachine;
