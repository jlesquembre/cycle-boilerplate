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

import {makeDOMDriver, div, input, p} from '@cycle/dom';

function main(sources) {
  const sinks = {
    DOM: sources.DOM.select('input').events('click')
      .map(ev => ev.target.checked)
      .startWith(false)
      .map(toggled =>
        div([
          input({attrs: {type: 'checkbox'}}), 'Toggle me',
          p(toggled ? 'ON' : 'off')
        ])
      )
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
