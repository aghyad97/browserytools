export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide"
  | "unknown";

export interface ChemElement {
  number: number;
  symbol: string;
  name: string;
  mass: string;
  category: ElementCategory;
  group: number; // 1-18; lanthanides/actinides use placeholder 3
  period: number; // 1-7
  block: "s" | "p" | "d" | "f";
  config: string;
  /** Grid position in the standard 18-column layout (1-indexed). */
  xpos: number;
  /** Grid row in the standard layout, including the two separated f-block rows. */
  ypos: number;
}

// Static dataset of all 118 elements. xpos/ypos describe the canonical
// periodic-table layout used for rendering. The f-block (lanthanides &
// actinides) is placed on rows 8 and 9 below the main table.
export const elements: ChemElement[] = [
  { number: 1, symbol: "H", name: "Hydrogen", mass: "1.008", category: "nonmetal", group: 1, period: 1, block: "s", config: "1s1", xpos: 1, ypos: 1 },
  { number: 2, symbol: "He", name: "Helium", mass: "4.0026", category: "noble-gas", group: 18, period: 1, block: "s", config: "1s2", xpos: 18, ypos: 1 },
  { number: 3, symbol: "Li", name: "Lithium", mass: "6.94", category: "alkali-metal", group: 1, period: 2, block: "s", config: "[He] 2s1", xpos: 1, ypos: 2 },
  { number: 4, symbol: "Be", name: "Beryllium", mass: "9.0122", category: "alkaline-earth-metal", group: 2, period: 2, block: "s", config: "[He] 2s2", xpos: 2, ypos: 2 },
  { number: 5, symbol: "B", name: "Boron", mass: "10.81", category: "metalloid", group: 13, period: 2, block: "p", config: "[He] 2s2 2p1", xpos: 13, ypos: 2 },
  { number: 6, symbol: "C", name: "Carbon", mass: "12.011", category: "nonmetal", group: 14, period: 2, block: "p", config: "[He] 2s2 2p2", xpos: 14, ypos: 2 },
  { number: 7, symbol: "N", name: "Nitrogen", mass: "14.007", category: "nonmetal", group: 15, period: 2, block: "p", config: "[He] 2s2 2p3", xpos: 15, ypos: 2 },
  { number: 8, symbol: "O", name: "Oxygen", mass: "15.999", category: "nonmetal", group: 16, period: 2, block: "p", config: "[He] 2s2 2p4", xpos: 16, ypos: 2 },
  { number: 9, symbol: "F", name: "Fluorine", mass: "18.998", category: "halogen", group: 17, period: 2, block: "p", config: "[He] 2s2 2p5", xpos: 17, ypos: 2 },
  { number: 10, symbol: "Ne", name: "Neon", mass: "20.180", category: "noble-gas", group: 18, period: 2, block: "p", config: "[He] 2s2 2p6", xpos: 18, ypos: 2 },
  { number: 11, symbol: "Na", name: "Sodium", mass: "22.990", category: "alkali-metal", group: 1, period: 3, block: "s", config: "[Ne] 3s1", xpos: 1, ypos: 3 },
  { number: 12, symbol: "Mg", name: "Magnesium", mass: "24.305", category: "alkaline-earth-metal", group: 2, period: 3, block: "s", config: "[Ne] 3s2", xpos: 2, ypos: 3 },
  { number: 13, symbol: "Al", name: "Aluminium", mass: "26.982", category: "post-transition-metal", group: 13, period: 3, block: "p", config: "[Ne] 3s2 3p1", xpos: 13, ypos: 3 },
  { number: 14, symbol: "Si", name: "Silicon", mass: "28.085", category: "metalloid", group: 14, period: 3, block: "p", config: "[Ne] 3s2 3p2", xpos: 14, ypos: 3 },
  { number: 15, symbol: "P", name: "Phosphorus", mass: "30.974", category: "nonmetal", group: 15, period: 3, block: "p", config: "[Ne] 3s2 3p3", xpos: 15, ypos: 3 },
  { number: 16, symbol: "S", name: "Sulfur", mass: "32.06", category: "nonmetal", group: 16, period: 3, block: "p", config: "[Ne] 3s2 3p4", xpos: 16, ypos: 3 },
  { number: 17, symbol: "Cl", name: "Chlorine", mass: "35.45", category: "halogen", group: 17, period: 3, block: "p", config: "[Ne] 3s2 3p5", xpos: 17, ypos: 3 },
  { number: 18, symbol: "Ar", name: "Argon", mass: "39.948", category: "noble-gas", group: 18, period: 3, block: "p", config: "[Ne] 3s2 3p6", xpos: 18, ypos: 3 },
  { number: 19, symbol: "K", name: "Potassium", mass: "39.098", category: "alkali-metal", group: 1, period: 4, block: "s", config: "[Ar] 4s1", xpos: 1, ypos: 4 },
  { number: 20, symbol: "Ca", name: "Calcium", mass: "40.078", category: "alkaline-earth-metal", group: 2, period: 4, block: "s", config: "[Ar] 4s2", xpos: 2, ypos: 4 },
  { number: 21, symbol: "Sc", name: "Scandium", mass: "44.956", category: "transition-metal", group: 3, period: 4, block: "d", config: "[Ar] 3d1 4s2", xpos: 3, ypos: 4 },
  { number: 22, symbol: "Ti", name: "Titanium", mass: "47.867", category: "transition-metal", group: 4, period: 4, block: "d", config: "[Ar] 3d2 4s2", xpos: 4, ypos: 4 },
  { number: 23, symbol: "V", name: "Vanadium", mass: "50.942", category: "transition-metal", group: 5, period: 4, block: "d", config: "[Ar] 3d3 4s2", xpos: 5, ypos: 4 },
  { number: 24, symbol: "Cr", name: "Chromium", mass: "51.996", category: "transition-metal", group: 6, period: 4, block: "d", config: "[Ar] 3d5 4s1", xpos: 6, ypos: 4 },
  { number: 25, symbol: "Mn", name: "Manganese", mass: "54.938", category: "transition-metal", group: 7, period: 4, block: "d", config: "[Ar] 3d5 4s2", xpos: 7, ypos: 4 },
  { number: 26, symbol: "Fe", name: "Iron", mass: "55.845", category: "transition-metal", group: 8, period: 4, block: "d", config: "[Ar] 3d6 4s2", xpos: 8, ypos: 4 },
  { number: 27, symbol: "Co", name: "Cobalt", mass: "58.933", category: "transition-metal", group: 9, period: 4, block: "d", config: "[Ar] 3d7 4s2", xpos: 9, ypos: 4 },
  { number: 28, symbol: "Ni", name: "Nickel", mass: "58.693", category: "transition-metal", group: 10, period: 4, block: "d", config: "[Ar] 3d8 4s2", xpos: 10, ypos: 4 },
  { number: 29, symbol: "Cu", name: "Copper", mass: "63.546", category: "transition-metal", group: 11, period: 4, block: "d", config: "[Ar] 3d10 4s1", xpos: 11, ypos: 4 },
  { number: 30, symbol: "Zn", name: "Zinc", mass: "65.38", category: "transition-metal", group: 12, period: 4, block: "d", config: "[Ar] 3d10 4s2", xpos: 12, ypos: 4 },
  { number: 31, symbol: "Ga", name: "Gallium", mass: "69.723", category: "post-transition-metal", group: 13, period: 4, block: "p", config: "[Ar] 3d10 4s2 4p1", xpos: 13, ypos: 4 },
  { number: 32, symbol: "Ge", name: "Germanium", mass: "72.630", category: "metalloid", group: 14, period: 4, block: "p", config: "[Ar] 3d10 4s2 4p2", xpos: 14, ypos: 4 },
  { number: 33, symbol: "As", name: "Arsenic", mass: "74.922", category: "metalloid", group: 15, period: 4, block: "p", config: "[Ar] 3d10 4s2 4p3", xpos: 15, ypos: 4 },
  { number: 34, symbol: "Se", name: "Selenium", mass: "78.971", category: "nonmetal", group: 16, period: 4, block: "p", config: "[Ar] 3d10 4s2 4p4", xpos: 16, ypos: 4 },
  { number: 35, symbol: "Br", name: "Bromine", mass: "79.904", category: "halogen", group: 17, period: 4, block: "p", config: "[Ar] 3d10 4s2 4p5", xpos: 17, ypos: 4 },
  { number: 36, symbol: "Kr", name: "Krypton", mass: "83.798", category: "noble-gas", group: 18, period: 4, block: "p", config: "[Ar] 3d10 4s2 4p6", xpos: 18, ypos: 4 },
  { number: 37, symbol: "Rb", name: "Rubidium", mass: "85.468", category: "alkali-metal", group: 1, period: 5, block: "s", config: "[Kr] 5s1", xpos: 1, ypos: 5 },
  { number: 38, symbol: "Sr", name: "Strontium", mass: "87.62", category: "alkaline-earth-metal", group: 2, period: 5, block: "s", config: "[Kr] 5s2", xpos: 2, ypos: 5 },
  { number: 39, symbol: "Y", name: "Yttrium", mass: "88.906", category: "transition-metal", group: 3, period: 5, block: "d", config: "[Kr] 4d1 5s2", xpos: 3, ypos: 5 },
  { number: 40, symbol: "Zr", name: "Zirconium", mass: "91.224", category: "transition-metal", group: 4, period: 5, block: "d", config: "[Kr] 4d2 5s2", xpos: 4, ypos: 5 },
  { number: 41, symbol: "Nb", name: "Niobium", mass: "92.906", category: "transition-metal", group: 5, period: 5, block: "d", config: "[Kr] 4d4 5s1", xpos: 5, ypos: 5 },
  { number: 42, symbol: "Mo", name: "Molybdenum", mass: "95.95", category: "transition-metal", group: 6, period: 5, block: "d", config: "[Kr] 4d5 5s1", xpos: 6, ypos: 5 },
  { number: 43, symbol: "Tc", name: "Technetium", mass: "98", category: "transition-metal", group: 7, period: 5, block: "d", config: "[Kr] 4d5 5s2", xpos: 7, ypos: 5 },
  { number: 44, symbol: "Ru", name: "Ruthenium", mass: "101.07", category: "transition-metal", group: 8, period: 5, block: "d", config: "[Kr] 4d7 5s1", xpos: 8, ypos: 5 },
  { number: 45, symbol: "Rh", name: "Rhodium", mass: "102.91", category: "transition-metal", group: 9, period: 5, block: "d", config: "[Kr] 4d8 5s1", xpos: 9, ypos: 5 },
  { number: 46, symbol: "Pd", name: "Palladium", mass: "106.42", category: "transition-metal", group: 10, period: 5, block: "d", config: "[Kr] 4d10", xpos: 10, ypos: 5 },
  { number: 47, symbol: "Ag", name: "Silver", mass: "107.87", category: "transition-metal", group: 11, period: 5, block: "d", config: "[Kr] 4d10 5s1", xpos: 11, ypos: 5 },
  { number: 48, symbol: "Cd", name: "Cadmium", mass: "112.41", category: "transition-metal", group: 12, period: 5, block: "d", config: "[Kr] 4d10 5s2", xpos: 12, ypos: 5 },
  { number: 49, symbol: "In", name: "Indium", mass: "114.82", category: "post-transition-metal", group: 13, period: 5, block: "p", config: "[Kr] 4d10 5s2 5p1", xpos: 13, ypos: 5 },
  { number: 50, symbol: "Sn", name: "Tin", mass: "118.71", category: "post-transition-metal", group: 14, period: 5, block: "p", config: "[Kr] 4d10 5s2 5p2", xpos: 14, ypos: 5 },
  { number: 51, symbol: "Sb", name: "Antimony", mass: "121.76", category: "metalloid", group: 15, period: 5, block: "p", config: "[Kr] 4d10 5s2 5p3", xpos: 15, ypos: 5 },
  { number: 52, symbol: "Te", name: "Tellurium", mass: "127.60", category: "metalloid", group: 16, period: 5, block: "p", config: "[Kr] 4d10 5s2 5p4", xpos: 16, ypos: 5 },
  { number: 53, symbol: "I", name: "Iodine", mass: "126.90", category: "halogen", group: 17, period: 5, block: "p", config: "[Kr] 4d10 5s2 5p5", xpos: 17, ypos: 5 },
  { number: 54, symbol: "Xe", name: "Xenon", mass: "131.29", category: "noble-gas", group: 18, period: 5, block: "p", config: "[Kr] 4d10 5s2 5p6", xpos: 18, ypos: 5 },
  { number: 55, symbol: "Cs", name: "Caesium", mass: "132.91", category: "alkali-metal", group: 1, period: 6, block: "s", config: "[Xe] 6s1", xpos: 1, ypos: 6 },
  { number: 56, symbol: "Ba", name: "Barium", mass: "137.33", category: "alkaline-earth-metal", group: 2, period: 6, block: "s", config: "[Xe] 6s2", xpos: 2, ypos: 6 },
  { number: 57, symbol: "La", name: "Lanthanum", mass: "138.91", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 5d1 6s2", xpos: 4, ypos: 9 },
  { number: 58, symbol: "Ce", name: "Cerium", mass: "140.12", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f1 5d1 6s2", xpos: 5, ypos: 9 },
  { number: 59, symbol: "Pr", name: "Praseodymium", mass: "140.91", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f3 6s2", xpos: 6, ypos: 9 },
  { number: 60, symbol: "Nd", name: "Neodymium", mass: "144.24", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f4 6s2", xpos: 7, ypos: 9 },
  { number: 61, symbol: "Pm", name: "Promethium", mass: "145", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f5 6s2", xpos: 8, ypos: 9 },
  { number: 62, symbol: "Sm", name: "Samarium", mass: "150.36", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f6 6s2", xpos: 9, ypos: 9 },
  { number: 63, symbol: "Eu", name: "Europium", mass: "151.96", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f7 6s2", xpos: 10, ypos: 9 },
  { number: 64, symbol: "Gd", name: "Gadolinium", mass: "157.25", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f7 5d1 6s2", xpos: 11, ypos: 9 },
  { number: 65, symbol: "Tb", name: "Terbium", mass: "158.93", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f9 6s2", xpos: 12, ypos: 9 },
  { number: 66, symbol: "Dy", name: "Dysprosium", mass: "162.50", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f10 6s2", xpos: 13, ypos: 9 },
  { number: 67, symbol: "Ho", name: "Holmium", mass: "164.93", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f11 6s2", xpos: 14, ypos: 9 },
  { number: 68, symbol: "Er", name: "Erbium", mass: "167.26", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f12 6s2", xpos: 15, ypos: 9 },
  { number: 69, symbol: "Tm", name: "Thulium", mass: "168.93", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f13 6s2", xpos: 16, ypos: 9 },
  { number: 70, symbol: "Yb", name: "Ytterbium", mass: "173.05", category: "lanthanide", group: 3, period: 6, block: "f", config: "[Xe] 4f14 6s2", xpos: 17, ypos: 9 },
  { number: 71, symbol: "Lu", name: "Lutetium", mass: "174.97", category: "lanthanide", group: 3, period: 6, block: "d", config: "[Xe] 4f14 5d1 6s2", xpos: 18, ypos: 9 },
  { number: 72, symbol: "Hf", name: "Hafnium", mass: "178.49", category: "transition-metal", group: 4, period: 6, block: "d", config: "[Xe] 4f14 5d2 6s2", xpos: 4, ypos: 6 },
  { number: 73, symbol: "Ta", name: "Tantalum", mass: "180.95", category: "transition-metal", group: 5, period: 6, block: "d", config: "[Xe] 4f14 5d3 6s2", xpos: 5, ypos: 6 },
  { number: 74, symbol: "W", name: "Tungsten", mass: "183.84", category: "transition-metal", group: 6, period: 6, block: "d", config: "[Xe] 4f14 5d4 6s2", xpos: 6, ypos: 6 },
  { number: 75, symbol: "Re", name: "Rhenium", mass: "186.21", category: "transition-metal", group: 7, period: 6, block: "d", config: "[Xe] 4f14 5d5 6s2", xpos: 7, ypos: 6 },
  { number: 76, symbol: "Os", name: "Osmium", mass: "190.23", category: "transition-metal", group: 8, period: 6, block: "d", config: "[Xe] 4f14 5d6 6s2", xpos: 8, ypos: 6 },
  { number: 77, symbol: "Ir", name: "Iridium", mass: "192.22", category: "transition-metal", group: 9, period: 6, block: "d", config: "[Xe] 4f14 5d7 6s2", xpos: 9, ypos: 6 },
  { number: 78, symbol: "Pt", name: "Platinum", mass: "195.08", category: "transition-metal", group: 10, period: 6, block: "d", config: "[Xe] 4f14 5d9 6s1", xpos: 10, ypos: 6 },
  { number: 79, symbol: "Au", name: "Gold", mass: "196.97", category: "transition-metal", group: 11, period: 6, block: "d", config: "[Xe] 4f14 5d10 6s1", xpos: 11, ypos: 6 },
  { number: 80, symbol: "Hg", name: "Mercury", mass: "200.59", category: "transition-metal", group: 12, period: 6, block: "d", config: "[Xe] 4f14 5d10 6s2", xpos: 12, ypos: 6 },
  { number: 81, symbol: "Tl", name: "Thallium", mass: "204.38", category: "post-transition-metal", group: 13, period: 6, block: "p", config: "[Xe] 4f14 5d10 6s2 6p1", xpos: 13, ypos: 6 },
  { number: 82, symbol: "Pb", name: "Lead", mass: "207.2", category: "post-transition-metal", group: 14, period: 6, block: "p", config: "[Xe] 4f14 5d10 6s2 6p2", xpos: 14, ypos: 6 },
  { number: 83, symbol: "Bi", name: "Bismuth", mass: "208.98", category: "post-transition-metal", group: 15, period: 6, block: "p", config: "[Xe] 4f14 5d10 6s2 6p3", xpos: 15, ypos: 6 },
  { number: 84, symbol: "Po", name: "Polonium", mass: "209", category: "post-transition-metal", group: 16, period: 6, block: "p", config: "[Xe] 4f14 5d10 6s2 6p4", xpos: 16, ypos: 6 },
  { number: 85, symbol: "At", name: "Astatine", mass: "210", category: "halogen", group: 17, period: 6, block: "p", config: "[Xe] 4f14 5d10 6s2 6p5", xpos: 17, ypos: 6 },
  { number: 86, symbol: "Rn", name: "Radon", mass: "222", category: "noble-gas", group: 18, period: 6, block: "p", config: "[Xe] 4f14 5d10 6s2 6p6", xpos: 18, ypos: 6 },
  { number: 87, symbol: "Fr", name: "Francium", mass: "223", category: "alkali-metal", group: 1, period: 7, block: "s", config: "[Rn] 7s1", xpos: 1, ypos: 7 },
  { number: 88, symbol: "Ra", name: "Radium", mass: "226", category: "alkaline-earth-metal", group: 2, period: 7, block: "s", config: "[Rn] 7s2", xpos: 2, ypos: 7 },
  { number: 89, symbol: "Ac", name: "Actinium", mass: "227", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 6d1 7s2", xpos: 4, ypos: 10 },
  { number: 90, symbol: "Th", name: "Thorium", mass: "232.04", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 6d2 7s2", xpos: 5, ypos: 10 },
  { number: 91, symbol: "Pa", name: "Protactinium", mass: "231.04", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f2 6d1 7s2", xpos: 6, ypos: 10 },
  { number: 92, symbol: "U", name: "Uranium", mass: "238.03", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f3 6d1 7s2", xpos: 7, ypos: 10 },
  { number: 93, symbol: "Np", name: "Neptunium", mass: "237", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f4 6d1 7s2", xpos: 8, ypos: 10 },
  { number: 94, symbol: "Pu", name: "Plutonium", mass: "244", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f6 7s2", xpos: 9, ypos: 10 },
  { number: 95, symbol: "Am", name: "Americium", mass: "243", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f7 7s2", xpos: 10, ypos: 10 },
  { number: 96, symbol: "Cm", name: "Curium", mass: "247", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f7 6d1 7s2", xpos: 11, ypos: 10 },
  { number: 97, symbol: "Bk", name: "Berkelium", mass: "247", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f9 7s2", xpos: 12, ypos: 10 },
  { number: 98, symbol: "Cf", name: "Californium", mass: "251", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f10 7s2", xpos: 13, ypos: 10 },
  { number: 99, symbol: "Es", name: "Einsteinium", mass: "252", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f11 7s2", xpos: 14, ypos: 10 },
  { number: 100, symbol: "Fm", name: "Fermium", mass: "257", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f12 7s2", xpos: 15, ypos: 10 },
  { number: 101, symbol: "Md", name: "Mendelevium", mass: "258", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f13 7s2", xpos: 16, ypos: 10 },
  { number: 102, symbol: "No", name: "Nobelium", mass: "259", category: "actinide", group: 3, period: 7, block: "f", config: "[Rn] 5f14 7s2", xpos: 17, ypos: 10 },
  { number: 103, symbol: "Lr", name: "Lawrencium", mass: "266", category: "actinide", group: 3, period: 7, block: "d", config: "[Rn] 5f14 7s2 7p1", xpos: 18, ypos: 10 },
  { number: 104, symbol: "Rf", name: "Rutherfordium", mass: "267", category: "transition-metal", group: 4, period: 7, block: "d", config: "[Rn] 5f14 6d2 7s2", xpos: 4, ypos: 7 },
  { number: 105, symbol: "Db", name: "Dubnium", mass: "268", category: "transition-metal", group: 5, period: 7, block: "d", config: "[Rn] 5f14 6d3 7s2", xpos: 5, ypos: 7 },
  { number: 106, symbol: "Sg", name: "Seaborgium", mass: "269", category: "transition-metal", group: 6, period: 7, block: "d", config: "[Rn] 5f14 6d4 7s2", xpos: 6, ypos: 7 },
  { number: 107, symbol: "Bh", name: "Bohrium", mass: "270", category: "transition-metal", group: 7, period: 7, block: "d", config: "[Rn] 5f14 6d5 7s2", xpos: 7, ypos: 7 },
  { number: 108, symbol: "Hs", name: "Hassium", mass: "269", category: "transition-metal", group: 8, period: 7, block: "d", config: "[Rn] 5f14 6d6 7s2", xpos: 8, ypos: 7 },
  { number: 109, symbol: "Mt", name: "Meitnerium", mass: "278", category: "unknown", group: 9, period: 7, block: "d", config: "[Rn] 5f14 6d7 7s2", xpos: 9, ypos: 7 },
  { number: 110, symbol: "Ds", name: "Darmstadtium", mass: "281", category: "unknown", group: 10, period: 7, block: "d", config: "[Rn] 5f14 6d9 7s1", xpos: 10, ypos: 7 },
  { number: 111, symbol: "Rg", name: "Roentgenium", mass: "282", category: "unknown", group: 11, period: 7, block: "d", config: "[Rn] 5f14 6d10 7s1", xpos: 11, ypos: 7 },
  { number: 112, symbol: "Cn", name: "Copernicium", mass: "285", category: "unknown", group: 12, period: 7, block: "d", config: "[Rn] 5f14 6d10 7s2", xpos: 12, ypos: 7 },
  { number: 113, symbol: "Nh", name: "Nihonium", mass: "286", category: "unknown", group: 13, period: 7, block: "p", config: "[Rn] 5f14 6d10 7s2 7p1", xpos: 13, ypos: 7 },
  { number: 114, symbol: "Fl", name: "Flerovium", mass: "289", category: "unknown", group: 14, period: 7, block: "p", config: "[Rn] 5f14 6d10 7s2 7p2", xpos: 14, ypos: 7 },
  { number: 115, symbol: "Mc", name: "Moscovium", mass: "290", category: "unknown", group: 15, period: 7, block: "p", config: "[Rn] 5f14 6d10 7s2 7p3", xpos: 15, ypos: 7 },
  { number: 116, symbol: "Lv", name: "Livermorium", mass: "293", category: "unknown", group: 16, period: 7, block: "p", config: "[Rn] 5f14 6d10 7s2 7p4", xpos: 16, ypos: 7 },
  { number: 117, symbol: "Ts", name: "Tennessine", mass: "294", category: "unknown", group: 17, period: 7, block: "p", config: "[Rn] 5f14 6d10 7s2 7p5", xpos: 17, ypos: 7 },
  { number: 118, symbol: "Og", name: "Oganesson", mass: "294", category: "unknown", group: 18, period: 7, block: "p", config: "[Rn] 5f14 6d10 7s2 7p6", xpos: 18, ypos: 7 },
];

export const categoryOrder: ElementCategory[] = [
  "alkali-metal",
  "alkaline-earth-metal",
  "transition-metal",
  "post-transition-metal",
  "metalloid",
  "nonmetal",
  "halogen",
  "noble-gas",
  "lanthanide",
  "actinide",
  "unknown",
];

// Tailwind utility classes per category (light tile bg + readable text).
export const categoryStyles: Record<ElementCategory, string> = {
  "alkali-metal": "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100",
  "alkaline-earth-metal": "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-100",
  "transition-metal": "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  "post-transition-metal": "bg-lime-100 text-lime-900 dark:bg-lime-950 dark:text-lime-100",
  "metalloid": "bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-100",
  "nonmetal": "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100",
  "halogen": "bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-100",
  "noble-gas": "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100",
  "lanthanide": "bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-950 dark:text-fuchsia-100",
  "actinide": "bg-pink-100 text-pink-900 dark:bg-pink-950 dark:text-pink-100",
  "unknown": "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
};

// Small swatch color for legend dots.
export const categorySwatch: Record<ElementCategory, string> = {
  "alkali-metal": "bg-rose-400",
  "alkaline-earth-metal": "bg-orange-400",
  "transition-metal": "bg-amber-400",
  "post-transition-metal": "bg-lime-400",
  "metalloid": "bg-teal-400",
  "nonmetal": "bg-sky-400",
  "halogen": "bg-cyan-400",
  "noble-gas": "bg-violet-400",
  "lanthanide": "bg-fuchsia-400",
  "actinide": "bg-pink-400",
  "unknown": "bg-slate-400",
};
