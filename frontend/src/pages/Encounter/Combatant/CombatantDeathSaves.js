import React from 'react';
import { CombatantBtn } from './fragments';
import { faSkullCrossbones } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-regular-svg-icons';
import { faDiceD20 } from '@fortawesome/pro-light-svg-icons';

/////////////////////////////
// DEATH SAVE
/////////////////////////////

const DeathSaveBtn = ({ save }) => {
  return (
    <div className="col p-0 pl-1">
      <CombatantBtn
        icon={
          !!save
            ? faCheck
            : save === undefined || save === null
            ? faDiceD20
            : faSkullCrossbones
        }
        subtle={false}
        confirm={!!save}
        error={!save && save !== undefined && save !== null}
        disabled={save !== undefined}
      />
    </div>
  );
};

const CombatantDeathSaves = ({ combatant = {} }) => {
  const { deathSaves = [] } = combatant;
  return (
    <div className="d-flex">
      {deathSaves.map((save, i) => (
        <DeathSaveBtn key={i} save={save} />
      ))}
    </div>
  );
};

export default CombatantDeathSaves;
