import './App.css'
import {  UserContextProvider} from './Pages/UserContext';
import Widget from './Pages/Widget';
function App() {


  return (
   
     <UserContextProvider>
      
      <div className=' bg-yellow-200'>
       <Widget />
      </div>
      <div className='mt-[15em]'> another content</div>
    
    </UserContextProvider>
   
  )
}

export default App
