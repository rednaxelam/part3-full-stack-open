import { createElement } from 'react';

const HTag = ({textContent, level}) => {
  return createElement(`h${level}`, null, `${textContent}`);
  
}

export default HTag