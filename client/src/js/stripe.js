// import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { request } from './axios';
import { showAlert } from './alert';

const stripePromise = loadStripe(
  'pk_test_51IpxicDPN2xmZKI6ZaILPd4gdFWIAAIpQoc6ioMW7YFMp3Dogp7mv7XWgqdA7pGktYCiGpyRBQlu5tTAdGaB8Uv1004pNdT6W4'
);
export const bookTour = async (tourId) => {
  try {
    const response = await request(
      'GET',
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    if (response) {
      if (response.data.status === 'success') {
        const stripe = await stripePromise;

        const result = await stripe.redirectToCheckout({
          sessionId: response.data.data.session.id,
        });
        console.log(result);
      }
      if (response.data.status !== 'success') {
        showAlert('fail', response.data.message, 3);
      }
    }
  } catch (err) {
    showAlert('error', err, 3);
  }
};
