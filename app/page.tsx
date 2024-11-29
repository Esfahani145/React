'use client';

import React, { useEffect, useState } from 'react';
import MyApp from '../components/App';
import '../Css/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';


const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleScroll = () => {

    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <MyApp />
      {isVisible && (
        <button className="back-to-top" onClick={scrollToTop}><FontAwesomeIcon icon={faArrowUp}/></button>
      )}
    </div>
  );
};

export default App;