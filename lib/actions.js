import { Schemas } from './api';
import * as ActionTypes from './types.js';
import { addAction } from 'meteor/nova:lib';

// -------
// The Rugby Net - Redux Async/Sync Actions 
// -------

// all the action types needed here
const { 
  CALL_API, 
  CONF_REQUEST, CONF_SUCCESS, CONF_FAILURE, 
  COMP_REQUEST, COMP_SUCCESS, COMP_FAILURE, 
  MATCH_REQUEST, MATCH_SUCCESS, MATCH_FAILURE, 
  RESET_ERROR_MESSAGE 
} = ActionTypes;

// Fetches configuration of TRN API.
// Relies on the custom API middleware defined in ./api.js.
const fetchConfiguration = () => ({
  [CALL_API]: {
    types: [ CONF_REQUEST, CONF_SUCCESS, CONF_FAILURE ],
    endpoint: `configuration`,
    schema: Schemas.CONF
  }
});

// Fetches the core configuration unless it is cached.
// Relies on Redux Thunk middleware.
export const loadConfiguration = (requiredFields = []) => (dispatch, getState) => {
  if (!getState().entities || !getState().entities.config)  {
    return dispatch(fetchConfiguration())
  }

  const config = getState().entities.config[Object.keys(getState().entities.config)]
  if (config && requiredFields.every(key => config.hasOwnProperty(key))) {
    return null
  }

  return dispatch(fetchConfiguration())
};

// Fetches a single comp.
// Relies on the custom API middleware defined in ./api.js.
const fetchComp = id => ({
  [CALL_API]: {
    types: [ COMP_REQUEST, COMP_SUCCESS, COMP_FAILURE ],
    endpoint: `competitions/get?id=${id}`,
    schema: Schemas.COMP
  }
});

// Fetches a single comp from TRN API unless it is cached.
// Relies on Redux Thunk middleware.
export const loadCompetition = (id, requiredFields = []) => (dispatch, getState) => {
  const comp = getState().entities.comp
    ? getState().entities.comp[id] || null
    : null
  if (comp && requiredFields.every(key => comp.hasOwnProperty(key))) {
    return null
  }

  return dispatch(fetchComp(id))
};



// Fetches a single MATCH.
const fetchMatch = id => ({
  [CALL_API]: {
    types: [ MATCH_REQUEST, MATCH_SUCCESS, MATCH_FAILURE ],
    endpoint: `match/get?id=${id}`,
    schema: Schemas.MATCH
  }
});

// Fetches a single match from TRN API unless it is cached.
export const loadMatch = (id, requiredFields = []) => (dispatch, getState) => {
  const match = getState().entities.matches
    ? getState().entities.matches[id] || null
    : null
  if (match && requiredFields.every(key => match.hasOwnProperty(key))) {
    return null
  }

  return dispatch(fetchMatch(id))
};



// Resets the currently visible error message.
export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
});

addAction({
  loadConfiguration: loadConfiguration,
  loadCompetition: loadCompetition,
  loadMatch: loadMatch,
  resetErrorMessage: resetErrorMessage,
});