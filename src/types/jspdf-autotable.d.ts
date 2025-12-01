declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  export interface UserOptions {
    startY?: number;
    head?: (string | string[])[];
    body?: (string | string[])[];
    theme?: string;
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): jsPDF;
}

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}
