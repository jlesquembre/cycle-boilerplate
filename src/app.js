import Rx from 'rxjs';
import {run} from '@cycle/rxjs-run';
import {makeDOMDriver, div, h2, h3, form} from '@cycle/dom';

import Input from './components/input';
import styles from './app.css';

function main(sources) {

  const nameInput = Input({DOM: sources.DOM, props$: Rx.Observable.of({labelName: 'Your name'})});

  const sinks = {
    DOM: Rx.Observable.
      combineLatest(nameInput.DOM, nameInput.value$,
                    (nameInputDom, name) => {
                      return div({props: { className: styles.container }}, [
                        h2('Welcome to Cycle.js'),
                        form([nameInputDom,]),
                        h3(`Hello ${name}!!`)
                      ])
                    }
    ),
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
