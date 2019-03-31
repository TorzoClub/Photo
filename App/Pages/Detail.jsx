import 'arr-ext'
import Api from '../Api'
import React from 'react'

import ReactMarkdown from 'react-markdown'

import './Detail.scss'

class DetailPage extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()

    this.state = {
      // opacity: 0,
      articleWidth: '',
      image: null
    }
  }

  resetArticleWidth = () => {
    this.setState(state => {
      if (state.image) {
        return { articleWidth: `${state.image.width}px` }
      } else {
        return {}
      }
    })
  }

  handleClickFrame = e => {
    if (e.target.className === 'detail-frame') {
      history.back()
    }
  }

  handleImageLoad = e => {
    this.setState({
      image: e.target
    })
    this.resetArticleWidth()
  }

  touchStart = e => {
    const { clientY } = e.touches[0]
    this.lastClientY = clientY
  }

  touchEnd = e => {
    this.lastClientY = undefined
  }

  touchMove = e => {
    const { clientX, clientY } = e.touches[0]
    const { lastClientY } = this
    if (lastClientY === undefined) {
      return alert('failure')
    }

    // 是否上滑
    const isSlideUp = this.lastClientY > clientY
    const isSlideDown = this.lastClientY < clientY

    const { scrollTop, offsetHeight, scrollHeight } = this.myRef.current

    if (scrollHeight > offsetHeight) {
      if (scrollTop <= 0) {
        isSlideDown && e.preventDefault()
      } else if ((scrollTop + offsetHeight) >= scrollHeight) {
        isSlideUp && e.preventDefault()
      }
    } else {
      e.preventDefault()
    }
  }

  disableScrolling() {
    Array.from(document.querySelectorAll('html, body')).forEach(el => {
      // el.style.overflow = 'hidden'
    })

    // window.scrollTo(0, window.scrollY)

    this.myRef.current.addEventListener('touchstart', this.touchStart)
    this.myRef.current.addEventListener('touchmove', this.touchMove)
    this.myRef.current.addEventListener('touchend', this.touchEnd)
  }

  enableScrolling() {
    Array.from(document.querySelectorAll('html, body')).forEach(el => {
      el.style.overflow = ''
    })

    this.myRef.current.removeEventListener('touchstart', this.touchStart)
    this.myRef.current.removeEventListener('touchmove', this.touchMove)
    this.myRef.current.removeEventListener('touchend', this.touchEnd)
  }

  componentWillMount() {
    window.addEventListener('resize', this.resetArticleWidth)
  }

  componentDidMount() {
    this.disableScrolling()
    this.setState({ opacity: 1 })
  }

  componentWillUnmount() {
    this.enableScrolling()
    window.removeEventListener('resize', this.resetArticleWidth)
  }

  render() {
    const { state } = this
    const { match } = this.props
    const gallery_list = Api.getData()

    const gallery = gallery_list.findBy('year', parseInt(match.params.year))
    const photo = gallery.gallery.findBy('id', match.params.id)

    return (
      <div
        className="detail-frame"
        ref={this.myRef}
        style={ { opacity: state.opacity } }
        onClick={ this.handleClickFrame }
      >
        <div className="detail-box">
          <a href={ photo.url } target="_blank">
            <img className="detail-image" src={ photo.imageDataUrl || photo.url } onLoad={ this.handleImageLoad } />
          </a>
          { !!photo.comment.trim().length &&
            <article className="detail-comment" style={ { width: state.articleWidth } }>
              <ReactMarkdown source={ photo.comment } />
            </article>
          }
        </div>
      </div>
    )
  }
}

export default DetailPage
