import { GeoJsonObject } from "geojson";
import { FC } from "react";
import { GeoJSON } from 'react-leaflet'
import { RegioIndeling } from "../interfaces/regios";

import * as turf from '@turf/turf'
import { IZiekenhuis } from "../interfaces/ziekenhuis"
import { GeoJSONObject } from "@turf/turf";


export const isLatLonInGeoJSON = (latlon: [number, number], poly: any): boolean => {
  const [lat, lon] = latlon
  const point = turf.point([lon, lat])
  return turf.booleanPointInPolygon(point, poly)
}

export const findGeoJSONContainingLatLon = (latlon: [number, number], geoJSONObject: any): undefined | GeoJSONObject => {
  return geoJSONObject.features.find( (geoJSON: any) => isLatLonInGeoJSON(latlon, geoJSON) )
}

const regioJSONs: { regioIndeling: RegioIndeling, json: GeoJsonObject }[] = [
  { regioIndeling: 'corop', json: require("../assets/regios_geojsons/corop.json") },
  // { regioIndeling: 'energie', json: require("../assets/regios_geojsons/energie.json") },
  { regioIndeling: 'ggd', json: require("../assets/regios_geojsons/ggd.json") },
  { regioIndeling: 'jeugd', json: require("../assets/regios_geojsons/jeugd.json") },
  // { regioIndeling: 'provincie', json: require("../assets/regios_geojsons/provincie.json") },
  { regioIndeling: 'rav', json: require("../assets/regios_geojsons/rav.json") },
  { regioIndeling: 'roaz', json: require("../assets/regios_geojsons/roaz.json") },
  { regioIndeling: 'veiligheid', json: require("../assets/regios_geojsons/veiligheid.json") },
  // { regioIndeling: 'zorgkantoor', json: require("../assets/regios_geojsons/zorgkantoor.json") },
]

export const findGeoJSONObject = (regioIndeling: RegioIndeling) => {
  return (regioJSONs.find(regioJSON => regioJSON.regioIndeling === regioIndeling))?.json as GeoJsonObject
}

export const RegioGeoJSON: FC<{
  regioIndeling: RegioIndeling,
  highlightedLatLon?: [number, number]
}>
  = ({ regioIndeling, highlightedLatLon }) => {


    const geoJSONObject = findGeoJSONObject(regioIndeling)
    // console.log(findGeoJSONContainingLatLon([52, 5], geoJSONObject))

    if (!geoJSONObject)
      return <></>

    const style = (geoJsonFeature: any) => {


      const isHighlighted = highlightedLatLon && isLatLonInGeoJSON(highlightedLatLon, geoJsonFeature)

      return {
        weight: 1,
        color: "blue",
        fillOpacity: isHighlighted ? 0.2 : 0.05,
      };
    };
    return <GeoJSON key={regioIndeling} data={geoJSONObject} style={style} />
  } 