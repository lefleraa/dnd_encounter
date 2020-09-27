import { axiosGet } from './helpers';

//////////////////////////////////////////////
// FETCH ENCOUNTERS
//////////////////////////////////////////////

function getEncounters(options) {
  return axiosGet(
    {
      url: `/encounters`,
      transformResponse: (data) => {
        return data;
      },
    },
    options
  );
}

export { getEncounters };
