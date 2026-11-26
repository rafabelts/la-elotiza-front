import type {
  CatalogOption,
  CatalogProduct,
  ConfigurationIssue,
  ConfigurationValidation,
  OptionGroup,
  ProductSelection,
} from "./types";

export function getAvailableOptions(
  group: OptionGroup,
  selection: ProductSelection,
): readonly CatalogOption[] {
  const sizeId = selection.size?.[0];
  return group.options.filter(
    (option) =>
      !option.availableForSizeIds ||
      (sizeId !== undefined && option.availableForSizeIds.includes(sizeId)),
  );
}

export function validateConfiguration(
  product: CatalogProduct,
  selection: ProductSelection,
  quantity: number,
): ConfigurationValidation {
  const issues: ConfigurationIssue[] = [];
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    issues.push({ groupId: "quantity", message: "La cantidad debe ser un entero mayor que cero." });
  }
  const groupIds = new Set(product.optionGroups.map((group) => group.id));
  for (const key of Object.keys(selection)) {
    if (!groupIds.has(key) && selection[key].length > 0) {
      issues.push({ groupId: key, message: "La opción seleccionada no pertenece a este producto." });
    }
  }
  for (const group of product.optionGroups) {
    const selected = selection[group.id] ?? [];
    const unique = new Set(selected);
    const available = new Set(getAvailableOptions(group, selection).map((option) => option.id));
    if (selected.length !== unique.size) {
      issues.push({ groupId: group.id, message: "Elige opciones distintas." });
    }
    if (group.selection === "single" && selected.length > 1) {
      issues.push({ groupId: group.id, message: "Elige solo una opción." });
    }
    if (selected.length < group.minSelections) {
      issues.push({
        groupId: group.id,
        message: group.minSelections === 1
          ? "Elige una opción obligatoria."
          : `Elige ${group.minSelections} opciones distintas.`,
      });
    }
    if (group.maxSelections !== undefined && selected.length > group.maxSelections) {
      issues.push({
        groupId: group.id,
        message: `Elige máximo ${group.maxSelections} opciones.`,
      });
    }
    if (selected.some((id) => !available.has(id))) {
      issues.push({ groupId: group.id, message: "Hay una opción no disponible para esta configuración." });
    }
  }
  return { valid: issues.length === 0, issues };
}

export function calculateUnitPriceCents(
  product: CatalogProduct,
  selection: ProductSelection,
): number {
  // This calculation supports an incomplete selection for the live preview.
  // Unknown or currently unavailable options are excluded from its preview.
  let amount = product.basePriceCents;
  for (const group of product.optionGroups) {
    const selected = new Set(selection[group.id] ?? []);
    const options = getAvailableOptions(group, selection).filter((option) => selected.has(option.id));
    if (group.priceRole === "base") {
      if (options[0]) amount = options[0].priceCents;
    } else {
      amount += options.reduce((sum, option) => sum + option.priceCents, 0);
      amount += Math.max(0, options.length - (group.includedSelections ?? 0)) *
        (group.additionalSelectionPriceCents ?? 0);
    }
  }
  return amount;
}

export function calculateTotalPriceCents(
  product: CatalogProduct,
  selection: ProductSelection,
  quantity: number,
): number {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new RangeError("La cantidad debe ser un entero mayor que cero.");
  }
  const total = calculateUnitPriceCents(product, selection) * quantity;
  if (!Number.isSafeInteger(total)) throw new RangeError("El total excede el rango permitido.");
  return total;
}
