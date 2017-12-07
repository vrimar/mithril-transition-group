import * as m from 'mithril';
import * as assert from 'assert';
import { Transition, TransitionState } from '../src';
import * as o from 'ospec';
import { setTimeout } from 'timers';

const transitionDuration = 100;

describe('Transition', () => {
  let transition;
  const root = {
    transition: null,
    view() {
      this.transition = transition;
      return transition;
    }
  };

  beforeEach(() => {
    m.mount(document.body, null);
    transition = undefined;
  })

  it('handles entering state/callbacks', (done) => {
    let count = 0;

    transition = m(Transition, {
      isVisible: true,
      onEnter: () => {
        count++;
        assert.equal(transition.state.status, TransitionState.EXITED);
      },
      onEntering: () => {
        count++;
        assert.equal(transition.state.status, TransitionState.ENTERING);
      },
      onEntered: () => {
        count++;
        assert.equal(transition.state.status, TransitionState.ENTERED);
        assert.equal(count, 3);
        done();
      },
      timeout: transitionDuration
    });

    m.mount(document.body, root);
  });

  it('handles exiting state/callbacks', (done) => {
    let count = 0;

    const container = {
      isVisible: true,
      view(vnode) {
        transition = m(Transition, {
          isVisible: container.isVisible,
          onEntered: () => {
            container.isVisible = false;
            m.redraw();
          },
          onExit: () => {
            count++;
            assert.equal(transition.state.status, TransitionState.ENTERED);
          },
          onExiting: () => {
            count++;
            assert.equal(transition.state.status, TransitionState.EXITING);
          },
          onExited: () => {
            count++;
            assert.equal(transition.state.status, TransitionState.UNMOUNTED);
            assert.equal(count, 3);
            done();
          },
          timeout: transitionDuration
        });
        return transition;
      }
    };

    m.mount(document.body, container);
  });
});
