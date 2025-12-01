
function unitStatus(status: string) {
    let unit_status = "Not Set";
    
    if(status === 'owner_occupied'){
        unit_status = "Owner Occupied"
    }

    if(status === 'air_bnb'){
        unit_status = "Air Bnb"
    }

    if(status === 'rented_short_term'){
        unit_status = "Rented"
    }

    return unit_status
}

export default unitStatus