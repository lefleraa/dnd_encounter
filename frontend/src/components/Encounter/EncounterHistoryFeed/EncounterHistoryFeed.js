import React, { useState, useContext, useEffect, useRef } from 'react';
import classNames from 'classnames';
import keys from 'lodash-es/keys';
import noop from 'lodash-es/noop';
import debounce from 'lodash-es/debounce';
import Panel from 'components/Panel';
import Group from 'components/Group';
import Scrollbars from 'components/Scrollbars';
import Icon from 'atoms/Icon';
import { useSpring } from 'react-spring';
import { EncounterContext } from '../EncounterProvider';
import { faChevronRight, faEmptySet } from '@fortawesome/pro-light-svg-icons';
import HistoryLog, { HistoryLogDivider } from './HistoryLog';

const transitionDur = 500;

const HistoryRound = ({
  historyRound = [],
  handleUpdateScroll,
  isTransitioningOut,
}) => {
  const encounterContext = useContext(EncounterContext);
  const { encounter = {} } = encounterContext;
  const { history = {}, actions = {}, round } = encounter;
  const { list = [] } = history;
  const { currentHistoryIndex } = history;
  const { setHistoryIndex = noop } = actions;

  const [expanded, setExpanded] = useState(true);

  const headingLog = historyRound[0];
  const firstLog = historyRound[1];
  const isCurrentRound = round === headingLog.metaData.round;

  useEffect(() => {
    if (!isTransitioningOut) {
      setExpanded(!!isCurrentRound);
    }
  }, [isCurrentRound, list.length, isTransitioningOut]);

  return (
    <div className={classNames(`HistoryRound_${headingLog.metaData.round}`)}>
      <HistoryLog
        historyLog={{
          ...headingLog,
          dividerBefore: false,
          heading: (
            <span
              className={classNames(
                'd-flex align-items-center',
                !isCurrentRound && !expanded && 'u-opacity-3'
              )}
            >
              {headingLog.heading}
            </span>
          ),
          disabled: isCurrentRound,
        }}
        onClick={() => setExpanded(!expanded)}
        components={{
          after: !isCurrentRound && (
            <span className="u-opacity-6">
              <Icon
                icon={faChevronRight}
                transform={{ rotate: !!expanded ? 90 : 0 }}
                className={classNames(
                  'u-color-gray',
                  !isCurrentRound
                    ? 'animate__animated animate__fadeIn animate__slow'
                    : 'u-opacity-0'
                )}
                size="xs"
                fw={true}
              />
            </span>
          ),
        }}
      />
      <Group
        open={expanded}
        openByDefault={expanded}
        onOpen={handleUpdateScroll}
        onClose={handleUpdateScroll}
        transitionTime={transitionDur / 2}
        lazyRender={true}
      >
        <div style={{ paddingTop: 1 }}>
          {!!firstLog && !firstLog.dividerBefore && <HistoryLogDivider />}
          {historyRound.length > 1 ? (
            historyRound.map((historyLog, i) => {
              const { metaData = {}, silent } = historyLog;
              const { historyIndex } = metaData;
              if (!!silent || i === 0) {
                return null;
              } else {
                return (
                  <HistoryLog
                    historyLog={historyLog}
                    key={historyIndex}
                    active={historyIndex === currentHistoryIndex}
                    onClick={() => setHistoryIndex(historyIndex)}
                  />
                );
              }
            })
          ) : (
            <HistoryLog
              historyLog={{
                msg: (
                  <span className="u-color-gray">
                    No History in this round.
                  </span>
                ),
                icon: faEmptySet,
                iconColor: 'gray',
                dividerBefore: true,
              }}
            />
          )}
        </div>
        {!isCurrentRound && <HistoryLogDivider />}
      </Group>
    </div>
  );
};

const EncounterHistoryFeed = () => {
  const encounterContext = useContext(EncounterContext);
  const { encounter = {} } = encounterContext;
  const { history = {}, round } = encounter;
  const { list = [], rounds = {} } = history;

  ////////////////////////////////
  // MANAGE AUTOSCROLL BEHAVIOR
  ////////////////////////////////

  const historyScroll = useRef(null);
  const { current } = historyScroll;
  const [y, setY] = useSpring(() => ({ y: 0 }));

  const handleUpdateScroll = () => {
    if (current) {
      current.updateScroll();
    }
  };

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
      }
    },
    transitionDur,
    { leading: false }
  );

  useEffect(() => {
    scrollToBottom();
    handleUpdateScroll();
  }, [list.length]);

  ////////////////////////////////
  // ROUND TRANSITION ANIMATION
  ////////////////////////////////

  const [isTransitioningOut, setTransitionOut] = useState(false);

  useEffect(() => {
    if (!!round) {
      setTransitionOut(true);
      setTimeout(() => {
        setTransitionOut(false);
      }, transitionDur);
    }
  }, [round]);

  ////////////////////////////////
  // RETURN
  ////////////////////////////////

  return (
    <>
      <Panel auto={true}>
        <div className="pl-5 pr-5 pt-5 pb-4">
          <h4 className="m-0 u-text-medium">History</h4>
        </div>
      </Panel>
      <Panel>
        <div className="HistoryLogOuter">
          <Scrollbars ref={historyScroll}>
            <div className="pl-5 pr-5 pb-5 pt-0">
              <div className="HistoryLogWrap">
                <div
                  className={classNames(
                    'animate__animated animate__faster',
                    !!isTransitioningOut
                      ? 'animate__fadeOut'
                      : 'animate__fadeIn'
                  )}
                >
                  {!!keys(rounds).length &&
                    keys(rounds).map((historyRoundKey, i) => {
                      const historyRound = rounds[historyRoundKey];
                      if (!historyRound) {
                        return null;
                      }
                      return (
                        <div
                          key={i}
                          className={classNames(
                            isTransitioningOut &&
                              i === keys(rounds).length - 1 &&
                              'u-opacity-0'
                          )}
                        >
                          <HistoryRound
                            historyRound={historyRound}
                            handleUpdateScroll={handleUpdateScroll}
                            isTransitioningOut={isTransitioningOut}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </Scrollbars>
        </div>
      </Panel>
    </>
  );
};

export default EncounterHistoryFeed;
