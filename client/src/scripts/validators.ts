export function EmailValidator(s: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return s === '' || re.test(s.toLowerCase());
}

export function PasswordValidator(s: string) {
  return !(s === '') && s.length >= 7 && /^.*[A-Z].*$/.test(s) && /^.*[0-9].*/.test(s);
}

export function PriorityValidator(s: string) {
  return /^[0-9]$/.test(s) || /^10$/.test(s);
}

export function ListValidator(s: string) {
  return /^\w+(,\s?\w+)+$/ || s.length === 0;
}

export function DateValidator(s: string) {
  s = s.replace(' ', '@');
  const datetimeString = s.split('@');
  const reTime = /^((0?[0-9]|1[0-2]):[0-5][0-9](am|pm)?)|((1[3-9]|2[0-4]):[0-5][0-9])$/;
  const reDay = /^(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/
  const reDate = '';
  if (datetimeString.length === 2){
    console.log(reTime.test(datetimeString[1]));
  }
  return true;
}
