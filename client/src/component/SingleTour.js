import React from 'react';
import { BiUser } from 'react-icons/bi';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiFlag, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getMonthYear } from '../js/date';
// import TourDetails from './TourDetails';
// import axios from 'axios';

export default function SingleTour({
  id,
  imageCover,
  name,
  ratingsAverage,
  ratingsQuantity,
  duration,
  maxGroupSize,
  difficulty,
  summary,
  price,
  stops,
  startLocation,
  startDate,
  slug,
}) {
  // to get the month name and year
  const { month, year } = getMonthYear(startDate);

  return (
    <div className='tour_container'>
      {/* display the image cover and name of the tour */}
      <div className='header_container'>
        <div className='img_container'>
          <img
            className='singleTour_img'
            src={`/public/img/tours/${imageCover}`}
            alt={name}
          />
        </div>
        <h3 className='singleTour_name'>
          <span>{name}</span>
        </h3>
      </div>
      {/* for the over view details of the tour */}
      <div className='details_container'>
        <h4>
          {difficulty} {duration}-day tour
        </h4>
        <p>{summary}</p>
        <div className='card_data'>
          <div className='card_el'>
            <FiMapPin className='card_el_img' />
            <span>{startLocation}</span>
          </div>
          <div className='card_el'>
            <AiOutlineCalendar className='card_el_img' />
            <span>
              {month} {year}
            </span>
          </div>
          <div className='card_el'>
            <FiFlag className='card_el_img' />
            <span>{stops} stops</span>
          </div>
          <div className='card_el'>
            <BiUser className='card_el_img' />
            <span>{maxGroupSize} people</span>
          </div>
        </div>
      </div>
      {/* for the price and booking bottun */}
      <div className='card_footer'>
        <div className='footer_data'>
          <div className='footer_data_el'>
            <span className='footer_price'>${price}</span>
            <span className='footer_data_el_detail'>per person</span>
          </div>
          <div className='footer_data_el'>
            <span className='footer_price'>{ratingsAverage}</span>
            <span className='footer_data_el_detail'>
              rating({ratingsQuantity})
            </span>
          </div>
        </div>
        <Link
          to={{ pathname: `/tour/${slug}`, state: { tourId: id } }}
          className='nav_link details_link'
        >
          details
        </Link>
      </div>
    </div>
  );
}
