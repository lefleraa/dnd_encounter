import axios from 'axios';

axios.defaults.baseURL = '/api/v1';
axios.defaults.headers.post['Content-Type'] = 'application/json';

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

function axiosHelper({ method = 'get', transformResponse, ...rest }, options) {
  let config = options || {};
  const { customError } = config;
  let cancel;

  let promise = axios({
    method,
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

export { axiosHelper };
