import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import "./Pagination.css";



export default function PaginatedItems({ itemsPerPage,setPagesToShow,totalData }) {
const pageCount=Math.ceil(totalData/itemsPerPage);
  return (
    <>
      <ReactPaginate
        breakLabel={<span className="pagination-ellipsis">...</span>}
        nextLabel=">>"
        onPageChange={(e)=>setPagesToShow(e.selected+1)}
        pageRangeDisplayed={1}
        pageCount={pageCount}
        previousLabel="<< "
        renderOnZeroPageCount={null}
        containerClassName="pageNavigator"
        pageLinkClassName="pageNavigator-anchor"
        previousClassName="pageNavigator-anchor" 
        nextClassName="pageNavigator-anchor"
        activeLinkClassName="pageNavigator-active" 
      />
    </>
  );
}

// Check if the container element exists before rendering
const container = document.getElementById('container');
if (container) {
  ReactDOM.render(<PaginatedItems itemsPerPage={4} />, container);
} else {
  console.error('Container element with id "container" not found.');
}
