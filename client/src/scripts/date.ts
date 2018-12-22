function replaceAll(src: string, search: string, replacement: string) {
  const target: string = src;
  return target.replace(new RegExp(search, 'g'), replacement);
}

export function DateValidator(s: string): number {
  if (s.length === 0) {
    return -1;
  }
  s = s.toLowerCase();
  s = replaceAll(s, ' ', '@');
  s = replaceAll(s, '/', '-');
  const regexes = [
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{4}$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{4}@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{4}@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{4}@(0?[1-9]|1[0-9]|2[0-4])$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{4}@(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{4}@(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{4}@(0?[1-9]|1[0-2])(am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{2}$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{2}@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{2}@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{2}@(0?[1-9]|1[0-9]|2[0-4])$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{2}@(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{2}@(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])-[0-9]{2}@(0?[1-9]|1[0-2])(am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])@(0?[1-9]|1[0-9]|2[0-4])$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])@(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])@(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])-(0?[1-9]|1[0-2])@(0?[1-9]|1[0-2])(am|pm)$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{4}$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{4}@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{4}@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{4}@(0?[1-9]|1[0-9]|2[0-4])$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{4}@(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{4}@(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{4}@(0?[1-9]|1[0-2])(am|pm)$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{2}$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{2}@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{2}@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{2}@(0?[1-9]|1[0-9]|2[0-4])$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{2}@(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{2}@(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])-[0-9]{2}@(0?[1-9]|1[0-2])(am|pm)$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-9]|2[0-4])$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-2])(am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-9]|2[0-4])$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|[12][0-9]|3[0-1])@(0?[1-9]|1[0-2])(am|pm)$/,
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/,
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]$/,
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/,
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)@(0?[1-9]|1[0-9]|2[0-4])$/,
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)@(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9](am|pm)$/,
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)@(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/,
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)@(0?[1-9]|1[0-2])(am|pm)$/,
    /^(mon|tue|wed|thu|fri|sat|sun)$/,
    /^(mon|tue|wed|thu|fri|sat|sun)@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]$/,
    /^(mon|tue|wed|thu|fri|sat|sun)@(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/,
    /^(mon|tue|wed|thu|fri|sat|sun)@(0?[1-9]|1[0-9]|2[0-4])$/,
    /^(mon|tue|wed|thu|fri|sat|sun)@(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9](am|pm)$/,
    /^(mon|tue|wed|thu|fri|sat|sun)@(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/,
    /^(mon|tue|wed|thu|fri|sat|sun)@(0?[1-9]|1[0-2])(am|pm)$/,
    /^(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]$/,
    /^(0?[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/,
    /^(0?[1-9]|1[0-9]|2[0-4])$/,
    /^(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/,
    /^(0?[1-9]|1[0-2])(am|pm)$/,
  ];
  for (const reg in regexes) {
    if (s.match(regexes[reg])) {
      return parseInt(reg, 10);
    }
  }
  return 0;
}

export function ParseDate(s: string) {
  if (s.length === 0) {
    return null;
  }
  s = s.toLowerCase();
  s = replaceAll(s, ' ', '@');
  s = replaceAll(s, '/', '-');
  const id: number = DateValidator(s);
  const str: string[][] = [s.split('@')[0].split('-'), s.split('@')[1] ? s.split('@')[1].split(':') : []];
  const date = new Date();
  if (id <= 6) {
    date.setFullYear(parseInt(str[0][2], 10), parseInt(str[0][1], 10) - 1, parseInt(str[0][0], 10));
  } else if (id <= 13) {
    date.setFullYear(parseInt('20' + str[0][2], 10), parseInt(str[0][1], 10) - 1, parseInt(str[0][0], 10));
  } else if (id <= 20) {
    date.setMonth(parseInt(str[0][1], 10) - 1, parseInt(str[0][0], 10));
  } else if (id <= 27) {
    date.setFullYear(parseInt(str[0][2], 10), parseInt(str[0][0], 10) - 1, parseInt(str[0][1], 10));
  } else if (id <= 34) {
    date.setFullYear(parseInt('20' + str[0][2], 10), parseInt(str[0][0], 10) - 1, parseInt(str[0][1], 10));
  } else if (id <= 41) {
    date.setMonth(parseInt(str[0][0], 10) - 1, parseInt(str[0][1], 10));
  } else if (id <= 48) {
    date.setDate(parseInt(str[0][0], 10));
  } else if (id <= 55) {
    const days: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    while (days[date.getDay()] !== str[0][0]) {
      date.setDate(date.getDate() + 1);
    }
  } else if (id <= 62) {
    const days: string[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    while (days[date.getDay()] !== str[0][0]) {
      date.setDate(date.getDate() + 1);
    }
  } else {
    str[1] = str[0][0].split(':');
    if (id % 7 === 0) {
      date.setHours(parseInt(str[1][0], 10), parseInt(str[1][1], 10), parseInt(str[1][2], 10), 0);
    } else if (id % 7 === 1) {
      date.setHours(parseInt(str[1][0], 10), parseInt(str[1][1], 10), 0, 0);
    } else if (id % 7 === 2) {
      date.setHours(parseInt(str[1][0], 10), 0, 0, 0);
    } else if (id % 7 === 3) {
      if (str[1][2].slice(2) === 'am') {
        date.setHours(parseInt(str[1][0], 10), parseInt(str[1][1], 10), parseInt(str[1][2].slice(0, 2), 10), 0);
      } else {
        date.setHours(12 + parseInt(str[1][0], 10), parseInt(str[1][1], 10), parseInt(str[1][2].slice(0, 2), 10), 0);
      }
    } else if (id % 7 === 4) {
      if (str[1][1].slice(2) === 'am') {
        date.setHours(parseInt(str[1][0], 10), parseInt(str[1][1].slice(0, 2), 10), 0, 0);
      } else {
        date.setHours(12 + parseInt(str[1][0], 10), parseInt(str[1][1].slice(0, 2), 10), 0, 0);
      }
    } else if (id % 7 === 5) {
      if (str[1][0].slice(2) === 'am') {
        date.setHours(parseInt(str[1][0].slice(0, 2), 10), 0, 0, 0);
      } else {
        date.setHours(12 + parseInt(str[1][0].slice(0, 2), 10), 0, 0, 0);
      }
    }
  }
  if (id <= 62) {
    if (id % 7 === 0) {
      date.setHours(0, 0, 0, 0);
    } else if (id % 7 === 1) {
      date.setHours(parseInt(str[1][0], 10), parseInt(str[1][1], 10), parseInt(str[1][2], 10), 0);
    } else if (id % 7 === 2) {
      date.setHours(parseInt(str[1][0], 10), parseInt(str[1][1], 10), 0, 0);
    } else if (id % 7 === 3) {
      date.setHours(parseInt(str[1][0], 10), 0, 0, 0);
    } else if (id % 7 === 4) {
      if (str[1][2].slice(2) === 'am') {
        date.setHours(parseInt(str[1][0], 10), parseInt(str[1][1], 10), parseInt(str[1][2].slice(0, 2), 10), 0);
      } else {
        date.setHours(12 + parseInt(str[1][0], 10), parseInt(str[1][1], 10), parseInt(str[1][2].slice(0, 2), 10), 0);
      }
    } else if (id % 7 === 5) {
      if (str[1][1].slice(2) === 'am') {
        date.setHours(parseInt(str[1][0], 10), parseInt(str[1][1].slice(0, 2), 10), 0, 0);
      } else {
        date.setHours(12 + parseInt(str[1][0], 10), parseInt(str[1][1].slice(0, 2), 10), 0, 0);
      }
    } else if (id % 7 === 6) {
      if (str[1][0].slice(2) === 'am') {
        date.setHours(parseInt(str[1][0].slice(0, 2), 10), 0, 0, 0);
      } else {
        date.setHours(12 + parseInt(str[1][0].slice(0, 2), 10), 0, 0, 0);
      }
    }
  }
  return Math.floor(date.getTime() / 1000);
}

export function DateFmt(fmt: string, timeStamp: number): string {
  const date: Date = new Date();
  date.setTime(1000 * timeStamp);
  const today: Date = new Date();
  const yyyy: string = date.getFullYear().toString().padStart(4, '0');
  const mm: string = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd: string = date.getDate().toString().padStart(2, '0');
  const HH: string = date.getHours().toString().padStart(2, '0');
  const MM: string = date.getMinutes().toString().padStart(2, '0');
  const SS: string = date.getSeconds().toString().padStart(2, '0');
  let DD: string = '';
  let diff: number = 0;
  if (date.getTime() > today.getTime()) {
    diff = date.getTime() - today.getTime();
  } else {
    diff = today.getTime() - date.getTime();
    DD += '-';
  }
  const days: number = Math.floor(diff / (1000 * 3600 * 24));
  const secs: number = Math.floor(diff / (1000));
  if (days > 7) {
    DD += Math.floor(days / 7).toString() + 'w';
  } else if (days > 0) {
    DD += days.toString() + 'd';
  } else if (secs > 3600) {
    DD += Math.floor(secs / 3600).toString() + 'h';
  } else if (secs > 60) {
    DD += Math.floor(secs / 60).toString() + 'm';
  } else if (secs > 0) {
    DD += secs.toString() + 's';
  } else {
    DD = 'NOW';
  }
  fmt = replaceAll(fmt, '%Y', yyyy);
  fmt = replaceAll(fmt, '%m', mm);
  fmt = replaceAll(fmt, '%d', dd);
  fmt = replaceAll(fmt, '%H', HH);
  fmt = replaceAll(fmt, '%M', MM);
  fmt = replaceAll(fmt, '%S', SS);
  fmt = replaceAll(fmt, '%D', DD);
  return fmt;
}
