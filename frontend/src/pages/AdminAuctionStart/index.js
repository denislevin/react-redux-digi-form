import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AuctionStartForm from 'components/AuctionStartForm'
import { formSubmit } from 'utils/form'
import Spinner from 'components/Spinner'
import SectionTitle from 'components/SectionTitle'
import {
  getAuctionDetail,
  startAuction,
} from 'store/modules/admin/auctions'
import { adminAuctionsSelector } from 'store/selectors'


class AdminAuctionDetail extends PureComponent {

  static propTypes = {
    adminAuctions: ImmutablePropTypes.map.isRequired,
    getAuctionDetail: PropTypes.func.isRequired,
    startAuction: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    loadingStatus: 1,
    initialValues: null,
  }

  handleSubmit = (data) => {
    const { startAuction, match } = this.props
    return formSubmit(startAuction, {
      id: match.params.id,
      data,
      success: this.handleBack,
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/auctions'
  })

  componentWillMount() {
    const date = new Date()
    date.setDate(date.getDate() + 5)
    this.setState({
      initialValues: Immutable.Map({
        open_until: date.toISOString()
      })
    })

    this.props.getAuctionDetail({
      id: this.props.match.params.id,
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  render() {
    const { adminAuctions } = this.props
    const auctionDetail = adminAuctions.get('auctionDetail')
    const { loadingStatus, initialValues } = this.state

    if (loadingStatus === -1) {
      return (
        <div>
          <SectionTitle>Auction not found</SectionTitle>
        </div>
      )
    }

    return (
      <div>
        <div>
          {(loadingStatus === 1 || !auctionDetail) && <Spinner />}

          {loadingStatus === 10 && auctionDetail && <div>
            <SectionTitle className="mb-5">Start Auction For: {auctionDetail.getIn(['product_details', 'title'])}</SectionTitle>

            <div className="mb-4">Please enter either ending date or duration of the auction.</div>

            <AuctionStartForm
              initialValues={initialValues}
              onSubmit={this.handleSubmit}
              onBack={this.handleBack}
            />
          </div>}
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminAuctions: adminAuctionsSelector,
})

const actions = {
  getAuctionDetail,
  startAuction,
}

export default compose(
  connect(selector, actions)
)(AdminAuctionDetail)
