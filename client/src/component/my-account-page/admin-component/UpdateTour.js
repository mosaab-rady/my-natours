import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { myContext } from '../../../Context';
import { showAlert } from '../../../js/alert';
import { request } from '../../../js/axios';
import { createUpdateTour } from '../../../js/createTour';

export default function UpdateTour({ id }) {
  const { allTours } = useContext(myContext);
  const tour = allTours.find((tour) => tour._id === id);
  const [num, setNum] = useState(tour.locations.length);
  const [users, setUsers] = useState([]);
  const [guides, setGuides] = useState(tour.guides.map((guide) => guide._id));

  useEffect(() => {
    const getUsers = async () => {
      const response = await request('GET', '/api/v1/users');
      if (response) {
        if (response.data.status === 'success') {
          setUsers(response.data.data.users);
        } else if (response.data.status !== 'success') {
          showAlert('fail', response.data.message, 3);
        }
      }
    };
    getUsers();
  }, []);

  let locations = [];
  for (let i = 0; i < num; i++) {
    locations.push(i);
  }

  const [imageCover, setImageCover] = useState(
    `/public/img/tours/${tour.imageCover}`
  );
  const [img_1, setImg_1] = useState(`/public/img/tours/${tour.images[0]}`);
  const [img_2, setImg_2] = useState(`/public/img/tours/${tour.images[1]}`);
  const [img_3, setImg_3] = useState(`/public/img/tours/${tour.images[2]}`);

  const handlePhoto = (img) => (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        if (img === 'cover') setImageCover(e.target.result);
        if (img === 'img_1') setImg_1(e.target.result);
        if (img === 'img_2') setImg_2(e.target.result);
        if (img === 'img_3') setImg_3(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createUpdateTour(e, 'update', tour._id, guides);
  };

  const userGuides = users.filter((user) => guides.includes(user._id));

  return (
    <form
      className='create-tour-container'
      encType='multipart/form-data'
      onSubmit={handleSubmit}
    >
      <div className='input-group'>
        <label htmlFor='name'>name</label>
        <input
          type='text'
          required
          name='name'
          id='name'
          defaultValue={tour.name}
          minLength='5'
        />
      </div>
      <div className='section-input'>
        <div className='input-group'>
          <label htmlFor='duration'>duration</label>
          <input
            type='number'
            required
            name='duration'
            id='duration'
            minLength='1'
            min='1'
            defaultValue={tour.duration}
          />
        </div>
        <div className='input-group'>
          <label htmlFor='maxGroupSize'>max group size</label>
          <input
            type='number'
            required
            name='maxGroupSize'
            id='maxGroupSize'
            minLength='1'
            min='1'
            defaultValue={tour.maxGroupSize}
          />
        </div>
        <div className='input-group'>
          <label htmlFor='difficulty'>difficulty</label>
          <input
            list='list'
            required
            name='difficulty'
            id='difficulty'
            minLength='1'
            min='1'
            defaultValue={tour.difficulty}
          />
          <datalist id='list'>
            <option value='easy'></option>
            <option value='medium'></option>
            <option value='difficult'></option>
          </datalist>
        </div>
        <div className='input-group'>
          <label htmlFor='price'>price</label>
          <input
            type='number'
            required
            name='price'
            id='price'
            minLength='1'
            min='1'
            defaultValue={tour.price}
          />
        </div>
      </div>
      <div className='input-group summary'>
        <label htmlFor='summary'>summary</label>
        <textarea
          name='summary'
          id='summary'
          required
          minLength='10'
          defaultValue={tour.summary}
        ></textarea>
      </div>
      <div className='input-group description'>
        <label htmlFor='description' minLength='10'>
          description
        </label>
        <textarea
          name='description'
          id='description'
          rows='6'
          defaultValue={tour.description}
        ></textarea>
      </div>

      <div className='input-group guide-input__group '>
        <label htmlFor='guide'>guides</label>
        <select
          name='guide'
          id='guide'
          onChange={(e) =>
            e.target.value === 'no guide'
              ? setGuides([])
              : setGuides(Array.from(new Set([...guides, e.target.value])))
          }
          className='guide-input__group__select'
        >
          <option value='no guide'>no guides</option>
          {users.length >= 1 ? (
            users
              .filter((user) => user.role !== 'user' && user.role !== 'admin')
              .map((user, i) => {
                return (
                  <option value={user._id} key={i}>
                    {user.name.split(' ')[0]}----
                    {user.role}
                  </option>
                );
              })
          ) : (
            <option>no users</option>
          )}
        </select>
        <div className='guides-info'>
          {userGuides.map((guide, i) => {
            return (
              <div className='guide-info' key={i}>
                <div className='guide-info__header'>
                  <img
                    className='guide-info__img'
                    src={`/public/img/users/${guide.photo}`}
                    alt=''
                  />
                  <h3>{guide.name}</h3>
                  <AiOutlineClose
                    className='remove-guide'
                    onClick={() =>
                      setGuides(guides.filter((id) => id !== guide._id))
                    }
                  />
                </div>
                <h4>{guide.role}</h4>
                <h5>{guide.email}</h5>
              </div>
            );
          })}
        </div>
      </div>

      <div className='input-group'>
        <label htmlFor='startDates'>start dates</label>
        <div className='start-dates__input'>
          <input
            type='datetime-local'
            name='startDates_1'
            id='startDates'
            // defaultValue={tour.startDates[0]}
          />
          <input
            type='datetime-local'
            name='startDates_2'
            id='startDates'
            // defaultValue={tour.startDates[1]}
          />
          <input
            type='datetime-local'
            // defaultValue={tour.startDates[2]}
            name='startDates_3'
            id='startDates'
          />
        </div>
      </div>
      <div className='startLocation'>
        <h2>start location: </h2>
        <div className='input-group discriptionLocation'>
          <label htmlFor='description'>description</label>
          <input
            type='text'
            name='description_startLocation'
            id='description-location'
            minLength='1'
            defaultValue={tour.startLocation.description}
          />
        </div>
        <div className='input-group'>
          <label htmlFor='address'>address</label>
          <input
            type='text'
            name='address_startLocation'
            id='address'
            minLength='1'
            defaultValue={tour.startLocation.address}
          />
        </div>
        <div className='input-group'>
          <label htmlFor='coordinates'>coordinates</label>
          <div className='coordinates__input'>
            <input
              type='number'
              name='lag_startLocation'
              id='lag'
              step='0.00000000001'
              placeholder='longitude'
              defaultValue={tour.startLocation.coordinates[0]}
            />
            <input
              type='number'
              name='lat_startLocation'
              id='lat'
              step='0.00000000001'
              placeholder='latitude'
              defaultValue={tour.startLocation.coordinates[1]}
            />
          </div>
        </div>
      </div>

      {/*  */}
      <div className='locations'>
        <div className='locations__number'>
          <label>number of locations:</label>
          <input
            type='number'
            name='num'
            defaultValue={num}
            onChange={(e) => setNum(e.target.value)}
          />
        </div>
        {locations.map((location, i) => {
          return (
            <div key={i} className='locations__location-container'>
              <h2>location {i + 1}: </h2>
              <div className='input-group discriptionLocation'>
                <label htmlFor='description'>description</label>
                <input
                  type='text'
                  name={`description_location${i + 1}`}
                  id={`description_location${i + 1}`}
                  minLength='1'
                  defaultValue={
                    tour.locations[i] ? tour.locations[i].description : ''
                  }
                />
              </div>

              <div className='input-group'>
                <label htmlFor='coordinates'>coordinates</label>
                <div className='coordinates__input'>
                  <input
                    type='number'
                    name={`lag_location${i + 1}`}
                    id={`lag_location${i + 1}`}
                    step='0.00000000001'
                    placeholder='longitude'
                    defaultValue={
                      tour.locations[i] ? tour.locations[i].coordinates[0] : ''
                    }
                  />
                  <input
                    type='number'
                    name={`lat_location${i + 1}`}
                    id={`lat_location${i + 1}`}
                    step='0.00000000001'
                    placeholder='latitude'
                    defaultValue={
                      tour.locations[i] ? tour.locations[i].coordinates[1] : ''
                    }
                  />
                </div>
              </div>
              <div className='input-group day__number'>
                <label htmlFor='day'>day</label>
                <input
                  type='number'
                  name={`day_location${i + 1}`}
                  id={`day_location${i + 1}`}
                  minLength='1'
                  min='1'
                  defaultValue={tour.locations[i] ? tour.locations[i].day : ''}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/*  */}

      <div className='input-group__imageCover-container'>
        <img
          src={imageCover ? imageCover : 'default-tour.jpg'}
          alt=''
          className='img-container__img'
        />
        <label htmlFor='imageCover' className='input-img photo-btn'>
          new Cover Image
        </label>
        <input
          type='file'
          accept='image/*'
          id='imageCover'
          name='imageCover'
          onChange={handlePhoto('cover')}
        />
      </div>
      <div className='input-group__images-container'>
        <div className='images-container__img-container'>
          <img
            src={img_1 ? img_1 : 'default-tour.jpg'}
            alt=''
            className='img-container__img_1'
          />
          <label htmlFor='img_1' className='input-img photo-btn'>
            choose new image
          </label>
          <input
            type='file'
            accept='image/*'
            id='img_1'
            name='img_1'
            onChange={handlePhoto('img_1')}
          />
        </div>
        <div className='images-container__img-container'>
          <img
            src={img_2 ? img_2 : 'default-tour.jpg'}
            alt=''
            className='img-container__img_2'
          />
          <label htmlFor='img_2' className='input-img photo-btn'>
            choose new image
          </label>
          <input
            type='file'
            accept='image/*'
            id='img_2'
            name='img_2'
            onChange={handlePhoto('img_2')}
          />
        </div>
        <div className='images-container__img-container'>
          <img
            src={img_3 ? img_3 : 'default-tour.jpg'}
            alt=''
            className='img-container__img_3'
          />
          <label htmlFor='img_3' className='input-img photo-btn'>
            choose new image
          </label>
          <input
            type='file'
            accept='image/*'
            id='img_3'
            name='img_3'
            onChange={handlePhoto('img_3')}
          />
        </div>
      </div>
      <button className='create-tour__btn'>update tour</button>
    </form>
  );
}
