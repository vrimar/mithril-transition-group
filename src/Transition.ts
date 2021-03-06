import m from 'mithril';
import { safeCall } from './utils';

const TIMEOUT_DELAY = 17;

export interface ITimeout {
  enter: number;
  exit: number;
}

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
  timeout: number | ITimeout;
}

export enum TransitionState {
  UNMOUNTED = 'unmounted',
  EXITED = 'exited',
  ENTERING = 'entering',
  ENTERED = 'entered',
  EXITING = 'exiting'
}

export class Transition implements m.ClassComponent<ITransitionAttrs> {
  private status: TransitionState = TransitionState.UNMOUNTED;
  private nextStatus: TransitionState = null;
  private node: HTMLElement = null;
  private timeoutStack: number[] = [];

  public oninit({ attrs }: m.CVnode<ITransitionAttrs>) {
    if (attrs.isVisible) {
      this.status = TransitionState.EXITED;
      this.nextStatus = TransitionState.ENTERING;
    }
  }

  public oncreate({ attrs, dom }: m.CVnodeDOM<ITransitionAttrs>) {
    this.node = dom as HTMLElement;
    this.updateStatus(attrs);
  }

  public onupdate({ attrs, dom }: m.CVnodeDOM<ITransitionAttrs>) {
    this.node = dom as HTMLElement;
    this.updateStatus(attrs);
  }

  public onbeforeupdate(vnode: m.CVnode<ITransitionAttrs>, old: m.CVnode<ITransitionAttrs>) {
    const isVisible = vnode.attrs.isVisible;

    if (isVisible && this.status === TransitionState.UNMOUNTED) {
      this.status = TransitionState.EXITED;
      this.nextStatus = TransitionState.ENTERING;
    } else if (isVisible && !old.attrs.isVisible) {
      this.clearTimeouts();
      this.nextStatus = TransitionState.ENTERING;
    } else if (!isVisible && old.attrs.isVisible) {
      this.clearTimeouts();
      this.nextStatus = TransitionState.EXITING;
    }
  }

  public onbeforeremove() {
    this.clearTimeouts();
  }

  public view({ attrs }: m.CVnode<ITransitionAttrs>) {
    if (this.status === TransitionState.UNMOUNTED) {
      return null;
    }

    if (typeof (attrs.content) === 'function') {
      return attrs.content(this.status);
    }

    return attrs.content;
  }

  private getTimeouts(attrs: ITransitionAttrs) {
    const { timeout } = attrs;
    // tslint:disable-next-line:one-variable-per-declaration
    let enter, exit;

    exit = enter = timeout;

    if (timeout !== null && typeof timeout !== 'number') {
      enter = timeout.enter;
      exit = timeout.exit;
    }
    return { enter, exit };
  }

  private updateStatus(attrs: ITransitionAttrs, mounting = false) {
    if (this.nextStatus === TransitionState.ENTERING) {
      this.performEnter(attrs);
    } else if (this.nextStatus === TransitionState.EXITING) {
      this.performExit(attrs);
    } else if (this.nextStatus === TransitionState.UNMOUNTED) {
      this.performUnmount();
    }
  }

  private performEnter(attrs: ITransitionAttrs) {
    const timeouts = this.getTimeouts(attrs);

    safeCall(attrs.onEnter, this.node);

    this.setTimeout(() => {
      this.status = TransitionState.ENTERING;
      this.nextStatus = TransitionState.ENTERED;
      m.redraw();
      safeCall(attrs.onEntering, this.node);
    }, TIMEOUT_DELAY);

    this.setTimeout(() => {
      this.status = TransitionState.ENTERED;
      this.nextStatus = null;
      m.redraw();
      safeCall(attrs.onEntered, this.node);
    }, timeouts.enter + TIMEOUT_DELAY);
  }

  private performExit(attrs: ITransitionAttrs) {
    const timeouts = this.getTimeouts(attrs);

    safeCall(attrs.onExit, this.node);

    this.setTimeout(() => {
      this.status = TransitionState.EXITING;
      this.nextStatus = TransitionState.EXITED;
      m.redraw();
      safeCall(attrs.onExiting, this.node);
    }, TIMEOUT_DELAY);

    this.setTimeout(() => {
      this.status = TransitionState.EXITED;
      this.nextStatus = TransitionState.UNMOUNTED;
      m.redraw();
      safeCall(attrs.onExited, this.node);
    }, timeouts.exit + TIMEOUT_DELAY);
  }

  private performUnmount() {
    this.status = TransitionState.UNMOUNTED;
    this.nextStatus = null;
    m.redraw();
  }

  private setTimeout(callback: () => void, timeout?: number) {
    const handle = window.setTimeout(callback, timeout);
    this.timeoutStack.push(handle);
    return () => clearTimeout(handle);
  }

  private clearTimeouts = () => {
    if (this.timeoutStack.length) {
      this.timeoutStack.map((timeout) => clearTimeout(timeout));
      this.timeoutStack = [];
    }
  }
}
