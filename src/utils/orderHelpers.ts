export function shouldShowEquipment(
  equipment: string
): boolean {
  const normalized =
    equipment.trim().toLowerCase();

  return ![
    "",
    "ospec",
    "valfri",
  ].includes(normalized);
}