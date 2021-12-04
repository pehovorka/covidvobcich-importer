export const selectDistinctOrps = `
SELECT DISTINCT 
    orpId, 
    orpName 
FROM orpVaccinations 
WHERE orpId != ''
`;

export const selectOrpDosesOrder = `
SELECT
    date,
    doseOrder,
    SUM(newDoses) AS newDoses
FROM
    orpVaccinations
WHERE
    orpId = ?
GROUP BY
    date,
    doseOrder
ORDER BY
    date,
    doseOrder;
`;

export const selectOrpVaccines = `
SELECT
    date,
    vaccineId,
    SUM(newDoses) AS newDoses
FROM
    orpVaccinations
WHERE
    orpId = ?
GROUP BY
    date,
    vaccineId
ORDER BY
    date,
    vaccineId;
`;

export const selectDistinctVaccines = `
SELECT DISTINCT 
    vaccineId, 
    vaccineName 
FROM 
    orpVaccinations
`;

export const selectDistinctDoseOrders = `
SELECT DISTINCT 
    doseOrder
FROM
    orpVaccinations
`;
