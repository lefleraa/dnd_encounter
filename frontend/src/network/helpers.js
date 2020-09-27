import React from 'react';
import axios from 'axios';
import compact from 'lodash-es/compact';

const baseURL = 'api/v1';

//////////////////////////////////////////////
// HANDLERS
//////////////////////////////////////////////

function errorHandler({ error, customError }) {
  if (!error) {
    return;
  }

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
    // triggerToast({ text: customError });
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(error.request);
    // triggerToast({ text: customError });
  } else {
    // Something happened in setting up the request that triggered an Error
    if (error == 'Cancel') {
      console.warn('Cancel', error);
    }
    if (error.message) {
      console.error('Error', error.message);
      // triggerToast({ text: customError });
    }
  }
}

function successHandler({ transformResponse }) {
  if (!transformResponse) {
    return undefined;
  }
  return axios.defaults.transformResponse.concat((data) => {
    // if (data.success === 0) {
    //   triggerToast({ text: data.msg });
    // }
    return transformResponse(data);
  });
}

//////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////

function axiosGet({ url, params, data, transformResponse, ...rest }, options) {
  let config = options || {};
  const { customError } = config;
  let cancel;

  let promise = axios({
    method: 'get',
    url,
    params,
    data,
    baseURL,
    cancelToken: new axios.CancelToken(function executor(c) {
      cancel = c;
    }),
    transformResponse: successHandler({ transformResponse }),
    ...rest,
  }).catch((error) => {
    errorHandler({ error, customError });
  });

  return {
    promise,
    cancel,
  };
}

function axiosPost({ url, params, data, transformResponse, ...rest }, options) {
  let config = options || {};
  const { customError } = config;
  let cancel;

  let promise = axios({
    method: 'post',
    url,
    params,
    data,
    baseURL,
    cancelToken: new axios.CancelToken(function executor(c) {
      cancel = c;
    }),
    transformResponse: successHandler({ transformResponse }),
    ...rest,
  }).catch((error) => {
    errorHandler({ error, customError });
  });

  return {
    promise,
    cancel,
  };
}

function keyValue(data) {
  let key = Object.keys(data)[0];
  let value = data[key];

  if (typeof value === 'boolean') {
    value = !!value ? 1 : 0;
  }
  return {
    key,
    value,
  };
}

function axiosAll({ request, ids, list, data, metaData = {} }, options) {
  const items = list || ids || [];

  const mappedPromises = compact(
    items.map((item, i) => {
      const { promise } = request(
        {
          id: !!(ids && ids.length) ? item : undefined,
          data: !!data ? data : item,
          ...metaData,
        },
        options
      );

      return new Promise((resolve) => {
        promise.then(({ data, error }) => {
          resolve({
            [i]: { data, error },
          });
        });
      });
    })
  );

  return {
    promise: axios.all(mappedPromises).then((response) => {
      return response.reduce((acc, cur) => {
        return {
          ...acc,
          ...cur,
        };
      }, {});
    }),
  };
}

export { errorHandler, axios, axiosGet, axiosPost, axiosAll, keyValue };
