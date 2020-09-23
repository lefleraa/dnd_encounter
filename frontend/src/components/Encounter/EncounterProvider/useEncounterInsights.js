import { encounterHelpers } from 'helpers';
import find from 'lodash-es/find';

function useEncounterInsights(params) {
  const { encounter, eventState } = params || {};

  if (!encounter || !eventState) {
    return;
  }

  const { combatants = [], round } = encounter;
  const { events = [], currentEventIndex } = eventState;

  let completeCombatants = encounterHelpers.filterCombatants(
    combatants,
    (c) => {
      return encounterHelpers.isCompleteCombatant(c);
    }
  );
  let turnReadyCombatants = encounterHelpers.filterCombatants(
    combatants,
    (c) => {
      return encounterHelpers.isTurnReadyCombatant(c);
    }
  );
  let inPlayCombatants = encounterHelpers.filterCombatants(combatants, (c) => {
    return encounterHelpers.isInPlay(c);
  });
  let deadCombatants = encounterHelpers.filterCombatants(combatants, (c) => {
    return encounterHelpers.isDeadCombatant(c);
  });
  let unsetCombatants = encounterHelpers.filterCombatants(combatants, (c) => {
    return encounterHelpers.isUnsetCombatant(c);
  });

  return {
    combatants: {
      list: combatants,
      complete: completeCombatants,
      ready: turnReadyCombatants,
      dead: deadCombatants,
      unset: unsetCombatants,
    },
    insights: {
      // encounter created
      encounterCreated: true,
      // `round` equals `1` or higher
      encounterStarted: !!round,
      // safe to advance to next round, all "in play" combatants are `complete`
      roundComplete: !!(
        unsetCombatants.length !== combatants.length &&
        !turnReadyCombatants.length
      ),
      // active combatant
      activeCombatant: encounterHelpers.getActiveCombatant(combatants),
      // active combatant candidate (always first `ready` combatant)
      activeCombatantCandidate: find(turnReadyCombatants, (c) => {
        return encounterHelpers.isTurnReadyCombatant(c);
      }),
      // on most recent event
      onMostRecentEvent: currentEventIndex === events.length - 1,
      // one or more combatants exist who are `complete`
      hasCompleteCombatants: !!completeCombatants.length,
      // one or more combatants exist who are `ready`
      hasTurnReadyCombatants: !!turnReadyCombatants.length,
      // one or more combatants are still in the action (`complete` or `ready`)
      hasInPlayCombatants: !!inPlayCombatants.length,
      // one or more combatants exist who are `dead`
      hasDeadCombatants: !!deadCombatants.length,
      // one or more combatants exist who are `unset`
      hasUnsetCombatants: !!unsetCombatants.length,
      // all combatants are `unset`
      hasNoSetCombatants: unsetCombatants.length === combatants.length,
      // no combatants have been added
      hasCombatants: !!combatants.length,
    },
  };
}

export default useEncounterInsights;
