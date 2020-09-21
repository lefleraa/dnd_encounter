import React from 'react';
import Container from 'components/Container';
import Icon from 'atoms/Icon';
import DetailHeading from 'atoms/DetailHeading';
import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';

////////////////////////
// HEADER
////////////////////////

const Header = ({ heading, components = {} }) => {
  const { backBtn, after } = components;
  return (
    <div className="pt-5 pb-3">
      <Container>
        <div className="d-flex align-items-center">
          <div className="col p-0">
            {!!backBtn && (
              <div className="d-inline-flex align-items-center u-color-gray-light">
                <div className="col-auto pl-0 pr-3">
                  <Icon icon={faAngleLeft} />
                </div>
                <div className="col p-0">
                  <DetailHeading>{backBtn.text}</DetailHeading>
                </div>
              </div>
            )}
            <h1 className="m-0 u-text-medium">{heading}</h1>
          </div>
          {!!after && (
            <div className="col-auto d-flex align-self-stretch align-items-center p-0 flex-nowrap">
              {after}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Header;
