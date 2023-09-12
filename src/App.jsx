import './App.css'
import {  UserContextProvider} from './Pages/UserContext';
import Widget from './Pages/Widget';
function App() {


  return (
   
     <UserContextProvider>
      
      <div className='h-screen w-full bg-white'>
       <Widget />
      </div>
    </UserContextProvider>
   
  )
}

export default App
