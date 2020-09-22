import noop from 'lodash-es/noop';

const socketHelper = ({ channel, event: eventName, onPush = noop }) => {
  if (!channel || !eventName) {
    return {};
  }

  const connect = () => {
    console.log(`Connected to channel`);
    channel.on(eventName, onPush);
  };

  const join = () => {
    console.log(`Attempting to join channel`);
    channel
      .join()
      .receive('ok', (resp) => {
        console.log(`Joined channel successfully`, resp);
        connect();
      })
      .receive('error', (resp) => {
        console.log(`Unable to join channel`, resp);
      });
  };

  const leave = () => {
    console.log(`Attempting to leave channel`);
    channel
      .leave()
      .receive('ok', (resp) => {
        console.log(`Left channel successfully`, resp);
      })
      .receive('error', (resp) => {
        console.log(`Unable to leave channel`, resp);
      });
  };

  return {
    connect,
    join,
    leave,
  };
};

export default socketHelper;
