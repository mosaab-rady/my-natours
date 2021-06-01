import React, { useEffect, useState } from 'react';
import { showAlert } from '../../js/alert';
import { request } from '../../js/axios';
import SingleTour from '../SingleTour';
import '../../css/mybookings.css';

export default function MyBookings() {
  const [tours, setTours] = useState();

  useEffect(() => {
    const getMyBookings = async () => {
      const response = await request('GET', `/api/v1/bookings/mybookings`);
      if (response) {
        if (response.data.status === 'success') {
          setTours(response.data.data.tours);
        }
        if (response.data.status !== 'success') {
          showAlert('fail', response.data.message, 3);
        }
      }
    };
    getMyBookings();
  }, []);

  if (tours) {
    if (tours.length >= 1) {
      return (
        <div className='tours_container bookings-container '>
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
      );
    }
    if (tours.length < 1) {
      return (
        <div className='my-reviews'>
          <h1>you do not have bookings yet</h1>
        </div>
      );
    }
  } else {
    return (
      <div className='my-reviews'>
        <div className='loading'></div>
      </div>
    );
  }
}
