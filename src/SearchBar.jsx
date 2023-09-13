import React from 'react'

import {  UserContextProvider} from './Pages/UserContext';
import Widget from './Pages/Widget';



  




const SearchBar = () => {
    return (
   
        <UserContextProvider>
         
         <div>
          <Widget />
         </div>
         
       
       </UserContextProvider>
      
     )
}

export default SearchBar