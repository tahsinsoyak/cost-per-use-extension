import { describe, expect, it } from 'vitest';
import { estimatePurchase, validatePurchase } from './model';
const base={price:200,years:3,uses:5,currency:'USD' as const,resale:0,maintenance:0,payments:0,totalPaid:0};
describe('website calculator',()=>{
  it('uses the shared extension calculation for the default example',()=>{
    const result=estimatePurchase(base)!;
    expect(result.totalEstimatedUses).toBe(782);
    expect(result.costPerUse).toBeCloseTo(200/782);
  });
  it('includes financing, maintenance and resale in net cost',()=>{
    expect(estimatePurchase({...base,payments:12,totalPaid:240,maintenance:20,resale:60})?.netCost).toBe(200);
  });
  it.each([{price:0},{years:-1},{uses:Infinity},{uses:0.001},{resale:201},{maintenance:-1},{payments:12},{totalPaid:240},{payments:1.5,totalPaid:240}])('rejects invalid or incomplete inputs %j',changes=>{
    expect(estimatePurchase({...base,...changes})).toBeNull();
  });
});

it('points to the missing installment field and clears it after correction',()=>{
  expect(validatePurchase({...base,payments:12})).toEqual({totalPaid:'paired'});
  expect(validatePurchase({...base,totalPaid:240})).toEqual({payments:'paired'});
  expect(validatePurchase({...base,payments:12,totalPaid:240})).toEqual({});
});
it('identifies resale and usage errors separately',()=>{
  expect(validatePurchase({...base,resale:201,uses:0.001})).toEqual({resale:'resaleLimit',uses:'usageRange'});
  expect(validatePurchase({...base,years:Number.MAX_VALUE})).toEqual({uses:'usageRange'});
});
