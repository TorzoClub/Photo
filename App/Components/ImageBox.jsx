import React from 'react'

import './ImageBox.scss'

class ImageBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  imageOnLoad = e => {
    this.setState({ loaded: true })
  }

  render() {
    const { props, state } = this

    const ratio = (props.height / props.width).toFixed(4)
    const height = `calc(${props.boxWidth} * ${ ratio })`

    const coverFrameStyle = {
      height,
      background: state.loaded ? 'white': ''
    }

    return (
      <div className="image-box">
        <div className="cover-frame" style={ coverFrameStyle }>
          <img
            className="cover"
            src={props.thum_url}
            style={ { opacity: state.loaded ? 100 : 0 } }
            onLoad={this.imageOnLoad} />
        </div>
        <div className="label">{ props.author }</div>
      </div>
    )
  }
}

export default ImageBox
