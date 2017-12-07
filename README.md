# mithril-transition-group

A set of Mithril higher-order components for creating state/class based transitions. Inspired by [react-transition-group](https://github.com/reactjs/react-transition-group).

## Installation

```
npm install --save mithril-transition-group
```

## Transition
`Transition` is a higher-order component that allows you to transition children based on current animation state with a declarative API.

### Usage

By default, the `Transition` component does not alter it's children; it only tracks "enter" and "exit" transitions. The example below provides an example of transitioning it's content using inline styles:

There are 4 main states a `Transition` can be in:
1. ENTERING
2. ENTERED
3. EXITING
4. EXITED

```javascript
const duration = 400;

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
  background: 'red',
};

const transitionStyles = {
  entering: {
    opacity: 0,
    background: 'blue'
  },
  entered: {
    opacity: 1,
    background: 'white'
  },
  exiting: {
    background: 'red'
  }
};

const Example = {
  isVisible: true,

  view() {
    return m('', [
      m('button', { onclick: () => this.isVisible = !this.isVisible }, 'Toggle Transition'),

      m(Transition, {
        isVisible: this.isVisible,
        content: (state) => {
          return m('', {
            style: {
              ...defaultStyle,
              ...transitionStyles[state]
            }
          }, 'Fade transition')
        },
        exitTimeout: duration
      })
    ]);
  }
};

m.mount(document.body, Example);
```

## Transition API
```javascript
export interface ITransitionAttrs {
  /** Displays the content; triggers onEnter/onExit callbacks */
  isVisible?: boolean;

  /** Content to be transitioned */
  content?: m.Children | ((state: TransitionState) => m.Children);

  /** Invoked on initial component enter */
  onEnter?: (node: HTMLElement) => void;

  /** Invoked when component is entering */
  onEntering?: (node: HTMLElement) => void;

  /** Invoked when component has entered */
  onEntered?: (node: HTMLElement) => void;

  /** Invoked on initial component exit */
  onExit?: (node: HTMLElement) => void;

  /** Invoked when component is exiting */
  onExiting?: (node: HTMLElement) => void;

  /** Invoked on when component has exited */
  onExited?: (node: HTMLElement) => void;

  /** Timeouts for enter/exit transition */
  timeout: number | {
    enter: number;
    exit: number;
  };
}
```

## CSS Transition

A higher-order component that uses CSS classes for transitions. It is inspired by [react-transition-group](http://www.nganimate.org/).

### Usage
`CSSTransition` applies a pair of classes (specified by the `transitionClass` property) to `content` during the `enter` and `exit` transition states. Assuming `transitionClass="fade"`, the lifecycle process is as follows.

1. onEnter: `.fade-enter` class is added to `content`
2. onEntering: `.fade-enter-active` class is added to `content`
3. onEntered: `.fade-enter` and `.fade-enter-active` are removed from `content`
4. onExit: `.fade-exit` class is added to `content
5. onExiting: `.fade-exit-active` class is added to `content`
6. onExited: `.fade-exit` and `.fade-exit-active` are removed from `content`

### CSS Transition API

```javascript
export interface ICSSTransitionAttrs {
  /** Displays the content; triggers onEnter/onExit callbacks */
  isVisible?: boolean;

  /** Content to be transitioned */
  content?: m.Children | ((state: TransitionState) => m.Children);

  /** Invoked on initial component enter */
  onEnter?: (node: HTMLElement) => void;

  /** Invoked when component is entering */
  onEntering?: (node: HTMLElement) => void;

  /** Invoked when component has entered */
  onEntered?: (node: HTMLElement) => void;

  /** Invoked on initial component exit */
  onExit?: (node: HTMLElement) => void;

  /** Invoked when component is exiting */
  onExiting?: (node: HTMLElement) => void;

  /** Invoked on when component has exited */
  onExited?: (node: HTMLElement) => void;

  /** Timeouts for enter/exit transition */
  timeout: number | {
    enter: number;
    exit: number;
  };

  /** Base transition class to use for CSS transitions **/
  transitionClass: string;
}
```
