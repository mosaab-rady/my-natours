export const hideAlert = () => {
  const el = document.querySelector('.notifacation');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="notifacation ${type}"><p>${msg}</p></div>`;
  document.querySelector('.App').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};
