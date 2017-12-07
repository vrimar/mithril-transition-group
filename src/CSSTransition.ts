import * as m from 'mithril';
import * as elClass from 'element-class';
import { Transition, ITransitionAttrs } from './Transition';
import { safeCall } from './utils';

export interface ICSSTransitionAttrs extends ITransitionAttrs {
  transitionClass?: string;
}

export type transitionType = 'enter' | 'exit';

export class CSSTransition implements m.ClassComponent<ICSSTransitionAttrs> {
  view({ attrs }: m.CVnode<ICSSTransitionAttrs>) {
    return m(Transition, {
      ...attrs as ITransitionAttrs,
      onEnter: (node: HTMLElement) => this.onEnter(node, attrs),
      onEntering: (node: HTMLElement) => this.onEntering(node, attrs),
      onEntered: (node: HTMLElement) => this.onEntered(node, attrs),
      onExit: (node: HTMLElement) => this.onExit(node, attrs),
      onExiting: (node: HTMLElement) => this.onExiting(node, attrs),
      onExited: (node: HTMLElement) => this.onExited(node, attrs),
    });
  }

  onEnter = (node: HTMLElement, attrs: ICSSTransitionAttrs) => {
    this.removeClasses(node, attrs, 'exit');
    elClass(node).add(`${attrs.transitionClass}-enter`);

    safeCall(attrs.onEnter, node);
  }

  onEntering = (node: HTMLElement, attrs: ICSSTransitionAttrs) => {
    this.removeClasses(node, attrs, 'exit');

    elClass(node).add(`${attrs.transitionClass}-enter-active`);
    // tslint:disable-next-line:no-unused-expression
    node.scrollTop;

    safeCall(attrs.onEntering, node);
  }

  onEntered = (node: HTMLElement, attrs: ICSSTransitionAttrs) => {
    this.removeClasses(node, attrs, 'enter');
    safeCall(attrs.onEntered, node);
  }

  onExit = (node: HTMLElement, attrs: ICSSTransitionAttrs) => {
    this.removeClasses(node, attrs, 'enter');
    elClass(node).add(`${attrs.transitionClass}-exit`);

    safeCall(attrs.onExit, node);
  }

  onExiting = (node: HTMLElement, attrs: ICSSTransitionAttrs) => {
    this.removeClasses(node, attrs, 'enter');

    elClass(node).add(`${attrs.transitionClass}-exit-active`);
    // tslint:disable-next-line:no-unused-expression
    node.scrollTop;

    safeCall(attrs.onExiting, node);
  }

  onExited = (node: HTMLElement, attrs: ICSSTransitionAttrs) => {
    this.removeClasses(node, attrs, 'exit');

    safeCall(attrs.onExited, node);
  }

  removeClasses(node: HTMLElement, attrs: ICSSTransitionAttrs, type: transitionType) {
    elClass(node).remove(`${attrs.transitionClass}-${type}`);
    elClass(node).remove(`${attrs.transitionClass}-${type}-active`);
  }
}
