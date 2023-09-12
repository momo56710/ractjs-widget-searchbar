import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../Pages/UserContext';
const CompareHome = () => {
  const {navigateToCompare , setCompare , settings } = useContext(UserContext);
const color = settings.themeColor ;
  return (
    <div className='mt-6'>
          <p className=" title block w-fit mb-6 text-base font-bold text-gray-900 pb-2   uppercase ">Compare</p>
            <div className='w-full h-12 md:h-40 flex justify-center items-center mb-7  lg:mb-0  '>
                <button className='cursor-pointer block'onClick={()=>{setCompare(true); navigateToCompare();}} >
                      <div style={{background: color}} className= {`  rounded-full w-12 h-12 flex  items-center justify-center`}>
                        <img   src="./images/Plus.svg" alt="" />
                       </div>
                </button>
            </div>
    </div>
  )
}

export default CompareHome
