import React, { useEffect, useState } from 'react';
import "./Index.css";
import { Main } from '../../../Components/Dashboard/Main';
import { StatisticsSide } from '../../../Components/Dashboard/Statistics';
import LoadingSpinner from '../../../Components/Loading/loadingSpinner';


const Index = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1);
  
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div className="analytics">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Main />
          <StatisticsSide />
        </>
      )}
    </div>
  );
};

export default Index;
