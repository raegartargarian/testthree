import { runSaga } from "../store/configureStore";
import { globalSaga } from "../containers/global/saga";
import { dashboardSaga } from "./dashboard/saga";
import { attachmentsSaga } from "./attachments/saga";
import { attachmentDetailSaga } from "./attachmentDetail/saga";

export const runSagas = () => {
  runSaga(globalSaga);
  runSaga(dashboardSaga);
  runSaga(attachmentsSaga);
  runSaga(attachmentDetailSaga);
};
