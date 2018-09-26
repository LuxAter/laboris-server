export function EmailValidator(s: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return s === '' || re.test(s.toLowerCase());
}

export function PasswordValidator(s: string) {
  return !(s === '') && s.length >= 7 && /^.*[A-Z].*$/.test(s) && /^.*[0-9].*/.test(s);
}
