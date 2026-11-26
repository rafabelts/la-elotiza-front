import { describe, expect, it } from "vitest";
import { readMockCatalog } from "./mock-service";
import { calculateTotalPriceCents, calculateUnitPriceCents, getAvailableOptions, validateConfiguration } from "./rules";

const catalog = await readMockCatalog();
function product(id: string) {
  const found = catalog.products.find((item) => item.id === id);
  if (!found) throw new Error(`Missing product ${id}`);
  return found;
}

describe("catalog configuration rules", () => {
  it("requires one flavor and rejects unknown and duplicate choices", () => {
    const drink = product("refresco");
    expect(validateConfiguration(drink, {}, 1).valid).toBe(false);
    expect(validateConfiguration(drink, { sabor: ["Coca Zero"] }, 1).valid).toBe(true);
    expect(validateConfiguration(drink, { sabor: ["Coca Zero", "Coca Zero"] }, 1).valid).toBe(false);
    expect(validateConfiguration(drink, { sabor: ["No existe"] }, 1).valid).toBe(false);
    expect(validateConfiguration(drink, { sabor: ["Coca Zero"], extra: ["x"] }, 1).valid).toBe(false);
  });

  it("requires two distinct whole chips for Supremo and limits cardinality", () => {
    const supremo = product("supremo");
    expect(validateConfiguration(supremo, { entera: ["Takis"] }, 1).valid).toBe(false);
    expect(validateConfiguration(supremo, { entera: ["Takis", "Takis"] }, 1).valid).toBe(false);
    expect(validateConfiguration(supremo, { entera: ["Takis", "Ruffles"] }, 1).valid).toBe(true);
    expect(validateConfiguration(supremo, { entera: ["Takis", "Ruffles", "Chips"] }, 1).valid).toBe(false);
  });

  it("exposes Tostitos only with eligible Sabriesquite size", () => {
    const sabri = product("sabri");
    const whole = sabri.optionGroups.find((group) => group.id === "entera");
    if (!whole) throw new Error("Missing whole chips");
    expect(getAvailableOptions(whole, { size: ["12 oz"] }).map((item) => item.id)).not.toContain("Tostitos Verdes");
    expect(getAvailableOptions(whole, { size: ["20 oz"] }).map((item) => item.id)).toContain("Tostitos Verdes");
    expect(validateConfiguration(sabri, { size: ["12 oz"], entera: ["Tostitos Verdes"] }, 1).valid).toBe(false);
    expect(validateConfiguration(sabri, { size: ["20 oz"], entera: ["Tostitos Verdes"] }, 1).valid).toBe(true);
  });

  it("prices size, included and paid toppings, extras, bags and quantity", () => {
    const ramen = product("ramen");
    const base = { ramen: ["Negro"], salsa: ["Nada de salsa"], topping: ["Takis"] };
    expect(validateConfiguration(ramen, base, 1).valid).toBe(true);
    expect(calculateUnitPriceCents(ramen, base)).toBe(16500);
    const paid = { ...base, topping: ["Takis", "Ruffles"], bolsa: ["Chips"], extras: ["tocino"] };
    expect(calculateUnitPriceCents(ramen, paid)).toBe(24500);
    expect(calculateTotalPriceCents(ramen, paid, 2)).toBe(49000);
    const sabri = product("sabri");
    expect(calculateUnitPriceCents(sabri, { size: ["20 oz"], entera: ["Takis"] })).toBe(9000);
  });

  it("rejects invalid quantities and unsafe total overflow", () => {
    const water = product("agua");
    for (const quantity of [0, -1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 1]) {
      expect(validateConfiguration(water, {}, quantity).valid).toBe(false);
      expect(() => calculateTotalPriceCents(water, {}, quantity)).toThrow(RangeError);
    }
    expect(() => calculateTotalPriceCents(water, {}, Number.MAX_SAFE_INTEGER)).toThrow(RangeError);
  });
});
