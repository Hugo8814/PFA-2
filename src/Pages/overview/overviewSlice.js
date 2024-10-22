import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setPots } from "../pots/potSlice";
import { setBudget } from "../budgets/budgetSlice";
import { setTransactions } from "../transactions/transactionSlice";
import { setRecurring } from "../recurringBills/recurringSlice";
import { selectAuthToken } from "../../../backend/data/authSlice"; // Import your token selector

// Create Async Thunk for Fetching Data
export const fetchOverviewData = createAsyncThunk(
  "overview/fetchOverviewData",
  async (_, { dispatch, getState }) => {
    const state = getState();
    const token = selectAuthToken(state);

    if (!token) {
      throw new Error("Token is not available from OverviewSlice"); //this is getting triggerd
    }

    const response = await fetch("http://127.0.0.1:9000/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Data received from API:", data);
    dispatch(setBudget(data.budgets));
    dispatch(setTransactions(data.transactions));
    dispatch(setPots(data.pots));
    dispatch(setRecurring(data.transactions));

    return data;
  }
);

// Create Slice
const overviewSlice = createSlice({
  name: "overview",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverviewData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOverviewData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchOverviewData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectOverviewData = (state) => state.overview.data;
export const selectOverviewStatus = (state) => state.overview.status;
export const selectOverviewError = (state) => state.overview.error;

export default overviewSlice.reducer;
