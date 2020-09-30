import { axiosHelper } from './helpers';

//////////////////////////////////////////////
// FETCH ENCOUNTERS
//////////////////////////////////////////////

function getEncounters(options) {
  return axiosHelper(
    {
      method: 'get',
      url: `/encounters`,
      transformResponse: (data) => {
        return data;
      },
    },
    options
  );
}

function createEncounter(encounter, options) {
  return axiosHelper(
    {
      method: 'post',
      url: `/encounters`,
      data: { encounter: encounter || {} },
      transformResponse: (data) => {
        return data;
      },
    },
    options
  );
}

function getEncounter(id, options) {
  return axiosHelper(
    {
      method: 'get',
      url: `/encounters/${id}`,
      transformResponse: (data) => {
        return data;
      },
    },
    options
  );
}

function deleteEncounter(id, options) {
  return axiosHelper(
    {
      method: 'delete',
      url: `/encounters/${id}`,
      transformResponse: (data) => {
        return data;
      },
    },
    options
  );
}

export { getEncounters, createEncounter, getEncounter, deleteEncounter };
