import m from 'mithril';
import assert from 'assert';
import { CSSTransition } from '../src';

const transitionDuration = 100;

describe('CSSTransition', () => {
  beforeEach(() => m.mount(document.body, null));

  it('handles entering state/callbacks', (done) => {
    let count = 0;
    let transition = null;

    let container = {
      view() {
        transition = m(CSSTransition, {
          content: m(''),
          isVisible: true,
          onEnter: (node: HTMLElement) => {
            count++;
            assert(node.classList.contains('fade-enter'));
          },
          onEntering: (node: HTMLElement) => {
            count++;
            assert(node.classList.contains('fade-enter'));
            assert(node.classList.contains('fade-enter-active'));
          },
          onEntered: (node: HTMLElement) => {
            count++;
            assert.equal(node.classList.length, 0);
            assert.equal(count, 3);
            done();
          },
          transitionClass: 'fade',
          timeout: transitionDuration
        });
        return transition;
      }
    }

    const node = document.createElement('div');
    document.body.appendChild(node);
    m.mount(node, container);
  });

  it('handles exiting state/callbacks', (done) => {
    let count = 0;
    let transition = null;

    let container = {
      isVisible: true,
      view(vnode) {
        transition = m(CSSTransition, {
          isVisible: container.isVisible,
          content: m(''),
          onEntered: () => {
            container.isVisible = false;
            m.redraw();
          },
          onExit: (node: HTMLElement) => {
            count++;
            assert(node.classList.contains('fade-exit'));
          },
          onExiting: (node: HTMLElement) => {
            count++;
            assert(node.classList.contains('fade-exit'));
            assert(node.classList.contains('fade-exit-active'));
          },
          onExited: (node: HTMLElement) => {
            count++;
            assert.equal(node.classList.length, 0);
            assert.equal(count, 3);
            done();
          },
          timeout: transitionDuration,
          transitionClass: 'fade'
        });
        return transition;
      }
    };

    const node = document.createElement('div');
    document.body.appendChild(node);
    m.mount(node, container);
  });
});
