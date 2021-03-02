import React from 'react';
import noop from 'lodash-es/noop';
import { Card } from 'components';
import { Icon, Btn } from 'atoms';
import { PageLayout } from 'layout';
import { faCircleNotch, faPlus } from '@fortawesome/pro-regular-svg-icons';

const InterfaceState = ({
  icon,
  loading = false,
  variant = 'primary',
  text,
  btnText,
  btnIcon = faPlus,
  btnAction = noop,
  btnTo,
  pageLayout = false,
}) => {
  const Content = () => {
    return (
      <Card className="p-5 d-flex align-items-center justify-content-center">
        <div className="u-text-center pt-5 pb-5">
          {!!(loading || icon) && (
            <Icon
              icon={!!loading ? faCircleNotch : icon}
              size="2x"
              className={`u-color-${variant}`}
              spin={!!loading}
            />
          )}
          {!!text && <p className="mb-0 mt-3 u-color-gray">{text}</p>}
          {!!btnText && (
            <Btn
              variant={variant}
              className="mt-4"
              onClick={btnAction}
              to={btnTo}
            >
              {!!btnIcon && <Icon icon={btnIcon} className="mr-2" />}
              {btnText}
            </Btn>
          )}
        </div>
      </Card>
    );
  };

  if (pageLayout) {
    return (
      <PageLayout
        components={{
          content: <Content />,
        }}
      />
    );
  } else {
    return <Content />;
  }
};

export default InterfaceState;
