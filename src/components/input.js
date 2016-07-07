import {div, label, input, p, form, span, h2} from '@cycle/dom';
import {Observable} from '@reactivex/rxjs';
//import Rx from '@reactivex/rxjs';

import styles from './input.css';

function intent(DOM, id){
    const newValue$ = DOM.select(`#${id}`).events('input').map(ev => ev.target.value);
    const focus$ = DOM.select(`#${id}`).events('focus').map(e => 'focus');
    const blur$ = DOM.select(`#${id}`).events('blur').map(e => 'blur');

    const isFocus$ = focus$.merge(blur$).startWith('blur').map(val => val == 'focus');

    return {newValue$, isFocus$};
}

function model(newValue$, initialValue){

    return newValue$.startWith(initialValue);

}

function view(state$, isFocus$, id, labelName){

    const vtree$ = Observable.combineLatest(state$, isFocus$,

            ( value, focus ) =>

            div({props:{className: styles.group}},
                [
                    input({props: {id, required: true, className: styles.input, value}}),
                    span({props: {className: styles.bar}}),
                    label({props: {for: id, className: ( focus || value ? styles.labelActive : styles.labelInactive)}}, labelName),
                ])
            );

    return vtree$;
}


function Input({DOM, props}){

    const {id, labelName} = props;
    const initialValue = props.initialValue ? props.initialValue : '';

    const {newValue$, isFocus$} = intent(DOM, id);
    const state$ = model(newValue$, initialValue);
    const vtree$ = view(state$, isFocus$, id, labelName);


  return {
      vtree$,
      value$: state$,
      id
  }


}

export default Input;
