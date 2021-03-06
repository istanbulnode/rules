import { createRule } from "../lib";

describe("RuleContext tests", () => {
  it("createRule should return a RuleContext", () => {
    const rule = createRule();
    expect(rule.and).toBeDefined();
    expect(rule.or).toBeDefined();
    expect(rule.end).toBeDefined();
  });

  it("RuleContext.start should return a RuleContext", () => {
    const rule = createRule();
    const result = rule.start(() => ({ success: true }));
    expect(result.and).toBeDefined();
    expect(result.or).toBeDefined();
    expect(result.end).toBeDefined();
  });

  it("createRule and try to end should return a RuleContextResult", () => {
    const rule = createRule();
    const result = rule.start(() => ({ success: true })).end();
    expect(result.success).toBe(true);
    expect(result.errors.length).toEqual(0);
  });

  it("createRule and try to and function (true to true)", () => {
    const rule = createRule();
    const result = rule
      .start(() => ({ success: true }))
      .and(() => ({ success: true }))
      .end();
    expect(result.success).toBe(true);
    expect(result.errors.length).toEqual(0);
  });

  it("createRule and try to and function (false to true)", () => {
    const rule = createRule();
    const result = rule
      .start(() => ({ success: false }))
      .and(() => ({ success: true }))
      .end();
    expect(result.success).toBe(false);
    expect(result.errors.length).toEqual(1);
  });

  it("createRoute and try to or function (true to true)", () => {
    const rule = createRule();
    const result = rule
      .start(() => ({ success: true }))
      .or(() => ({ success: true }))
      .end();
    expect(result.success).toBe(true);
    expect(result.errors.length).toEqual(0);
  });

  it("createRule and try to or function (false to true)", () => {
    const rule = createRule({ waitAll: false });
    const result = rule
      .start(() => ({ success: false }))
      .or(() => ({ success: true }))
      .end();
    expect(result.success).toBe(false);
    expect(result.errors.length).toEqual(1);
  });

  it("createRule and try to or function (false to false)", () => {
    const rule = createRule({ waitAll: false });
    const result = rule
      .start(() => ({ success: false }))
      .or(() => ({ success: false }))
      .end();
    expect(result.success).toBe(false);
    expect(result.errors.length).toEqual(1);
  });

  it("createRule and try to provide waitAll option", () => {
    const rule = createRule({ waitAll: true });
    let abc: boolean = false;
    const result = rule
      .start(() => ({ success: false }))
      .and(() => {
        abc = true;
        return { success: true };
      })
      .end();
    expect(result.success).toBe(false);
    expect(abc).toBe(true);
    expect(result.errors.length).toEqual(1);
  });

  it("createRule and try to don't provide waitAll option", () => {
    const rule = createRule({ waitAll: false });
    let abc: boolean = false;
    const result = rule
      .start(() => ({ success: false }))
      .and(() => {
        abc = true;
        return { success: true };
      })
      .end();
    expect(result.success).toBe(false);
    expect(abc).toBe(false);
    expect(result.errors.length).toEqual(1);
  });

  it("createRule and try to provide params negative", () => {
    const rule = createRule();
    const result = rule
      .start((num: number) => ({ success: num === 2 }))
      .end(1, 2, 3);
    expect(result.success).toBe(false);
    expect(result.errors.length).toEqual(1);
  });

  it("createRule and try to provide params positive", () => {
    const rule = createRule();
    const result = rule
      .start((num: number) => ({ success: num === 1 }))
      .end(1, 2, 3);
    expect(result.success).toBe(true);
    expect(result.errors.length).toEqual(0);
  });
});
