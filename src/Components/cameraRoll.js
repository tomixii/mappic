import React, {useEffect} from 'react';
import 'react-html5-camera-photo/build/css/index.css';
import { withFirebase } from './Firebase';
import CameraApp from './Pictures/Camera';
import ShowPictures from './Pictures/ShowPictures';

function CameraRoll (props) {

    const [showPhotoGallery, setShowPhotoGallery] = React.useState(false);
    const [photoArray, setPhotoArray] = React.useState([]);


    const getPhotosFromGallery = () => {
        CameraRoll.getPhotos({ first: 1000000 })
            .then(res => {
                let photoArray = res.edges;
                setShowPhotoGallery(true);
                setPhotoArray(photoArray)
                console.log('res', res)
            })
    }

    useEffect(() => {


    }, []);


    return (
        <div>
            <ShowPictures />
        </div>

    );
}

export default withFirebase(CameraRoll);