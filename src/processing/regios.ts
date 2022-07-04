import { IZiekenhuis } from "../interfaces/ziekenhuis"

export const areInSameRoazegio = (selectedZiekenhuis: IZiekenhuis, ziekenhuis: IZiekenhuis) => {
    if (selectedZiekenhuis === undefined) {
        return false
    }
    const selectedRoazRegio = selectedZiekenhuis.roazRegio[0]
    const isInSameRoazRegioAsSelected = ziekenhuis.roazRegio.includes(selectedRoazRegio)
    return isInSameRoazRegioAsSelected
}

export const getRegionaleRoazZiekenhuizen = (selectedZiekenhuis: IZiekenhuis, ziekenhuizen: IZiekenhuis[]) => {
    return ziekenhuizen.filter(ziekenhuis => areInSameRoazegio(selectedZiekenhuis, ziekenhuis))
}

// based on geography
// const getRegionaleZiekenhuizen = (
//     ziekenhuizen: IZiekenhuis[],
//     selectedZiekenhuis: IZiekenhuis,
//     regioIndeling: RegioIndeling) => {
//     const selectetGeoJSON = findGeoJSONContainingLatLon(selectedZiekenhuis.latlon, findGeoJSONObject(regioIndeling))
//     return ziekenhuizen.filter(ziekenhuis => isLatLonInGeoJSON(ziekenhuis.latlon, selectetGeoJSON))
//   }