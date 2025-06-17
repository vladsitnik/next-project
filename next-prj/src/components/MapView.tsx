'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression } from 'leaflet'

const position: LatLngExpression = [50.45, 30.523]

const MapView = () => (
  <MapContainer
    center={position}
    zoom={13}
    style={{ height: '300px', width: '100%' }}
  >
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>Пример местоположения (Киев)</Popup>
    </Marker>
  </MapContainer>
)

export default MapView