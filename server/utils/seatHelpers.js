const buildSeatUpdate =(seatsToUpdate,newStatus,statusToChange)=>{
    const setObj = {};
    const arrayFilters = [];

    seatsToUpdate.forEach((seat,index )=>{
        const key = `seat${index}`;
        setObj[`seats.$[${key}].status`] = newStatus;

        arrayFilters.push({
            [`${key}.row`]: seat.row,
            [`${key}.number`]:seat.number,
            [`${key}.status`]:statusToChange
        })
    });
    return {setObj,arrayFilters};
}

module.exports = buildSeatUpdate