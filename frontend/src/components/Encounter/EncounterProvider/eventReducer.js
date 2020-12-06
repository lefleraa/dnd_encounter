import cloneDeep from 'lodash-es/cloneDeep';
import orderBy from 'lodash-es/orderBy';

const initEvents = {
  events: [],
  currentEventIndex: 0,
  loading: true,
  safeToPush: false,
};

function eventReducer(throughState, action) {
  const { type, payload } = action;
  let state = cloneDeep(throughState);
  const { events = [] } = state || {};

  switch (type) {
    case 'resetEvents':
      return { ...initEvents };
    case 'setEvents':
      return {
        ...state,
        events: orderBy(payload || [], ['timestamp'], ['asc']),
        currentEventIndex: payload.length - 1,
      };
    case 'setCurrentEvent':
      return {
        ...state,
        currentEventIndex:
          payload === undefined || payload === null
            ? events.length - 1
            : payload,
      };
    case 'setLoading':
      return {
        ...state,
        loading: !!payload,
      };
    case 'setSafeToPush':
      return {
        ...state,
        safeToPush: !!payload,
      };
    default:
      return state;
  }
}

export { eventReducer, initEvents };
