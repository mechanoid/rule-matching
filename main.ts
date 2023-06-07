export type Rule = {
  prop: string;
  check: (val: any) => boolean;
  result: any;
};

export function matcher(rules: Rule[], defaultVal: any) {
  return function (blib: any): any {
    for (const { prop, check, result } of rules) {
      if (check(blib[prop])) return result;
    }
    return defaultVal;
  };
}
