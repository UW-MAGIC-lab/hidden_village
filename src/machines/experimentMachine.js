import { createMachine, assign } from "xstate";

const ExperimentMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5RgB4AcwCcCWBbMAdgC4B0AbthGAPYAKANgIYCe2BUAxAHICiAGgBVEoNNVjYi2agWEgUiAIwA2AEwkADCqXqAzKoAc+gOwKALAFZzAGhDNFSpSQUBOQwv1LzD-et0BfPxtUDBx8YnJKGgYWNk4AJR5aABkAQQBNWVFxSWlZeQRTFRs7BAUFdRJnFSNzHV8FFR0mlRUAoPQsPEJSLLAAWUYiAGMAC1jufiEkECyJKRlp-J0fSsMvcyM1i2dixCV9EhVTdVNDdXNG-eU28A7Q7pIh6QArMCGiAFdMMDiwRlhpONeIJMmI5rlFntqiRVM4XOp9OYEct9LsEEYKvoVAojM4LoiEfpTAoAoEQARqFR4NNgp0wqQKFQ6ExWOxQdl5nlEKZnKsdOZjDUeRdXGicbyWs4lC4jh4BZ4brT7uFegNhmM2dNZjkFqB8tUKs4TPzlkZTKcdKYxbjDiopTLTp45Yq7l1wk8CK93l8fn8AQRYuzwbq5HsjGoib5zA1iUpTDUxUSSKY9Hpwxtlt4XSE3UQgzquaVUbZEABaUwkIx1NzOE5SkynUl+IA */
  createMachine(
    {
      context: {
        currentPoseIndex: 0,
        completedDirectedActionCounter: 0,
        numPosesInDirectedAction: 3,
        actionMatchTarget: 2,
      },
      id: "experiment",
      initial: "videoPlaying",
      states: {
        videoPlaying: {
          on: {
            NEXT: {
              target: "#experiment.poseMatching",
            },
            REPLAY: {
              target: "#experiment.videoPlaying",
            },
          },
        },
        poseMatching: {
          on: {
            NEXT: "#experiment.intuition",
          },
        },
        conjectureReasoning: {
          on: {
            NEXT: {
              actions: "triggerEndOfExperiment",
              target: "#experiment.experimentEnd",
            },
          },
        },
        insight: {
          on: {
            NEXT: "experimentEnd",
          },
        },
        intuition: {
          on: {
            NEXT: "insight",
          },
        },
        experimentEnd: {
          type: "final",
        },
      },
    },
    {
      guards: {
        finishedMatching: (context) => {
          return (
            context.completedDirectedActionCounter ===
              context.actionMatchTarget - 1 &&
            context.currentPoseIndex === context.numPosesInDirectedAction - 1
          );
        },
      },
      actions: {
        updateMatchTracking: assign({
          currentPoseIndex: (context) => {
            if (
              context.currentPoseIndex ===
              context.numPosesInDirectedAction - 1
            ) {
              return 0;
            }
            return context.currentPoseIndex + 1;
          },
          completedDirectedActionCounter: (context) => {
            if (
              context.currentPoseIndex ===
              context.numPosesInDirectedAction - 1
            ) {
              return context.completedDirectedActionCounter + 1;
            }
            return context.completedDirectedActionCounter;
          },
        }),
      },
      triggerEndOfExperiment: () => {
        throw "overwrite this action with a callback to move to next experiment";
      },
    }
  );
export default ExperimentMachine;
