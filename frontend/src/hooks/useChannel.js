import { useState, useContext, useEffect } from 'react';
import noop from 'lodash-es/noop';
import { SocketContext } from 'contexts';

const useChannel = ({ channelName, onJoin = noop, onLeave = noop }) => {
  const [channel, setChannel] = useState();
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const phoenixChannel = socket.channel(channelName);

    phoenixChannel.join().receive('ok', () => {
      console.log(`Successfully JOINED: '${channelName}'`);
      setChannel(phoenixChannel);
      if (typeof onJoin === 'function') {
        onJoin();
      }
    });

    // leave the channel when the component unmounts
    return () => {
      phoenixChannel.leave().receive('ok', () => {
        console.log(`Successfully LEFT: '${channelName}'`);
        if (typeof onLeave === 'function') {
          onLeave();
        }
      });
    };
  }, []);
  // only connect to the channel once on component mount

  return { channel, socket };
};

export default useChannel;
