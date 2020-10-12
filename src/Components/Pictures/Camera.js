import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { withFirebase } from '../Firebase';

function CameraApp ({firebase}) {

    const handleTakePhoto = (dataUri) => {
        console.log("url", dataUri)
        firebase
            .pictures()
            .add({
                latitude: 23,
                longitude: 20,
                imageUrl: dataUri,
                createdAt: new Date().toISOString()

            })
            .then(function (docRef) {
                console.log('Document written with ID: ', docRef.id);
            })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });
    };


    return (
        <Camera
            onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
        />
    );
}

export default withFirebase(CameraApp);