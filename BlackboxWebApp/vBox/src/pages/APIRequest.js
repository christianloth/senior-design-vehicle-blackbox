/*eslint-disable*/

export async function fetchAPI(tripID) {
    // instantiate a headers object
    const myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({trip_id: tripID});
    // create a JSON object with parameters for API call and store in a variable
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    // make API call with parameters and use promises to get response
    let response = await fetch("https://7m3q3dqm4g.execute-api.us-east-1.amazonaws.com/dev", requestOptions);
    let response_txt = await response.text();
    const data = await JSON.parse(response_txt).body;

    sessionStorage.setItem("trip" + tripID + "Data", JSON.stringify({
        "average_acceleration": data.average_acceleration,
        "average_rpm": data.average_rpm,
        "average_speed": data.average_speed,
        "speed": data.speed,
        "throttle_position": data.throttle_position,
        "time": data.time,
        "trip_time": data.trip_time,
        "delta_acc_x": data.delta_acc_x,
        "delta_acc_y": data.delta_acc_y,
        "delta_acc_z": data.delta_acc_z,
        "lat": data.lat,
        "long": data.long,
        "conclusion_1": JSON.parse(data.analysis_results)[0],
        "conclusion_2": JSON.parse(data.analysis_results)[1],
        "conclusion_3": JSON.parse(data.analysis_results)[2],
        "conclusion_4": JSON.parse(data.analysis_results)[3],
        "conclusion_5": JSON.parse(data.analysis_results)[4],
    }));
    
    return data;
}

export function getTripData(tripNum) {

    const key = "trip" + tripNum + "Data";
    const data = JSON.parse(sessionStorage.getItem(key));
    return data
}