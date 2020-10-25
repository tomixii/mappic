import React, {useState, useEffect} from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { withFirebase } from '../Firebase';

function CameraApp ({firebase}) {
    const [takenPicture, setTakenPicture] = useState('');

    useEffect(() => {
        setTakenPicture('');
    }, []);

    const handleTakePhoto = (dataUri) => {
        setTakenPicture(dataUri);
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
        <div>
        {takenPicture === '' ?
            <Camera
                idealResolution = {{width: 640, height: 480}}
                onTakePhoto={(dataUri) => {
                    handleTakePhoto(dataUri);
                }}
                onCameraError{...error => console.log(error)}
            />
            :
            <img src={takenPicture}/>
        }

        </div>
    );
}

export default withFirebase(CameraApp);