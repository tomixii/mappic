import React, {useEffect} from 'react';
import { withFirebase } from '../Firebase';

const AddPicture = ({firebase}) => {

   const createQuery = () => {
       firebase
           .pictures()
           .add({
               latitude: 23,
               longitude: 20,
               imageUrl: "https://www.zooplus.fi/tietonurkka/wp-content/uploads/2020/03/koiran-koronavirus-768x512.jpeg",
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
        <button onClick={() => createQuery()}>Add a dog picture to the firebase</button>
    )
};

export default withFirebase(AddPicture);
