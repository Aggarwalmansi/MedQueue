import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../../styles/MapView.css';
import { Navigation, Star, Activity, Clock } from 'lucide-react';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;


const createCustomIcon = (color) => {
    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10]
    });
};

const userIcon = createCustomIcon('#3b82f6'); 
const hospitalIcon = createCustomIcon('#ef4444');

const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const MapView = ({ hospitals, userLocation, onMarkerClick }) => {
    const defaultCenter = [20.5937, 78.9629]; 
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [zoom, setZoom] = useState(5);

    useEffect(() => {
        if (userLocation) {
            setMapCenter([userLocation.lat, userLocation.lng]);
            setZoom(13);
        } else if (hospitals.length > 0) {
            
            setMapCenter([hospitals[0].latitude, hospitals[0].longitude]);
            setZoom(12);
        }
    }, [userLocation, hospitals]);

    return (
        <div className="map-view-container">
            <MapContainer
                center={mapCenter}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater center={mapCenter} />

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup>
                            <div className="map-popup-content">
                                <strong>You are here</strong>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Hospital Markers */}
                {hospitals.map(hospital => (
                    <Marker
                        key={hospital.id}
                        position={[hospital.latitude, hospital.longitude]}
                        icon={hospitalIcon}
                        eventHandlers={{
                            click: () => {
                                // Optional: Center map on click
                            },
                        }}
                    >
                        <Popup>
                            <div className="map-popup-card">
                                <h4>{hospital.name}</h4>
                                <div className="popup-meta">
                                    <span><Navigation size={12} /> {hospital.distance ? `${hospital.distance} km` : 'N/A'}</span>
                                    <span><Star size={12} fill="#eab308" color="#eab308" /> {hospital.averageRating || 'New'}</span>
                                </div>
                                <div className="popup-stats">
                                    <div className="stat">
                                        <Activity size={12} />
                                        <span>{hospital.totalBeds} Beds</span>
                                    </div>
                                    <div className="stat">
                                        <Clock size={12} />
                                        <span>{hospital.erWaitTimes?.critical?.avgWaitMinutes || 15}m Wait</span>
                                    </div>
                                </div>
                                <button
                                    className="popup-btn"
                                    onClick={() => onMarkerClick(hospital)}
                                >
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
