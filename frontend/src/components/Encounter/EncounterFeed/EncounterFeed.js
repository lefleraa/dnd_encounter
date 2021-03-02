import React, { useContext, useEffect, useRef } from 'react';
import noop from 'lodash-es/noop';
import debounce from 'lodash-es/debounce';
import { Panel, Scrollbars } from 'components';
import { useSpring } from 'react-spring';
import { EncounterContext } from '../EncounterProvider';
import HistoryLog from './HistoryLog';

const transitionDur = 500;

const EncounterFeed = ({ heading = 'History' }) => {
  const encounterContext = useContext(EncounterContext);
  const { encounter = {} } = encounterContext;
  const { history = {}, actions = {} } = encounter;
  const { list = [], currentHistoryIndex } = history;
  const { setHistoryIndex = noop } = actions;

  ////////////////////////////////
  // MANAGE AUTOSCROLL BEHAVIOR
  ////////////////////////////////

  const historyScroll = useRef(null);
  const { current } = historyScroll;
  const [y, setY] = useSpring(() => ({ y: 0 }));

  const scrollToBottom = debounce(
    () => {
      if (current) {
        setY(() => ({
          to: {
            y:
              current._container.scrollHeight - current._container.offsetHeight,
          },
          onFrame: ({ y }) => (current._container.scrollTop = y),
        }));
        current.updateScroll();
      }
    },
    transitionDur,
    { leading: true }
  );

  useEffect(() => {
    scrollToBottom();
  }, [list]);

  ////////////////////////////////
  // RETURN
  ////////////////////////////////

  return (
    <>
      <Panel auto={true}>
        <div className="pl-5 pr-5 pt-5 pb-4">
          <h4 className="m-0 u-text-medium">{heading}</h4>
        </div>
      </Panel>
      <Panel>
        <div className="HistoryLogOuter">
          <Scrollbars ref={historyScroll}>
            <div className="pl-5 pr-5 pb-5 pt-0">
              <div className="HistoryLogWrap">
                {!!(list && list.length) &&
                  list.map((historyLog, i) => {
                    const { metaData = {}, silent } = historyLog;
                    const { historyIndex } = metaData;
                    if (silent) {
                      return null;
                    }
                    return (
                      <HistoryLog
                        historyLog={historyLog}
                        key={historyIndex || i}
                        active={historyIndex === currentHistoryIndex}
                        onClick={() => setHistoryIndex(historyIndex)}
                      />
                    );
                  })}
              </div>
            </div>
          </Scrollbars>
        </div>
      </Panel>
    </>
  );
};

export default EncounterFeed;
