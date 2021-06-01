import { showAlert } from './alert';
import { request } from './axios';

export async function createUpdateTour(e, type, id, guides) {
  // console.log(e.target);

  const tourGuides = guides;
  console.log(tourGuides);

  const name = e.target.name.value;
  const duration = e.target.duration.value;
  const maxGroupSize = e.target.maxGroupSize.value;
  const difficulty = e.target.difficulty.value;
  const price = e.target.price.value;
  const summary = e.target.summary.value;
  const description = e.target.description.value;
  const startDates_1 = e.target.startDates_1.value;
  const startDates_2 = e.target.startDates_3.value;
  const startDates_3 = e.target.startDates_3.value;
  const imageCover = e.target.imageCover.files[0];
  const img_1 = e.target.img_1.files[0];
  const img_2 = e.target.img_2.files[0];
  const img_3 = e.target.img_3.files[0];
  const description_startLocation = e.target.description_startLocation.value;
  const address_startLocation = e.target.address_startLocation.value;
  const lag_startLocation = e.target.lag_startLocation.value;
  const lat_startLocation = e.target.lat_startLocation.value;
  const coordinatesStartLocation = [lag_startLocation, lat_startLocation];
  const startLocation = {};
  startLocation.description = description_startLocation;
  startLocation.address = address_startLocation;
  startLocation.coordinates = coordinatesStartLocation;
  const stringStartLocation = JSON.stringify(startLocation);
  const locations = [];
  for (let i = 0; i < e.target.num.value; i++) {
    const location = {};
    if (document.getElementById(`description_location${i + 1}`)) {
      location.description = document.getElementById(
        `description_location${i + 1}`
      ).value;
    }
    if (
      document.getElementById(`lag_location${i + 1}`) &&
      document.getElementById(`lat_location${i + 1}`)
    ) {
      location.coordinates = [
        document.getElementById(`lag_location${i + 1}`).value,
        document.getElementById(`lat_location${i + 1}`).value,
      ];
    }
    if (document.getElementById(`day_location${i + 1}`)) {
      location.day = document.getElementById(`day_location${i + 1}`).value;
    }
    locations.push(location);
  }
  const stringLocations = JSON.stringify(locations);
  // console.log(location);
  // console.log(startLocation);
  const form = new FormData();
  form.append('name', name);
  form.append('duration', duration);
  form.append('price', price);
  form.append('maxGroupSize', maxGroupSize);
  form.append('difficulty', difficulty);
  form.append('summary', summary);
  form.append('description', description);
  if (imageCover) form.append('imageCover', imageCover);
  form.append('locations', stringLocations);
  form.append('startLocation', stringStartLocation);
  if (img_1) form.append('images', img_1);
  if (img_2) form.append('images', img_2);
  if (img_3) form.append('images', img_3);
  if (startDates_1) form.append('startDates', startDates_1);
  if (startDates_2) form.append('startDates', startDates_2);
  if (startDates_3) form.append('startDates', startDates_3);
  if (tourGuides) {
    tourGuides.map((tourGuide) => form.append('guides', tourGuide));
  }

  let method;
  let message;
  let url;
  if (type === 'create') {
    method = 'POST';
    message = 'created tour successfully';
    url = 'api/v1/tours';
  }
  if (type === 'update') {
    method = 'PATCH';
    message = 'updated tour successfully';
    url = `api/v1/tours/${id}`;
  }
  const response = await request(method, url, form);
  if (response) {
    if (response.data.status === 'success') {
      showAlert('success', message, 1.5);
      setTimeout(() => {
        document.location.reload();
      }, 1500);
    }
    if (response.data.status !== 'success') {
      showAlert('fail', response.data.message, 5);
    }
  }
}
