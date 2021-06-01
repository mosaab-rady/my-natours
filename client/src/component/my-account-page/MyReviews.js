import React, { useContext, useEffect, useState } from 'react';
import '../../css/myreviews.css';
import { myContext } from '../../Context';
import { request } from '../../js/axios';
import { showAlert } from '../../js/alert';
import { BsStar } from 'react-icons/bs';

export default function MyReviews() {
  const { currentUser } = useContext(myContext);
  const [response, setResponse] = useState();
  useEffect(() => {
    const getMyReviews = async () => {
      const data = await request(
        'GET',
        `/api/v1/users/${currentUser._id}/reviews`
      );
      setResponse(data);
    };
    getMyReviews();
  }, [currentUser]);

  const updateReview = (id) => async (e) => {
    e.preventDefault();
    const response = await request('PATCH', `/api/v1/reviews/${id}`, {
      review: e.target.review.value,
      rating: e.target.rating.value,
    });
    if (response.data.status === 'success') {
      showAlert('success', 'updated data successfully', 1.5);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
    if (response.data.status !== 'success') {
      showAlert('fail', response.data.message, 3);
    }
  };

  const deleteReview = (id) => async (e) => {
    e.preventDefault();
    const response = await request('DELETE', `/api/v1/reviews/${id}`);
    if ((response.status = 204)) {
      showAlert('success', 'review deleted', 1.5);
      setTimeout(() => {
        document.location.reload();
      }, 1500);
    }
    if (response.status !== 204) {
      showAlert('fail', response.data.message, 3);
    }
  };

  if (response) {
    if (response.data.status === 'success' && response.data.data.results >= 1) {
      const reviews = response.data.data.reviews;
      return (
        <div className='my-reviews'>
          {reviews.map((review) => {
            return (
              <form
                onSubmit={updateReview(review.id)}
                className='my-reviews__review-container'
                key={review.id}
              >
                <h1>{review.tour.name} tour</h1>
                <h5>{review.createdAt.split('T')[0]}</h5>
                <textarea
                  name='review'
                  id='review'
                  rows='6'
                  defaultValue={review.review}
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
                  <input
                    className='my-review__input num-input'
                    name='rating'
                    type='number'
                    required
                    min={1}
                    max={5}
                    step={0.5}
                    defaultValue={review.rating}
                  />
                </div>
                <div className='my-reviews__btns'>
                  <button>update</button>
                  <button onClick={deleteReview(review.id)}>delete</button>
                </div>
              </form>
            );
          })}
        </div>
      );
    } else if (response.data.status !== 'success') {
      showAlert(response.data.status, response.data.message, 5);
      return;
    } else {
      return (
        <div className='my-reviews'>
          <h1>you don`t have reviews</h1>
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
