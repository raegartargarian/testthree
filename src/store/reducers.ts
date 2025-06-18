/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from "@reduxjs/toolkit";
import { globalReducer } from "../containers/global/slice";
import { dashboardReducer } from "../containers/dashboard/slice";
import { attachmentsReducer } from "@/containers/attachments/slice";
import { attachmentDetailReducer } from "@/containers/attachmentDetail/slice";

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer() {
  return combineReducers({
    global: globalReducer,
    dashboard: dashboardReducer,
    attachments: attachmentsReducer,
    attachmentDetail: attachmentDetailReducer,
  });
}
