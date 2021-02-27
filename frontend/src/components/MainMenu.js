import React from 'react';
import classNames from 'classnames';
import Icon from 'atoms/Icon';
import BtnWrap from 'atoms/BtnWrap';
import DetailHeading from 'atoms/DetailHeading';
import {
  faDiceD20,
  faHomeAlt,
  faPlayCircle,
} from '@fortawesome/pro-light-svg-icons';

import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div
      className="u-bg-primary d-inline-flex align-items-center justify-content-center u-border-radius-10"
      style={{
        width: 60,
        height: 60,
      }}
    >
      <Icon icon={faDiceD20} size="2x" fw={true} className="u-color-white" />
    </div>
  );
};

const Item = ({ text, icon, className, to, activeOnlyWhenExact, ...rest }) => {
  return (
    <li className={classNames('MainMenu__List__Item small mb-2', className)}>
      <BtnWrap block={true} className="MainMenu__List__Item__Inner">
        <Link
          to={to}
          {...rest}
          className="d-flex align-items-center MainMenu__List__Item__Inner__Nav"
        >
          {!!icon && (
            <Icon
              icon={icon}
              className="MainMenu__List__Item__Inner__Icon mr-2"
              size="2x"
              fw={true}
            />
          )}
          <span className="MainMenu__List__Item__Inner__Text">{text}</span>
        </Link>
      </BtnWrap>
    </li>
  );
};

const Menu = ({ children, heading }) => {
  return (
    <>
      {!!heading && <DetailHeading className="mb-2">{heading}</DetailHeading>}
      <ul className="MainMenu__List mb-5">{children}</ul>
    </>
  );
};

const MainMenu = () => {
  return (
    <div className="MainMenu pt-5 pb-5 d-flex flex-column align-items-center">
      <div>
        <div className="mb-5">
          <Logo />
        </div>
        <Menu>
          <Item icon={faHomeAlt} text="Home" to="/home" />
          <Item
            icon={faPlayCircle}
            text="Active"
            to="/encounterDM"
            style={{ marginTop: 15 }}
          />
        </Menu>
        <Menu heading="Encounters">
          <Item text="All" to="/encounters" />
          <Item text="Recent" to="/encounters" />
          <Item text="Incomplete" to="/encounters" />
          <Item text="Complete" to="/encounters" />
        </Menu>
        <Menu heading="Players">
          <Item text="All" />
          <Item text="Recent" />
          <Item text="Dead" />
        </Menu>
        <Menu heading="Settings">
          <Item text="Encounter" />
          <Item text="Players" />
          <Item text="Account" />
        </Menu>
      </div>
    </div>
  );
};

export default MainMenu;
