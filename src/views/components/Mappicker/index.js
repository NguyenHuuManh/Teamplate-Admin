import CIcon from "@coreui/icons-react";
import { CCardBody, CCardHeader, CCol, CInput, CInputGroup, CInputGroupPrepend, CInputGroupText, CLabel, CModal, CRow } from "@coreui/react";
import React, { memo, useEffect, useMemo, useState } from "react";
import { API_KEY } from "src/constrants/action";
import { Marker } from "react-google-maps";
import Map from "../Map";
import { apiPlaceDetailByLongLat } from "../../../apiFunctions/mapPlace"
import { isEmpty } from "lodash"
export default memo((props) => {
    const [isOpen, setIsOpen] = useState(false);
    const { form, field, title, maxTitle, horizontal, iconName, adress, setAdress, isRequired } = props
    const [marker, setMarker] = useState({});
    const { errors, touched, setFieldValue } = form;
    const { name, value } = field;
    useEffect(() => {
        if (!isOpen) return;
        navigator.geolocation.getCurrentPosition((e) => {
            console.log("getCurrentPosition", e);
            setMarker({ ...marker, lat: e?.coords?.latitude, lng: e?.coords?.longitude })
        })
    }, [isOpen])

    useEffect(() => {
        setFieldValue(name, isEmpty(adress) ? `` : `${adress?.city}-${adress?.district}-${adress?.subDistrict}`)
    }, [adress])

    const getDetailPlace = () => {
        apiPlaceDetailByLongLat(marker?.lng, marker?.lat).then((e) => {
            if (e.status == 200) {
                const place = e?.data?.results[0]?.address_components;
                setAdress({
                    ...adress,
                    city: place[place.length - 1]?.long_name,
                    province: place[place.length - 2]?.long_name,
                    district: place[place.length - 2]?.long_name,
                    subDistrict: place[place.length - 3]?.long_name,
                    GPS_Lati: marker?.lat + "",
                    GPS_long: marker?.lng + "",
                })
                console.log("place", place)
            }
        })
    }

    useEffect(() => {
        console.log("marker", marker);
        if (isEmpty(marker)) return;
        getDetailPlace();
    }, [marker])
    return (
        <>
            {(!horizontal) && title && (
                <label className="inputTitle">{title}</label>
            )}
            <div style={{ display: "flex" }}>
                {
                    horizontal && (
                        <label className="inputTitle" style={{ width: maxTitle || 150 }}>{title}</label>
                    )
                }
                <CInputGroup className="mb-3" style={{ display: "flex" }}>
                    <div style={{ width: "100%", display: "block", flex: 1 }}>
                        <CInput
                            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                            readOnly
                            style={{ backgroundColor: "#FFF" }}
                            onClick={() => { setIsOpen(!isOpen) }}
                            value={value}
                        />

                        {errors[name] && <div className="err-text" >{errors[name]}</div>}
                    </div>
                    <div>
                        {
                            iconName && (
                                <CInputGroupPrepend style={{ marginLeft: -2 }}>
                                    <CInputGroupText style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                                        <CIcon name={iconName} height={21} />
                                    </CInputGroupText>
                                </CInputGroupPrepend>
                            )
                        }
                    </div>
                </CInputGroup>
            </div>
            <CModal
                show={isOpen}
                onClose={setIsOpen}
            >
                <CCardHeader>Tìm kiếm địa điểm</CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol md={4}>
                            <CLabel>Tỉnh/Thành phố: </CLabel>
                        </CCol>
                        <CCol md={8}>
                            <CLabel>{adress?.city}</CLabel>
                        </CCol>
                        <CCol md={4}>
                            <CLabel>Quận/Huyện: </CLabel>
                        </CCol>
                        <CCol md={8}>
                            <CLabel>{adress?.district}</CLabel>
                        </CCol>
                        <CCol md={4}>
                            <CLabel>Xã/Phường: </CLabel>
                        </CCol>
                        <CCol md={8}>
                            <CLabel>{adress?.subDistrict}</CLabel>
                        </CCol>
                        <CCol md={2}>
                            <CLabel>Lat: </CLabel>
                        </CCol>
                        <CCol md={4}>
                            <CLabel>{marker?.lat}</CLabel>
                        </CCol>
                        <CCol md={2}>
                            <CLabel>Lng: </CLabel>
                        </CCol>
                        <CCol md={4}>
                            <CLabel>{marker?.lng}</CLabel>
                        </CCol>
                    </CRow>
                </CCardBody>
                <CCardBody>
                    {isOpen && (
                        <Map
                            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`}
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `40vh`, margin: `auto`, border: '2px solid black' }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            onClick={(res) => { setMarker({ lat: res.latLng.lat(), lng: res.latLng.lng() }) }}
                            defaultCenter={marker}
                        >
                            <Marker
                                position={marker}
                            />
                        </Map>
                    )}
                </CCardBody>
            </CModal>

        </>
    )
})