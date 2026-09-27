export type PharmacyLab = 
  | "PHARMACEUTICS" 
  | "PHARM_CHEMISTRY" 
  | "PHARMACOLOGY" 
  | "PHARMACOGNOSY";

export interface DeadStockItem {
  id: string;
  itemCode: string;
  equipmentName: string;
  lab: PharmacyLab;
  makeModel: string;
  purchaseDate: string;
  poNumber: string;
  quantity: number;
  costInr: number;
  workingStatus: "OPERATIONAL" | "UNDER_MAINTENANCE" | "SCRAPPED";
}

export interface ScheduledChemicalItem {
  id: string;
  chemicalName: string;
  casNumber: string;
  grade: "LR" | "AR" | "HPLC";
  currentStockGrams: number;
  minimumThresholdGrams: number;
  storageCondition: "DESICCATOR" | "FLAMMABLE_CABINET" | "POISON_CUPBOARD";
  isDangerousDrug: boolean;
}

export const INITIAL_DEAD_STOCK: DeadStockItem[] = [
  {
    id: "DS-PCE-01",
    itemCode: "DPK-EQ-PC-014",
    equipmentName: "Digital Dissolution Test Apparatus (6 Basket)",
    lab: "PHARMACEUTICS",
    makeModel: "Labindia DS-8000",
    purchaseDate: "2021-11-12",
    poNumber: "PO/2021/88",
    quantity: 1,
    costInr: 185000,
    workingStatus: "OPERATIONAL",
  },
  {
    id: "DS-PCH-02",
    itemCode: "DPK-EQ-CH-022",
    equipmentName: "UV-Visible Double Beam Spectrophotometer",
    lab: "PHARM_CHEMISTRY",
    makeModel: "Shimadzu UV-1800",
    purchaseDate: "2020-03-05",
    poNumber: "PO/2020/31",
    quantity: 1,
    costInr: 320000,
    workingStatus: "OPERATIONAL",
  },
  {
    id: "DS-PCL-03",
    itemCode: "DPK-EQ-PL-007",
    equipmentName: "Digital Student Physiograph (Single Channel)",
    lab: "PHARMACOLOGY",
    makeModel: "INCO-DSP-01",
    purchaseDate: "2022-09-18",
    poNumber: "PO/2022/104",
    quantity: 2,
    costInr: 96000,
    workingStatus: "OPERATIONAL",
  },
  {
    id: "DS-PCG-04",
    itemCode: "DPK-EQ-PG-019",
    equipmentName: "Compound Research Microscopes with LED",
    lab: "PHARMACOGNOSY",
    makeModel: "Olympus CX21i",
    purchaseDate: "2019-06-20",
    poNumber: "PO/2019/45",
    quantity: 10,
    costInr: 175000,
    workingStatus: "OPERATIONAL",
  },
];

export const INITIAL_CHEMICALS: ScheduledChemicalItem[] = [
  {
    id: "CHM-01",
    chemicalName: "Absolute Ethanol (Rectified Spirit 99.9%)",
    casNumber: "64-17-5",
    grade: "AR",
    currentStockGrams: 2500, // in mL
    minimumThresholdGrams: 5000,
    storageCondition: "POISON_CUPBOARD",
    isDangerousDrug: true,
  },
  {
    id: "CHM-02",
    chemicalName: "Potassium Permanganate",
    casNumber: "7722-64-7",
    grade: "LR",
    currentStockGrams: 800,
    minimumThresholdGrams: 500,
    storageCondition: "POISON_CUPBOARD",
    isDangerousDrug: true,
  },
  {
    id: "CHM-03",
    chemicalName: "Hydrochloric Acid (37% Pure)",
    casNumber: "7647-01-0",
    grade: "AR",
    currentStockGrams: 12000,
    minimumThresholdGrams: 8000,
    storageCondition: "FLAMMABLE_CABINET",
    isDangerousDrug: false,
  },
  {
    id: "CHM-04",
    chemicalName: "Picric Acid (Saturated Reagent)",
    casNumber: "88-89-1",
    grade: "AR",
    currentStockGrams: 150,
    minimumThresholdGrams: 250,
    storageCondition: "POISON_CUPBOARD",
    isDangerousDrug: true,
  },
];
