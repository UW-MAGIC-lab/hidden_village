import { createMachine, assign } from "xstate";

const ExperimentMachine = createMachine(
  {
    id: 'experiment',
    initial: 'videoPlaying',
    context: {
      currentPoseIndex: 0,
      completedDirectedActionCounter: 0,
      numPosesInDirectedAction: 3,
      actionMatchTarget: 2,
    },
    states: {
      videoPlaying: {
        on: {
          NEXT: 'poseMatching',
          REPLAY: 'videoPlaying'
        }
      },
      poseMatching: {
        on: {
          NEXT: [
            {
              target: 'conjectureReasoning',
              cond: 'finishedMatching'
            },
            {
              target: 'poseMatching',
              actions: ['updateMatchTracking']
            }
          ]
        }
      },
      conjectureReasoning: {
        on: {
          NEXT: {
            actions: ['triggerEndOfExperiment']
          }
        }
      }
    }
  },
  {
    guards: {
      finishedMatching: (context) => {
        return (context.completedDirectedActionCounter === context.actionMatchTarget - 1) && (context.currentPoseIndex === (context.numPosesInDirectedAction - 1)) ;
      }
    },
    actions: {
      updateMatchTracking: assign({
        currentPoseIndex: (context) => {
          if (context.currentPoseIndex === (context.numPosesInDirectedAction - 1)) {
            return 0
          }
          return context.currentPoseIndex + 1;
        },
        completedDirectedActionCounter: (context) => {
          if (context.currentPoseIndex === (context.numPosesInDirectedAction - 1)) {
            return context.completedDirectedActionCounter + 1
          }
          return context.completedDirectedActionCounter;
        }
      })
    },
    triggerEndOfExperiment: () => {
      throw('overwrite this action with a callback to move to next experiment')
    }
  }
);
export default ExperimentMachine;