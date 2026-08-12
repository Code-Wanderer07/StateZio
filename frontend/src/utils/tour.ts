import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const startTour = () => {
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: '#tour-add-state',
        popover: {
          title: 'Add State',
          description: 'Click here to spawn a new state on the canvas. You can drag states around to organize them.',
          side: "right", 
          align: 'start'
        }
      },
      {
        element: '#tour-auto-layout',
        popover: {
          title: 'Auto Layout',
          description: 'Instantly organizes all your states into a clean, readable graph structure.',
          side: "right",
          align: 'start'
        }
      },
      {
        element: '#tour-undo-redo',
        popover: {
          title: 'Undo & Redo',
          description: 'Made a mistake? Easily undo or redo any structural changes. Keyboard shortcuts (Ctrl+Z / Ctrl+Y) work too!',
          side: "right",
          align: 'start'
        }
      },
      {
        element: '#tour-sim-input',
        popover: {
          title: 'Test Input',
          description: 'Type a string here to test your automaton. The engine will evaluate whether it accepts or rejects.',
          side: "top",
          align: 'center'
        }
      },
      {
        element: '#tour-sim-play',
        popover: {
          title: 'Run Simulation',
          description: 'Hit Play to watch the machine execute step-by-step. You can also use the adjacent buttons to manually step forward or backward.',
          side: "top",
          align: 'center'
        }
      },
      {
        element: '#tour-sim-speed',
        popover: {
          title: 'Playback Speed',
          description: 'Adjust how fast the auto-play simulation runs, from 0.5x up to 4x speed.',
          side: "top",
          align: 'center'
        }
      },
      {
        element: '#tour-inspector',
        popover: {
          title: 'Execution Trace',
          description: 'View the Execution Trace table here to see exactly how your machine processes each symbol in real time!',
          side: "left",
          align: 'start'
        }
      },
      {
        element: '#tour-tab-batch',
        popover: {
          title: 'Batch Test Suite',
          description: 'Click this tab to define multiple test strings and instantly evaluate all of them at once!',
          side: "left",
          align: 'start'
        },
        onHighlightStarted: (el: Element | undefined) => {
          if (el) (el as HTMLElement).click();
        }
      },
      {
        element: '#tour-tab-tuples',
        popover: {
          title: 'Machine Tuples',
          description: 'Click this tab to view the formal mathematical 5-tuple definition of your constructed machine.',
          side: "left",
          align: 'start'
        },
        onHighlightStarted: (el: Element | undefined) => {
          if (el) (el as HTMLElement).click();
        }
      }
    ]
  });

  driverObj.drive();
};
