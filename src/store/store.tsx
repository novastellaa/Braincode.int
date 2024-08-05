import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

interface Point {
    latitude: number;
    longitude: number;
  province: string
}

const [pointsState, setPointsState] = createSignal<Point[]>([
  
  
  
  { province: 'Bangka Belitung', latitude: -3.022185, longitude:  106.447482},
  { province: 'Kalimantan ', latitude:  -3.216752,  longitude:  111.814708},
  { province: 'Jawa', latitude:   -6.756168,  longitude:  110.278615},
  { province: 'Makassar', latitude:   -5.549218,  longitude: 119.301325},


  

    // { province: 'Aceh', latitude: -2.944616, longitude: 96.7494 },
    // { province: 'Bali', latitude: -8.409518, longitude: 115.188919 },
    // { province: 'Bangka Belitung Islands', latitude: -2.741051, longitude: 106.44014 },
    // { province: 'Banten', latitude: -6.405817, longitude: 106.064018 },
    // { province: 'Bengkulu', latitude: -3.577847, longitude: 102.346388 },
    // { province: 'Central Java', latitude: -7.150975, longitude: 110.140259 },
    // { province: 'Central Kalimantan', latitude: -1.681488, longitude: 113.382355 },
    // { province: 'Central Sulawesi', latitude: -1.430025, longitude: 121.445617 },
    // { province: 'East Java', latitude: -7.536064, longitude: 112.238402 },
    // { province: 'East Kalimantan', latitude: 1.207889, longitude: 116.601328 },
    // { province: 'East Nusa Tenggara', latitude: -8.657382, longitude: 121.07937 },
    // { province: 'Gorontalo', latitude: 0.697182, longitude: 122.446724 },
    // { province: 'Jakarta Special Capital Region', latitude: -6.208763, longitude: 106.845599 },
    // { province: 'Jambi', latitude: -1.610572, longitude: 103.613139 },
    // { province: 'Lampung', latitude: -4.558585, longitude: 105.406808 },
    // { province: 'Maluku', latitude: -3.238462, longitude: 130.145273 },
    // { province: 'North Kalimantan', latitude: 2.294321, longitude: 117.840263 },
    // { province: 'North Maluku', latitude: 1.569122, longitude: 127.808769 },
    // { province: 'North Sulawesi', latitude: 1.446973, longitude: 124.842647 },
    // { province: 'North Sumatra', latitude: 2.115102, longitude: 99.545097 },
    // { province: 'Papua', latitude: -4.269928, longitude: 138.080353 },
    // { province: 'Riau', latitude: 0.293346, longitude: 101.706829 },
    // { province: 'Riau Islands', latitude: 3.945651, longitude: 108.142867 },
    // { province: 'South Kalimantan', latitude: -3.092642, longitude: 115.283759 },
    // { province: 'South Sulawesi', latitude: -3.668799, longitude: 119.974053 },
    // { province: 'South Sumatra', latitude: -3.319437, longitude: 104.914966 },
    // { province: 'Southeast Sulawesi', latitude: -4.14491, longitude: 122.174605 },
    // { province: 'West Java', latitude: -6.914744, longitude: 107.60981 },
    // { province: 'West Kalimantan', latitude: -0.27878, longitude: 111.475285 },
    // { province: 'West Nusa Tenggara', latitude: -8.652933, longitude: 117.361648 },
    // { province: 'West Papua', latitude: -2.133583, longitude: 133.333111 },
    // { province: 'West Sulawesi', latitude: -2.83286, longitude: 119.437401 },
    // { province: 'West Sumatra', latitude: -0.851914, longitude: 100.352865 },
    // { province: 'Yogyakarta Special Region', latitude: -7.801194, longitude: 110.364917 }
  ]
  );

const [titleState, setTitleState] = createSignal('Default Title');

const [hewanList, setHewanList] = createStore<string[]>(['Kucing', 'Anjing', 'Burung']);


// Fungsi untuk menambah hewan ke daftar
function tambahHewan(namaHewan: string) {
    setHewanList((prevList) => [...prevList, namaHewan]);
  }
  
  // Fungsi untuk menghapus hewan dari daftar
  function hapusHewan(namaHewan: string) {
    setHewanList((prevList) => prevList.filter((hewan) => hewan !== namaHewan));
  }

export { pointsState, setPointsState, titleState, setTitleState , hewanList, tambahHewan, hapusHewan };
