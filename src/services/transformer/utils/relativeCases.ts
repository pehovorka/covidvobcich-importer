export const getRelativeCases = (
  activeCases: number,
  municipalityPopulation?: number
): number | null => {
  if (municipalityPopulation) {
    return parseFloat(
      ((activeCases / municipalityPopulation) * 1000).toFixed(1)
    );
  }
  return null;
};
