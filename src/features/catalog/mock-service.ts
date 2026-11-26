import type { Catalog, CatalogOption, CatalogProduct, OptionGroup } from "./types";

const option = (label: string, priceCents = 0, id = label): CatalogOption => ({
  id, label, priceCents,
});
const options = (labels: readonly string[]): CatalogOption[] => labels.map((label) => option(label));
const group = (
  id: string,
  label: string,
  values: readonly CatalogOption[],
  config: Partial<Omit<OptionGroup, "id" | "label" | "options">> = {},
): OptionGroup => ({
  id, label, options: values, selection: "multiple", minSelections: 0, ...config,
});

const wholeChips = options([
  "Doritos Nachos", "Doritos Flamin'", "Cheetos Flamin'", "Takis",
  "Chips", "Rancheritos", "Ruffles",
]);
const tostitos = options(["Tostitos Morados", "Tostitos Verdes"]);
const crushedChips = options([
  "Doritos Nachos", "Doritos Flamin'", "Cheetos Flamin'",
  "Cheetos Torciditos", "Takis", "Rancheritos", "Ruffles",
]);
const bagChips = options([
  "Doritos Nachos", "Takis", "Chips", "Ruffles", "Tostitos Morados", "Tostitos Verdes",
]);
const extras: Record<string, CatalogOption> = {
  cheddar: option("Queso cheddar", 1500, "cheddar"),
  gouda: option("Queso gouda", 1500, "gouda"),
  rallado: option("Queso rallado", 1500, "rallado"),
  mayonesa: option("Mayonesa", 1500, "mayonesa"),
  crema: option("Crema", 1500, "crema"),
  mantequilla: option("Mantequilla", 1500, "mantequilla"),
  tocino: option("Tocino", 4000, "tocino"),
  chipotle: option("Aderezo chipotle", 1500, "chipotle"),
  cubierto: option("Cubierto", 200, "cubierto"),
};
const basicExtraIds = ["rallado", "mayonesa", "crema", "mantequilla"];
const esquiteExtraIds = [...basicExtraIds, "tocino", "cubierto"];
const sabriExtraIds = ["cheddar", ...basicExtraIds, "tocino"];
const specialExtraIds = ["cheddar", "gouda", ...basicExtraIds, "tocino", "chipotle", "cubierto"];

const size = (values: readonly [string, number][]): OptionGroup =>
  group("size", "Tamaño", values.map(([label, priceCents]) => option(label, priceCents, label)), {
    selection: "single", minSelections: 1, maxSelections: 1, priceRole: "base",
    hint: "Obligatorio",
  });
const whole = (count: number, includeTostitos: boolean, tostitosSizeId?: string): OptionGroup =>
  group("entera", count > 1 ? `Sabritas enteras (${count}, distintas)` : "Sabrita entera", [
    ...wholeChips,
    ...(includeTostitos
      ? tostitos.map((chip) => ({
          ...chip, ...(tostitosSizeId ? { availableForSizeIds: [tostitosSizeId] } : {}),
        }))
      : []),
  ], {
    minSelections: count, maxSelections: count,
    hint: "Incluida en el precio · obligatorio",
  });
const topping = (required: boolean): OptionGroup =>
  group("topping", "Topping (sabrita triturada)", crushedChips, {
    minSelections: required ? 1 : 0,
    includedSelections: required ? 1 : 0,
    additionalSelectionPriceCents: 1500,
    hint: required
      ? "1 incluido · obligatorio · cada topping adicional +$15.00"
      : "+$15.00 cada uno",
  });
const bag = (): OptionGroup =>
  group("bolsa", "Bolsa de sabritas", bagChips.map((chip) => ({ ...chip, priceCents: 2500 })), {
    hint: "+$25.00 cada una",
  });
const extra = (ids: readonly string[]): OptionGroup =>
  group("extras", "Extras", ids.map((id) => extras[id]), { hint: "Con costo" });
const flavor = (values: readonly string[]): OptionGroup =>
  group("sabor", "Sabor", options(values), {
    selection: "single", minSelections: 1, maxSelections: 1, hint: "Obligatorio",
  });
const ramen = (): OptionGroup =>
  group("ramen", "Tipo de ramen", options([
    "Carbonara (rosa)", "Carbonara cremosa (rosa-blanco)", "4 quesos (amarillo)",
    "Negro", "Morado", "Rojo",
  ]), { selection: "single", minSelections: 1, maxSelections: 1, hint: "Obligatorio" });
const salsa = (): OptionGroup =>
  group("salsa", "Cantidad de salsa", options([
    "Nada de salsa", "1/4 de salsa", "1/2 salsa", "Toda la salsa", "Salsa aparte",
  ]), { selection: "single", minSelections: 1, maxSelections: 1, hint: "Obligatorio" });

// Prototype examples only. Product availability, option rules, and prices need
// confirmation from the menu owner before production use.
const products: CatalogProduct[] = [
  { id: "esq", allowsSpecialInstructions: true, categoryId: "esquites", name: "Esquite tradicional", description: "Elote desgranado con mantequilla, mayonesa, crema, queso rallado y limón", basePriceCents: 4000, optionGroups: [size([["9 oz", 4000], ["12 oz", 4800], ["20 oz", 8900]]), topping(false), extra(esquiteExtraIds)] },
  { id: "sabri", allowsSpecialInstructions: true, categoryId: "esquites", name: "Sabriesquite", description: "Elote desgranado con sabritas de tu elección, queso rallado y derretido", basePriceCents: 7000, optionGroups: [size([["12 oz", 7000], ["20 oz", 9000]]), whole(1, true, "20 oz"), topping(false), extra(sabriExtraIds)] },
  { id: "rev", allowsSpecialInstructions: true, categoryId: "elotes", name: "Elote revolcado", description: "Elote con mantequilla, mayonesa, crema, sabritas de tu elección, queso rallado y derretido", basePriceCents: 6500, optionGroups: [whole(1, false), topping(false), extra(sabriExtraIds)] },
  { id: "trad", allowsSpecialInstructions: true, categoryId: "elotes", name: "Elote tradicional", description: "Elote con mantequilla, mayonesa, crema y queso rallado", basePriceCents: 4500, optionGroups: [topping(false), extra(basicExtraIds)] },
  { id: "charo", allowsSpecialInstructions: true, categoryId: "especiales", name: "Charolazo", description: "1 elote revolcado + esquite preparado + sabritas, bañado en queso líquido", basePriceCents: 15000, optionGroups: [whole(1, true), topping(false), bag(), extra(specialExtraIds)] },
  { id: "supremo", allowsSpecialInstructions: true, categoryId: "especiales", name: "Charolazo Supremo", description: "2 elotes revolcados + esquite + 2 sabritas + cheddar + aderezo chipotle + rallado", basePriceCents: 27500, optionGroups: [whole(2, true), topping(false), bag(), extra(specialExtraIds)] },
  { id: "ramen", allowsSpecialInstructions: true, categoryId: "especiales", name: "Sabriramen", description: "Ramen Buldak + esquite preparado + topping + queso cheddar y rallado", basePriceCents: 16500, optionGroups: [ramen(), topping(true), salsa(), bag(), extra(specialExtraIds)] },
  { id: "ramene", allowsSpecialInstructions: true, categoryId: "especiales", name: "Sabriramen Especial", description: "Ramen Buldak + gouda + esquite + topping + cheddar + rallado + tocino + aderezo chipotle", basePriceCents: 22000, optionGroups: [ramen(), topping(true), salsa(), bag(), extra(specialExtraIds)] },
  { id: "papa", allowsSpecialInstructions: true, categoryId: "especiales", name: "Papa Elotiza", description: "Papa preparada + esquite + sabritas + cheddar + rallado + tocino", basePriceCents: 17500, optionGroups: [whole(1, false), topping(false), bag(), extra(specialExtraIds)] },
  { id: "coca", allowsSpecialInstructions: false, categoryId: "bebidas", name: "Coca-Cola", description: "600 ml", basePriceCents: 3000, optionGroups: [] },
  { id: "seven", allowsSpecialInstructions: false, categoryId: "bebidas", name: "Seven Up", description: "600 ml", basePriceCents: 3000, optionGroups: [] },
  { id: "agua", allowsSpecialInstructions: false, categoryId: "bebidas", name: "Agua natural", description: "600 ml", basePriceCents: 1500, optionGroups: [] },
  { id: "kfk", allowsSpecialInstructions: false, categoryId: "bebidas", name: "Kirkland fresa-kiwi", description: "Bote gasificado", basePriceCents: 3000, optionGroups: [] },
  { id: "refresco", allowsSpecialInstructions: false, categoryId: "bebidas", name: "Otro refresco", description: "Coca Zero o Mirinda, 600 ml", basePriceCents: 3000, optionGroups: [flavor(["Coca Zero", "Mirinda"])] },
  { id: "klata", allowsSpecialInstructions: false, categoryId: "bebidas", name: "Kirkland en lata", description: "Agua gasificada", basePriceCents: 3000, optionGroups: [flavor(["Toronja", "Limón amarillo", "Limón"])] },
  { id: "kbote", allowsSpecialInstructions: false, categoryId: "bebidas", name: "Kirkland en bote", description: "Agua gasificada", basePriceCents: 3000, optionGroups: [flavor(["Frambuesa", "Mango-naranja"])] },
  { id: "bolsasuelta", allowsSpecialInstructions: true, categoryId: "bebidas", name: "Bolsa de sabritas", description: "Se vende sola", basePriceCents: 2500, optionGroups: [flavor(["Doritos Nachos", "Takis", "Chips", "Ruffles", "Tostitos Morados", "Tostitos Verdes"])] },
  { id: "cubierto", allowsSpecialInstructions: true, categoryId: "bebidas", name: "Cubierto", description: "Suelto", basePriceCents: 200, optionGroups: [] },
];

const mockCatalog: Catalog = {
  categories: [
    { id: "esquites", name: "Esquites" },
    { id: "elotes", name: "Elotes" },
    { id: "especiales", name: "Especiales" },
    { id: "bebidas", name: "Bebidas" },
  ],
  products,
};

export async function readMockCatalog(): Promise<Catalog> {
  return mockCatalog;
}
