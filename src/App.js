import React from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';

const App = () => {
	return (
		<div className="App">
			<header className="App-header">
				<div style={{ height: '100vh', width: '100%' }}>
					<GoogleMapReact
						bootstrapURLKeys={{
							key: process.env.GOOGLE_MAPS_API_KEY,
						}}
						defaultCenter={{ lat: 60.185243, lng: 24.826074 }}
						defaultZoom={15}
					>
						<div
							lat={60.185243}
							lng={24.826074}
							style={{
								width: 20,
								height: 20,
								borderWidth: 3,
								borderColor: 'red',
								borderStyle: 'solid',
								borderRadius: 20,
								backgroundColor: 'lightblue',
							}}
						/>
					</GoogleMapReact>
				</div>
			</header>
		</div>
	);
};

export default App;
