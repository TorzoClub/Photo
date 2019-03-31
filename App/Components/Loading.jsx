import React from 'react'
import './Loading.scss'
export default class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      line_list: [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
      ],
      line_count: 12,
      highlight_index: 0
    }
  }

  componentWillUnmount() {
    clearInterval(this.timing)
    this.timing = null
  }

  componentDidMount() {
    clearInterval(this.timing)

    let i = 0
    this.timing = setInterval(() => {
      let { line_list } = this.state

      if (line_list.length === i) {
        i = 0
      }

      line_list[i] = 1

      setTimeout((i =>
        () => {
          if (!this.timing) {
            return
          }
          this.setState(state => {
            state.line_list[i] = 0
            return {
              line_list: state.line_list.map(v => v)
            }
          })
        }
      )(i), 200)

      this.setState({
        line_list: line_list.map(v => v)
      })
      ++i
    }, 50)
  }

  render() {
    const { state } = this

    return <div className="loading">
      <div className="loading-block">
        {
          state.line_list.map((highlight, index, total) => {
            const className = `loading-block-line ${highlight && 'highlight'}`
            return <div
              key={index}
              className={className}
              style={ {
                transform: `rotate(${(360 / total.length) * index}deg)`
              } }
            ></div>
          })
        }
      </div>
    </div>
  }
}
