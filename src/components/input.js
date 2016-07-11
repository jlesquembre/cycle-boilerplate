import {div, label, input, p, form, span, h2} from '@cycle/dom';
import {Observable} from 'rxjs';
import isolate from '@cycle/isolate';

import styles from './input.css';

function intent(DOM){
    const newValue$ = DOM.select('.input').events('input').map(ev => ev.target.value);
    const focus$ = DOM.select('.input').events('focus').map(e => {return 'focus'});
    const blur$ = DOM.select('.input').events('blur').map(e => 'blur');

    const isFocus$ = focus$.merge(blur$).startWith('blur').map(val => val == 'focus');

    return {newValue$, isFocus$};
}

function model(newValue$, props$){
  return props$.map(props => typeof props.initialValue === 'string' ? props.initialValue : '').merge(newValue$);
  //return props$.flatMap(props => newValue$.startWith(props.initialValue ? props.initialValue : ''));

}

function view(state$, isFocus$, props$){

    const vtree$ = Observable.combineLatest(state$, isFocus$, props$,

            ( value, focus, props ) =>

            div({props:{className: styles.group}},
                [
                    input(`.input.${styles.input}`, {props: {required: true, value}}),
                    span({props: {className: styles.bar}}),
                    label({props: {className: ( focus || value ? styles.labelActive : styles.labelInactive)}}, props.labelName),
                ])
            );

    return vtree$;
}


function Input({DOM, props$}){

    const {newValue$, isFocus$} = intent(DOM);
    const state$ = model(newValue$, props$);
    const vtree$ = view(state$, isFocus$, props$);

  return {
      DOM: vtree$,
      value$: state$,
  }


}

export default sources => isolate(Input)(sources);
