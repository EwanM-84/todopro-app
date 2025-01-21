export interface Product {
    code: string;
    name: string;
    pricePerUnit: number;
    stockNeeded: number;
}

export const PRODUCTS: Product[] = [
    { code: 'DPC15', name: 'DPC15', pricePerUnit: 4.80, stockNeeded: 0.00 },
    { code: 'DPC10', name: 'DPC10', pricePerUnit: 3.50, stockNeeded: 0.00 },
    { code: 'DPC5', name: 'DPC5', pricePerUnit: 1.60, stockNeeded: 0.00 },
    { code: 'CAPAG10', name: 'CapaG10', pricePerUnit: 7.00, stockNeeded: 1.00 },
    { code: 'CAPAF5', name: 'CapaF5', pricePerUnit: 7.00, stockNeeded: 0.50 },
    { code: 'PEXT', name: 'Pintura.ext', pricePerUnit: 1.67, stockNeeded: 0.25 },
    { code: 'PINT', name: 'pintura.int', pricePerUnit: 1.00, stockNeeded: 0.20 },
    { code: 'FCOAT', name: 'floorcoat', pricePerUnit: 4.44, stockNeeded: 0.33 },
    { code: 'JUNTASL', name: 'JuntasL', pricePerUnit: 1.50, stockNeeded: 0.50 },
    { code: 'JUNTASP', name: 'JuntasP', pricePerUnit: 0.75, stockNeeded: 0.25 },
    { code: 'JCOM', name: 'JointCom', pricePerUnit: 1.00, stockNeeded: 0.00 },
    { code: 'PWP', name: 'PladurWP', pricePerUnit: 1.70, stockNeeded: 0.00 },
    { code: 'PN', name: 'pladurN', pricePerUnit: 1.40, stockNeeded: 0.00 },
    { code: 'STEELP', name: 'SteelP', pricePerUnit: 1.00, stockNeeded: 0.00 },
    { code: 'AMOHO', name: 'Anti-moho', pricePerUnit: 2.66, stockNeeded: 0.00 },
    { code: 'SUPP', name: 'Supplies', pricePerUnit: 50.00, stockNeeded: 0.00 },
    { code: 'BOLSAS', name: 'Bolsas', pricePerUnit: 0.30, stockNeeded: 0.00 },
    { code: 'BASURA', name: 'basura', pricePerUnit: 90.00, stockNeeded: 0.00 },
    { code: 'DAYS', name: 'Days', pricePerUnit: 200.00, stockNeeded: 0.00 }
];