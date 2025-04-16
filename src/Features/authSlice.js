import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axios.js";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const login = createAsyncThunk("user/Login", async (user, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/login", user);
    return response.data;
  } catch (error) {
    const message = error.response.data.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/me");
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
});

export const logout = createAsyncThunk("user/logout", async () => {
  await axiosInstance.delete("logout");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.message = "";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    //Get User Login
    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
      state.message = "";
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(getMe.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});
export const { reset } = authSlice.actions;
export default authSlice.reducer;
