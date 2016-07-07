//import xs from 'xstream';
import Rx from '@reactivex/rxjs';
import {run} from '@cycle/rxjs-run';
//import {makeDOMDriver, h1} from '@cycle/dom';
//
//function main() {
//  const sinks = {
//    DOM: Rx.Observable.interval(1000).map(i =>
//      h1('' + i + ' seconds elapsed')
//    )
//  };
//  return sinks;
//}
//
//const drivers = {
//  DOM: makeDOMDriver('#app')
//};
//
//run(main, drivers);

// Include normalize.css
//import normalize from 'normalize.css/normalize.css';

import {makeDOMDriver, div, input, p, span, label, h2, h3, form} from '@cycle/dom';

import Input from './components/input';
import styles from './app.css';

function main(sources) {

  const nameInput = Input({DOM: sources.DOM, props: {id: 'my_id', labelName: 'Your name', initialValue: ''}});

  const sinks = {
    DOM: Rx.Observable.
      combineLatest(nameInput.vtree$, nameInput.value$,
                    (nameInputDom, name) => {
                      return div({props: { className: styles.container }}, [
                        h2('Welcome to Cycle.js'),
                        form([nameInputDom,]),
                        h3(`Hello ${name}!!`)
                      ])
                    }
      //of(
      //div({props: {className: styles.group}},
      //    [
      //      input({props: {className: styles.input}}),
      //      span({props: {className: styles.bar}}),
      //      label({props: {className: styles.labelActive}})
      //    ]
      //   )
    ),
     // sources.DOM.select('input').events('click')
     // .map(ev => ev.target.checked)
     // .startWith(false)
     // .map(toggled =>
     //   div([
     //     input({attrs: {type: 'checkbox'}}), 'Toggle me',
     //     p(toggled ? 'ON' : 'off')
     //   ])
     // )
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
