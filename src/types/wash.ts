export type UserRole = 'admin' | 'coordinator' | 'partner';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  organization: string;
  organizationType: string;
  state?: string;
  lga?: string;
  avatar?: string;
}

export interface WashReport {
  id: string;
  submittedAt: string;
  submittedByRole?: UserRole;
  submittedByEmail?: string;
  
  // 01 WHO
  orgName: string;
  orgType: string;
  focalPoint: string;
  email: string;
  donor?: string;

  // 02 WHAT
  activityType: string;
  activityOther?: string;
  quantity: number | string;
  unit: string;
  indicatorDesc?: string;

  // 03 WHERE
  state: 'Borno' | 'Adamawa' | 'Yobe';
  lga: string;
  ward?: string;
  settlement?: string;
  locationType: string;

  // 04 WHEN
  period: string; // YYYY-MM
  status: 'Planned' | 'Ongoing' | 'Completed';
  startDate?: string;
  endDate?: string;

  // 05 FOR WHOM
  populationGroup: string;
  pwd: number;
  men: number;
  women: number;
  boys: number;
  girls: number;
  total: number;
}

export const LGA_BY_STATE: Record<'Borno' | 'Adamawa' | 'Yobe', string[]> = {
  Borno: [
    "Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", 
    "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", 
    "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", 
    "Monguno", "Ngala", "Nganzai", "Shani"
  ],
  Adamawa: [
    "Demsa", "Fufure", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", 
    "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North", 
    "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"
  ],
  Yobe: [
    "Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", 
    "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", 
    "Yunusari", "Yusufari"
  ]
};

export const INITIAL_WARDS_BY_LGA: Record<string, string[]> = {
  // Borno State
  "Maiduguri": [
    "Bolori I", "Bolori II", "Gwange I", "Gwange II", "Gwange III", 
    "Hausari", "Galtimari", "Shehuri North", "Shehuri South", 
    "Mafoni", "Maisandari", "Lamisula", "Gamboru", "Fezzan"
  ],
  "Jere": [
    "Old Maiduguri", "Maimusari", "Mashamari", "Dusuman", "Gongulong", 
    "Bale Galtimari", "Tuba", "Alau", "Dala Alamderi"
  ],
  "Bama": [
    "Shehuri", "Kasugula", "General Hospital Ward", "Sabsabwa", "Gulumba", 
    "Lawanti", "Dipcharima", "Woloji"
  ],
  "Gwoza": [
    "Gwoza Wakane", "Pulka/Bokko", "Guduf", "Kirawa/Jimini", "Kuranabasa", "Madagali Border"
  ],
  "Monguno": [
    "Monguno Central", "Kumalia", "Sure", "Ngurno", "Kaguram"
  ],
  "Damboa": [
    "Damboa Central", "Gumsuri", "Wawa", "Abba", "Azir"
  ],
  "Dikwa": [
    "Dikwa Central", "Boboshe", "Gajibo", "Mallam Maja"
  ],
  "Ngala": [
    "Gamboru 'A'", "Gamboru 'B'", "Gamboru 'C'", "Ngala Central", "Wulgo"
  ],
  "Konduga": [
    "Konduga Central", "Auno", "Dalori", "Malari", "Kawuri"
  ],
  "Biu": [
    "Biu Central", "Galdimare", "Zarawuyaku", "Miringa", "Yawi"
  ],
  // Adamawa State
  "Yola North": [
    "Ajiya", "Alkalawa", "Doubeli", "Gwadabawa", "Jambutu", "Karewa", "Limawa", "Nassarawa"
  ],
  "Yola South": [
    "Adarawo", "Bako", "Bole", "Chobboro", "Makama 'A'", "Makama 'B'", "Mbamba", "Toungo"
  ],
  "Mubi North": [
    "Bahuli", "Betso", "Digil", "Kolere", "Lokuwa", "Mayo Bani", "Mijilu", "Sabon Layi", "Yelwa"
  ],
  "Mubi South": [
    "Dirbishi", "Duvu", "Gella", "Gude", "Kwaja", "Lamorde", "Mugulbu", "Nasarawa"
  ],
  "Michika": [
    "Bazza", "Futudou", "Garta", "Jigalambu", "Michika I", "Michika II", "Moda", "Sina"
  ],
  "Madagali": [
    "Madagali", "Gulak", "Hyambula", "Pallam", "Vapra", "Waga"
  ],
  // Yobe State
  "Damaturu": [
    "Damaturu Central", "Njiwaji", "Maisandari", "Kukareta", "Sasawa", "Bindigari"
  ],
  "Potiskum": [
    "Bolewa 'A'", "Bolewa 'B'", "Hausawa", "Mamudo", "Ngojin", "Yerimaram", "Dogo Tebo"
  ],
  "Bade": [
    "Gashua Central", "Katuzu", "Lawna", "Sarki Hausawa", "Zango"
  ],
  "Geidam": [
    "Geidam Central", "Hausari", "Asheikri", "Gumsa", "Kusur"
  ],
  "Gujba": [
    "Buni Yadi", "Gujba Central", "Bunigari", "Goniri", "Wagir"
  ]
};

export const ACTIVITY_CATEGORIES = [
  {
    category: "Water Supply",
    activities: [
      "Borehole drilling (new)",
      "Borehole rehabilitation",
      "Handpump installation",
      "Handpump repair / maintenance",
      "Water trucking",
      "Piped water system construction / rehabilitation",
      "Water treatment / chlorination",
      "Water quality testing"
    ]
  },
  {
    category: "Sanitation",
    activities: [
      "Household latrine construction",
      "Institutional latrine construction",
      "Latrine rehabilitation",
      "Desludging services",
      "Solid waste management"
    ]
  },
  {
    category: "Hygiene",
    activities: [
      "Hygiene promotion session",
      "Hygiene / NFI kit distribution",
      "Menstrual hygiene management support"
    ]
  },
  {
    category: "Institutional WASH",
    activities: [
      "WASH in schools",
      "WASH in health facilities"
    ]
  }
];

export const ALL_ACTIVITIES = [
  ...ACTIVITY_CATEGORIES.flatMap(c => c.activities),
  "Other"
];

export const POPULATION_GROUPS = [
  "IDPs in camps",
  "IDPs outside camps",
  "Returnees",
  "Host community",
  "Refugees"
];

export const LOCATION_TYPES = [
  "IDP camp / camp-like setting",
  "Host community",
  "Informal settlement",
  "Return area",
  "Refugee settlement"
];

export const UNITS = [
  "Boreholes",
  "Handpumps",
  "Litres per day",
  "Latrine stances",
  "Households",
  "Individuals",
  "Sessions",
  "Kits",
  "Schools",
  "Health facilities",
  "Other unit"
];

export const ORG_TYPES = [
  "International NGO",
  "National NGO",
  "UN Agency",
  "Government / State Actor",
  "Red Cross / Red Crescent",
  "Other"
];

// Rich sample humanitarian data for the 5W platform
export const INITIAL_WASH_REPORTS: WashReport[] = [
  {
    id: "r_1001",
    submittedAt: "2026-08-28T10:15:00Z",
    submittedByRole: "partner",
    submittedByEmail: "partner@solidarites.org",
    orgName: "Solidarités International",
    orgType: "International NGO",
    focalPoint: "Ibrahim Mustapha",
    email: "imustapha@solidarites-nigeria.org",
    donor: "BHA / USAID",
    activityType: "Borehole rehabilitation",
    quantity: 4,
    unit: "Boreholes",
    indicatorDesc: "Solarization and yield enhancement of existing motor-powered boreholes in IDP camp sectors 4 and 5.",
    state: "Borno",
    lga: "Maiduguri",
    ward: "Bolori II",
    settlement: "Bakassi IDP Camp",
    locationType: "IDP camp / camp-like setting",
    period: "2026-08",
    status: "Completed",
    startDate: "2026-08-01",
    endDate: "2026-08-25",
    populationGroup: "IDPs in camps",
    pwd: 120,
    men: 2150,
    women: 2480,
    boys: 1890,
    girls: 2100,
    total: 8620
  },
  {
    id: "r_1002",
    submittedAt: "2026-08-29T14:30:00Z",
    submittedByRole: "partner",
    submittedByEmail: "wash@unicef.org",
    orgName: "UNICEF Nigeria",
    orgType: "UN Agency",
    focalPoint: "Grace Adebayo",
    email: "gadebayo@unicef.org",
    donor: "ECHO",
    activityType: "Hygiene / NFI kit distribution",
    quantity: 1200,
    unit: "Kits",
    indicatorDesc: "Standard WASH emergency cholera-prevention kits including jerrycans, soap, aqua-tabs, and MHM supplies.",
    state: "Borno",
    lga: "Jere",
    ward: "Maimusari",
    settlement: "Galtimari Community",
    locationType: "Host community",
    period: "2026-08",
    status: "Completed",
    startDate: "2026-08-05",
    endDate: "2026-08-20",
    populationGroup: "Host community",
    pwd: 95,
    men: 1420,
    women: 1850,
    boys: 1600,
    girls: 1730,
    total: 6600
  },
  {
    id: "r_1003",
    submittedAt: "2026-08-30T09:00:00Z",
    submittedByRole: "coordinator",
    submittedByEmail: "coordinator@washsector-ne.org",
    orgName: "Action Against Hunger (ACF)",
    orgType: "International NGO",
    focalPoint: "Tariq Mansoor",
    email: "tmansoor@ng-actionagainsthunger.org",
    donor: "FCDO",
    activityType: "Household latrine construction",
    quantity: 85,
    unit: "Latrine stances",
    indicatorDesc: "Gender-segregated emergency semi-permanent latrines with handwashing stations.",
    state: "Borno",
    lga: "Monguno",
    ward: "Monguno Central",
    settlement: "Stadium Camp",
    locationType: "IDP camp / camp-like setting",
    period: "2026-08",
    status: "Ongoing",
    startDate: "2026-08-10",
    endDate: "2026-09-15",
    populationGroup: "IDPs in camps",
    pwd: 64,
    men: 920,
    women: 1140,
    boys: 810,
    girls: 980,
    total: 3850
  },
  {
    id: "r_1004",
    submittedAt: "2026-08-26T11:45:00Z",
    submittedByRole: "partner",
    submittedByEmail: "wash@nrc.no",
    orgName: "Norwegian Refugee Council (NRC)",
    orgType: "International NGO",
    focalPoint: "Amina Yusuf",
    email: "amina.yusuf@nrc.no",
    donor: "NMFA",
    activityType: "Water trucking",
    quantity: 450000,
    unit: "Litres per day",
    indicatorDesc: "Emergency water provision (15 litres/person/day) to newly arrived displaced households.",
    state: "Borno",
    lga: "Gwoza",
    ward: "Gwoza Wakane",
    settlement: "Transit Site A",
    locationType: "Informal settlement",
    period: "2026-08",
    status: "Completed",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    populationGroup: "IDPs outside camps",
    pwd: 180,
    men: 3100,
    women: 3600,
    boys: 2900,
    girls: 3200,
    total: 12800
  },
  {
    id: "r_1005",
    submittedAt: "2026-08-27T16:10:00Z",
    submittedByRole: "partner",
    submittedByEmail: "info@firstaidcorp.org",
    orgName: "International Rescue Committee (IRC)",
    orgType: "International NGO",
    focalPoint: "Bello Mohammed",
    email: "bello.mohammed@rescue.org",
    donor: "USAID / BHA",
    activityType: "Desludging services",
    quantity: 42,
    unit: "Latrine stances",
    indicatorDesc: "Safe mechanical desludging and waste transport to sector-approved disposal site.",
    state: "Yobe",
    lga: "Damaturu",
    ward: "Kukasare",
    settlement: "Kasuwar Shanu Settlement",
    locationType: "Host community",
    period: "2026-08",
    status: "Completed",
    startDate: "2026-08-08",
    endDate: "2026-08-22",
    populationGroup: "Host community",
    pwd: 32,
    men: 680,
    women: 790,
    boys: 590,
    girls: 640,
    total: 2700
  },
  {
    id: "r_1006",
    submittedAt: "2026-08-25T13:20:00Z",
    submittedByRole: "partner",
    submittedByEmail: "programs@crudan.org",
    orgName: "CRUDAN Nigeria",
    orgType: "National NGO",
    focalPoint: "Dauda Yakubu",
    email: "dyakubu@crudan.org",
    donor: "NHF (Nigeria Humanitarian Fund)",
    activityType: "Handpump repair / maintenance",
    quantity: 12,
    unit: "Handpumps",
    indicatorDesc: "Community-level repair of India Mark II handpumps and WASH committee training.",
    state: "Adamawa",
    lga: "Mubi North",
    ward: "Digil",
    settlement: "Digil Ward Center",
    locationType: "Return area",
    period: "2026-08",
    status: "Completed",
    startDate: "2026-08-04",
    endDate: "2026-08-18",
    populationGroup: "Returnees",
    pwd: 48,
    men: 1100,
    women: 1250,
    boys: 950,
    girls: 1050,
    total: 4350
  },
  {
    id: "r_1007",
    submittedAt: "2026-08-29T17:00:00Z",
    submittedByRole: "coordinator",
    submittedByEmail: "coordinator@washsector-ne.org",
    orgName: "IOM Nigeria",
    orgType: "UN Agency",
    focalPoint: "Aisha Garba",
    email: "agarba@iom.int",
    donor: "CERF",
    activityType: "Hygiene promotion session",
    quantity: 45,
    unit: "Sessions",
    indicatorDesc: "Handwashing campaigns and acute watery diarrhea prevention messaging in reception centers.",
    state: "Borno",
    lga: "Bama",
    ward: "Shehuri",
    settlement: "Bama General Camp",
    locationType: "IDP camp / camp-like setting",
    period: "2026-08",
    status: "Completed",
    startDate: "2026-08-10",
    endDate: "2026-08-28",
    populationGroup: "IDPs in camps",
    pwd: 85,
    men: 1350,
    women: 2100,
    boys: 1200,
    girls: 1650,
    total: 6300
  },
  {
    id: "r_1008",
    submittedAt: "2026-08-31T08:15:00Z",
    submittedByRole: "partner",
    submittedByEmail: "wash@drc.ngo",
    orgName: "Danish Refugee Council (DRC)",
    orgType: "International NGO",
    focalPoint: "Kassim Goni",
    email: "kassim.goni@drc.ngo",
    donor: "Danida",
    activityType: "WASH in schools",
    quantity: 3,
    unit: "Schools",
    indicatorDesc: "Construction of gender-segregated latrines and solar water tap stands in primary schools.",
    state: "Yobe",
    lga: "Gujba",
    ward: "Buniyadi",
    settlement: "Central Primary School Buniyadi",
    locationType: "Return area",
    period: "2026-08",
    status: "Ongoing",
    startDate: "2026-08-15",
    endDate: "2026-09-30",
    populationGroup: "Returnees",
    pwd: 24,
    men: 250,
    women: 320,
    boys: 780,
    girls: 860,
    total: 2210
  },
  {
    id: "r_1009",
    submittedAt: "2026-08-30T15:40:00Z",
    submittedByRole: "partner",
    submittedByEmail: "water@fhi360.org",
    orgName: "FHI 360",
    orgType: "International NGO",
    focalPoint: "Zainab Maina",
    email: "zmaina@fhi360.org",
    donor: "USAID",
    activityType: "WASH in health facilities",
    quantity: 2,
    unit: "Health facilities",
    indicatorDesc: "Provision of running water, hand hygiene stations, and waste management in primary healthcare centers.",
    state: "Adamawa",
    lga: "Michika",
    ward: "Bazza",
    settlement: "Bazza Primary Health Centre",
    locationType: "Host community",
    period: "2026-08",
    status: "Planned",
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    populationGroup: "Host community",
    pwd: 30,
    men: 450,
    women: 890,
    boys: 320,
    girls: 460,
    total: 2120
  },
  {
    id: "r_1010",
    submittedAt: "2026-08-27T11:20:00Z",
    submittedByRole: "partner",
    submittedByEmail: "partner@solidarites.org",
    orgName: "Solidarités International",
    orgType: "International NGO",
    focalPoint: "Ibrahim Mustapha",
    email: "imustapha@solidarites-nigeria.org",
    donor: "BHA / USAID",
    activityType: "Emergency latrine construction",
    quantity: 30,
    unit: "Latrine stances",
    indicatorDesc: "Gender-segregated emergency pit latrines with solar lighting and handwashing stations in Bakassi Extension.",
    state: "Borno",
    lga: "Maiduguri",
    ward: "Bolori II",
    settlement: "Bakassi IDP Camp Extension",
    locationType: "IDP camp / camp-like setting",
    period: "2026-08",
    status: "Ongoing",
    startDate: "2026-08-12",
    endDate: "2026-09-10",
    populationGroup: "IDPs in camps",
    pwd: 45,
    men: 820,
    women: 980,
    boys: 710,
    girls: 890,
    total: 3400
  },
  {
    id: "r_1011",
    submittedAt: "2026-08-25T09:45:00Z",
    submittedByRole: "partner",
    submittedByEmail: "partner@solidarites.org",
    orgName: "Solidarités International",
    orgType: "International NGO",
    focalPoint: "Ibrahim Mustapha",
    email: "imustapha@solidarites-nigeria.org",
    donor: "NHF (Nigeria Humanitarian Fund)",
    activityType: "Hygiene promotion session",
    quantity: 60,
    unit: "Sessions",
    indicatorDesc: "Door-to-door hygiene promotion and water storage disinfection campaigns across Bolori II community.",
    state: "Borno",
    lga: "Maiduguri",
    ward: "Bolori II",
    settlement: "Hausari Community",
    locationType: "Host community",
    period: "2026-08",
    status: "Completed",
    startDate: "2026-08-03",
    endDate: "2026-08-20",
    populationGroup: "Host community",
    pwd: 60,
    men: 1200,
    women: 1650,
    boys: 1100,
    girls: 1450,
    total: 5400
  }
];
