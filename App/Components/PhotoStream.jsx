import React from 'react'

import './PhotoStream.scss'

import ImageBox from './ImageBox'

const SAME_HEIGHT = 100

export default class PhotoStream extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gutter: '0.75em'
    }
  }

  witchHeightIsMinimum = columns =>
    columns.indexOf(Math.min(...columns))

  computeColumnHeight = column =>
    column.length && column
      .map(photo => SAME_HEIGHT * (photo.height / photo.width))
      .reduce((a, b) => a + b)

  createColumns = () => {
    const columns = Array.from(
      Array(this.props.column_count)
    ).map(() => [])

    this.props.photos.forEach(photo => {
      const columnsHeight = columns.map(this.computeColumnHeight)

      const min_height_index = this.witchHeightIsMinimum(columnsHeight)
      columns[min_height_index].push(photo)
    })

    return columns
  }

  render() {
    const { column_count, total_width } = this.props
    const { gutter } = this.state

    const columns = this.createColumns()

    return <div className="photo-stream">
      {
        columns.map((column, key) => (
          <div
            className="steam-column"
            key={ String(key) }
            style={ {
              width: `calc(${total_width} / ${column_count})`,
              paddingLeft: key ? '' : gutter,
              paddingRight: gutter
            } }
          >
            {
              column.map(photo => (
                <ImageBox
                  photo={photo}
                  { ...photo }
                  toDetail={this.props.toDetail}
                  year={ this.props.year }
                  boxWidth={`((${total_width} / ${column_count}) - ${gutter} * 2 + (${gutter} / 2))`}
                  key={ photo.id.toString() } />
              ))
            }
          </div>
        ))
      }
    </div>
  }
}
