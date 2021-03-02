import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { BtnWrap } from 'atoms';

const SlideTabsIndicator = ({ activeOption = {} }) => {
  const indicatorRef = useRef();
  const { option = {}, optionRef = {} } = activeOption;
  const { color } = option;
  return (
    <div
      className={classNames(
        'HealthTypeSelector__Indicator',
        'pt-2 pb-2 pl-3 pr-3 u-border-radius-5 u-pos-absolute',
        `u-bg-${color || 'primary'}`
      )}
      style={{
        height: '100%',
        width: !!optionRef.current ? optionRef.current.offsetWidth : 0,
        minWidth: !!indicatorRef.current
          ? indicatorRef.current.offsetHeight
          : 0,
        left: !!optionRef.current ? optionRef.current.offsetLeft : 0,
        transition: 'all 0.15s ease-in-out',
      }}
      ref={indicatorRef}
    ></div>
  );
};

const SlideTabsOption = ({ onSelect, option = {}, i, ...rest }) => {
  const { component } = option;
  const optionRef = useRef();

  useEffect(() => {
    if (!i) {
      onSelect({ option, optionRef });
    }
  }, []);

  return (
    <BtnWrap
      className={classNames(
        'HealthTypeSelector__Item u-pos-relative small',
        'pt-2 pb-2 pl-3 pr-3 u-border-radius-5 u-color-white'
      )}
      ref={optionRef}
      onClick={() => onSelect({ option, optionRef })}
      {...rest}
    >
      {component}
    </BtnWrap>
  );
};

const SlideTabs = ({ options = [], onChange }) => {
  const [activeOption, setActiveOption] = useState();

  const handleOnSelect = (update) => {
    setActiveOption(update);
  };

  useEffect(() => {
    if (activeOption) {
      onChange(activeOption.option);
    }
  }, [activeOption]);

  return (
    <div className="mb-4 d-flex justify-content-center">
      <div
        className={classNames(
          'HealthTypeSelector',
          'd-inline-flex flex-nowrap u-bg-gray-darkest u-border-radius-5 u-pos-relative'
        )}
      >
        <SlideTabsIndicator activeOption={activeOption} />
        {options.map((option, i) => {
          return (
            <SlideTabsOption
              key={i}
              i={i}
              option={option}
              onSelect={handleOnSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SlideTabs;
