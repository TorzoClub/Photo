import React from 'react'

import './Gallery.scss'

import YearLine from './YearLine'
import PhotoStream from './PhotoStream'

class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      column_count: 1,
      gallery_width: ''
    }
  }

  getPhotoStreamState() {
    const state = {}
    if (window.innerWidth > 1366) {
      state.column_count = 4
      state.gallery_width = `(100vw - 10em)`
    } else if (window.innerWidth > 640) {
      state.column_count = 3
      state.gallery_width = '100vw'
    } else {
      state.column_count = 2
      state.gallery_width = '100vw'
    }
    return state
  }

  setPhotoStreamState = () =>
    this.setState(this.getPhotoStreamState())

  componentWillMount() {
    this.setPhotoStreamState()
    window.addEventListener('resize', this.setPhotoStreamState)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setPhotoStreamState)
  }

  render = () => {
    return (
      <div className="gallery">
        <YearLine>{ this.props.year }</YearLine>
        <PhotoStream
          column_count={ this.state.column_count }
          total_width={ this.state.gallery_width }
          photos={ this.props.gallery }
        />
      </div>
    )
  }
}

export default Gallery
