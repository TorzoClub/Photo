import React from 'react'
import './YearLine.scss'

export default props =>
  <div className="year-line">
    <div className="year-line-body">{ props.children }</div>
  </div>
