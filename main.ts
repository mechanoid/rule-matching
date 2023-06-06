export type Rule = {
  prop: string;
  check: (val: any) => boolean;
  result: string;
};

export function matcher(rules: Rule[], defaultVal: string) {
  return function (blib: any): string {
    for (const { prop, check, result } of rules) {
      if (check(blib[prop])) return result;
    }
    return defaultVal;
  };
}
