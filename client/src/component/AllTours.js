// import axios from 'axios';
import React, { useContext } from 'react';
import { myContext } from '../Context';

// import { showAlert } from '../js/alert';
// import { request } from '../js/axios';
import SingleTour from './SingleTour';

function AllTours() {
  document.title = 'Natours | All Tours';
  const { allTours } = useContext(myContext);
  let tours = allTours;
  // let err;
  // const [response, setResponse] = useState();

  // runs after the page rendered
  // useEffect(() => {
  //   const method = 'GET';
  //   const url = '/api/v1/tours';
  //   const getTours = async () => {
  //     const data = await request(method, url);
  //     setResponse(data);
  //   };
  //   getTours();
  // }, []);

  // if (response) {
  //   if (response.data.status === 'success') {
  //     tours = response.data.data.tours;
  //   }
  //   if (response.data.status !== 'success') {
  //     err = response.data.message;
  //     showAlert(response.data.status, err, 5);
  //   }
  // }

  return (
    <>
      <div className='tours_container'>
        {tours.map((tour, i) => (
          <SingleTour
            key={i}
            id={tour.id}
            imageCover={tour.imageCover}
            name={tour.name}
            ratingsAverage={tour.ratingsAverage}
            ratingsQuantity={tour.ratingsQuantity}
            duration={tour.duration}
            maxGroupSize={tour.maxGroupSize}
            difficulty={tour.difficulty}
            summary={tour.summary}
            price={tour.price}
            stops={tour.locations.length}
            startLocation={tour.startLocation.description}
            startDate={tour.startDates[0]}
            slug={tour.slug}
          />
        ))}
      </div>
    </>
  );
}

export default AllTours;
