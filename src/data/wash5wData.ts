// Standard 5W Response Monitoring Reference Data
// Extracted from official WASH Sector BAY States 5W reporting template

export interface Wash5WOrg {
  name: string;
  acronym: string;
}

export interface Wash5WState {
  name: "Adamawa" | "Borno" | "Yobe";
  pcode: string;
}

export interface Wash5WAdminUnit {
  name: string;
  pcode: string;
}

export interface Wash5WActivityDetail {
  indicator: string;
  unit: string;
}

export const WASH_5W_ORG_TYPES: string[] = [
  "Government",
  "International NGO",
  "National NGO",
  "Red Cross and Crescent Movement",
  "UN Agency"
];

export const WASH_5W_DONORS: string[] = [
  "BMZ/KfW",
  "CIDA",
  "DANIDA",
  "ECHO",
  "FCDO",
  "GAC",
  "GFFO",
  "IOM - RRF",
  "OCHA - NHF",
  "Other",
  "NORAD",
  "Qatar Foundation",
  "RRM",
  "SIDA",
  "UNICEF",
  "USAID - BHA"
];

export const WASH_5W_EMERGENCY_TYPES: string[] = [
  "Cholera",
  "Flooding",
  "Malnutrition",
  "Fire-outbreak",
  "Conflict",
  "Refugees",
  "Nexus"
];

export const WASH_5W_DOMAINS: string[] = [
  "Water",
  "Sanitation",
  "Hygiene"
];

export const WASH_5W_BENEFICIARY_TYPES: string[] = [
  "Host communities",
  "IDPs",
  "Refugees",
  "Returnees"
];

export const WASH_5W_STATUS_LIST: string[] = [
  "Cancelled",
  "Completed",
  "In progress",
  "Planned",
  "Suspended"
];

export const WASH_5W_SITE_TYPES: string[] = [
  "Community",
  "Health Center",
  "IDPs Camp",
  "IDPs in Host Community Shelters",
  "Refugee Camp",
  "School"
];

export const WASH_5W_HRP_LIST: string[] = [
  "Yes",
  "Nexus-Development",
  "Nexus-Durable Solution"
];

export const WASH_5W_MONTHS: string[] = [
  "January 2026",
  "February 2026",
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
  "October 2026",
  "November 2026",
  "December 2026"
];

export const WASH_5W_STATES: Wash5WState[] = [
  {
    "name": "Adamawa",
    "pcode": "NG002"
  },
  {
    "name": "Borno",
    "pcode": "NG008"
  },
  {
    "name": "Yobe",
    "pcode": "NG036"
  }
];

export const WASH_5W_LGAS_BY_STATE: Record<string, Wash5WAdminUnit[]> = {
  "Adamawa": [
    {
      "name": "Demsa",
      "pcode": "NG002001"
    },
    {
      "name": "Fufore",
      "pcode": "NG002002"
    },
    {
      "name": "Ganye",
      "pcode": "NG002003"
    },
    {
      "name": "Girei",
      "pcode": "NG002004"
    },
    {
      "name": "Gombi",
      "pcode": "NG002005"
    },
    {
      "name": "Guyuk",
      "pcode": "NG002006"
    },
    {
      "name": "Hong",
      "pcode": "NG002007"
    },
    {
      "name": "Jada",
      "pcode": "NG002008"
    },
    {
      "name": "Lamurde",
      "pcode": "NG002009"
    },
    {
      "name": "Madagali",
      "pcode": "NG002010"
    },
    {
      "name": "Maiha",
      "pcode": "NG002011"
    },
    {
      "name": "Mayo-Belwa",
      "pcode": "NG002012"
    },
    {
      "name": "Michika",
      "pcode": "NG002013"
    },
    {
      "name": "Mubi North",
      "pcode": "NG002014"
    },
    {
      "name": "Mubi South",
      "pcode": "NG002015"
    },
    {
      "name": "Numan",
      "pcode": "NG002016"
    },
    {
      "name": "Shelleng",
      "pcode": "NG002017"
    },
    {
      "name": "Song",
      "pcode": "NG002018"
    },
    {
      "name": "Toungo",
      "pcode": "NG002019"
    },
    {
      "name": "Yola North",
      "pcode": "NG002020"
    },
    {
      "name": "Yola South",
      "pcode": "NG002021"
    }
  ],
  "Borno": [
    {
      "name": "Abadam",
      "pcode": "NG008001"
    },
    {
      "name": "Askira/Uba",
      "pcode": "NG008002"
    },
    {
      "name": "Bama",
      "pcode": "NG008003"
    },
    {
      "name": "Bayo",
      "pcode": "NG008004"
    },
    {
      "name": "Biu",
      "pcode": "NG008005"
    },
    {
      "name": "Chibok",
      "pcode": "NG008006"
    },
    {
      "name": "Damboa",
      "pcode": "NG008007"
    },
    {
      "name": "Dikwa",
      "pcode": "NG008008"
    },
    {
      "name": "Gubio",
      "pcode": "NG008009"
    },
    {
      "name": "Guzamala",
      "pcode": "NG008010"
    },
    {
      "name": "Gwoza",
      "pcode": "NG008011"
    },
    {
      "name": "Hawul",
      "pcode": "NG008012"
    },
    {
      "name": "Jere",
      "pcode": "NG008013"
    },
    {
      "name": "Kaga",
      "pcode": "NG008014"
    },
    {
      "name": "Kala/Balge",
      "pcode": "NG008015"
    },
    {
      "name": "Konduga",
      "pcode": "NG008016"
    },
    {
      "name": "Kukawa",
      "pcode": "NG008017"
    },
    {
      "name": "Kwaya Kusar",
      "pcode": "NG008018"
    },
    {
      "name": "Mafa",
      "pcode": "NG008019"
    },
    {
      "name": "Magumeri",
      "pcode": "NG008020"
    },
    {
      "name": "Maiduguri",
      "pcode": "NG008021"
    },
    {
      "name": "Marte",
      "pcode": "NG008022"
    },
    {
      "name": "Mobbar",
      "pcode": "NG008023"
    },
    {
      "name": "Monguno",
      "pcode": "NG008024"
    },
    {
      "name": "Ngala",
      "pcode": "NG008025"
    },
    {
      "name": "Nganzai",
      "pcode": "NG008026"
    },
    {
      "name": "Shani",
      "pcode": "NG008027"
    }
  ],
  "Yobe": [
    {
      "name": "Bade",
      "pcode": "NG036001"
    },
    {
      "name": "Bursari",
      "pcode": "NG036002"
    },
    {
      "name": "Damaturu",
      "pcode": "NG036003"
    },
    {
      "name": "Fika",
      "pcode": "NG036004"
    },
    {
      "name": "Fune",
      "pcode": "NG036005"
    },
    {
      "name": "Geidam",
      "pcode": "NG036006"
    },
    {
      "name": "Gujba",
      "pcode": "NG036007"
    },
    {
      "name": "Gulani",
      "pcode": "NG036008"
    },
    {
      "name": "Jakusko",
      "pcode": "NG036009"
    },
    {
      "name": "Karasuwa",
      "pcode": "NG036010"
    },
    {
      "name": "Machina",
      "pcode": "NG036011"
    },
    {
      "name": "Nangere",
      "pcode": "NG036012"
    },
    {
      "name": "Nguru",
      "pcode": "NG036013"
    },
    {
      "name": "Potiskum",
      "pcode": "NG036014"
    },
    {
      "name": "Tarmua",
      "pcode": "NG036015"
    },
    {
      "name": "Yunusari",
      "pcode": "NG036016"
    },
    {
      "name": "Yusufari",
      "pcode": "NG036017"
    }
  ]
};

export const WASH_5W_WARDS_BY_LGA: Record<string, Wash5WAdminUnit[]> = {
  "Demsa": [
    {
      "name": "Bille",
      "pcode": "NG002001001"
    },
    {
      "name": "Borrong",
      "pcode": "NG002001002"
    },
    {
      "name": "Demsa",
      "pcode": "NG002001003"
    },
    {
      "name": "Dilli",
      "pcode": "NG002001004"
    },
    {
      "name": "Dong",
      "pcode": "NG002001005"
    },
    {
      "name": "Dwam",
      "pcode": "NG002001006"
    },
    {
      "name": "Gwamba",
      "pcode": "NG002001007"
    },
    {
      "name": "Kpasham",
      "pcode": "NG002001008"
    },
    {
      "name": "Mbula",
      "pcode": "NG002001009"
    },
    {
      "name": "Nassarawo Demsa",
      "pcode": "NG002001010"
    }
  ],
  "Fufore": [
    {
      "name": "Beti",
      "pcode": "NG002002001"
    },
    {
      "name": "Farang",
      "pcode": "NG002002002"
    },
    {
      "name": "Fufore",
      "pcode": "NG002002003"
    },
    {
      "name": "Gurin",
      "pcode": "NG002002004"
    },
    {
      "name": "Karlahi",
      "pcode": "NG002002005"
    },
    {
      "name": "Mayo Inne",
      "pcode": "NG002002006"
    },
    {
      "name": "Pariya",
      "pcode": "NG002002007"
    },
    {
      "name": "Ribadu",
      "pcode": "NG002002008"
    },
    {
      "name": "Uki Tuki",
      "pcode": "NG002002009"
    },
    {
      "name": "Wuro Bokki",
      "pcode": "NG002002010"
    },
    {
      "name": "Yadim",
      "pcode": "NG002002011"
    }
  ],
  "Ganye": [
    {
      "name": "Bakari Goso",
      "pcode": "NG002003001"
    },
    {
      "name": "Gamu",
      "pcode": "NG002003002"
    },
    {
      "name": "Ganye 1",
      "pcode": "NG002003003"
    },
    {
      "name": "Ganye 2",
      "pcode": "NG002003004"
    },
    {
      "name": "Gurumpawo",
      "pcode": "NG002003005"
    },
    {
      "name": "Jaggu",
      "pcode": "NG002003006"
    },
    {
      "name": "Sangassumi",
      "pcode": "NG002003007"
    },
    {
      "name": "Sugu",
      "pcode": "NG002003008"
    },
    {
      "name": "Timdore",
      "pcode": "NG002003009"
    },
    {
      "name": "Yebbi",
      "pcode": "NG002003010"
    }
  ],
  "Girei": [
    {
      "name": "Dakri",
      "pcode": "NG002004001"
    },
    {
      "name": "Damare",
      "pcode": "NG002004002"
    },
    {
      "name": "Gereng",
      "pcode": "NG002004003"
    },
    {
      "name": "Girei 1",
      "pcode": "NG002004004"
    },
    {
      "name": "Girei 2",
      "pcode": "NG002004005"
    },
    {
      "name": "Jera Bakari",
      "pcode": "NG002004006"
    },
    {
      "name": "Jera Bonyo",
      "pcode": "NG002004007"
    },
    {
      "name": "Modire",
      "pcode": "NG002004008"
    },
    {
      "name": "Tambo",
      "pcode": "NG002004009"
    },
    {
      "name": "Wuro Dole",
      "pcode": "NG002004010"
    }
  ],
  "Gombi": [
    {
      "name": "Boga",
      "pcode": "NG002005001"
    },
    {
      "name": "Duwa",
      "pcode": "NG002005002"
    },
    {
      "name": "Gaanda",
      "pcode": "NG002005003"
    },
    {
      "name": "Gabon",
      "pcode": "NG002005004"
    },
    {
      "name": "Garkida",
      "pcode": "NG002005005"
    },
    {
      "name": "Gombi North",
      "pcode": "NG002005006"
    },
    {
      "name": "Gombi South",
      "pcode": "NG002005007"
    },
    {
      "name": "Guyaku",
      "pcode": "NG002005008"
    },
    {
      "name": "Tawa",
      "pcode": "NG002005009"
    },
    {
      "name": "Yang",
      "pcode": "NG002005010"
    }
  ],
  "Guyuk": [
    {
      "name": "Banjiram",
      "pcode": "NG002006001"
    },
    {
      "name": "Bobini",
      "pcode": "NG002006002"
    },
    {
      "name": "Bodeno",
      "pcode": "NG002006003"
    },
    {
      "name": "Chikila",
      "pcode": "NG002006004"
    },
    {
      "name": "Dukul",
      "pcode": "NG002006005"
    },
    {
      "name": "Dumna",
      "pcode": "NG002006006"
    },
    {
      "name": "Guyuk",
      "pcode": "NG002006007"
    },
    {
      "name": "Kola",
      "pcode": "NG002006008"
    },
    {
      "name": "Lokoro",
      "pcode": "NG002006009"
    },
    {
      "name": "Purakayo",
      "pcode": "NG002006010"
    }
  ],
  "Hong": [
    {
      "name": "Bangshika",
      "pcode": "NG002007001"
    },
    {
      "name": "Daksiri",
      "pcode": "NG002007002"
    },
    {
      "name": "Garaha",
      "pcode": "NG002007003"
    },
    {
      "name": "Gaya-sikalmi",
      "pcode": "NG002007004"
    },
    {
      "name": "Hildi",
      "pcode": "NG002007005"
    },
    {
      "name": "Hong",
      "pcode": "NG002007006"
    },
    {
      "name": "Hoserezum",
      "pcode": "NG002007007"
    },
    {
      "name": "Kwarhi",
      "pcode": "NG002007008"
    },
    {
      "name": "Mayo Lope",
      "pcode": "NG002007009"
    },
    {
      "name": "Shangui",
      "pcode": "NG002007010"
    },
    {
      "name": "Thilbang",
      "pcode": "NG002007011"
    },
    {
      "name": "Uba",
      "pcode": "NG002007012"
    }
  ],
  "Jada": [
    {
      "name": "Danaba",
      "pcode": "NG002008001"
    },
    {
      "name": "Jada 1",
      "pcode": "NG002008002"
    },
    {
      "name": "Jada 2",
      "pcode": "NG002008003"
    },
    {
      "name": "Koma 1",
      "pcode": "NG002008004"
    },
    {
      "name": "Koma 2",
      "pcode": "NG002008005"
    },
    {
      "name": "Leko",
      "pcode": "NG002008006"
    },
    {
      "name": "Mapeo",
      "pcode": "NG002008007"
    },
    {
      "name": "Mayo Kalaye",
      "pcode": "NG002008008"
    },
    {
      "name": "Mbullo",
      "pcode": "NG002008009"
    },
    {
      "name": "Nyibago",
      "pcode": "NG002008010"
    },
    {
      "name": "Yeli",
      "pcode": "NG002008011"
    }
  ],
  "Lamurde": [
    {
      "name": "Dubange",
      "pcode": "NG002009001"
    },
    {
      "name": "Gyawana",
      "pcode": "NG002009002"
    },
    {
      "name": "Lafiya",
      "pcode": "NG002009003"
    },
    {
      "name": "Lamurde",
      "pcode": "NG002009004"
    },
    {
      "name": "Ngbakawo",
      "pcode": "NG002009006"
    },
    {
      "name": "Ngbebogun",
      "pcode": "NG002009005"
    },
    {
      "name": "Opalo",
      "pcode": "NG002009007"
    },
    {
      "name": "Rigange",
      "pcode": "NG002009008"
    },
    {
      "name": "Suwa",
      "pcode": "NG002009009"
    },
    {
      "name": "Waduku",
      "pcode": "NG002009010"
    }
  ],
  "Madagali": [
    {
      "name": "Bebel",
      "pcode": "NG002010001"
    },
    {
      "name": "Duhu",
      "pcode": "NG002010002"
    },
    {
      "name": "Gulak",
      "pcode": "NG002010003"
    },
    {
      "name": "Hyambula",
      "pcode": "NG002010004"
    },
    {
      "name": "Kirchinga",
      "pcode": "NG002010005"
    },
    {
      "name": "Madagali",
      "pcode": "NG002010006"
    },
    {
      "name": "Pallam",
      "pcode": "NG002010007"
    },
    {
      "name": "Sukur",
      "pcode": "NG002010008"
    },
    {
      "name": "Waga-chakawa",
      "pcode": "NG002010009"
    },
    {
      "name": "Wula",
      "pcode": "NG002010010"
    }
  ],
  "Maiha": [
    {
      "name": "Bebel",
      "pcode": "NG002011001"
    },
    {
      "name": "Humbutudi",
      "pcode": "NG002011002"
    },
    {
      "name": "Konkol",
      "pcode": "NG002011003"
    },
    {
      "name": "Maiha Gari",
      "pcode": "NG002011004"
    },
    {
      "name": "Manjekin",
      "pcode": "NG002011005"
    },
    {
      "name": "Mayo Nguli",
      "pcode": "NG002011006"
    },
    {
      "name": "Pakka",
      "pcode": "NG002011007"
    },
    {
      "name": "Sorau A",
      "pcode": "NG002011008"
    },
    {
      "name": "Sorau B",
      "pcode": "NG002011009"
    },
    {
      "name": "Tambajam",
      "pcode": "NG002011010"
    }
  ],
  "Mayo-Belwa": [
    {
      "name": "Bajama",
      "pcode": "NG002012001"
    },
    {
      "name": "Binyeri",
      "pcode": "NG002012002"
    },
    {
      "name": "Gang Fada",
      "pcode": "NG002012003"
    },
    {
      "name": "Gengle",
      "pcode": "NG002012004"
    },
    {
      "name": "Gorobi",
      "pcode": "NG002012005"
    },
    {
      "name": "Jereng",
      "pcode": "NG002012008"
    },
    {
      "name": "Mayo Farang",
      "pcode": "NG002012006"
    },
    {
      "name": "Mbilla",
      "pcode": "NG002012007"
    },
    {
      "name": "Ndikong",
      "pcode": "NG002012009"
    },
    {
      "name": "Ribadu",
      "pcode": "NG002012010"
    },
    {
      "name": "Tola",
      "pcode": "NG002012011"
    },
    {
      "name": "Yoffo",
      "pcode": "NG002012012"
    }
  ],
  "Michika": [
    {
      "name": "Bazza Margi",
      "pcode": "NG002013001"
    },
    {
      "name": "Futuless",
      "pcode": "NG002013002"
    },
    {
      "name": "Garta",
      "pcode": "NG002013003"
    },
    {
      "name": "Jigalambu",
      "pcode": "NG002013004"
    },
    {
      "name": "Madzi",
      "pcode": "NG002013005"
    },
    {
      "name": "Michika 1",
      "pcode": "NG002013006"
    },
    {
      "name": "Michika 2",
      "pcode": "NG002013007"
    },
    {
      "name": "Moda/Dlaka",
      "pcode": "NG002013009"
    },
    {
      "name": "Munkavachitta",
      "pcode": "NG002013010"
    },
    {
      "name": "Ninkisi/Wuro Ngiki",
      "pcode": "NG002013008"
    },
    {
      "name": "Sina Kamale",
      "pcode": "NG002013011"
    },
    {
      "name": "Tsukumu/Tilijo",
      "pcode": "NG002013012"
    },
    {
      "name": "Tumbara/Ngabili",
      "pcode": "NG002013014"
    },
    {
      "name": "Vih/Boka",
      "pcode": "NG002013015"
    },
    {
      "name": "Wambilimi/Tili",
      "pcode": "NG002013016"
    },
    {
      "name": "Zah",
      "pcode": "NG002013013"
    }
  ],
  "Mubi North": [
    {
      "name": "Bahuli",
      "pcode": "NG002014001"
    },
    {
      "name": "Betso",
      "pcode": "NG002014002"
    },
    {
      "name": "Digil",
      "pcode": "NG002014003"
    },
    {
      "name": "Kolere",
      "pcode": "NG002014004"
    },
    {
      "name": "Lokuwa",
      "pcode": "NG002014005"
    },
    {
      "name": "Mayo Bani",
      "pcode": "NG002014006"
    },
    {
      "name": "Mijilu",
      "pcode": "NG002014007"
    },
    {
      "name": "Muchalla",
      "pcode": "NG002014008"
    },
    {
      "name": "Sabon Layi",
      "pcode": "NG002014009"
    },
    {
      "name": "Vimtim",
      "pcode": "NG002014010"
    },
    {
      "name": "Yelwa",
      "pcode": "NG002014011"
    }
  ],
  "Mubi South": [
    {
      "name": "Dirbishi",
      "pcode": "NG002015001"
    },
    {
      "name": "Duvu",
      "pcode": "NG002015002"
    },
    {
      "name": "Gella",
      "pcode": "NG002015003"
    },
    {
      "name": "Gude",
      "pcode": "NG002015004"
    },
    {
      "name": "Kwaja",
      "pcode": "NG002015005"
    },
    {
      "name": "Lamurde",
      "pcode": "NG002015006"
    },
    {
      "name": "Mugulbu",
      "pcode": "NG002015007"
    },
    {
      "name": "Mujara",
      "pcode": "NG002015008"
    },
    {
      "name": "Nassarawo",
      "pcode": "NG002015009"
    },
    {
      "name": "Nduku",
      "pcode": "NG002015010"
    }
  ],
  "Numan": [
    {
      "name": "Bare",
      "pcode": "NG002016001"
    },
    {
      "name": "Bwalki",
      "pcode": "NG002016002"
    },
    {
      "name": "Gamadiyo",
      "pcode": "NG002016003"
    },
    {
      "name": "Imburu",
      "pcode": "NG002016004"
    },
    {
      "name": "Kodomti",
      "pcode": "NG002016005"
    },
    {
      "name": "Numan 1",
      "pcode": "NG002016006"
    },
    {
      "name": "Numan 2",
      "pcode": "NG002016007"
    },
    {
      "name": "Numan 3",
      "pcode": "NG002016008"
    },
    {
      "name": "Sabon Pegi",
      "pcode": "NG002016009"
    },
    {
      "name": "Vulpi",
      "pcode": "NG002016010"
    }
  ],
  "Shelleng": [
    {
      "name": "Bakta",
      "pcode": "NG002017001"
    },
    {
      "name": "Bodwai",
      "pcode": "NG002017002"
    },
    {
      "name": "Gundo",
      "pcode": "NG002017003"
    },
    {
      "name": "Gwapopolok",
      "pcode": "NG002017004"
    },
    {
      "name": "Jumbul",
      "pcode": "NG002017005"
    },
    {
      "name": "Ketembere",
      "pcode": "NG002017006"
    },
    {
      "name": "Kiri",
      "pcode": "NG002017007"
    },
    {
      "name": "Libbo",
      "pcode": "NG002017008"
    },
    {
      "name": "Shelleng",
      "pcode": "NG002017009"
    },
    {
      "name": "Talum",
      "pcode": "NG002017010"
    }
  ],
  "Song": [
    {
      "name": "Dirma",
      "pcode": "NG002018001"
    },
    {
      "name": "Dumne",
      "pcode": "NG002018002"
    },
    {
      "name": "Gudu Mboi",
      "pcode": "NG002018003"
    },
    {
      "name": "Kilange Funa",
      "pcode": "NG002018004"
    },
    {
      "name": "Kilange Hirna",
      "pcode": "NG002018005"
    },
    {
      "name": "Sigire",
      "pcode": "NG002018006"
    },
    {
      "name": "Song Gari",
      "pcode": "NG002018007"
    },
    {
      "name": "Song Waje",
      "pcode": "NG002018008"
    },
    {
      "name": "Suktu",
      "pcode": "NG002018009"
    },
    {
      "name": "Waltandi",
      "pcode": "NG002018010"
    },
    {
      "name": "Zumo",
      "pcode": "NG002018011"
    }
  ],
  "Toungo": [
    {
      "name": "Dawo 1",
      "pcode": "NG002019001"
    },
    {
      "name": "Dawo 2",
      "pcode": "NG002019002"
    },
    {
      "name": "Gumti",
      "pcode": "NG002019003"
    },
    {
      "name": "Kiri 1",
      "pcode": "NG002019004"
    },
    {
      "name": "Kiri 2",
      "pcode": "NG002019005"
    },
    {
      "name": "Kogin Baba 1",
      "pcode": "NG002019006"
    },
    {
      "name": "Kogin Baba 2",
      "pcode": "NG002019007"
    },
    {
      "name": "Toungo 1",
      "pcode": "NG002019008"
    },
    {
      "name": "Toungo 2",
      "pcode": "NG002019009"
    },
    {
      "name": "Toungo 3",
      "pcode": "NG002019010"
    }
  ],
  "Yola North": [
    {
      "name": "Ajiya",
      "pcode": "NG002020001"
    },
    {
      "name": "Alkalawa",
      "pcode": "NG002020002"
    },
    {
      "name": "Doubeli",
      "pcode": "NG002020003"
    },
    {
      "name": "Gwadabawa",
      "pcode": "NG002020004"
    },
    {
      "name": "Jambutu",
      "pcode": "NG002020005"
    },
    {
      "name": "Karewa",
      "pcode": "NG002020006"
    },
    {
      "name": "Limawa",
      "pcode": "NG002020007"
    },
    {
      "name": "Luggere",
      "pcode": "NG002020008"
    },
    {
      "name": "Nassarawo",
      "pcode": "NG002020009"
    },
    {
      "name": "Rumde",
      "pcode": "NG002020010"
    },
    {
      "name": "Yelwa",
      "pcode": "NG002020011"
    }
  ],
  "Yola South": [
    {
      "name": "Adarawo",
      "pcode": "NG002021001"
    },
    {
      "name": "Bako",
      "pcode": "NG002021002"
    },
    {
      "name": "Bole Yolde Pate",
      "pcode": "NG002021003"
    },
    {
      "name": "Makama A",
      "pcode": "NG002021004"
    },
    {
      "name": "Makama B",
      "pcode": "NG002021005"
    },
    {
      "name": "Mbamba",
      "pcode": "NG002021006"
    },
    {
      "name": "Mbamoi",
      "pcode": "NG002021007"
    },
    {
      "name": "Namtari",
      "pcode": "NG002021008"
    },
    {
      "name": "Ngurore",
      "pcode": "NG002021009"
    },
    {
      "name": "Toungo",
      "pcode": "NG002021010"
    },
    {
      "name": "Yolde Kohi",
      "pcode": "NG002021011"
    }
  ],
  "Abadam": [
    {
      "name": "Arege",
      "pcode": "NG008001001"
    },
    {
      "name": "Banowa",
      "pcode": "NG008001002"
    },
    {
      "name": "Busuna",
      "pcode": "NG008001006"
    },
    {
      "name": "Foguwa",
      "pcode": "NG008001003"
    },
    {
      "name": "Jabullam",
      "pcode": "NG008001004"
    },
    {
      "name": "Kessa'A",
      "pcode": "NG008001007"
    },
    {
      "name": "Kudokurgo",
      "pcode": "NG008001005"
    },
    {
      "name": "Yau",
      "pcode": "NG008001008"
    },
    {
      "name": "Yawa",
      "pcode": "NG008001009"
    },
    {
      "name": "Yitiwa",
      "pcode": "NG008001010"
    }
  ],
  "Askira/Uba": [
    {
      "name": "Askira East",
      "pcode": "NG008002001"
    },
    {
      "name": "Dille Huyim",
      "pcode": "NG008002003"
    },
    {
      "name": "Hausari Tampul",
      "pcode": "NG008002004"
    },
    {
      "name": "Hausari Zadawa",
      "pcode": "NG008002013"
    },
    {
      "name": "Lassa",
      "pcode": "NG008002006"
    },
    {
      "name": "Mussa",
      "pcode": "NG008002007"
    },
    {
      "name": "Ngohi",
      "pcode": "NG008002008"
    },
    {
      "name": "Ngulde",
      "pcode": "NG008002009"
    },
    {
      "name": "Ngurthlavu Kopa",
      "pcode": "NG008002005"
    },
    {
      "name": "Rumirgu Chul",
      "pcode": "NG008002002"
    },
    {
      "name": "Uba",
      "pcode": "NG008002010"
    },
    {
      "name": "Uvu Uda",
      "pcode": "NG008002011"
    },
    {
      "name": "Wamdeo Giwi",
      "pcode": "NG008002012"
    }
  ],
  "Bama": [
    {
      "name": "Abbaram",
      "pcode": "NG008003007"
    },
    {
      "name": "Amchaka",
      "pcode": "NG008003008"
    },
    {
      "name": "Andara",
      "pcode": "NG008003001"
    },
    {
      "name": "Banki",
      "pcode": "NG008003002"
    },
    {
      "name": "Bogomari",
      "pcode": "NG008003012"
    },
    {
      "name": "Darajamal",
      "pcode": "NG008003003"
    },
    {
      "name": "Goniri",
      "pcode": "NG008003009"
    },
    {
      "name": "Gulumba",
      "pcode": "NG008003004"
    },
    {
      "name": "Kasugula",
      "pcode": "NG008003005"
    },
    {
      "name": "Kumshe",
      "pcode": "NG008003006"
    },
    {
      "name": "Shehuri",
      "pcode": "NG008003011"
    },
    {
      "name": "Soye",
      "pcode": "NG008003010"
    },
    {
      "name": "Yabiri",
      "pcode": "NG008003013"
    },
    {
      "name": "Zageri",
      "pcode": "NG008003014"
    }
  ],
  "Bayo": [
    {
      "name": "Balbaya",
      "pcode": "NG008004001"
    },
    {
      "name": "Briyel",
      "pcode": "NG008004002"
    },
    {
      "name": "Fikhayel",
      "pcode": "NG008004003"
    },
    {
      "name": "Gamadadi",
      "pcode": "NG008004004"
    },
    {
      "name": "Jara-Dali",
      "pcode": "NG008004005"
    },
    {
      "name": "Jara-Gol",
      "pcode": "NG008004006"
    },
    {
      "name": "Limanti",
      "pcode": "NG008004007"
    },
    {
      "name": "Telli",
      "pcode": "NG008004008"
    },
    {
      "name": "Wuyo",
      "pcode": "NG008004009"
    },
    {
      "name": "Zara",
      "pcode": "NG008004010"
    }
  ],
  "Biu": [
    {
      "name": "Buratai",
      "pcode": "NG008005001"
    },
    {
      "name": "Dugja",
      "pcode": "NG008005003"
    },
    {
      "name": "Galdimari",
      "pcode": "NG008005006"
    },
    {
      "name": "Garubula",
      "pcode": "NG008005004"
    },
    {
      "name": "Gunda",
      "pcode": "NG008005002"
    },
    {
      "name": "Gur",
      "pcode": "NG008005005"
    },
    {
      "name": "Mandaragirau",
      "pcode": "NG008005007"
    },
    {
      "name": "Miringa",
      "pcode": "NG008005008"
    },
    {
      "name": "Sulumthla",
      "pcode": "NG008005009"
    },
    {
      "name": "Yawi",
      "pcode": "NG008005010"
    },
    {
      "name": "Zarawuyaku",
      "pcode": "NG008005011"
    }
  ],
  "Chibok": [
    {
      "name": "Garu",
      "pcode": "NG008006001"
    },
    {
      "name": "Gatamarwa",
      "pcode": "NG008006004"
    },
    {
      "name": "Kautikari",
      "pcode": "NG008006005"
    },
    {
      "name": "Korongilum",
      "pcode": "NG008006006"
    },
    {
      "name": "Kuburmbula",
      "pcode": "NG008006007"
    },
    {
      "name": "Likama",
      "pcode": "NG008006002"
    },
    {
      "name": "Mbalala",
      "pcode": "NG008006008"
    },
    {
      "name": "Mbokura",
      "pcode": "NG008006009"
    },
    {
      "name": "Pemi",
      "pcode": "NG008006010"
    },
    {
      "name": "Shirarkir",
      "pcode": "NG008006011"
    },
    {
      "name": "Whuntaku",
      "pcode": "NG008006003"
    }
  ],
  "Damboa": [
    {
      "name": "Ajigin A",
      "pcode": "NG008007001"
    },
    {
      "name": "Ajigin B",
      "pcode": "NG008007002"
    },
    {
      "name": "Azir Multe",
      "pcode": "NG008007003"
    },
    {
      "name": "Bego",
      "pcode": "NG008007004"
    },
    {
      "name": "Damboa Central",
      "pcode": "NG008007005"
    },
    {
      "name": "Gumsuri",
      "pcode": "NG008007006"
    },
    {
      "name": "Kafa Mafi",
      "pcode": "NG008007007"
    },
    {
      "name": "Mulgo Kopchi",
      "pcode": "NG008007008"
    },
    {
      "name": "Nzuda Wuyaram",
      "pcode": "NG008007009"
    },
    {
      "name": "Wawa Korode",
      "pcode": "NG008007010"
    }
  ],
  "Dikwa": [
    {
      "name": "Afuye",
      "pcode": "NG008008009"
    },
    {
      "name": "Boboshe",
      "pcode": "NG008008001"
    },
    {
      "name": "Dikwa",
      "pcode": "NG008008002"
    },
    {
      "name": "Gajibo",
      "pcode": "NG008008003"
    },
    {
      "name": "M. Kaza",
      "pcode": "NG008008006"
    },
    {
      "name": "M. Maja",
      "pcode": "NG008008005"
    },
    {
      "name": "Margata",
      "pcode": "NG008008004"
    },
    {
      "name": "Muliye",
      "pcode": "NG008008007"
    },
    {
      "name": "Ngudoram",
      "pcode": "NG008008008"
    },
    {
      "name": "Ufaye",
      "pcode": "NG008008010"
    }
  ],
  "Gubio": [
    {
      "name": "Ardimini",
      "pcode": "NG008009001"
    },
    {
      "name": "Dabira",
      "pcode": "NG008009002"
    },
    {
      "name": "Felo",
      "pcode": "NG008009003"
    },
    {
      "name": "Gamawu",
      "pcode": "NG008009004"
    },
    {
      "name": "Gazabure",
      "pcode": "NG008009005"
    },
    {
      "name": "Gubio 1",
      "pcode": "NG008009006"
    },
    {
      "name": "Gubio 2",
      "pcode": "NG008009007"
    },
    {
      "name": "Kingowa",
      "pcode": "NG008009008"
    },
    {
      "name": "Ngetra",
      "pcode": "NG008009009"
    },
    {
      "name": "Zowo",
      "pcode": "NG008009010"
    }
  ],
  "Guzamala": [
    {
      "name": "Aduwa",
      "pcode": "NG008010001"
    },
    {
      "name": "Gudumbali East",
      "pcode": "NG008010002"
    },
    {
      "name": "Gudumbali West",
      "pcode": "NG008010003"
    },
    {
      "name": "Guworam",
      "pcode": "NG008010004"
    },
    {
      "name": "Guzamala East",
      "pcode": "NG008010005"
    },
    {
      "name": "Guzamala West",
      "pcode": "NG008010006"
    },
    {
      "name": "Kingarawa",
      "pcode": "NG008010007"
    },
    {
      "name": "Mairari",
      "pcode": "NG008010008"
    },
    {
      "name": "Moduri",
      "pcode": "NG008010009"
    },
    {
      "name": "Wamiri",
      "pcode": "NG008010010"
    }
  ],
  "Gwoza": [
    {
      "name": "Ashigashiya",
      "pcode": "NG008011001"
    },
    {
      "name": "Bita Izge",
      "pcode": "NG008011002"
    },
    {
      "name": "Bulabulin",
      "pcode": "NG008011007"
    },
    {
      "name": "Chikide",
      "pcode": "NG008011009"
    },
    {
      "name": "Gava Agapalawa",
      "pcode": "NG008011004"
    },
    {
      "name": "Guduf A&B",
      "pcode": "NG008011005"
    },
    {
      "name": "Hambagda",
      "pcode": "NG008011008"
    },
    {
      "name": "Hausari",
      "pcode": "NG008011006"
    },
    {
      "name": "Kirawa",
      "pcode": "NG008011010"
    },
    {
      "name": "Kuranabasa",
      "pcode": "NG008011011"
    },
    {
      "name": "Ngoshe",
      "pcode": "NG008011012"
    },
    {
      "name": "Pulka Bokko",
      "pcode": "NG008011013"
    },
    {
      "name": "Wala Warabe",
      "pcode": "NG008011003"
    }
  ],
  "Hawul": [
    {
      "name": "Bilingwi",
      "pcode": "NG008012001"
    },
    {
      "name": "Grim Damchoba",
      "pcode": "NG008012002"
    },
    {
      "name": "Gwangang Chata",
      "pcode": "NG008012003"
    },
    {
      "name": "Hizhibwala",
      "pcode": "NG008012004"
    },
    {
      "name": "Kidda",
      "pcode": "NG008012005"
    },
    {
      "name": "Kwajaffa",
      "pcode": "NG008012006"
    },
    {
      "name": "Kwayabura",
      "pcode": "NG008012007"
    },
    {
      "name": "Marama Kidang",
      "pcode": "NG008012008"
    },
    {
      "name": "Pama Whitambaya",
      "pcode": "NG008012009"
    },
    {
      "name": "Puba Vidau",
      "pcode": "NG008012010"
    },
    {
      "name": "Sakwa Hema",
      "pcode": "NG008012011"
    },
    {
      "name": "Shaffa",
      "pcode": "NG008012012"
    }
  ],
  "Jere": [
    {
      "name": "Alau",
      "pcode": "NG008013001"
    },
    {
      "name": "Dala",
      "pcode": "NG008013003"
    },
    {
      "name": "Dusuma",
      "pcode": "NG008013004"
    },
    {
      "name": "Galtimari",
      "pcode": "NG008013002"
    },
    {
      "name": "Gomari",
      "pcode": "NG008013005"
    },
    {
      "name": "Gongulong",
      "pcode": "NG008013006"
    },
    {
      "name": "Khadammari",
      "pcode": "NG008013010"
    },
    {
      "name": "Maimusari",
      "pcode": "NG008013007"
    },
    {
      "name": "Mairi",
      "pcode": "NG008013008"
    },
    {
      "name": "Mashamari",
      "pcode": "NG008013009"
    },
    {
      "name": "Old Maiduguri",
      "pcode": "NG008013011"
    },
    {
      "name": "Tuba",
      "pcode": "NG008013012"
    }
  ],
  "Kaga": [
    {
      "name": "Benisheikh",
      "pcode": "NG008014002"
    },
    {
      "name": "Borgozo",
      "pcode": "NG008014003"
    },
    {
      "name": "Dogoma",
      "pcode": "NG008014004"
    },
    {
      "name": "Dongo",
      "pcode": "NG008014005"
    },
    {
      "name": "Fai",
      "pcode": "NG008014001"
    },
    {
      "name": "Galangi",
      "pcode": "NG008014006"
    },
    {
      "name": "Guwo",
      "pcode": "NG008014007"
    },
    {
      "name": "Karagawaru",
      "pcode": "NG008014008"
    },
    {
      "name": "Mainok",
      "pcode": "NG008014009"
    },
    {
      "name": "Marguba",
      "pcode": "NG008014010"
    },
    {
      "name": "Ngamdu",
      "pcode": "NG008014011"
    },
    {
      "name": "Shettimari",
      "pcode": "NG008014012"
    },
    {
      "name": "Tobolo",
      "pcode": "NG008014013"
    },
    {
      "name": "Wajiro",
      "pcode": "NG008014014"
    },
    {
      "name": "Wassaram",
      "pcode": "NG008014015"
    }
  ],
  "Kala/Balge": [
    {
      "name": "Daima",
      "pcode": "NG008015009"
    },
    {
      "name": "Jarawa",
      "pcode": "NG008015001"
    },
    {
      "name": "Jilbe",
      "pcode": "NG008015002"
    },
    {
      "name": "K Kaudi",
      "pcode": "NG008015003"
    },
    {
      "name": "K Kumaga",
      "pcode": "NG008015005"
    },
    {
      "name": "Kala",
      "pcode": "NG008015004"
    },
    {
      "name": "Mada",
      "pcode": "NG008015006"
    },
    {
      "name": "Moholo",
      "pcode": "NG008015007"
    },
    {
      "name": "Rann",
      "pcode": "NG008015008"
    },
    {
      "name": "Sigal",
      "pcode": "NG008015010"
    }
  ],
  "Konduga": [
    {
      "name": "Ajiri",
      "pcode": "NG008016011"
    },
    {
      "name": "Auno",
      "pcode": "NG008016001"
    },
    {
      "name": "Dalori",
      "pcode": "NG008016002"
    },
    {
      "name": "Dalwa",
      "pcode": "NG008016009"
    },
    {
      "name": "Jakana",
      "pcode": "NG008016004"
    },
    {
      "name": "Kawuri",
      "pcode": "NG008016005"
    },
    {
      "name": "Konduga",
      "pcode": "NG008016007"
    },
    {
      "name": "Malari",
      "pcode": "NG008016003"
    },
    {
      "name": "Yabal",
      "pcode": "NG008016008"
    },
    {
      "name": "Yajiwa",
      "pcode": "NG008016010"
    },
    {
      "name": "Yale",
      "pcode": "NG008016006"
    }
  ],
  "Kukawa": [
    {
      "name": "Alagarno",
      "pcode": "NG008017001"
    },
    {
      "name": "Baga",
      "pcode": "NG008017002"
    },
    {
      "name": "Barwati",
      "pcode": "NG008017009"
    },
    {
      "name": "Bundur",
      "pcode": "NG008017003"
    },
    {
      "name": "Dogoshi",
      "pcode": "NG008017004"
    },
    {
      "name": "Doro",
      "pcode": "NG008017005"
    },
    {
      "name": "Kauwa",
      "pcode": "NG008017006"
    },
    {
      "name": "Kekeno",
      "pcode": "NG008017007"
    },
    {
      "name": "Kukawa",
      "pcode": "NG008017008"
    },
    {
      "name": "Yoyo",
      "pcode": "NG008017010"
    }
  ],
  "Kwaya Kusar": [
    {
      "name": "Bila Gusi",
      "pcode": "NG008018002"
    },
    {
      "name": "Guwal",
      "pcode": "NG008018003"
    },
    {
      "name": "Gwandi",
      "pcode": "NG008018001"
    },
    {
      "name": "Kubuku",
      "pcode": "NG008018004"
    },
    {
      "name": "Kurba Gayi",
      "pcode": "NG008018005"
    },
    {
      "name": "Kwaya Kusar",
      "pcode": "NG008018006"
    },
    {
      "name": "Peta",
      "pcode": "NG008018007"
    },
    {
      "name": "Wada",
      "pcode": "NG008018008"
    },
    {
      "name": "Wawa",
      "pcode": "NG008018009"
    },
    {
      "name": "Yimirdalang",
      "pcode": "NG008018010"
    }
  ],
  "Mafa": [
    {
      "name": "Ajiri",
      "pcode": "NG008019002"
    },
    {
      "name": "Gawa",
      "pcode": "NG008019003"
    },
    {
      "name": "Koshebe",
      "pcode": "NG008019004"
    },
    {
      "name": "Lege",
      "pcode": "NG008019005"
    },
    {
      "name": "Limanti",
      "pcode": "NG008019006"
    },
    {
      "name": "Loskuri",
      "pcode": "NG008019007"
    },
    {
      "name": "Ma'Afa",
      "pcode": "NG008019008"
    },
    {
      "name": "Mafa",
      "pcode": "NG008019009"
    },
    {
      "name": "Masu",
      "pcode": "NG008019010"
    },
    {
      "name": "Mujigine",
      "pcode": "NG008019011"
    },
    {
      "name": "Tamsu Ngamdua",
      "pcode": "NG008019012"
    },
    {
      "name": "Zangebe",
      "pcode": "NG008019001"
    }
  ],
  "Magumeri": [
    {
      "name": "Ardoram",
      "pcode": "NG008020001"
    },
    {
      "name": "Ayi Yasku",
      "pcode": "NG008020002"
    },
    {
      "name": "Borno Yesu",
      "pcode": "NG008020003"
    },
    {
      "name": "Furram",
      "pcode": "NG008020004"
    },
    {
      "name": "Gajigana",
      "pcode": "NG008020005"
    },
    {
      "name": "Hoyo Chingowa",
      "pcode": "NG008020007"
    },
    {
      "name": "Kalizoram",
      "pcode": "NG008020008"
    },
    {
      "name": "Kararam",
      "pcode": "NG008020009"
    },
    {
      "name": "Kupti",
      "pcode": "NG008020010"
    },
    {
      "name": "Magumeri",
      "pcode": "NG008020011"
    },
    {
      "name": "Ngamma",
      "pcode": "NG008020012"
    },
    {
      "name": "Ngubala Bamma",
      "pcode": "NG008020013"
    },
    {
      "name": "Titiwa",
      "pcode": "NG008020006"
    }
  ],
  "Maiduguri": [
    {
      "name": "Bolori I",
      "pcode": "NG008021001"
    },
    {
      "name": "Bolori II",
      "pcode": "NG008021002"
    },
    {
      "name": "Bulabulin",
      "pcode": "NG008021003"
    },
    {
      "name": "Fezzan",
      "pcode": "NG008021004"
    },
    {
      "name": "Gamboru",
      "pcode": "NG008021005"
    },
    {
      "name": "Gwange I",
      "pcode": "NG008021006"
    },
    {
      "name": "Gwange II",
      "pcode": "NG008021007"
    },
    {
      "name": "Gwange III",
      "pcode": "NG008021008"
    },
    {
      "name": "Hausari",
      "pcode": "NG008021009"
    },
    {
      "name": "Lamisula",
      "pcode": "NG008021010"
    },
    {
      "name": "Limanti",
      "pcode": "NG008021011"
    },
    {
      "name": "Mafoni",
      "pcode": "NG008021012"
    },
    {
      "name": "Maisandari",
      "pcode": "NG008021013"
    },
    {
      "name": "Shehuri North",
      "pcode": "NG008021014"
    },
    {
      "name": "Shehuri South",
      "pcode": "NG008021015"
    }
  ],
  "Marte": [
    {
      "name": "A Lawant",
      "pcode": "NG008022002"
    },
    {
      "name": "Ala",
      "pcode": "NG008022001"
    },
    {
      "name": "Badairi",
      "pcode": "NG008022011"
    },
    {
      "name": "Borsori",
      "pcode": "NG008022003"
    },
    {
      "name": "Gumna",
      "pcode": "NG008022004"
    },
    {
      "name": "Kabulawa",
      "pcode": "NG008022005"
    },
    {
      "name": "Kirenowa",
      "pcode": "NG008022006"
    },
    {
      "name": "Kulli",
      "pcode": "NG008022007"
    },
    {
      "name": "Marte",
      "pcode": "NG008022008"
    },
    {
      "name": "Musune",
      "pcode": "NG008022010"
    },
    {
      "name": "Muwalli",
      "pcode": "NG008022009"
    },
    {
      "name": "Njine",
      "pcode": "NG008022012"
    },
    {
      "name": "Zaga Ngalori",
      "pcode": "NG008022013"
    }
  ],
  "Mobbar": [
    {
      "name": "Asaga",
      "pcode": "NG008023001"
    },
    {
      "name": "Bogum",
      "pcode": "NG008023002"
    },
    {
      "name": "Chamba",
      "pcode": "NG008023003"
    },
    {
      "name": "Damasak",
      "pcode": "NG008023004"
    },
    {
      "name": "Duji",
      "pcode": "NG008023005"
    },
    {
      "name": "Gashigar",
      "pcode": "NG008023006"
    },
    {
      "name": "Kareto",
      "pcode": "NG008023007"
    },
    {
      "name": "Layi",
      "pcode": "NG008023008"
    },
    {
      "name": "Zari",
      "pcode": "NG008023010"
    },
    {
      "name": "Zulum Umarti",
      "pcode": "NG008023009"
    }
  ],
  "Monguno": [
    {
      "name": "Damakuli",
      "pcode": "NG008024001"
    },
    {
      "name": "Kaguram",
      "pcode": "NG008024002"
    },
    {
      "name": "Kumalia",
      "pcode": "NG008024003"
    },
    {
      "name": "Mandala",
      "pcode": "NG008024004"
    },
    {
      "name": "Mintar",
      "pcode": "NG008024005"
    },
    {
      "name": "Mofio",
      "pcode": "NG008024006"
    },
    {
      "name": "Monguno",
      "pcode": "NG008024007"
    },
    {
      "name": "Ngurno",
      "pcode": "NG008024008"
    },
    {
      "name": "Sure",
      "pcode": "NG008024009"
    },
    {
      "name": "Wulo",
      "pcode": "NG008024010"
    },
    {
      "name": "Yele",
      "pcode": "NG008024011"
    },
    {
      "name": "Zulum",
      "pcode": "NG008024012"
    }
  ],
  "Ngala": [
    {
      "name": "Fuye",
      "pcode": "NG008025001"
    },
    {
      "name": "Gamboru A",
      "pcode": "NG008025007"
    },
    {
      "name": "Gamboru B",
      "pcode": "NG008025002"
    },
    {
      "name": "Gamboru C",
      "pcode": "NG008025003"
    },
    {
      "name": "Logumane",
      "pcode": "NG008025004"
    },
    {
      "name": "Ndufu",
      "pcode": "NG008025005"
    },
    {
      "name": "Ngala",
      "pcode": "NG008025006"
    },
    {
      "name": "Shehuri",
      "pcode": "NG008025009"
    },
    {
      "name": "Warshele",
      "pcode": "NG008025010"
    },
    {
      "name": "Wulgo",
      "pcode": "NG008025011"
    }
  ],
  "Nganzai": [
    {
      "name": "Alarge",
      "pcode": "NG008026001"
    },
    {
      "name": "Badu",
      "pcode": "NG008026002"
    },
    {
      "name": "Damaram",
      "pcode": "NG008026003"
    },
    {
      "name": "Gadai",
      "pcode": "NG008026004"
    },
    {
      "name": "Gajiram",
      "pcode": "NG008026005"
    },
    {
      "name": "Jigalta",
      "pcode": "NG008026006"
    },
    {
      "name": "Kuda",
      "pcode": "NG008026007"
    },
    {
      "name": "Kurnawa",
      "pcode": "NG008026008"
    },
    {
      "name": "Maiwa",
      "pcode": "NG008026009"
    },
    {
      "name": "Miye",
      "pcode": "NG008026010"
    },
    {
      "name": "Sabsabuwa",
      "pcode": "NG008026011"
    },
    {
      "name": "Sugundare",
      "pcode": "NG008026012"
    }
  ],
  "Shani": [
    {
      "name": "Bargu",
      "pcode": "NG008027001"
    },
    {
      "name": "Buma",
      "pcode": "NG008027002"
    },
    {
      "name": "Gasi",
      "pcode": "NG008027003"
    },
    {
      "name": "Gora",
      "pcode": "NG008027004"
    },
    {
      "name": "Gwalasho",
      "pcode": "NG008027005"
    },
    {
      "name": "Gwaskara",
      "pcode": "NG008027006"
    },
    {
      "name": "Kombo",
      "pcode": "NG008027007"
    },
    {
      "name": "Kubo",
      "pcode": "NG008027008"
    },
    {
      "name": "Lakundum",
      "pcode": "NG008027009"
    },
    {
      "name": "Shani",
      "pcode": "NG008027010"
    },
    {
      "name": "Walama",
      "pcode": "NG008027011"
    }
  ],
  "Bade": [
    {
      "name": "Dagona",
      "pcode": "NG036001001"
    },
    {
      "name": "Dawayo",
      "pcode": "NG036001002"
    },
    {
      "name": "Gwio-Kura",
      "pcode": "NG036001003"
    },
    {
      "name": "Katuzu",
      "pcode": "NG036001004"
    },
    {
      "name": "Lawan Fannami",
      "pcode": "NG036001005"
    },
    {
      "name": "Lawan Musa",
      "pcode": "NG036001006"
    },
    {
      "name": "Sabon Gari",
      "pcode": "NG036001007"
    },
    {
      "name": "Sarkin Hausawa",
      "pcode": "NG036001008"
    },
    {
      "name": "Tsugum Tagali",
      "pcode": "NG036001009"
    },
    {
      "name": "Zango",
      "pcode": "NG036001010"
    }
  ],
  "Bursari": [
    {
      "name": "Bayamari",
      "pcode": "NG036002001"
    },
    {
      "name": "Danani",
      "pcode": "NG036002002"
    },
    {
      "name": "Dapchi",
      "pcode": "NG036002003"
    },
    {
      "name": "Guba Dapso",
      "pcode": "NG036002004"
    },
    {
      "name": "Guji Metalari",
      "pcode": "NG036002005"
    },
    {
      "name": "Jawa G Dole",
      "pcode": "NG036002006"
    },
    {
      "name": "Juluri Damnawa",
      "pcode": "NG036002007"
    },
    {
      "name": "Kaliyari",
      "pcode": "NG036002008"
    },
    {
      "name": "Kurnawa",
      "pcode": "NG036002009"
    },
    {
      "name": "Masaba",
      "pcode": "NG036002010"
    }
  ],
  "Damaturu": [
    {
      "name": "Bindigari Pawari",
      "pcode": "NG036003001"
    },
    {
      "name": "Damakasu",
      "pcode": "NG036003002"
    },
    {
      "name": "Damaturu Central",
      "pcode": "NG036003003"
    },
    {
      "name": "Gambir Moduri",
      "pcode": "NG036003004"
    },
    {
      "name": "Kalallawa Gabai",
      "pcode": "NG036003005"
    },
    {
      "name": "Kukareta Warsala",
      "pcode": "NG036003006"
    },
    {
      "name": "Maisandari Wi",
      "pcode": "NG036003007"
    },
    {
      "name": "Murfakalam",
      "pcode": "NG036003008"
    },
    {
      "name": "Nayinawa",
      "pcode": "NG036003009"
    },
    {
      "name": "Njiwaji Gwange",
      "pcode": "NG036003010"
    },
    {
      "name": "Sasawa Kabaru",
      "pcode": "NG036003011"
    }
  ],
  "Fika": [
    {
      "name": "Fika Anze",
      "pcode": "NG036004001"
    },
    {
      "name": "Gadaka",
      "pcode": "NG036004002"
    },
    {
      "name": "Garu",
      "pcode": "NG036004003"
    },
    {
      "name": "Gudi Dozi",
      "pcode": "NG036004004"
    },
    {
      "name": "Janga",
      "pcode": "NG036004005"
    },
    {
      "name": "Mubi Fussami",
      "pcode": "NG036004006"
    },
    {
      "name": "Ngalda",
      "pcode": "NG036004007"
    },
    {
      "name": "Shoye",
      "pcode": "NG036004008"
    },
    {
      "name": "Turmi Malori",
      "pcode": "NG036004009"
    },
    {
      "name": "Zangaya Mazawaun",
      "pcode": "NG036004010"
    }
  ],
  "Fune": [
    {
      "name": "Alagarno",
      "pcode": "NG036005001"
    },
    {
      "name": "Borno Kiji",
      "pcode": "NG036005002"
    },
    {
      "name": "Damagum A",
      "pcode": "NG036005003"
    },
    {
      "name": "Damagum B",
      "pcode": "NG036005004"
    },
    {
      "name": "Daura A",
      "pcode": "NG036005005"
    },
    {
      "name": "Daura B",
      "pcode": "NG036005006"
    },
    {
      "name": "Jajere",
      "pcode": "NG036005007"
    },
    {
      "name": "Kayeri",
      "pcode": "NG036005008"
    },
    {
      "name": "Kollere Kafaje",
      "pcode": "NG036005009"
    },
    {
      "name": "Marmari Gudugurka",
      "pcode": "NG036005010"
    },
    {
      "name": "Mashio",
      "pcode": "NG036005011"
    },
    {
      "name": "Ngelzarma A",
      "pcode": "NG036005012"
    },
    {
      "name": "Ngelzarma B",
      "pcode": "NG036005013"
    }
  ],
  "Geidam": [
    {
      "name": "Asheikri 1",
      "pcode": "NG036006001"
    },
    {
      "name": "Asheikri 2",
      "pcode": "NG036006002"
    },
    {
      "name": "Balle",
      "pcode": "NG036006003"
    },
    {
      "name": "Borko",
      "pcode": "NG036006004"
    },
    {
      "name": "Fukurti",
      "pcode": "NG036006005"
    },
    {
      "name": "Futchimiram",
      "pcode": "NG036006006"
    },
    {
      "name": "Gumsa",
      "pcode": "NG036006007"
    },
    {
      "name": "Hausari",
      "pcode": "NG036006008"
    },
    {
      "name": "Jororo",
      "pcode": "NG036006009"
    },
    {
      "name": "Kusur",
      "pcode": "NG036006010"
    },
    {
      "name": "Ma'Anna",
      "pcode": "NG036006011"
    }
  ],
  "Gujba": [
    {
      "name": "Buni Gari",
      "pcode": "NG036007001"
    },
    {
      "name": "Buni Yadi",
      "pcode": "NG036007002"
    },
    {
      "name": "Dadingel",
      "pcode": "NG036007003"
    },
    {
      "name": "Goniri",
      "pcode": "NG036007004"
    },
    {
      "name": "Gotala",
      "pcode": "NG036007005"
    },
    {
      "name": "Gujba",
      "pcode": "NG036007006"
    },
    {
      "name": "Mandunari",
      "pcode": "NG036007007"
    },
    {
      "name": "Mutai",
      "pcode": "NG036007008"
    },
    {
      "name": "Ngurbuwa",
      "pcode": "NG036007009"
    },
    {
      "name": "Wagir",
      "pcode": "NG036007010"
    }
  ],
  "Gulani": [
    {
      "name": "Bara",
      "pcode": "NG036008001"
    },
    {
      "name": "Bularafa",
      "pcode": "NG036008002"
    },
    {
      "name": "Bumsa",
      "pcode": "NG036008003"
    },
    {
      "name": "Dokshi",
      "pcode": "NG036008004"
    },
    {
      "name": "Gabai",
      "pcode": "NG036008005"
    },
    {
      "name": "Gagure",
      "pcode": "NG036008006"
    },
    {
      "name": "Garin Tuwo",
      "pcode": "NG036008007"
    },
    {
      "name": "Gulani",
      "pcode": "NG036008008"
    },
    {
      "name": "Kushimaga",
      "pcode": "NG036008009"
    },
    {
      "name": "Njibulwa",
      "pcode": "NG036008010"
    },
    {
      "name": "Ruhu",
      "pcode": "NG036008011"
    },
    {
      "name": "Teteba",
      "pcode": "NG036008012"
    }
  ],
  "Jakusko": [
    {
      "name": "Buduwa",
      "pcode": "NG036009001"
    },
    {
      "name": "Dumbari",
      "pcode": "NG036009002"
    },
    {
      "name": "Gidgid Bayam",
      "pcode": "NG036009003"
    },
    {
      "name": "Gorgoram",
      "pcode": "NG036009004"
    },
    {
      "name": "Jaba",
      "pcode": "NG036009005"
    },
    {
      "name": "Jakusko",
      "pcode": "NG036009006"
    },
    {
      "name": "Jawur Katamma",
      "pcode": "NG036009007"
    },
    {
      "name": "Lafiya Loi Loi",
      "pcode": "NG036009008"
    },
    {
      "name": "Muguram",
      "pcode": "NG036009009"
    },
    {
      "name": "Zabudum Dachia",
      "pcode": "NG036009010"
    }
  ],
  "Karasuwa": [
    {
      "name": "Bukarti",
      "pcode": "NG036010001"
    },
    {
      "name": "Fajiganari",
      "pcode": "NG036010002"
    },
    {
      "name": "Garin Gawo",
      "pcode": "NG036010003"
    },
    {
      "name": "Gasma",
      "pcode": "NG036010004"
    },
    {
      "name": "Jajeri",
      "pcode": "NG036010005"
    },
    {
      "name": "Jaji Maji",
      "pcode": "NG036010006"
    },
    {
      "name": "Karasuwa Galu",
      "pcode": "NG036010007"
    },
    {
      "name": "Karauswa Garu Guna",
      "pcode": "NG036010008"
    },
    {
      "name": "Wachakal",
      "pcode": "NG036010009"
    },
    {
      "name": "Waro",
      "pcode": "NG036010010"
    }
  ],
  "Machina": [
    {
      "name": "Bogo",
      "pcode": "NG036011001"
    },
    {
      "name": "Damai",
      "pcode": "NG036011002"
    },
    {
      "name": "Dole",
      "pcode": "NG036011003"
    },
    {
      "name": "Falimaram",
      "pcode": "NG036011004"
    },
    {
      "name": "Konkomma",
      "pcode": "NG036011005"
    },
    {
      "name": "Kukayasku",
      "pcode": "NG036011006"
    },
    {
      "name": "Lamisu",
      "pcode": "NG036011007"
    },
    {
      "name": "Machina",
      "pcode": "NG036011008"
    },
    {
      "name": "Maskandare",
      "pcode": "NG036011009"
    },
    {
      "name": "Taganama",
      "pcode": "NG036011010"
    }
  ],
  "Nangere": [
    {
      "name": "Chilariye",
      "pcode": "NG036012001"
    },
    {
      "name": "Chukuriya",
      "pcode": "NG036012002"
    },
    {
      "name": "Dawasa",
      "pcode": "NG036012003"
    },
    {
      "name": "Dazigau",
      "pcode": "NG036012004"
    },
    {
      "name": "Degubi",
      "pcode": "NG036012005"
    },
    {
      "name": "Dudduye",
      "pcode": "NG036012006"
    },
    {
      "name": "Kukuri",
      "pcode": "NG036012007"
    },
    {
      "name": "Langawa Darin",
      "pcode": "NG036012008"
    },
    {
      "name": "Nangere",
      "pcode": "NG036012009"
    },
    {
      "name": "Tikau",
      "pcode": "NG036012010"
    },
    {
      "name": "Watinani",
      "pcode": "NG036012011"
    }
  ],
  "Nguru": [
    {
      "name": "Afunori",
      "pcode": "NG036013001"
    },
    {
      "name": "Bulabulin",
      "pcode": "NG036013002"
    },
    {
      "name": "Bulanguwa",
      "pcode": "NG036013003"
    },
    {
      "name": "Dabule",
      "pcode": "NG036013004"
    },
    {
      "name": "Dumsai",
      "pcode": "NG036013005"
    },
    {
      "name": "Hausari",
      "pcode": "NG036013006"
    },
    {
      "name": "Kanuri",
      "pcode": "NG036013007"
    },
    {
      "name": "Maja Kura",
      "pcode": "NG036013008"
    },
    {
      "name": "Ngarbi",
      "pcode": "NG036013009"
    },
    {
      "name": "Nglaiwa",
      "pcode": "NG036013010"
    }
  ],
  "Potiskum": [
    {
      "name": "Bare Bari",
      "pcode": "NG036014001"
    },
    {
      "name": "Bolewa A",
      "pcode": "NG036014002"
    },
    {
      "name": "Bolewa B",
      "pcode": "NG036014003"
    },
    {
      "name": "Danchuwa",
      "pcode": "NG036014004"
    },
    {
      "name": "Dogo Tebo",
      "pcode": "NG036014005"
    },
    {
      "name": "Dogon Nini",
      "pcode": "NG036014006"
    },
    {
      "name": "Hausawa Asibiti",
      "pcode": "NG036014007"
    },
    {
      "name": "Mamudo",
      "pcode": "NG036014008"
    },
    {
      "name": "Ngojin",
      "pcode": "NG036014009"
    },
    {
      "name": "Yerimaram",
      "pcode": "NG036014010"
    }
  ],
  "Tarmua": [
    {
      "name": "Babangida",
      "pcode": "NG036015001"
    },
    {
      "name": "Biriri",
      "pcode": "NG036015002"
    },
    {
      "name": "Goduram",
      "pcode": "NG036015003"
    },
    {
      "name": "Jumbam",
      "pcode": "NG036015004"
    },
    {
      "name": "Koriyel",
      "pcode": "NG036015005"
    },
    {
      "name": "Lantaiwa",
      "pcode": "NG036015006"
    },
    {
      "name": "Mafa",
      "pcode": "NG036015007"
    },
    {
      "name": "Manda Da'A",
      "pcode": "NG036015008"
    },
    {
      "name": "Shekau",
      "pcode": "NG036015009"
    },
    {
      "name": "Sungul Koka",
      "pcode": "NG036015010"
    }
  ],
  "Yunusari": [
    {
      "name": "Bultuwa",
      "pcode": "NG036016001"
    },
    {
      "name": "Degaltura",
      "pcode": "NG036016002"
    },
    {
      "name": "Dekwa",
      "pcode": "NG036016003"
    },
    {
      "name": "Dilala",
      "pcode": "NG036016004"
    },
    {
      "name": "Kafiya",
      "pcode": "NG036016005"
    },
    {
      "name": "Mairari",
      "pcode": "NG036016006"
    },
    {
      "name": "Mozogun",
      "pcode": "NG036016007"
    },
    {
      "name": "Toshia",
      "pcode": "NG036016008"
    },
    {
      "name": "Yunusari",
      "pcode": "NG036016009"
    },
    {
      "name": "Zabudum Dachia",
      "pcode": "NG036016010"
    }
  ],
  "Yusufari": [
    {
      "name": "Bulatura",
      "pcode": "NG036017001"
    },
    {
      "name": "Gumshi",
      "pcode": "NG036017002"
    },
    {
      "name": "Guya",
      "pcode": "NG036017003"
    },
    {
      "name": "Jebuwa",
      "pcode": "NG036017004"
    },
    {
      "name": "Kumagannam",
      "pcode": "NG036017005"
    },
    {
      "name": "Maimalari",
      "pcode": "NG036017006"
    },
    {
      "name": "Mayori",
      "pcode": "NG036017007"
    },
    {
      "name": "Sumbar",
      "pcode": "NG036017008"
    },
    {
      "name": "Tulotulo",
      "pcode": "NG036017009"
    },
    {
      "name": "Yusufari",
      "pcode": "NG036017010"
    }
  ]
};

export const WASH_5W_ACTIVITIES_BY_DOMAIN: Record<string, string[]> = {
  "Water": [
    "Borehole Construction",
    "Borehole upgrade",
    "Borehole Rehabilitation",
    "Reticulation Construction",
    "Reticulation Rehabilitation",
    "Water System - O & M",
    "WASHCOMs - Capacity building - Equipments ",
    "WASHCOMs - Capacity building - Trainings",
    "Water treatment chemicals (HH)",
    "Chlorination - Water supply system",
    "Water Trucking",
    "CVA"
  ],
  "Sanitation": [
    "Installation of Hand Washing Station",
    "Latrine - O & M",
    "Latrine construction - Emergency",
    "Latrine construction - Institutional",
    "Latrine Construction (HH)",
    "Latrine construction - Communal",
    "Latrine desludgin",
    "Latrine Rehabilitation   Emergency",
    "Latrine Rehabilitation - Institutional ",
    "Latrine Rehabilitation - Communal",
    "Sanitation  Kits Distribution",
    "Shower - O & M",
    "Shower construction - Emergency",
    "Shower Rehabilitation   Emergency",
    "Shower Rehabilitation - Communal",
    "Shower construction - Communal",
    "Drainage canal cleaning",
    "CVA"
  ],
  "Hygiene": [
    "WASH & Dignity Kits (Hygiene Kits)",
    "Replenishment Kit",
    "MHM Kits",
    "Hygiene Kits",
    "Cholera Kit provision",
    "Hygiene promotions -Host community",
    "Hygiene promotions - IDP sites",
    "Hygiene promotions - institutions",
    "Post Distribution Monitoring",
    "CVA"
  ]
};

export const WASH_5W_ACTIVITY_DETAILS: Record<string, Wash5WActivityDetail> = {
  "Water|||Borehole Construction": {
    "indicator": "Number of affected people have safe and equitable access to a sufficient quantity of water for domestic needs, as per the sector's standards.",
    "unit": "Boreholes"
  },
  "Water|||Borehole upgrade": {
    "indicator": "Number of affected people have safe and equitable access to a sufficient quantity of water for domestic needs, as per the sector's standards.",
    "unit": "Boreholes"
  },
  "Water|||Borehole Rehabilitation": {
    "indicator": "Number of affected people have safe and equitable access to a sufficient quantity of water for domestic needs, as per the sector's standards.",
    "unit": "Boreholes"
  },
  "Water|||Reticulation Construction": {
    "indicator": "Number of affected people have safe and equitable access to a sufficient quantity of water for domestic needs, as per the sector's standards.",
    "unit": "Boreholes"
  },
  "Water|||Reticulation Rehabilitation": {
    "indicator": "Number of affected people have safe and equitable access to a sufficient quantity of water for domestic needs, as per the sector's standards.",
    "unit": "Boreholes"
  },
  "Water|||Water System - O & M": {
    "indicator": "Number of affected people have water systems functionality supported by sustained operation and maintenance services.",
    "unit": "Water System"
  },
  "Water|||WASHCOMs - Capacity building - Equipments ": {
    "indicator": "Number of affected people have water systems functionality supported by sustained operation and maintenance services.",
    "unit": "WASHCOM Equipped"
  },
  "Water|||WASHCOMs - Capacity building - Trainings": {
    "indicator": "Number of affected people have water systems functionality supported by sustained operation and maintenance services.",
    "unit": "WASHCOM Trained"
  },
  "Water|||Water treatment chemicals (HH)": {
    "indicator": "Number of affected people have safe and equitable access to a sufficient quantity of water for domestic needs, as per the sector's standards.",
    "unit": "People Reached"
  },
  "Water|||Chlorination - Water supply system": {
    "indicator": "Number of affected people have safe and equitable access to a sufficient quantity of water for domestic needs, as per the sector's standards.",
    "unit": "Water System"
  },
  "Water|||Water Trucking": {
    "indicator": "Number of people having access to emergency safe water facilities and services as per sector's standards",
    "unit": "litres trucked"
  },
  "Water|||CVA": {
    "indicator": "Number of Households receiving cash transfers and or vouchers to meet their WASH needs including top-ups",
    "unit": "People Reached"
  },
  "Sanitation|||Installation of Hand Washing Station": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "Handwashing stations installed"
  },
  "Sanitation|||Latrine - O & M": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "Latrines"
  },
  "Sanitation|||Latrine construction - Emergency": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "Latrines"
  },
  "Sanitation|||Latrine construction - Institutional": {
    "indicator": "Number of Health Care Facilities, Nutritional Centers, temporary learning centers (TLC), Child Friendly Spaces (CFS), schools and other relevant public places assisted with appropriate emergency WASH facilities supporting affected children.",
    "unit": "Latrines"
  },
  "Sanitation|||Latrine Construction (HH)": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "Latrines"
  },
  "Sanitation|||Latrine construction - Communal": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "Latrines"
  },
  "Sanitation|||Latrine desludgin": {
    "indicator": "Number of people benefiting from sustained desludging and cleaning of their latrines as per sector's standard",
    "unit": "Latrines"
  },
  "Sanitation|||Latrine Rehabilitation   Emergency": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "Latrines"
  },
  "Sanitation|||Latrine Rehabilitation - Institutional ": {
    "indicator": "Number of Health Care Facilities, Nutritional Centers, temporary learning centers (TLC), Child Friendly Spaces (CFS), schools and other relevant public places assisted with appropriate emergency WASH facilities supporting affected children.",
    "unit": "Latrines"
  },
  "Sanitation|||Latrine Rehabilitation - Communal": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "Latrines"
  },
  "Sanitation|||Sanitation  Kits Distribution": {
    "indicator": "Number of IDPs in camps having access to sustained solid waste management services",
    "unit": "Kits"
  },
  "Sanitation|||Shower - O & M": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "showers"
  },
  "Sanitation|||Shower construction - Emergency": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "showers"
  },
  "Sanitation|||Shower Rehabilitation   Emergency": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "showers"
  },
  "Sanitation|||Shower Rehabilitation - Communal": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "showers"
  },
  "Sanitation|||Shower construction - Communal": {
    "indicator": "Number of affected people have safe and dignified access to improved sanitation facilities, as per the sector's standard.",
    "unit": "showers"
  },
  "Sanitation|||Drainage canal cleaning": {
    "indicator": "Number of IDPs in camps having access to sustained solid waste management services",
    "unit": "Communities"
  },
  "Sanitation|||CVA": {
    "indicator": "Number of Households receiving cash transfers and or vouchers to meet their WASH needs including top-ups",
    "unit": "People Reached"
  },
  "Hygiene|||WASH & Dignity Kits (Hygiene Kits)": {
    "indicator": "Number of people assisted with WASH NFIs (hygiene kits, replenishment hygiene kits, WASH cholera kits, WASH Nutrition kits, sanitation kits and MHM kits).",
    "unit": "Kits"
  },
  "Hygiene|||Replenishment Kit": {
    "indicator": "Number of people assisted with WASH NFIs (hygiene kits, replenishment hygiene kits, WASH cholera kits, WASH Nutrition kits, sanitation kits and MHM kits).",
    "unit": "Kits"
  },
  "Hygiene|||MHM Kits": {
    "indicator": "Number of people assisted with WASH NFIs (hygiene kits, replenishment hygiene kits, WASH cholera kits, WASH Nutrition kits, sanitation kits and MHM kits).",
    "unit": "Kits"
  },
  "Hygiene|||Hygiene Kits": {
    "indicator": "Number of people assisted with WASH NFIs (hygiene kits, replenishment hygiene kits, WASH cholera kits, WASH Nutrition kits, sanitation kits and MHM kits).",
    "unit": "Kits"
  },
  "Hygiene|||Cholera Kit provision": {
    "indicator": "Number of people assisted with WASH NFIs (hygiene kits, replenishment hygiene kits, WASH cholera kits, WASH Nutrition kits, sanitation kits and MHM kits).",
    "unit": "Kits"
  },
  "Hygiene|||Hygiene promotions -Host community": {
    "indicator": "Number of affected people benefit from community tailored gender and age-sensitive hygiene messages aiming at hygienic behavior and practices as per the sector's standards.",
    "unit": "People Reached"
  },
  "Hygiene|||Hygiene promotions - IDP sites": {
    "indicator": "Number of affected people benefit from community tailored gender and age-sensitive hygiene messages aiming at hygienic behavior and practices as per the sector's standards.",
    "unit": "People Reached"
  },
  "Hygiene|||Hygiene promotions - institutions": {
    "indicator": "Number of affected people benefit from community tailored gender and age-sensitive hygiene messages aiming at hygienic behavior and practices as per the sector's standards.",
    "unit": "People Reached"
  },
  "Hygiene|||Post Distribution Monitoring": {
    "indicator": "Number of people assisted with WASH NFIs (hygiene kits, replenishment hygiene kits, WASH cholera kits, WASH Nutrition kits, sanitation kits and MHM kits).",
    "unit": "Household survey"
  },
  "Hygiene|||CVA": {
    "indicator": "Number of Households receiving cash transfers and or vouchers to meet their WASH needs including top-ups",
    "unit": "People Reached"
  }
};

export const WASH_5W_ORGS: Wash5WOrg[] = [
  {
    "name": "Action Against Hunger",
    "acronym": "AAH"
  },
  {
    "name": "Adamawa Rural Water Supply And Sanitation Agency",
    "acronym": "ADRUWASSA"
  },
  {
    "name": "Aduba Relief Care Foundation",
    "acronym": "ARCF"
  },
  {
    "name": "Advocacy For Resilience And Innovative Solutions For The Youths, Women, And Children Empowerment",
    "acronym": "ARISE"
  },
  {
    "name": "AfriYouth Mindset for Innovation and Entrepreneurship Development Initiative",
    "acronym": "AfriYouth MIEDI"
  },
  {
    "name": "Alheri Peace Building and Empowerment Foundation",
    "acronym": "APBEF"
  },
  {
    "name": "Almagda Community Development Initiative",
    "acronym": "ACDI"
  },
  {
    "name": "Anchor for Life Support and Resilience",
    "acronym": "ALSAR"
  },
  {
    "name": "ASA Health Partners Consulting",
    "acronym": "AHPC"
  },
  {
    "name": "Ayuba Alamson Foundation",
    "acronym": "AAF"
  },
  {
    "name": "Bedada Care Foundation",
    "acronym": "BECFO"
  },
  {
    "name": "Bela Community Development Initiative",
    "acronym": "BELA-CODE"
  },
  {
    "name": "Belgra Care Foundation",
    "acronym": "BCF"
  },
  {
    "name": "Blues Charity Aid Foundation Namur",
    "acronym": "BCAFN"
  },
  {
    "name": "Boaid Humanitarian Foundation",
    "acronym": "BOAID"
  },
  {
    "name": "Borno Rural Water Supply And Sanitation Agency",
    "acronym": "BoRUWASSA"
  },
  {
    "name": "Brandlife vision foundation",
    "acronym": "BLVF"
  },
  {
    "name": "Care Best Initiative Cbi",
    "acronym": "CBI"
  },
  {
    "name": "Care First Community Initiative",
    "acronym": "CFCI"
  },
  {
    "name": "Care Ways Initiative For Youth And Women Support Development",
    "acronym": "CAREWI"
  },
  {
    "name": "Catholic Caritas Foundation Of Nigeria",
    "acronym": "CCFN"
  },
  {
    "name": "Catholic Relief Service",
    "acronym": "CRS"
  },
  {
    "name": "Cedar Foundation For Disability",
    "acronym": "CEDAR"
  },
  {
    "name": "Center for Advocacy, Resilience and Empowerment",
    "acronym": "CARE Initiative"
  },
  {
    "name": "Center For Advocacy, Transparency, And Accountability Initiative",
    "acronym": "CATAI"
  },
  {
    "name": "Center for child care and human development",
    "acronym": "C3HD"
  },
  {
    "name": "Child Protection And Women Empowerment Initiative -Cpwei",
    "acronym": "CPWEI"
  },
  {
    "name": "Child protection and women empowerment initiative.",
    "acronym": "CPWEI"
  },
  {
    "name": "Christian Aid",
    "acronym": "CAID"
  },
  {
    "name": "Christian Rural And Urban Development Association Of Nigeria Crudan",
    "acronym": "CRUDAN"
  },
  {
    "name": "Civil Soceity Fr Poverty Eradication",
    "acronym": "CISCOPE"
  },
  {
    "name": "Communal Support Foundation of Nigeria",
    "acronym": "COSFON"
  },
  {
    "name": "Community Engagement and Social Development Initiative",
    "acronym": "CESDI"
  },
  {
    "name": "Concern For Women And Children Development Foundation",
    "acronym": "COWACDI"
  },
  {
    "name": "Concern On Climate Change For The Community Initiative",
    "acronym": "FOURCi"
  },
  {
    "name": "Create A Wonderful World Initiative",
    "acronym": "CWI"
  },
  {
    "name": "Danish Refugee Council",
    "acronym": "DRC"
  },
  {
    "name": "Danuwa Empowerment Foundation",
    "acronym": "DEF"
  },
  {
    "name": "Daurama Foundation",
    "acronym": "DF"
  },
  {
    "name": "Delight Affection Foundation",
    "acronym": "DAF"
  },
  {
    "name": "Dorcas Sisters Foundation",
    "acronym": "DSF"
  },
  {
    "name": "Elela-Care Humanitarian And Development Organization",
    "acronym": "ECM"
  },
  {
    "name": "El-Ezhar Care Initiative",
    "acronym": "ECI"
  },
  {
    "name": "Enrich Girl Child Of Their Right Initiative",
    "acronym": "EGCI"
  },
  {
    "name": "Eremale Foundation",
    "acronym": "EF"
  },
  {
    "name": "FHI360",
    "acronym": "FHI360"
  },
  {
    "name": "First Step Action For Children Initiative (Fsaci",
    "acronym": "FSACI"
  },
  {
    "name": "Foundation for Climate Action and Sustainable Development",
    "acronym": "F-CASD"
  },
  {
    "name": "Foundation For Empowerment And Support For Youth And Displaced Persons",
    "acronym": "FESYD-P"
  },
  {
    "name": "Future Resilience And Development Foundation",
    "acronym": "FRAD"
  },
  {
    "name": "Garkuwa Youth Initiative for Development",
    "acronym": "G-YID"
  },
  {
    "name": "Gender Equality and Empowerment of Women and Children Initiative",
    "acronym": "GEEWCI"
  },
  {
    "name": "Gender Equality Peace And Development Centre",
    "acronym": "GEPaDC"
  },
  {
    "name": "Gibran Books And Values Society Of Nigeria",
    "acronym": "GBVS"
  },
  {
    "name": "Global Grassroots Succour Initiative",
    "acronym": "GGSI"
  },
  {
    "name": "Global peace Development",
    "acronym": "GPD"
  },
  {
    "name": "Global Village Healthcare Initiative For Africa",
    "acronym": "GHIV Africa"
  },
  {
    "name": "Goalprime Organization Nigeria",
    "acronym": "GPON"
  },
  {
    "name": "Godiyah Cherished Care for Humanitarian Response Initiative",
    "acronym": "GCCHRI"
  },
  {
    "name": "Grassroot Initiative For Strengthening Community Resilience",
    "acronym": "GISCOR"
  },
  {
    "name": "Grassroot Lifesaving Outreach",
    "acronym": "LESGO"
  },
  {
    "name": "Green Concern For Development",
    "acronym": "GREENCODE"
  },
  {
    "name": "Green Generation Initiative",
    "acronym": "GGi"
  },
  {
    "name": "Green Water Analyte And Ecological Development.",
    "acronym": "GWAED"
  },
  {
    "name": "Grow Strong Foundation",
    "acronym": "GSF"
  },
  {
    "name": "Hand-in-Hand Empowerment Initiative",
    "acronym": "HiH"
  },
  {
    "name": "Heed The Child Initiative",
    "acronym": "HCI"
  },
  {
    "name": "Hope 360 Initiative for Peace",
    "acronym": "HOPE360"
  },
  {
    "name": "Hope for Street Children and Vulnerable People Foundation",
    "acronym": "HOPLE"
  },
  {
    "name": "HopeAid Humanitarian Foundation",
    "acronym": "HHF"
  },
  {
    "name": "Hopeful Women Initiative",
    "acronym": "HWI"
  },
  {
    "name": "Idaniya Women and Girl Child Initiative",
    "acronym": "IWaGI"
  },
  {
    "name": "International Medical Corps",
    "acronym": "IMC"
  },
  {
    "name": "International Organization For Migration",
    "acronym": "IOM"
  },
  {
    "name": "International Rescue Commitee",
    "acronym": "IRC"
  },
  {
    "name": "INTERSOS",
    "acronym": "INTERSOS"
  },
  {
    "name": "Jami Al Hakeem Foundation",
    "acronym": "JHF"
  },
  {
    "name": "Jen Initiative For Integrity And Development",
    "acronym": "JIID"
  },
  {
    "name": "Jidda Community Care Foundation",
    "acronym": "JC2F"
  },
  {
    "name": "Jireh Doo Foundation",
    "acronym": "JDF"
  },
  {
    "name": "Justice Development And Peace Commission Maiduguri",
    "acronym": "JDPC"
  },
  {
    "name": "Kumbal Support Initiative",
    "acronym": "KSi"
  },
  {
    "name": "Lake Chad Peace And Development Initiative",
    "acronym": "LCPD"
  },
  {
    "name": "Life At Best Development Initiative",
    "acronym": "LABDI"
  },
  {
    "name": "Life Helpers Initiative",
    "acronym": "LHI"
  },
  {
    "name": "Lindii Peace Foundation",
    "acronym": "LPF"
  },
  {
    "name": "Malteser International",
    "acronym": "MAL"
  },
  {
    "name": "Media Communication For Health And Development Initiative",
    "acronym": "MECOMHEDI"
  },
  {
    "name": "Mercy Corps",
    "acronym": "MERCYCORPS"
  },
  {
    "name": "Monclub International",
    "acronym": "MCI"
  },
  {
    "name": "Multi Aid And Charity Initiaitive",
    "acronym": "MACI"
  },
  {
    "name": "Murmushi People's Development Foundation",
    "acronym": "MPDF"
  },
  {
    "name": "New Foundation For Displaced Person'S",
    "acronym": "NFDP"
  },
  {
    "name": "Nkafamiya Rescue Mission",
    "acronym": "NRM"
  },
  {
    "name": "North East Youth Initiative For Development",
    "acronym": "NEYIF"
  },
  {
    "name": "Norwegian Church Aid",
    "acronym": "NCA"
  },
  {
    "name": "Norwegian Refugee Council",
    "acronym": "NRC"
  },
  {
    "name": "Novel Alliance For Development Aid",
    "acronym": "NADA"
  },
  {
    "name": "OXFAM",
    "acronym": "OXFAM"
  },
  {
    "name": "Peacebuilding And Livelihood Restoration Initiative",
    "acronym": "PALRI"
  },
  {
    "name": "Portrait of lake child initiative",
    "acronym": "PLCI"
  },
  {
    "name": "Pride Initaitives",
    "acronym": "PRIDE"
  },
  {
    "name": "Rapid Action Aid Initiative",
    "acronym": "RAAI"
  },
  {
    "name": "Rays Of Change Development Initiative",
    "acronym": "RCDI"
  },
  {
    "name": "Reawakening And Development Initiative",
    "acronym": "RADI"
  },
  {
    "name": "Rehabilitation Empowerment And Better Health Initiative",
    "acronym": "REBHI"
  },
  {
    "name": "Relief For Community Outreach & Development",
    "acronym": "RECOD"
  },
  {
    "name": "Rising Hope Initiative for Sustainable Development",
    "acronym": "RHISD"
  },
  {
    "name": "Roadmap For Women And Youth Development",
    "acronym": "RAWYOD"
  },
  {
    "name": "Sahei Gender Development Initiative",
    "acronym": "SGDi"
  },
  {
    "name": "Save The Children International",
    "acronym": "SCI"
  },
  {
    "name": "Save The Slum Initiative",
    "acronym": "STSI"
  },
  {
    "name": "Secours Islamique France",
    "acronym": "SIF"
  },
  {
    "name": "Sirri Care Foundation",
    "acronym": "SIRRI CARE"
  },
  {
    "name": "Solidarites International",
    "acronym": "SI"
  },
  {
    "name": "Sorasun Foundation",
    "acronym": "SRF"
  },
  {
    "name": "SOS Children’s Villages Nigeria",
    "acronym": "SOSCVN"
  },
  {
    "name": "Speed Relief Humanitarian Organization",
    "acronym": "SRHO"
  },
  {
    "name": "Superior Life And Care Initiative",
    "acronym": "SLACI"
  },
  {
    "name": "Taimako Community Development Initiative",
    "acronym": "TCDI"
  },
  {
    "name": "Tallafi Initiative For Child And Women Development",
    "acronym": "TIWOD"
  },
  {
    "name": "Terre Des Hommes",
    "acronym": "TDH"
  },
  {
    "name": "The Big Smile Foundation",
    "acronym": "TBSF"
  },
  {
    "name": "The Mentor Initiative",
    "acronym": "TMI"
  },
  {
    "name": "Thlama Peace Foundation",
    "acronym": "TPF"
  },
  {
    "name": "Transcultural Psychosocial organization",
    "acronym": "TPO"
  },
  {
    "name": "Turum Aid Initiative",
    "acronym": "TAI"
  },
  {
    "name": "Uam Foundation",
    "acronym": "UAMF"
  },
  {
    "name": "UNICEF",
    "acronym": "UNICEF"
  },
  {
    "name": "Unified Culture Promotion Foundation",
    "acronym": "UNICPF"
  },
  {
    "name": "Valfasam Care Initiative",
    "acronym": "VCI"
  },
  {
    "name": "Vision for Inclusive Solutions and Transparency Initiative",
    "acronym": "VISTA Initiative"
  },
  {
    "name": "Voice of Women in Nigeria Leadership Initiative",
    "acronym": "VOWNLI"
  },
  {
    "name": "Water Supply And Sanitation Initiative",
    "acronym": "WASSI"
  },
  {
    "name": "Yasmeen Life Foundation",
    "acronym": "YLF"
  },
  {
    "name": "Yerwa Empowerment Foundation",
    "acronym": "YEF"
  },
  {
    "name": "Yobe Rural Water Supply And Sanitation Agency",
    "acronym": "YoRUWASSA"
  },
  {
    "name": "Young Prodigy Hunamitarian Organization",
    "acronym": "YPHO"
  },
  {
    "name": "Youth Integrated For Positive Development Initiative",
    "acronym": "YIPDI"
  },
  {
    "name": "Zai Development Foundation",
    "acronym": "ZDF"
  },
  {
    "name": "ZOA",
    "acronym": "ZOA"
  }
];

export function cleanIndicator(text: string): string {
  if (!text) return "";
  return text.replace(/^\s*indicator\s*\d+\s*:\s*/i, "").trim();
}

export function cleanUnit(text: string): string {
  if (!text) return "";
  return text.replace(/^\s*#\s*of\s+/i, "").trim();
}

export function getStatePcode(stateName: string): string {
  const found = WASH_5W_STATES.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  return found ? found.pcode : "";
}

export function getLgaPcode(stateName: string, lgaName: string): string {
  const lgas = WASH_5W_LGAS_BY_STATE[stateName] || [];
  const found = lgas.find(l => l.name.toLowerCase() === lgaName.toLowerCase());
  return found ? found.pcode : "";
}

export function getWardPcode(lgaName: string, wardName: string): string {
  const wards = WASH_5W_WARDS_BY_LGA[lgaName] || [];
  const found = wards.find(w => w.name.toLowerCase() === wardName.toLowerCase());
  return found ? found.pcode : "";
}
