import _ from 'lodash';

/**
 * The function will grab the current year data from both sets and merges them
 * by their iso-3 string in order to create one array of objects.
 * @param {*} lifeData 
 * @param {*} worldData 
 * @param {*} currentYear 
 */

export const transformData = (lifeData, worldData, currentYear) => { // we use liodash to simplify the code {vanilla: filter both array then merge}, lodash work with sequence like d3 works with select
    const filteredData = lifeData.filter((e) => e.year === currentYear);

    const mergedData = _(filteredData)                              // start sequence (start with this array)
        .keyBy('code')                                              // Create a dictionary (TKey, TValue) of the first array
        .merge(_.keyBy(worldData.features, 'properties.iso_a3'))    // Create a dictionary of the second array and merge it to the first one
        .values()                                                   // convert the combined dictionaries to an array again
        .value()                                                    // get the value (array) of the sequence that is returned by lodash

    return mergedData;
}