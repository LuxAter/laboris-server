function dateDiff(start: number, end: number): number {
  return ((start - end) / 86400);
}

function UrgDue(task: any): number {
  if (task.dueDate === null) {
    return 0.0;
  }
  const due = dateDiff(Date.now() / 1000, task.dueDate);
  const k = 0.7;
  const x0 = -3.98677299562;
  const alpha = -6.95740376945;
  if (due < alpha) {
    return 0.2;
  } else {
    return 1.0 / (1 + Math.exp(-k * (due - x0)));
  }
}

export function CalcUrg(task: any): number {
  let urg = 0.0;
  urg += Math.abs(0.01429 * dateDiff(task.entryDate, Date.now() / 1000));
  urg += Math.abs(9.00000 * UrgDue(task));
  urg += Math.abs(1.00000 * task.projects.length);
  urg += Math.abs(0.20000 * task.tags.length);
  urg += Math.abs(1.00000 * task.priority);
  if (task.status === 'COMPLETED' || task.priority === -1) {
    urg = 0.0;
  }
  return urg;
}

function angleDiffMin(s: number, e: number): number {
  const cw = s <= e ? e - s : 360.0 + e - s;
  const ccw = e <= s ? e - s : -360.0 - s + e;
  return Math.abs(cw) > Math.abs(ccw) ? ccw : cw;
}

function calcGradient(a: string, b: string, t: number): string {

  return a;
}

export function UrgColor(urg: number): string {
  if (0 <= urg && urg < 3.0) {
    return '#000';
  } else if (3.0 <= urg && urg < 4.0) {
    // MUCH TO DO!
  }
  return '#f44336';
}
