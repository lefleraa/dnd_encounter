import {
  faDiceD4,
  faDiceD6,
  faDiceD8,
  faDiceD10,
  faDiceD12,
  faDiceD20,
} from '@fortawesome/pro-light-svg-icons';

const diceTypes = {
  d4: {
    name: 'D4',
    code: 'd4',
    icon: faDiceD4,
  },
  d6: {
    name: 'D6',
    code: 'd6',
    icon: faDiceD6,
  },
  d8: {
    name: 'D8',
    code: 'd8',
    icon: faDiceD8,
  },
  d10: {
    name: 'D10',
    code: 'd10',
    icon: faDiceD10,
  },
  d12: {
    name: 'D12',
    code: 'd12',
    icon: faDiceD12,
  },
  d20: {
    name: 'D20',
    code: 'd20',
    icon: faDiceD20,
  },
};

export default diceTypes;
