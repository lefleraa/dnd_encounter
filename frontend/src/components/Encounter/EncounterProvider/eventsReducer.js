import cloneDeep from 'lodash-es/cloneDeep';
import sortBy from 'lodash-es/sortBy';

const initEvents = {
  events: [],
  currentEventIndex: 0,
};

function eventsReducer(throughState, action) {
  const { type, payload } = action;
  let state = cloneDeep(throughState);
  const { events = [] } = state || {};

  switch (type) {
    case 'resetEvents':
      return { ...initEvents };
    case 'setEvents':
      return {
        ...state,
        events: sortBy(payload || [], ['timestamp']),
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
    default:
      return state;
  }
}

export { eventsReducer, initEvents };
