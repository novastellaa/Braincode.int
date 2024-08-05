import { createSignal } from "solid-js";
import { api } from "./api";


const fetchDataAssetKapal = async () => {
    const [data, setData] : any = createSignal([]);
    const [error, setError] = createSignal();

    // const url = `/public/json/data-asset-kapal.json`;
    const url = `${api}get_asset_kapal`;
    await fetch(url, { headers: { "Content-type": "application/json;charset=UTF-8" } }).then((res) => res.json())
        .then((data: any) => {
            setData(data);
        }
        ).catch((err) => {
            setError(err); 
        }); 
        let uniqueLines = new Set(data().map((item :any)=> item.nama)); 
        let result = [...uniqueLines].map(nama => { 
          let filteredData = data().filter((item :any) => item.nama === nama); 
          return filteredData[0];
        });  
        let res = {"data" : data() , "filter" : result}
        console.log("RES KAPAL-> ", res)
    return res;
}


const fetchDataAssetKapalAdd = async (body_params: any) => {
    const [data, setData] = createSignal();
    const [error, setError] = createSignal();
    const url = `${api}add_asset_kapal`;
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body_params),
    })
        .then((res) => res.json())
        .then((data) => {
            setData(data);
        })
        .catch((err) => {
            setError(err); 
        });
    return data();
};

const fetchDataAssetPos = async () => {
    const [data, setData] : any = createSignal([]);
    const [error, setError] = createSignal();

    const url = `${api}get_asset_pos`;
    await fetch(url, { headers: { "Content-type": "application/json;charset=UTF-8" } }).then((res) => res.json())
        .then((data: any) => {
            setData(data);
        }
        ).catch((err) => {
            setError(err); 
        }); 
        let uniqueLines = new Set(data().map((item :any)=> item.lokasi)); 
        let result = [...uniqueLines].map(lokasi => { 
          let filteredData = data().filter((item :any) => item.lokasi === lokasi); 
          return filteredData[0];
        });  
        let res = {"data" : data() , "filter" : result}
        console.log("RES POS-> ", res)
    return res;
}


const fetchDataAssetPosAdd = async (body_params: any) => {
    const [data, setData] = createSignal();
    const [error, setError] = createSignal();
    const url = `${api}add_asset_pos`;
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body_params),
    })
        .then((res) => res.json())
        .then((data) => {
            setData(data);
        })
        .catch((err) => {
            setError(err); 
        });
    return data();
};


const fetchDataAssetPosUpdate = async (body_params: any) => {
    const [data, setData] = createSignal();
    const [error, setError] = createSignal();
    const url = `${api}update_asset_pos`;
    await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body_params),
    })
        .then((res) => res.json())
        .then((data) => {
            setData(data);
        })
        .catch((err) => {
            setError(err); 
        });
    return data();
};


const fetchDataAssetPosDelete = async (body_params: any) => {
    const [data, setData] = createSignal();
    const [error, setError] = createSignal();
    const url = `${api}delete_asset_pos=asset_pos:${body_params}`;
    await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((res) => res.json())
        .then((data) => {
            setData(data);
        })
        .catch((err) => {
            setError(err); 
        });
    return data();
};



const fetchDataPoint = async () => {
    const [data, setData] : any = createSignal([]);
    const [error, setError] = createSignal();

    const url = `${api}get_point_data`;
    await fetch(url, { headers: { "Content-type": "application/json;charset=UTF-8" } }).then((res) => res.json())
        .then((data: any) => {
            setData(data);
        }
        ).catch((err) => {
            setError(err); 
        }); 
        let uniqueLines = new Set(data().map((item :any)=> item.lokasi)); 
        let result = [...uniqueLines].map(lokasi => { 
          let filteredData = data().filter((item :any) => item.lokasi === lokasi); 
          return filteredData[0];
        });  
        let res = {"data" : data() , "filter" : result}
        console.log("RES POS-> ", res)
    return res;
}


const fetchDataPointAdd = async (body_params: any) => {
    const [data, setData] = createSignal();
    const [error, setError] = createSignal();
    const url = `${api}add_point_data`;
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body_params),
    })
        .then((res) => res.json())
        .then((data) => {
            setData(data);
        })
        .catch((err) => {
            setError(err); 
        });
    return data();
};


const fetchDataPolyline = async () => {
    const [data, setData] : any = createSignal([]);
    const [error, setError] = createSignal();

    const url = `${api}get_polyline_data`;
    await fetch(url, { headers: { "Content-type": "application/json;charset=UTF-8" } }).then((res) => res.json())
        .then((data: any) => {
            setData(data);
        }
        ).catch((err) => {
            setError(err); 
        }); 
        let uniqueLines = new Set(data().map((item :any)=> item.lokasi)); 
        let result = [...uniqueLines].map(lokasi => { 
          let filteredData = data().filter((item :any) => item.lokasi === lokasi); 
          return filteredData[0];
        });  
        let res = {"data" : data() , "filter" : result}
        console.log("RES POS-> ", res)
    return res;
}


const fetchDataPolylineAdd = async (body_params: any) => {
    const [data, setData] = createSignal();
    const [error, setError] = createSignal();
    const url = `${api}add_polyline_data`;
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body_params),
    })
        .then((res) => res.json())
        .then((data) => {
            setData(data);
        })
        .catch((err) => {
            setError(err); 
        });
    return data();
};



const fetchDataPolygon = async () => {
    const [data, setData] : any = createSignal([]);
    const [error, setError] = createSignal();

    const url = `${api}get_polygon_data`;
    await fetch(url, { headers: { "Content-type": "application/json;charset=UTF-8" } }).then((res) => res.json())
        .then((data: any) => {
            setData(data);
        }
        ).catch((err) => {
            setError(err); 
        }); 
        let uniqueLines = new Set(data().map((item :any)=> item.lokasi)); 
        let result = [...uniqueLines].map(lokasi => { 
          let filteredData = data().filter((item :any) => item.lokasi === lokasi); 
          return filteredData[0];
        });  
        let res = {"data" : data() , "filter" : result}
        console.log("RES POS-> ", res)
    return res;
}


const fetchDataPolygonAdd = async (body_params: any) => {
    const [data, setData] = createSignal();
    const [error, setError] = createSignal();
    const url = `${api}add_polygon_data`;
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body_params),
    })
        .then((res) => res.json())
        .then((data) => {
            setData(data);
        })
        .catch((err) => {
            setError(err); 
        });
    return data();
};


const fetchDataRuteKapalAdd = async (body_params: any) => {
    const [data, setData] = createSignal();
    const [error, setError] = createSignal();
    const url = `${api}add_rute_kapal`;
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body_params),
    })
        .then((res) => res.json())
        .then((data) => {
            setData(data);
        })
        .catch((err) => {
            setError(err); 
        });
    return data();
};

const fetchDataRuteKapal = async () => {
    const [data, setData] : any = createSignal([]);
    const [error, setError] = createSignal();

    const url = `${api}get_rute_kapal`;
    await fetch(url, { headers: { "Content-type": "application/json;charset=UTF-8" } }).then((res) => res.json())
        .then((data: any) => {
            setData(data);
        }
        ).catch((err) => {
            setError(err); 
        }); 
        let uniquePositions = new Set<string>();

        // Populate the Set with unique combinations of start_pos and end_pos
        data().forEach((item: any) => {
            uniquePositions.add(item.start_pos);
            uniquePositions.add(item.end_pos);
        });
    
        // Convert the Set to an array of objects with a single key 'position'
        let result = Array.from(uniquePositions).map(pos => {
            return { position: pos }; // Return as an object with the key 'position'
        });
    
    
        let res = {"data" : data() , "filter" : result}
        console.log("RES POS-> ", res)
    return res;
}

export {fetchDataAssetKapal,fetchDataAssetPos,fetchDataAssetPosAdd,fetchDataAssetPosUpdate,fetchDataAssetPosDelete,
    fetchDataPoint,fetchDataPointAdd ,fetchDataPolyline,fetchDataPolylineAdd,fetchDataPolygon,fetchDataPolygonAdd,fetchDataAssetKapalAdd,fetchDataRuteKapalAdd,fetchDataRuteKapal
}