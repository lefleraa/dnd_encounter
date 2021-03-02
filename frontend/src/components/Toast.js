import React from 'react';
import noop from 'lodash-es/noop';
import toast from 'toasted-notes';
import { Icon, BtnWrap } from 'atoms';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';

const Toast = ({ text, icon, variant = 'primary', onClose = noop }) => {
  return (
    <div className={`Toast p-3 u-bg-${variant} u-border-radius-5`}>
      <div
        className="d-flex align-items-center"
        style={{
          minWidth: 175,
        }}
      >
        {icon && (
          <div className="col-auto p-0 pr-3">
            <Icon icon={icon} className="u-color-white u-opacity-6" />
          </div>
        )}
        <div className="col p-0">
          <span className="u-color-white small">{text}</span>
        </div>
        <div className="col-auto p-0 pl-2">
          <BtnWrap onClick={onClose}>
            <Icon icon={faTimes} color="black" className="u-opacity-2" fw />
          </BtnWrap>
        </div>
      </div>
    </div>
  );
};

function triggerToast({
  icon,
  text,
  variant,
  duration = 2000,
  position = 'bottom-left',
}) {
  toast.notify(
    ({ onClose }) => (
      <Toast icon={icon} text={text} variant={variant} onClose={onClose} />
    ),
    {
      position,
      duration,
    }
  );
}

export { Toast, triggerToast };
