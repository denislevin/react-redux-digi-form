import { all } from 'redux-saga/effects'

import auth from './auth'
import adminCharities from './admin/charities'
import adminDonors from './admin/donors'


export default function* rootSaga() {
  yield all([
    auth(),
    adminCharities(),
    adminDonors(),
  ])
}
