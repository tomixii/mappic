import React, {useEffect, useState} from 'react';
import 'react-html5-camera-photo/build/css/index.css';
import { withFirebase } from '../Firebase';

function CameraApp ({firebase}) {

    const [pictures, setPictures] = useState([]);
    const [showPictures, setShowPictures] = useState(false);

    useEffect(() => {
        firebase
            .pictures()
            .get()
            .then(function (snapshot) {
                snapshot.forEach((doc) => {
                    setPictures(oldArray => [...oldArray, doc.data()])

                })
            })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });

    }, []);


    return (
        <div>
            <button onClick={() => setShowPictures(true)}>Show all the pictures</button>
            {showPictures &&
                pictures.map((pic) => (
                    <div>{pic.imageUrl}</div>
                ))
            }

        </div>

    );
}

export default withFirebase(CameraApp);