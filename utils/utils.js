import moment from 'moment';

export const getTimeFromNow = (timestamp, type) => {
  const time = moment(timestamp);
  const now = moment();

  if (now.diff(time, 'seconds') <= 60) return 'a few seconds ago';
  else if (now.diff(time, 'days') == 1) return 'yesterday';
  else if (now.diff(time, 'days') > 1) return `${time.format('D MMM YY')} • ${time.format('LT')}`;
  return time.fromNow();
};

export const getTimeConvo = timestamp => {
  const time = moment(timestamp);
  const today = moment().startOf('day');
  if (time.isSame(today, 'd')) {
    return time.format('LT');
  } else {
    return time.calendar('D MMM YY');
  }
};

export const calcPetAge = (ageYear, ageMonth) => {
  let ageLabel = '';
  let monthLabel = ageMonth > 1 ? ' months' : ' month';
  let yearLabel = ageYear > 1 ? ' years' : ' year';
  if (ageYear == 0) {
    ageLabel = ageMonth + monthLabel;
  } else if (ageMonth == 0) {
    ageLabel = ageYear + yearLabel;
  } else if (ageYear > 0 && ageMonth > 0) {
    ageLabel = ageYear + yearLabel + ' ' + ageMonth + monthLabel;
  } else {
    ageLabel = 'Age Unspecified';
  }
  return ageLabel;
};
