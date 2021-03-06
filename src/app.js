import {Observable} from 'rxjs';
import {run} from '@cycle/rxjs-run';
import {makeDOMDriver, div, h2, h3, form} from '@cycle/dom';

import Input from './components/input';
import { style, merge } from 'glamor';

import styles from './global.css';

let container = style({
  fontFamily: 'Roboto',
  background: '#FFF',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100vh',
})

function main(sources) {

  const nameInput = Input({DOM: sources.DOM, props$: Observable.of({labelName: 'Your name'})});

  const sinks = {
    DOM: Observable.
      combineLatest(nameInput.DOM, nameInput.value$,
                    (nameInputDom, name) => {
                      return div(`.${container}`, [
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
