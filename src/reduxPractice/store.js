import reducer from "./userSlice";
import { configureStore } from "@reduxjs/toolkit";
 export const store=configureStore({
     reducer:{
        user:reducer

     }
})