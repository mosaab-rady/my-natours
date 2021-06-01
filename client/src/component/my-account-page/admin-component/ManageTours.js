import React, { useContext, useState } from 'react';
import '../../../css/managetours.css';
import { BiAddToQueue, BiArrowBack } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { myContext } from '../../../Context';
import ManageTour from './ManageTour';
import CreateTour from './CreateTour';
import UpdateTour from './UpdateTour';

export default function ManageTours() {
  const { allTours } = useContext(myContext);
  const [createTour, setCreateTour] = useState(false);
  const [updateTour, setUpdateTour] = useState(false);
  const [id, setId] = useState();

  return (
    <div className='manage-tours'>
      {createTour || updateTour ? (
        <Link
          to='#'
          title='back to tours'
          onClick={() => {
            setCreateTour(false);
            setUpdateTour(false);
          }}
        >
          <BiArrowBack className='add-icon' />
        </Link>
      ) : (
        <Link to='#' title='add new tour' onClick={() => setCreateTour(true)}>
          <BiAddToQueue className='add-icon' />
        </Link>
      )}
      {createTour ? (
        <CreateTour />
      ) : updateTour ? (
        <UpdateTour id={id} />
      ) : (
        <div className='tours-container'>
          {allTours.map((tour, i) => {
            return (
              <ManageTour
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
                setUpdateTour={setUpdateTour}
                setId={setId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
