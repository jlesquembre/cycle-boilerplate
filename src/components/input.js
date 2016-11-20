import {h} from '@cycle/dom';
import {Observable} from 'rxjs';
import isolate from '@cycle/isolate';

//import styles from './input.css';
import { style, merge, $, before, after } from 'glamor';


const onColor = '#5264AE';
const offColor = '#999';
const width = '300px';


const labelCommon = style({
  fontWeight: 'normal',
  position: 'absolute',
  pointerEvents: 'none',
  left: 5,
  transition: '0.2s ease all',
  boxSizing: 'border-box',
})

const labelActive = merge(
  style({
    top: '-20px',
    color: onColor,
    fontSize: 14,
  })
)

const labelInactive = merge(
  style({
    top: 10,
    color: offColor,
    fontSize: 18,
  })
)

let input = style({
  fontSize: 18,
  padding: '10px 10px 10px 5px',
  display: 'block',
  width: width,
  border: 'none',
  borderBottom: '1px solid #757575',
  boxSizing: 'border-box',
  outline: 'none',
})

const barTrans = {
  content: "''",
  height: 2,
  width:0,
  bottom: 1,
  position: 'absolute',
  background: onColor,
  transition: '0.2s ease all',
}

const bar = merge(
  {
    position: 'relative',
    display: 'block',
    width: width,
  },
  before({...barTrans, left: '50%'}),
  after({...barTrans, right: '50%'})
)


input = merge(
  input,
  $(`:focus ~ .${bar}:before`, {
    width: '50%'
  }),
  $(`:focus ~ .${bar}:after`, {
    width: '50%',
  })
)

const group = style({
  position: 'relative',
  marginBottom: 45,
})


function intent(DOM){
  const newValue$ = DOM.select(`.${input}`).events('input').map(ev => ev.target.value);
  const focus$ = DOM.select(`.${input}`).events('focus').map(e => 'focus');
  const blur$ = DOM.select(`.${input}`).events('blur').map(e => 'blur');

  const isFocus$ = focus$.merge(blur$).startWith('blur').map(val => val == 'focus');

  return {newValue$, isFocus$};
}


function model(newValue$, props$){
  return props$.map(props => typeof props.initialValue === 'string' ? props.initialValue : '').merge(newValue$);
}


function view(state$, isFocus$, props$){

  const vtree$ = Observable.combineLatest(state$, isFocus$, props$,

    ( value, focus, props ) =>

      h(`div.${group}`,
        [
          h(`input.${input}`, {
            props: {
              required: true,
              value
            }
          }),
          h(`span.${bar}`),
          h('label', {
            props: {
              className: `${labelCommon} ` +
              `${focus || value ? labelActive : labelInactive}`
            }},
            props.labelName
          ),
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
