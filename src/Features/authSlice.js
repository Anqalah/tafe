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
    let errorMessage = "Terjadi kesalahan tak terduga.";
    if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg;
    } else if (error.response?.statusText) {
      errorMessage = error.response.statusText;
    } else if (error.request) {
      errorMessage = "Tidak dapat terhubung ke server.";
    } else {
      errorMessage = error.message || "Kesalahan permintaan.";
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/me");
    return response.data;
  } catch (error) {
    let message = "Gagal memuat data pengguna.";

    if (error.response) {
      message =
        error.response.data?.message ||
        error.response.statusText ||
        "Sesi tidak valid.";
    } else if (error.request) {
      message = "Tidak dapat terhubung ke server.";
    } else {
      message = error.message || "Kesalahan jaringan.";
    }

    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("token");
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
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
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
