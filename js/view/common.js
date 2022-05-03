export const createElement = (tag, className) => {
  const element = document.createElement(tag);
  if (className) {
    if (className instanceof Array) {
      element.classList.add(...className);
    } else element.classList.add(className);
  }
  return element;
};
export const getElement = (selector) => {
  const element = document.querySelector(selector);
  return element;
};
export const removeElement = (selector) => {
  getElement(selector).remove();
};
