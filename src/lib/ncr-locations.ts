// Metro Manila (NCR) cities/municipalities and their barangays, used to
// scope delivery to NCR only. Compiled from general knowledge — Manila,
// Pasay, and Caloocan officially use plain numbered barangays, generated
// below rather than hand-listed. The named lists for the other cities are
// a best effort; Quezon City's especially (142 barangays) is worth a spot
// check against the official PSA/PSGC list if anything looks off.

function numbered(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Barangay ${i + 1}`);
}

export const NCR_BARANGAYS: Record<string, string[]> = {
  Caloocan: numbered(188),
  "Las Piñas": [
    "Almanza Uno", "Almanza Dos", "B.F. International Village", "Daniel Fajardo",
    "Elias Aldana", "Ilaya", "Manuyo Uno", "Manuyo Dos", "Pamplona Uno",
    "Pamplona Dos", "Pamplona Tres", "Pilar", "Pulang Lupa Uno", "Pulang Lupa Dos",
    "Talon Uno", "Talon Dos", "Talon Tres", "Talon Kuatro", "Talon Singko", "Zapote",
  ],
  Makati: [
    "Bangkal", "Bel-Air", "Carmona", "Cembo", "Comembo", "Dasmariñas", "East Rembo",
    "Forbes Park", "Guadalupe Nuevo", "Guadalupe Viejo", "Kasilawan", "La Paz",
    "Magallanes", "Olympia", "Palanan", "Pembo", "Pinagkaisahan", "Pio del Pilar",
    "Pitogo", "Poblacion", "Post Proper Northside", "Post Proper Southside", "Rizal",
    "San Antonio", "San Isidro", "San Lorenzo", "Santa Cruz", "Singkamas",
    "South Cembo", "Tejeros", "Urdaneta", "Valenzuela", "West Rembo",
  ],
  Malabon: [
    "Acacia", "Baritan", "Bayan-bayanan", "Catmon", "Concepcion", "Dampalit",
    "Flores", "Hulong Duhat", "Ibaba", "Longos", "Maysilo", "Muzon", "Niugan",
    "Panghulo", "Potrero", "San Agustin", "Santolan", "Santo Niño", "Tañong", "Tinajeros", "Tonsuya",
  ],
  Mandaluyong: [
    "Addition Hills", "Bagong Silang", "Barangka Drive", "Barangka Ibaba",
    "Barangka Ilaya", "Barangka Itaas", "Buayang Bato", "Burol", "Daang Bakal",
    "Hagdang Bato Itaas", "Hagdang Bato Libis", "Harapin Ang Bukas", "Highway Hills",
    "Hulo", "Mabini-J. Rizal", "Malamig", "Mauway", "Namayan", "New Zañiga",
    "Old Zañiga", "Pag-asa", "Plainview", "Poblacion", "Pleasant Hills", "San Jose",
    "Vergara", "Wack-Wack Greenhills",
  ],
  Manila: numbered(897),
  Marikina: [
    "Barangka", "Calumpang", "Concepcion Uno", "Concepcion Dos", "Fortune",
    "Industrial Valley Complex", "Jesus dela Peña", "Malanday", "Marikina Heights",
    "Nangka", "Parang", "San Roque", "Santa Elena", "Santo Niño", "Tañong", "Tumana",
  ],
  Muntinlupa: [
    "Alabang", "Ayala Alabang", "Bayanan", "Buli", "Cupang", "Poblacion", "Putatan", "Sucat", "Tunasan",
  ],
  Navotas: [
    "Bagumbayan North", "Bagumbayan South", "Bangculasi", "Daanghari", "NBBS Proper",
    "NBBS Kaunlaran", "North Bay Boulevard North", "North Bay Boulevard South",
    "San Jose", "San Rafael Village", "San Roque", "Sipac-Almacen", "Tangos", "Tanza",
  ],
  Parañaque: [
    "Baclaran", "BF Homes", "Don Bosco", "Don Galo", "La Huerta", "Marcelo Green",
    "Merville", "Moonwalk", "San Antonio", "San Dionisio", "San Isidro",
    "San Martin de Porres", "Santo Niño", "Sun Valley", "Tambo", "Vitalez",
  ],
  Pasay: numbered(201),
  Pasig: [
    "Bagong Ilog", "Bagong Katipunan", "Bambang", "Buting", "Caniogan", "Dela Paz",
    "Kalawaan", "Kapasigan", "Kapitolyo", "Malinao", "Manggahan", "Maybunga",
    "Oranbo", "Palatiw", "Pinagbuhatan", "Pineda", "Rosario", "Sagad", "San Antonio",
    "San Joaquin", "San Jose", "San Miguel", "San Nicolas", "Santa Cruz",
    "Santa Lucia", "Santa Rosa", "Santo Tomas", "Santolan", "Sumilang", "Ugong",
  ],
  Pateros: [
    "Aguho", "Bayanan", "Magtanggol", "Martires del 96", "Poblacion", "San Pedro",
    "San Roque", "Santa Ana", "Santo Rosario-Kanluran", "Santo Rosario-Silangan",
  ],
  "Quezon City": [
    "Alicia", "Amihan", "Apolonio Samson", "Aurora", "Baesa", "Bagbag",
    "Bagong Lipunan ng Crame", "Bagong Pag-asa", "Bagong Silangan", "Bagumbayan",
    "Bahay Toro", "Balingasa", "Balumbato", "Batasan Hills", "Bayanihan",
    "Blue Ridge A", "Blue Ridge B", "Botocan", "Bungad", "Camp Aguinaldo", "Capri",
    "Central", "Claro", "Commonwealth", "Culiat", "Damar", "Damayan",
    "Damayang Lagi", "Del Monte", "Dioquino Zobel", "Don Manuel", "Doña Aurora",
    "Doña Imelda", "Doña Josefa", "Duyan-duyan", "E. Rodriguez", "East Kamias",
    "Escopa I", "Escopa II", "Escopa III", "Escopa IV", "Fairview", "Gulod",
    "Greater Lagro", "Holy Spirit", "Horseshoe", "Immaculate Concepcion",
    "Kaligayahan", "Kalusugan", "Kamuning", "Katipunan", "Kaunlaran",
    "Kristong Hari", "Krus na Ligas", "Laging Handa", "Libis", "Lourdes",
    "Loyola Heights", "Maharlika", "Malaya", "Mangga", "Manresa", "Mariana",
    "Mariblo", "Marilag", "Masambong", "Matandang Balara", "Milagrosa",
    "Nagkaisang Nayon", "Nayong Kanluran", "New Era", "North Fairview",
    "Novaliches Proper", "N.S. Amoranto", "Obrero", "Old Capitol Site",
    "Paang Bundok", "Pag-ibig sa Nayon", "Paligsahan", "Paltok", "Pansol",
    "Paraiso", "Pasong Putik Proper", "Pasong Tamo", "Payatas", "Phil-Am",
    "Pinyahan", "Project 2", "Project 3", "Project 4", "Project 6", "Project 7",
    "Project 8", "Quirino 2A", "Quirino 2B", "Quirino 2C", "Quirino 3A",
    "Ramon Magsaysay", "Roxas", "Sacred Heart", "Salvacion", "San Agustin",
    "San Antonio", "San Bartolome", "San Isidro", "San Jose", "San Roque",
    "San Vicente", "Sangandaan", "Santa Cruz", "Santa Lucia", "Santa Monica",
    "Santa Teresita", "Santo Cristo", "Santo Domingo", "Santo Niño", "Santol",
    "Sauyo", "Sienna", "Sikatuna Village", "Silangan", "Socorro", "South Triangle",
    "Tagumpay", "Talayan", "Talipapa", "Tandang Sora", "Tatalon",
    "Teachers Village East", "Teachers Village West", "Ugong Norte", "UP Campus",
    "UP Village", "Valencia", "Vasra", "Veterans Village", "Villa Maria Clara",
    "West Kamias", "West Triangle", "White Plains", "Windsor",
  ],
  "San Juan": [
    "Addition Hills", "Balong-Bato", "Batis", "Corazon de Jesus", "Ermitaño",
    "Greenhills", "Isabelita", "Kabayanan", "Little Baguio", "Maytunas", "Onse",
    "Pasadeña", "Pedro Cruz", "Progreso", "Rivera", "Salapan", "San Perfecto",
    "Santa Lucia", "St. Joseph", "Tibagan", "West Crame",
  ],
  Taguig: [
    "Bagumbayan", "Bambang", "Calzada", "Central Bicutan", "Central Signal Village",
    "Fort Bonifacio", "Hagonoy", "Ibayo-Tipas", "Katuparan", "Ligid-Tipas",
    "Lower Bicutan", "Maharlika Village", "Napindan", "New Lower Bicutan",
    "North Daang Hari", "North Signal Village", "Palingon", "Pinagsama",
    "San Miguel", "Santa Ana", "South Daang Hari", "South Signal Village",
    "Tanyag", "Tuktukan", "Upper Bicutan", "Ususan", "Wawa", "Western Bicutan",
  ],
  Valenzuela: [
    "Arkong Bato", "Bagbaguin", "Balangkas", "Bignay", "Bisig", "Canumay East",
    "Canumay West", "Coloong", "Dalandanan", "Gen. T. de Leon", "Isla",
    "Karuhatan", "Lawang Bato", "Lingunan", "Mabolo", "Malanday", "Malinta",
    "Mapulang Lupa", "Marulas", "Maysan", "Palasan", "Parada", "Pariancillo Villa",
    "Paso de Blas", "Pasolo", "Poblacion", "Pulo", "Punturin", "Rincon",
    "Tagalag", "Ugong", "Viente Reales", "Wawang Pulo",
  ],
};

export const NCR_CITIES = Object.keys(NCR_BARANGAYS).sort();
