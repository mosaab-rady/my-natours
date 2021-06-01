import React, { useContext, useEffect, useState } from 'react';
import { myContext } from '../../../Context';
import '../../../css/managereviews.css';
// import { IoIosArrowDropdownCircle } from 'react-icons/io';
import { request } from '../../../js/axios';
import { showAlert } from '../../../js/alert';
import { BsStar } from 'react-icons/bs';

export default function ManageReviews() {
  const { allTours } = useContext(myContext);
  const [reviews, setReviews] = useState();
  const [filterReviews, setFilterReviews] = useState([]);
  // const [showReviews, setShowReviews] = useState([]);

  useEffect(() => {
    const getAllReviews = async () => {
      const response = await request('GET', '/api/v1/reviews');
      if (response) {
        if (response.data.status === 'success') {
          setReviews(response.data.data.reviews);
          setFilterReviews(response.data.data.reviews);
        }
        if (response.data.status !== 'success') {
          showAlert('fail', response.data.message, 3);
        }
      }
    };
    getAllReviews();
  }, []);

  // console.log(reviews);
  const showReviews = (e) => {
    if (e.target.value === 'allReviews') {
      setFilterReviews(reviews);
    } else {
      const id = e.target.value;
      setFilterReviews(reviews.filter((review) => review.tour._id === id));
    }
  };

  const handleDeleteReview = async (id) => {
    const response = await request('DELETE', `/api/v1/reviews/${id}`);
    if ((response.status = 204)) {
      showAlert('success', 'review deleted', 1.5);
      setFilterReviews(filterReviews.filter((review) => review._id !== id));
    }
    if (response.status !== 204) {
      showAlert('fail', response.data.message, 3);
    }
  };

  if (reviews) {
    return (
      <div className='manage-reviews'>
        <select
          name='reviews'
          id='reviews'
          onChange={showReviews}
          className='manage-reviews__select'
        >
          <option value='allReviews'>all reviews ({reviews.length}) </option>
          {allTours.map((tour, i) => {
            return (
              <option value={tour._id} key={i}>
                {tour.name} tour
              </option>
            );
          })}
        </select>
        <div className='manage-reviews__container'>
          {filterReviews.length >= 1 ? (
            filterReviews.map((review, i) => {
              return (
                <div
                  className='my-reviews__review-container manage-reviews__review-container '
                  key={i}
                >
                  <div className='review-user'>
                    <img
                      className='review-user__img'
                      src={`/public/img/users/${review.user.photo}`}
                      alt=''
                    />
                    <h1>{review.user.name.split(' ')[0]}</h1>
                  </div>
                  <h1>{review.tour.name} tour</h1>
                  <h5>{review.createdAt.split('T')[0]}</h5>
                  <textarea
                    name='review'
                    id='review'
                    rows='6'
                    defaultValue={review.review}
                    readOnly
                  ></textarea>
                  {/* <p>{review.review}</p> */}
                  <div className='review-star'>
                    {[1, 2, 3, 4, 5].map((star, i) => {
                      return (
                        <BsStar
                          key={i}
                          className={
                            review.rating >= star
                              ? 'active star'
                              : 'inactive star'
                          }
                        />
                      );
                    })}
                  </div>
                  <button onClick={() => handleDeleteReview(review._id)}>
                    delete
                  </button>
                </div>
              );
            })
          ) : (
            <h1>no reviews</h1>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className='my-reviews'>
        <div className='loading'></div>
      </div>
    );
  }
}
