import React from 'react'

import Loading from './Loading'

import './ImageBox.scss'

class ImageBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      downloading: false
    }
  }

  loadImage() {
    this.setState({
      downloading: true
    })
    const xhr = new XMLHttpRequest
    xhr.onprogress = e => {
      const percent = parseFloat((e.loaded / e.total).toFixed(2))
    }
    xhr.onload = e => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 304) {
          // const blobObject = new Blob([xhr.response], { type: xhr.getResponseHeader('content-type') })
          this.interval = Date.now() - this.start_time
          this.props.toDetail && this.props.toDetail({
            ...this.props,
            imageData: xhr.response
          })
        }
      }
    }
    xhr.onerror = e => {
      console.error(e, xhr)
    }
    xhr.onloadend = e => {
      this.setState({
        downloading: false
      })
    }
    xhr.onloadstart = e => {
      this.start_time = Date.now()
    }
    xhr.open('GET', this.props.url)
    xhr.responseType = 'blob'
    xhr.send()
  }

  handleClick = e => {
    this.loadImage()
  }

  handleImageLoaded = e => {
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
      <div className="image-box" onClick={ this.handleClick }>
        <div className="cover-frame" style={ coverFrameStyle }>
          {
            state.downloading && <div className="box-loading-frame">
              <Loading
                style={ {
                  opacity: Number(state.downloading)
                } }
              />
            </div>
          }
          <img
            className="cover"
            src={props.thum_url}
            style={{ opacity: state.loaded ? 100 : 0 }}
            onLoad={this.handleImageLoaded}
          />
        </div>
        <div className="label">{ props.author }</div>
      </div>
    )
  }
}

export default ImageBox
