import React from 'react';
import noop from 'lodash-es/noop';
import Card from 'components/Card';
import Btn from 'atoms/Btn';
import Icon from 'atoms/Icon';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';

const EmptyState = ({
  icon,
  variant = 'primary',
  text,
  btnText,
  btnIcon = faPlus,
  btnAction = noop,
}) => {
  return (
    <Card className="p-5 d-flex align-items-center justify-content-center">
      <div className="u-text-center pt-5 pb-5">
        {!!icon && (
          <Icon icon={icon} size="2x" className={`u-color-${variant}`} />
        )}
        {!!text && <p className="mb-0 mt-3 u-color-gray">{text}</p>}
        {!!btnText && (
          <Btn variant={variant} className="mt-4" onClick={btnAction}>
            {!!btnIcon && <Icon icon={btnIcon} className="mr-2" />}
            {btnText}
          </Btn>
        )}
      </div>
    </Card>
  );
};

export default EmptyState;
